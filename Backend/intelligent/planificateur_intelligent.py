from recettes.analyseur_nutritionnel import AnalyseurNutritionnel
from recettes.models import Recette, Ingredient
from utilisateurs.models import Preference, Utilisateur, Allergie
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import json
from django.db.models import Q
from django.core.cache import cache
from asgiref.sync import sync_to_async
from plan_repas.models import PlanRepas, Repas

# Configuration du logging
logger = logging.getLogger("planificateur_intelligent")
logger.setLevel(logging.DEBUG)

# Créer un handler pour la console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

# Définir le format des messages
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Ajouter le handler au logger
logger.addHandler(console_handler)

class PlanificateurIntelligent:
    def __init__(self, utilisateur: 'Utilisateur'):
        self.utilisateur = utilisateur
        self.logger = logger
        self._init_user_preferences()

    def _init_user_preferences(self):
        try:
            preference = Preference.objects.get(utilisateur=self.utilisateur)
            self.est_vegetarien = preference.est_vegetarien
            self.logger.info(f"Préférence végétarienne de l'utilisateur {self.utilisateur.id}: {self.est_vegetarien}")
        except Preference.DoesNotExist:
            self.logger.error(f"Préférences non trouvées pour l'utilisateur {self.utilisateur.id}")
            raise ValueError("Préférences utilisateur non trouvées")

    async def obtenir_recettes_compatibles(self) -> List[Recette]:
        """Obtient la liste des recettes compatibles avec les préférences de l'utilisateur"""
        try:
            query = Q()
            if self.est_vegetarien:
                query &= Q(est_vegetarien=True)

            # Obtenir les allergies de l'utilisateur
            allergies = await sync_to_async(list)(Allergie.objects.filter(utilisateur=self.utilisateur))
            for allergie in allergies:
                query &= ~Q(ingredients__allergenes__contains=[allergie.nom])

            recettes = await sync_to_async(list)(Recette.objects.filter(query).distinct())
            return recettes
        except Exception as e:
            self.logger.error(f"Erreur lors de l'obtention des recettes compatibles: {str(e)}")
            raise

    def _formater_repas(self, recette: 'Recette') -> Dict:
        """Formate les données d'un repas individuel selon le format attendu par le frontend"""
        if not recette:
            return None

        return {
            'recette_id': str(recette.id),
            'nom': recette.nom
        }

    async def _generer_repas(self, recettes_compatibles: List[Recette]) -> Optional[Recette]:
        """Génère un repas à partir des recettes compatibles"""
        try:
            if not recettes_compatibles:
                self.logger.error("Aucune recette compatible disponible")
                return None

            # Choix aléatoire d'une recette
            recette = random.choice(recettes_compatibles)
            self.logger.debug(f"Recette générée: {recette.id} - {recette.nom}")
            return recette

        except Exception as e:
            self.logger.error(f"Erreur lors de la génération d'un repas: {str(e)}")
            return None

    async def generer_plan_repas(self, date_debut: datetime, date_fin: datetime, utilisateur: 'Utilisateur') -> Dict:
        """Génère un plan de repas pour la période spécifiée"""
        try:
            self.logger.info(f"Début de la génération du plan repas pour l'utilisateur {utilisateur.id}")
            self.logger.info(f"Période: du {date_debut} au {date_fin}")

            nb_jours = (date_fin - date_debut).days + 1
            dates = [date_debut + timedelta(days=x) for x in range(nb_jours)]

            recettes_compatibles = await self.obtenir_recettes_compatibles()
            self.logger.info(f"Nombre de recettes compatibles trouvées: {len(recettes_compatibles)}")

            if not recettes_compatibles:
                self.logger.error("Aucune recette compatible trouvée")
                raise ValueError("Aucune recette compatible disponible")

            plan_data = {
                'metadata': {
                    'utilisateur_id': str(utilisateur.id),
                    'date_generation': datetime.now().isoformat(),
                    'periode': {
                        'debut': date_debut.isoformat(),
                        'fin': date_fin.isoformat(),
                        'nb_jours': nb_jours
                    }
                },
                'repas_par_jour': {}
            }

            self.logger.info("Début de la génération des repas journaliers")
            for date in dates:
                date_str = date.strftime('%Y-%m-%d')
                self.logger.debug(f"Génération des repas pour le {date_str}")

                petit_dejeuner = await self._generer_repas(recettes_compatibles)
                dejeuner = await self._generer_repas(recettes_compatibles)
                diner = await self._generer_repas(recettes_compatibles)

                self.logger.debug(f"Repas générés pour {date_str}:")
                self.logger.debug(f"Petit déjeuner: {petit_dejeuner.id if petit_dejeuner else None}")
                self.logger.debug(f"Déjeuner: {dejeuner.id if dejeuner else None}")
                self.logger.debug(f"Dîner: {diner.id if diner else None}")

                repas_jour = {
                    'petit_dejeuner': petit_dejeuner,
                    'dejeuner': dejeuner,
                    'diner': diner
                }

                if None in repas_jour.values():
                    self.logger.error(f"Certains repas n'ont pas pu être générés pour le {date_str}")
                    continue

                formatted_repas = self._formater_repas_journalier(repas_jour)
                self.logger.debug(f"Repas formatés pour {date_str}: {json.dumps(formatted_repas)}")
                plan_data['repas_par_jour'][date_str] = formatted_repas

            if not plan_data['repas_par_jour']:
                self.logger.error("Échec de la génération du plan : aucun repas généré")
                raise ValueError("Aucun repas n'a pu être généré")

            self.logger.info("Plan data avant sauvegarde:")
            self.logger.info(json.dumps(plan_data, indent=2))

            plan_repas = await self.sauvegarder_plan_repas(
                utilisateur=utilisateur,
                date_debut=date_debut,
                date_fin=date_fin,
                repas_data=plan_data
            )

            # Vérification immédiate après la sauvegarde
            saved_data = await sync_to_async(PlanRepas.objects.get)(id=plan_repas.id)
            self.logger.info("Données sauvegardées en base:")
            self.logger.info(json.dumps(saved_data.repas_data, indent=2))

            return {
                'id': plan_repas.id,
                'plan_data': plan_data
            }

        except Exception as e:
            self.logger.error(f"Erreur lors de la génération du plan repas: {str(e)}")
            raise

    async def sauvegarder_plan_repas(self, utilisateur: 'Utilisateur',
                                   date_debut: datetime, date_fin: datetime,
                                   repas_data: Dict) -> 'PlanRepas':
        """Sauvegarde le plan de repas dans la base de données"""
        try:
            self.logger.info(f"Début de la sauvegarde du plan repas pour l'utilisateur {utilisateur.id}")
            self.logger.info("Données à sauvegarder:")
            self.logger.info(json.dumps(repas_data, indent=2))

            # Validation de la structure
            if not isinstance(repas_data, dict):
                self.logger.error("Format invalide: repas_data n'est pas un dictionnaire")
                raise ValueError(f"repas_data doit être un dictionnaire")

            required_keys = {'metadata', 'repas_par_jour'}
            if not all(key in repas_data for key in required_keys):
                self.logger.error(f"Structure invalide: clés manquantes. Attendues: {required_keys}")
                raise ValueError(f"Structure de données invalide. Clés requises: {required_keys}")

            # Vérification explicite du contenu
            if not repas_data['repas_par_jour']:
                self.logger.warning("repas_par_jour est vide!")

            # Création du plan de repas avec vérification explicite
            self.logger.debug("Création du plan repas dans la base de données")
            plan_repas = await sync_to_async(PlanRepas.objects.create)(
                utilisateur=utilisateur,
                date_debut=date_debut,
                date_fin=date_fin,
                repas_data=repas_data
            )

            # Vérification immédiate post-sauvegarde
            self.logger.debug(f"Vérification de la sauvegarde pour le plan {plan_repas.id}")
            saved_plan = await sync_to_async(PlanRepas.objects.get)(id=plan_repas.id)
            self.logger.info("Données sauvegardées en base:")
            self.logger.info(json.dumps(saved_plan.repas_data, indent=2))

            if not saved_plan.repas_data or not saved_plan.repas_data.get('repas_par_jour'):
                self.logger.error("Échec de la sauvegarde: données manquantes ou vides")
                raise ValueError("La sauvegarde du plan de repas a échoué")

            self.logger.info(f"Plan repas sauvegardé avec succès. ID: {plan_repas.id}")
            return plan_repas

        except Exception as e:
            self.logger.error(f"Erreur lors de la sauvegarde du plan repas: {str(e)}")
            raise