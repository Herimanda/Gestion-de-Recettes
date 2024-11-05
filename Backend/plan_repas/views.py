from rest_framework import viewsets, status
from .models import Repas, PlanRepas
from .serializers import RepasSerialiseur, PlanRepasSerialiseur
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from intelligent.planificateur_intelligent import PlanificateurIntelligent
import logging
from django.http import Http404
from django.core.exceptions import ValidationError
from bson import ObjectId, errors

logger = logging.getLogger(__name__)

class PlanRepasVueSet(viewsets.ModelViewSet):
    queryset = PlanRepas.objects.all()
    serializer_class = PlanRepasSerialiseur
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def generer_plan(self, request):
        utilisateur = request.user
        planificateur = PlanificateurIntelligent(utilisateur)
        plan_repas = planificateur.generer_plan_repas(jours=7)
        return Response(plan_repas)

class RepasViewSet(viewsets.ModelViewSet):
    serializer_class = RepasSerialiseur
    permission_classes = [IsAuthenticated]
    lookup_field = '_id'
    
    def get_queryset(self):
        return Repas.objects.filter(utilisateur=self.request.user)
    
    def create(self, request, *args, **kwargs):
        logger.debug(f"Données reçues: {request.data}")
        
        try:
            serializer = self.get_serializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Erreurs de validation: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erreur lors de la création: {str(e)}")
            return Response(
                {"detail": f"Erreur lors de la création: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)
        
    def get_object(self):
        """
        Récupère l'objet en utilisant l'ObjectId de MongoDB
        """
        try:
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            _id = self.kwargs.get(lookup_url_kwarg)
            
            if not ObjectId.is_valid(_id):
                raise Http404("ID invalide")
                
            obj_id = ObjectId(_id)
            obj = self.get_queryset().get(_id=obj_id)
            self.check_object_permissions(self.request, obj)
            return obj
            
        except (Repas.DoesNotExist, errors.InvalidId) as e:
            logger.error(f"Erreur lors de la récupération de l'objet: {str(e)}")
            raise Http404
        except Exception as e:
            logger.error(f"Erreur inattendue: {str(e)}")
            raise
            
    def destroy(self, request, *args, **kwargs):
        """
        Supprime un repas avec gestion d'erreurs améliorée
        """
        logger.info(f"Tentative de suppression du repas avec ID: {kwargs.get(self.lookup_field)}")
        
        try:
            instance = self.get_object()
            logger.info(f"Repas trouvé, suppression en cours...")
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Http404:
            logger.warning(f"Repas non trouvé avec ID: {kwargs.get(self.lookup_field)}")
            return Response(
                {"detail": "Repas non trouvé"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Erreur lors de la suppression: {str(e)}")
            return Response(
                {"detail": f"Erreur lors de la suppression: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )