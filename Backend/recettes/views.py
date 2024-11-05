from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from bson import ObjectId
from .models import Recette, IngredientRecette, Ingredient
from  utilisateurs.models import Preference, Allergie
from .serializers import RecetteSerialiseur, IngredientRecetteSerializer, IngredientSerializer
from .analyseur_nutritionnel import AnalyseurNutritionnel
import logging
import json
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)


class RecetteVueSet(viewsets.ModelViewSet):
    queryset = Recette.objects.all()
    serializer_class = RecetteSerialiseur

    def create(self, request, *args, **kwargs):
        try:
            recette_data = request.data.copy()
            ingredients_data = recette_data.pop('ingredients', '[]')

            if isinstance(ingredients_data, str):
                ingredients_data = json.loads(ingredients_data)

            recette_serializer = self.get_serializer(data=recette_data)
            recette_serializer.is_valid(raise_exception=True)
            recette = recette_serializer.save()

            for ingredient_data in ingredients_data:
                ingredient, created = Ingredient.objects.get_or_create(
                    nom=ingredient_data['nom'],
                    defaults={
                        'calories': ingredient_data.get('calories', 0),
                        'proteines': ingredient_data.get('proteines', 0),
                        'glucides': ingredient_data.get('glucides', 0),
                        'lipides': ingredient_data.get('lipides', 0),
                    }
                )
                IngredientRecette.objects.create(
                    recette=recette,
                    ingredient=ingredient,
                    quantite=ingredient_data['quantite']
                )

            logger.info(f"Recette créée avec succès: {recette.nom}")
            return Response(recette_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception(f"Erreur lors de la création de la recette: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        logger.info(f"Nombre de recettes récupérées: {len(serializer.data)}")
        return Response(serializer.data)

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            obj = Recette.objects.get(_id=ObjectId(pk))
            self.check_object_permissions(self.request, obj)
            return obj
        except Recette.DoesNotExist:
            raise Http404("Aucune recette ne correspond à cet identifiant.")

    @action(detail=True, methods=['get', 'post'])
    def ingredients(self, request, pk=None):
        if request.method == 'GET':
            return self.get_ingredients(request, pk)
        elif request.method == 'POST':
            return self.add_ingredient(request, pk)

    def get_ingredients(self, request, pk=None):
        try:
            recette = self.get_object()
            ingredient_recettes = IngredientRecette.objects.filter(recette=str(recette._id))
            serializer = IngredientRecetteSerializer(ingredient_recettes, many=True)
            
            valeurs_totales = AnalyseurNutritionnel.calculer_valeurs_nutritionnelles(recette)
            
            response_data = {
                'ingredients': serializer.data,
                'valeurs_nutritionnelles_totales': valeurs_totales
            }
            return Response(response_data)
        except Http404:
            return Response({"detail": "Recette non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception(f"Erreur lors de la récupération des ingrédients pour la recette {pk}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def add_ingredient(self, request, pk=None):
        try:
            recette = self.get_object()
            data = request.data.copy()
            data['recette'] = str(recette._id)
            
            ingredient, created = Ingredient.objects.get_or_create(
                nom=data['nom'],
                defaults={
                    'calories': data.get('calories', 0),
                    'proteines': data.get('proteines', 0),
                    'glucides': data.get('glucides', 0),
                    'lipides': data.get('lipides', 0),
                }
            )
            data['ingredient'] = str(ingredient._id)
            
            serializer = IngredientRecetteSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({"detail": "Recette non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.exception(f"Erreur lors de l'ajout d'un ingrédient à la recette {pk}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_object(self):
        """
        Récupère l'objet Recette en utilisant l'ObjectId de MongoDB.
        """
        pk = self.kwargs.get('pk')
        try:
            obj = Recette.objects.get(_id=ObjectId(pk))
            self.check_object_permissions(self.request, obj)
            return obj
        except Recette.DoesNotExist:
            raise Http404("Aucune recette ne correspond à cet identifiant.")

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    def list(self, request):
        ingredients = self.get_queryset()
        serializer = self.get_serializer(ingredients, many=True)
        
        # Calculer les valeurs nutritionnelles totales
        total_calories = sum(ingredient.calories for ingredient in ingredients)
        total_proteines = sum(ingredient.proteines for ingredient in ingredients)
        total_glucides = sum(ingredient.glucides for ingredient in ingredients)
        total_lipides = sum(ingredient.lipides for ingredient in ingredients)
        
        response_data = {
            'ingredients': serializer.data,
            'valeurs_nutritionnelles_totales': {
                'calories': total_calories,
                'proteines': total_proteines,
                'glucides': total_glucides,
                'lipides': total_lipides
            }
        }
        
        return Response(response_data)

    def create(self, request, *args, **kwargs):
        try:
            recette_data = request.data.copy()
            
            # Nettoyage et validation du champ vegetarien
            if 'vegetarien' in recette_data:
                # Si la valeur est une chaîne ou une liste, la nettoyer
                vegetarien_value = recette_data['vegetarien']
                if isinstance(vegetarien_value, list):
                    vegetarien_value = vegetarien_value[0]
                if isinstance(vegetarien_value, str):
                    vegetarien_value = vegetarien_value.lower()
                    recette_data['vegetarien'] = vegetarien_value == 'true'
                elif isinstance(vegetarien_value, bool):
                    recette_data['vegetarien'] = vegetarien_value
                else:
                    recette_data['vegetarien'] = False

            ingredients_data = recette_data.pop('ingredients', [])
            if isinstance(ingredients_data, str):
                try:
                    ingredients_data = json.loads(ingredients_data)
                except json.JSONDecodeError:
                    ingredients_data = []

            # Validation des données avec le serializer
            recette_serializer = self.get_serializer(data=recette_data)
            if not recette_serializer.is_valid():
                logger.error(f"Erreurs de validation: {recette_serializer.errors}")
                return Response(
                    {"error": recette_serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Sauvegarde de la recette
            recette = recette_serializer.save()
            
            # Traitement des ingrédients
            for ingredient_data in ingredients_data:
                ingredient, created = Ingredient.objects.get_or_create(
                    nom=ingredient_data['nom'],
                    defaults={
                        'calories': ingredient_data.get('calories', 0),
                        'proteines': ingredient_data.get('proteines', 0),
                        'glucides': ingredient_data.get('glucides', 0),
                        'lipides': ingredient_data.get('lipides', 0),
                    }
                )
                IngredientRecette.objects.create(
                    recette=recette,
                    ingredient=ingredient,
                    quantite=ingredient_data['quantite']
                )

            logger.info(f"Recette créée avec succès: {recette.nom}")
            return Response(recette_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.exception(f"Erreur lors de la création de la recette: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            logger.info(f"Début de la mise à jour - données reçues: {request.data}")
            instance = self.get_object()
            logger.info(f"Instance trouvée: {instance.__dict__}")
            
            # Préparer les données
            data = request.data.copy()
            logger.info(f"Données après copie: {data}")
            
            # Garder une trace des anciennes valeurs
            old_values = {
                'calories': float(instance.calories or 0),
                'proteines': float(instance.proteines or 0),
                'glucides': float(instance.glucides or 0),
                'lipides': float(instance.lipides or 0)
            }
            logger.info(f"Anciennes valeurs: {old_values}")

            # Validation et mise à jour
            serializer = self.get_serializer(instance, data=data, partial=True)
            if not serializer.is_valid():
                logger.error(f"Erreurs de validation: {serializer.errors}")
                return Response(
                    {'error': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                updated_ingredient = serializer.save()
                logger.info(f"Ingrédient mis à jour: {updated_ingredient.__dict__}")
            except Exception as save_error:
                logger.exception("Erreur lors de la sauvegarde du sérialiseur")
                return Response(
                    {'error': f"Erreur lors de la sauvegarde: {str(save_error)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Calculer les différences nutritionnelles
                nutritional_diff = {
                    'calories': float(updated_ingredient.calories or 0) - old_values['calories'],
                    'proteines': float(updated_ingredient.proteines or 0) - old_values['proteines'],
                    'glucides': float(updated_ingredient.glucides or 0) - old_values['glucides'],
                    'lipides': float(updated_ingredient.lipides or 0) - old_values['lipides']
                }
                logger.info(f"Différences nutritionnelles calculées: {nutritional_diff}")

                # Mettre à jour les recettes associées
                ingredient_recettes = IngredientRecette.objects.filter(ingredient=str(instance._id))
                logger.info(f"Nombre de recettes à mettre à jour: {ingredient_recettes.count()}")

                for ing_recette in ingredient_recettes:
                    try:
                        recette = Recette.objects.get(_id=ObjectId(ing_recette.recette))
                        for nutriment, diff in nutritional_diff.items():
                            current_value = float(getattr(recette, nutriment, 0) or 0)
                            new_value = current_value + (diff * float(ing_recette.quantite))
                            setattr(recette, nutriment, max(0, new_value))
                        recette.save()
                        logger.info(f"Recette {recette._id} mise à jour avec succès")
                    except Recette.DoesNotExist:
                        logger.warning(f"Recette {ing_recette.recette} non trouvée")
                    except Exception as recette_error:
                        logger.error(f"Erreur lors de la mise à jour de la recette {ing_recette.recette}: {str(recette_error)}")

            except Exception as update_error:
                logger.exception("Erreur lors de la mise à jour des recettes associées")
                # On continue même si la mise à jour des recettes échoue
                pass

            # Récupérer les données mises à jour
            serializer = self.get_serializer(updated_ingredient)
            logger.info("Mise à jour terminée avec succès")
            return Response(serializer.data)

        except Http404:
            logger.error("Ingrédient non trouvé")
            return Response(
                {'error': "Ingrédient non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.exception(f"Erreur inattendue lors de la mise à jour de l'ingrédient: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_object(self):
        try:
            pk = self.kwargs.get('pk')
            logger.info(f"Recherche de l'ingrédient avec l'ID: {pk}")
            if not ObjectId.is_valid(pk):
                logger.error(f"ID MongoDB invalide: {pk}")
                raise Http404("ID d'ingrédient invalide")
            
            obj = Ingredient.objects.get(_id=ObjectId(pk))
            self.check_object_permissions(self.request, obj)
            return obj
        except (Ingredient.DoesNotExist, InvalidId) as e:
            logger.error(f"Erreur lors de la récupération de l'ingrédient: {str(e)}")
            raise Http404("Aucun ingrédient ne correspond à cet identifiant.")

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            nutritional_values = {
                'calories': instance.calories,
                'proteines': instance.proteines,
                'glucides': instance.glucides,
                'lipides': instance.lipides,
                'quantite': instance.quantite
            }

            ingredient_recettes = IngredientRecette.objects.filter(ingredient=str(instance._id))
            for ing_recette in ingredient_recettes:
                try:
                    recette = Recette.objects.get(_id=ObjectId(ing_recette.recette))
                    ratio = ing_recette.quantite / nutritional_values['quantite']
                    for nutriment in ['calories', 'proteines', 'glucides', 'lipides']:
                        current_value = getattr(recette, nutriment, 0) or 0
                        updated_value = current_value - (nutritional_values[nutriment] * ratio)
                        setattr(recette, nutriment, max(0, updated_value))
                    recette.save()
                except Recette.DoesNotExist:
                    logger.warning(f"Recette {ing_recette.recette} non trouvée")

            ingredient_recettes.delete()
            instance.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Http404:
            return Response(
                {'error': "Ingrédient non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.exception(f"Erreur lors de la suppression de l'ingrédient: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def ajuster_valeurs_nutritionnelles(self, request, pk=None):
        try:
            ingredient = self.get_object()
            nouvelle_quantite = float(request.data.get('nouvelle_quantite', 0))
            
            if nouvelle_quantite <= 0:
                return Response(
                    {'error': 'La nouvelle quantité doit être supérieure à 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calcul du ratio de changement
            ratio = nouvelle_quantite / ingredient.quantite

            # Mise à jour des valeurs nutritionnelles
            ingredient.calories *= ratio
            ingredient.proteines *= ratio
            ingredient.glucides *= ratio
            ingredient.lipides *= ratio
            ingredient.quantite = nouvelle_quantite
            ingredient.save()

            # Mise à jour des recettes associées
            ingredient_recettes = IngredientRecette.objects.filter(ingredient=str(ingredient._id))
            for ing_recette in ingredient_recettes:
                try:
                    recette = Recette.objects.get(_id=ObjectId(ing_recette.recette))
                    # Ajustement des valeurs nutritionnelles de la recette
                    for nutriment in ['calories', 'proteines', 'glucides', 'lipides']:
                        current_value = getattr(recette, nutriment, 0) or 0
                        original_value = current_value / ratio
                        setattr(recette, nutriment, original_value * ratio)
                    recette.save()
                except Recette.DoesNotExist:
                    continue

            serializer = self.get_serializer(ingredient)
            return Response(serializer.data)

        except Exception as e:
            logger.exception(f"Erreur lors de l'ajustement des valeurs nutritionnelles: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


logger = logging.getLogger(__name__)

class PlanRepasRandomViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _recette_contient_allergene(self, recette, allergies):
        """
        Vérifie si une recette contient des allergènes dans son nom ou sa description.

        Args:
            recette (dict): Recette à vérifier
            allergies (list): Liste des allergies à vérifier

        Returns:
            bool: True si la recette contient un allergène, False sinon
        """
        # Convertir les champs à vérifier en minuscules
        nom_recette = recette['nom'].lower()
        description = recette['description'].lower() if recette['description'] else ""

        # Vérifier chaque allergie
        for allergie in allergies:
            allergie_lower = allergie.lower()
            if allergie_lower in nom_recette or allergie_lower in description:
                logger.info(f"Allergie '{allergie}' trouvée dans la recette '{recette['nom']}'")
                return True
        return False

    def _select_unique_recipe(self, available_recipes, used_recipes_today):
        """
        Sélectionne une recette unique qui n'a pas encore été utilisée aujourd'hui.

        Args:
            available_recipes (list): Liste des recettes disponibles
            used_recipes_today (set): Ensemble des IDs des recettes déjà utilisées aujourd'hui

        Returns:
            dict: Recette sélectionnée ou None si aucune recette disponible
        """
        # Filtrer les recettes non utilisées aujourd'hui
        unused_recipes = [r for r in available_recipes if str(r['_id']) not in used_recipes_today]

        if not unused_recipes:
            logger.warning("Aucune recette unique disponible pour ce repas")
            return None

        return random.choice(unused_recipes)

    def create(self, request):
        try:
            # Log de début de requête
            logger.info(f"Début de la génération du plan repas - Données reçues: {request.data}")

            # Utiliser l'utilisateur de la requête au lieu de celui fourni dans les données
            utilisateur_id = request.user.id
            date_debut = request.data.get('date_debut')
            date_fin = request.data.get('date_fin')

            # Log des paramètres
            logger.info(f"Paramètres : utilisateur={utilisateur_id}, "
                       f"date_debut={date_debut}, date_fin={date_fin}")

            if not all([date_debut, date_fin]):
                logger.warning("Paramètres de dates manquants dans la requête")
                return Response(
                    {'error': 'Les dates sont requises'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Log pour les préférences
                logger.info(f"Recherche des préférences pour l'utilisateur {utilisateur_id}")
                preference = Preference.objects.get(utilisateur_id=utilisateur_id)
                est_vegetarien = preference.est_vegetarien
                # Récupération des allergies
                allergies = list(preference.allergies.values_list('nom', flat=True))
                logger.info(f"Préférences trouvées - Végétarien: {est_vegetarien}, Allergies: {allergies}")
            except Preference.DoesNotExist:
                logger.warning(f"Aucune préférence trouvée pour l'utilisateur {utilisateur_id}")
                est_vegetarien = False
                allergies = []

            # Log pour les recettes
            logger.info("Récupération des recettes")
            try:
                # Utilisez values() pour obtenir un dictionnaire des champs en spécifiant les champs désirés
                recettes_query = Recette.objects.all().values(
                    '_id',
                    'nom',
                    'description',
                    'instructions',
                    'vegetarien',
                    'categorie',
                    'image'
                )

                # Convertir le QuerySet en liste de dictionnaires
                toutes_recettes = list(recettes_query)
                logger.info(f"Nombre total de recettes trouvées : {len(toutes_recettes)}")

                # Définir les catégories autorisées pour chaque type de repas
                categories_par_repas = {
                    'petit_dejeuner': ['Dessert', 'Entrée'],
                    'dejeuner': ['Plat Principal'],
                    'diner': ['Plat Principal', 'Entrée']
                }

                # Filtrer et organiser les recettes par type de repas
                recettes_par_type = {
                    'petit_dejeuner': [],
                    'dejeuner': [],
                    'diner': []
                }

                # Filtrer les recettes en fonction des préférences, allergies et catégories
                for recette in toutes_recettes:
                    # Vérifier si la recette est compatible avec le régime végétarien
                    if est_vegetarien and not recette['vegetarien']:
                        continue

                    # Vérifier les allergies avec la nouvelle méthode
                    if allergies and self._recette_contient_allergene(recette, allergies):
                        continue

                    # Ajouter la recette aux types de repas appropriés selon sa catégorie
                    for type_repas, categories in categories_par_repas.items():
                        if recette['categorie'] in categories:
                            recettes_par_type[type_repas].append(recette)

                # Vérifier qu'il y a assez de recettes pour chaque type de repas
                for type_repas, recettes in recettes_par_type.items():
                    logger.info(f"Nombre de recettes pour {type_repas}: {len(recettes)}")
                    if not recettes:
                        return Response(
                            {'error': f'Aucune recette disponible pour le repas {type_repas}'},
                            status=status.HTTP_404_NOT_FOUND
                        )
                    # Vérifier qu'il y a assez de recettes uniques pour une journée
                    if len(recettes) < 1:
                        return Response(
                            {'error': f'Pas assez de recettes uniques pour le repas {type_repas}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # Sélectionner des recettes aléatoires pour la période
                date_debut = datetime.strptime(date_debut, '%Y-%m-%d')
                date_fin = datetime.strptime(date_fin, '%Y-%m-%d')
                nombre_jours = (date_fin - date_debut).days + 1

                # Créer le plan repas
                repas_data = {'repas_par_jour': {}}
                date_courante = date_debut

                # Types de repas dans l'ordre
                types_repas = ['petit_dejeuner', 'dejeuner', 'diner']

                for _ in range(nombre_jours):
                    date_str = date_courante.strftime('%Y-%m-%d')
                    repas_data['repas_par_jour'][date_str] = {}

                    # Ensemble pour tracker les recettes utilisées aujourd'hui
                    used_recipes_today = set()

                    # Sélectionner une recette pour chaque type de repas
                    for type_repas in types_repas:
                        recettes_disponibles = recettes_par_type[type_repas]
                        recette = self._select_unique_recipe(recettes_disponibles, used_recipes_today)

                        if recette:
                            # Ajouter l'ID de la recette à l'ensemble des recettes utilisées
                            used_recipes_today.add(str(recette['_id']))

                            repas_data['repas_par_jour'][date_str][type_repas] = {
                                'id': str(recette['_id']),
                                'nom': recette['nom'],
                                'description': recette['description'],
                                'instructions': recette['instructions'],
                                'categorie': recette['categorie'],
                                'image': recette['image'] if recette['image'] else None
                            }
                        else:
                            logger.error(f"Impossible de trouver une recette unique pour {type_repas}")
                            return Response(
                                {'error': f'Impossible de générer un plan avec des recettes uniques pour {type_repas}'},
                                status=status.HTTP_400_BAD_REQUEST
                            )

                    date_courante += timedelta(days=1)

                # Log du résultat
                logger.info(f"Plan repas généré avec succès pour {nombre_jours} jours")

                return Response(repas_data, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Erreur lors de la récupération des recettes: {str(e)}",
                           exc_info=True)
                raise

        except Exception as e:
            logger.error(f"Erreur inattendue: {str(e)}", exc_info=True)
            return Response(
                {'error': f"Une erreur s'est produite : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
