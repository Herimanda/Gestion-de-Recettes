from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Utilisateur, Preference, Allergie
from .serializers import UtilisateurSerialiseur, PreferenceSerializer, PlanRepasSerialiseur
import logging
from intelligent.planificateur_intelligent import PlanificateurIntelligent
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from plan_repas.models import Repas
from datetime import datetime, timedelta
import asyncio

logger = logging.getLogger(__name__)

User = get_user_model()

class UtilisateurVueSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerialiseur


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        logger.info(f"Tentative de connexion pour l'utilisateur: {username}")
        logger.info(f"Données de la requête: {request.data}")

        if not username or not password:
            logger.error("Nom d'utilisateur ou mot de passe manquant dans les données de la requête")
            return Response({'error': 'Nom d\'utilisateur et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            logger.info(f"Utilisateur {username} authentifié avec succès")
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {'username': user.username, 'email': user.email}
            }, status=status.HTTP_200_OK)
        else:
            logger.error(f"Échec de l'authentification pour l'utilisateur: {username}")
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        serializer = UtilisateurSerialiseur(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": UtilisateurSerialiseur(user).data,
                "message": "User Created Successfully",
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        user = request.user
        preference, created = Preference.objects.get_or_create(utilisateur=user)
        serializer = PreferenceSerializer(preference)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        preference = get_object_or_404(Preference, utilisateur=user)

        # Gestion des allergies
        allergies_data = request.data.get('allergies', [])
        if isinstance(allergies_data, str):
            # Si les allergies sont envoyées comme une chaîne, les convertir en liste
            allergies_list = [allergie.strip() for allergie in allergies_data.split(',') if allergie.strip()]
        else:
            allergies_list = allergies_data

        # Copier les données de la requête pour modification
        preference_data = request.data.copy()
        preference_data.pop('allergies', None)  # Retirer les allergies pour les traiter séparément

        # Mettre à jour les préférences de base
        serializer = PreferenceSerializer(preference, data=preference_data, partial=True)
        if serializer.is_valid():
            preference = serializer.save()

            # Mettre à jour les allergies
            preference.allergies.clear()
            for allergie_nom in allergies_list:
                allergie, _ = Allergie.objects.get_or_create(nom=allergie_nom)
                preference.allergies.add(allergie)

            # Récupérer les données mises à jour
            updated_serializer = PreferenceSerializer(preference)
            return Response(updated_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py

class PlanRepasView(APIView):
    permission_classes = [IsAuthenticated]
    logger = logging.getLogger("views.PlanRepasView")

    async def post(self, request):
        try:
            utilisateur_id = request.data.get('utilisateur')
            date_debut = request.data.get('date_debut')
            date_fin = request.data.get('date_fin')
            self.logger.info(f"Données reçues: utilisateur={utilisateur_id}, date_debut={date_debut}, date_fin={date_fin}")

            if not all([date_debut, date_fin, utilisateur_id]):
                return Response(
                    {'error': 'Données manquantes'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                date_debut_obj = datetime.strptime(date_debut, '%Y-%m-%d')
                date_fin_obj = datetime.strptime(date_fin, '%Y-%m-%d')
            except ValueError:
                return Response(
                    {'error': 'Format de date invalide'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            utilisateur = await sync_to_async(get_object_or_404)(User, id=utilisateur_id)
            planificateur = PlanificateurIntelligent(utilisateur)
            
            # Génération du plan repas
            plan_repas_data = await planificateur.generer_plan_repas(
                date_debut_obj,
                date_fin_obj,
                utilisateur
            )

            # Vérification des données générées
            if not plan_repas_data or 'repas_data' not in plan_repas_data:
                self.logger.error("Données de plan repas invalides ou manquantes")
                return Response(
                    {'error': 'Erreur lors de la génération du plan repas'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # S'assurer que les données sont dans le bon format avant de les sauvegarder
            repas_data = plan_repas_data['repas_data']
            if not isinstance(repas_data, dict) or 'repas_par_jour' not in repas_data:
                repas_data = {'repas_par_jour': repas_data}

            # Créer un nouveau plan repas en base de données
# Créer un nouveau plan repas en base de données
            plan_repas_db = await sync_to_async(PlanRepas.objects.create)(
            utilisateur=utilisateur,
            date_debut=date_debut_obj,
            date_fin=date_fin_obj,
            repas_data=plan_repas_data['repas_data']  # Données structurées correctement
)


            # Debug log
            self.logger.info(f"Plan repas créé avec succès. ID: {plan_repas_db.id}")
            self.logger.debug(f"Données du plan repas: {plan_repas_db.repas_data}")

            # Sérialiser et retourner la réponse
            serializer = PlanRepasSerialiseur(plan_repas_db)
            response_data = serializer.data

            # Vérification finale des données
            if 'repas_par_jour' not in response_data:
                self.logger.error("Données de repas manquantes dans la réponse sérialisée")
                return Response(
                    {'error': 'Erreur de sérialisation des données'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            self.logger.debug(f"Données de réponse finales: {response_data}")
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            self.logger.error(f"Erreur lors de la génération du plan repas: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UtilisateurSerialiseur(request.user)
        return Response(serializer.data)