# utilisateurs/serializers.py

from django.db import transaction

from rest_framework import serializers

from .models import Utilisateur, Preference, Allergie 
from plan_repas.models import Repas, PlanRepas
from recettes.serializers import RecetteSerialiseur
from recettes.models import Recette 
from bson import ObjectId, errors
from datetime import datetime, timedelta
import logging



class AllergieSerializer(serializers.ModelSerializer):

    class Meta:

        model = Allergie

        fields = ('id', 'nom', 'description', 'gravite')



class PreferenceSerializer(serializers.ModelSerializer):
    # Modifier la sérialisation des allergies pour n'envoyer que les noms
    allergies = serializers.SerializerMethodField()
    
    class Meta:
        model = Preference
        fields = ('est_vegetarien', 'allergies', 'objectif_calories', 
                 'objectif_proteines', 'objectif_glucides', 'objectif_lipides')

    def get_allergies(self, obj):
        # Retourner uniquement la liste des noms d'allergies
        return [allergie.nom for allergie in obj.allergies.all()]



class UtilisateurSerialiseur(serializers.ModelSerializer):

    

    class Meta:
        model = Utilisateur
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}
        }




    @transaction.atomic

    def create(self, validated_data):

        preferences_data = validated_data.pop('preference', None)

        password = validated_data.pop('password', None)

        

        # Créer l'utilisateur

        utilisateur = Utilisateur.objects.create(**validated_data)

        if password:

            utilisateur.set_password(password)

            utilisateur.save()



        # Créer les préférences si elles sont fournies

        if preferences_data:

            allergies_data = preferences_data.pop('allergies', [])

            preference = Preference.objects.create(utilisateur=utilisateur, **preferences_data)

            

            # Ajouter les allergies

            for allergie_data in allergies_data:

                allergie, _ = Allergie.objects.get_or_create(nom=allergie_data['nom'])

                preference.allergies.add(allergie)



        return utilisateur



    @transaction.atomic
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # Update password if provided
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

class RepasSimplifieSerialiseur(serializers.ModelSerializer):
    recette = serializers.SerializerMethodField()

    class Meta:
        model = Repas
        fields = ['date', 'type_repas', 'recette']

    def get_recette(self, obj):
        return obj.recette.nom if obj.recette else "Pas de recette"

# serializers.py

class PlanRepasSerialiseur(serializers.ModelSerializer):
    repas_par_jour = serializers.SerializerMethodField()
    
    class Meta:
        model = PlanRepas
        fields = ['id', 'utilisateur', 'date_debut', 'date_fin', 'repas_par_jour']

    def get_repas_par_jour(self, obj):
        logger = logging.getLogger("serializers.PlanRepasSerialiseur")
        
        try:
            # Log des données brutes
            logger.debug(f"Données repas_data brutes: {obj.repas_data}")
            
            if not obj.repas_data:
                logger.warning("repas_data est vide ou None")
                return {}
                
            if not isinstance(obj.repas_data, dict):
                logger.error(f"repas_data n'est pas un dictionnaire: {type(obj.repas_data)}")
                return {}
            
            # Si repas_data contient directement repas_par_jour
            if 'repas_par_jour' in obj.repas_data:
                return obj.repas_data['repas_par_jour']
                
            # Si les données sont directement dans repas_data
            logger.info("Utilisation directe de repas_data comme repas_par_jour")
            return obj.repas_data
            
        except Exception as e:
            logger.error(f"Erreur lors de la sérialisation des repas: {e}")
            return {}

    def validate_repas_data(self, value):
        """Validation personnalisée pour repas_data"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("repas_data doit être un dictionnaire")
            
        if 'repas_par_jour' not in value:
            raise serializers.ValidationError("repas_data doit contenir la clé 'repas_par_jour'")
            
        return value