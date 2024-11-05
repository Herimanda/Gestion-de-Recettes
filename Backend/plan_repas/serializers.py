from rest_framework import serializers
from .models import Repas, PlanRepas
from recettes.serializers import RecetteSerialiseur
from recettes.models import Recette 
from bson import ObjectId, errors
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RepasSerialiseur(serializers.ModelSerializer):
    _id = serializers.CharField(read_only=True)
    recette = RecetteSerialiseur(read_only=True)
    recette_id = serializers.CharField(write_only=True)
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Repas
        fields = ['_id', 'recette', 'recette_id', 'date', 'type_repas']
        read_only_fields = ['_id']

    def validate_recette_id(self, value):
        logger.debug(f"Validating recette_id: {value}")
        
        if not value:
            raise serializers.ValidationError("Une recette doit être sélectionnée")
        
        try:
            if not ObjectId.is_valid(value):
                raise serializers.ValidationError(f"L'ID {value} n'est pas un ObjectId valide")
            
            object_id = ObjectId(value)
            recette = Recette.objects.filter(_id=object_id).first()
            
            if not recette:
                raise serializers.ValidationError(f"Aucune recette trouvée avec l'ID {value}")
            
            return str(object_id)  # Retourner l'ID sous forme de string
            
        except errors.InvalidId:
            raise serializers.ValidationError(f"ID de recette invalide: {value}")
        except Exception as e:
            logger.error(f"Erreur lors de la validation de recette_id: {str(e)}")
            raise serializers.ValidationError(f"Erreur de validation: {str(e)}")

    def create(self, validated_data):
        logger.debug(f"Creating Repas with data: {validated_data}")
        logger.debug(f"User: {self.context.get('request').user}")
        
        recette_id = validated_data.pop('recette_id')
        try:
            object_id = ObjectId(recette_id)
            recette = Recette.objects.get(_id=object_id)
            
            # Obtenir l'utilisateur depuis le contexte
            request = self.context.get('request')
            if not request or not hasattr(request, 'user'):
                raise serializers.ValidationError("Utilisateur non authentifié")
                
            # Créer l'instance de Repas
            repas = Repas(
                recette=recette,
                utilisateur=request.user,
                date=validated_data['date'],
                type_repas=validated_data['type_repas']
            )
            repas.save()
            return repas
            
        except Recette.DoesNotExist:
            raise serializers.ValidationError({"recette_id": "Recette non trouvée"})
        except Exception as e:
            logger.error(f"Erreur lors de la création du repas: {str(e)}")
            raise serializers.ValidationError({"detail": f"Erreur lors de la création du repas: {str(e)}"})
class PlanRepasSerialiseur(serializers.ModelSerializer):
    _id = serializers.CharField(read_only=True)  # Ajouté pour cohérence
    repas = RepasSerialiseur(many=True, read_only=True)

    class Meta:
        model = PlanRepas
        fields = ['_id', 'utilisateur', 'repas', 'date_debut', 'date_fin']
        read_only_fields = ['_id']