from rest_framework import serializers
from .models import Recette, Ingredient, IngredientRecette
import base64
from django.core.files.base import ContentFile
from bson import ObjectId  # Ajout de l'import manquant

class RecetteSerialiseur(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_null=True)
    vegetarien = serializers.BooleanField()  # Ajout de la validation explicite

    class Meta:
        model = Recette
        fields = '__all__'

    def to_internal_value(self, data):
        # Conversion du champ vegetarien
        if 'vegetarien' in data and isinstance(data['vegetarien'], str):
            data['vegetarien'] = data['vegetarien'].lower() == 'true'

        if 'image' in data and data['image']:
            if isinstance(data['image'], str) and data['image'].startswith('data:image'):
                return data
            elif hasattr(data['image'], 'read'):
                image_data = data['image'].read()
                content_type = data['image'].content_type
                image_base64 = base64.b64encode(image_data).decode('utf-8')
                data['image'] = f"data:image/{content_type.split('/')[-1]};base64,{image_base64}"
        return data 

    def validate_vegetarien(self, value):
        """
        Validation spécifique pour le champ vegetarien
        """
        if isinstance(value, (bool, int)):
            return bool(value)
        if isinstance(value, str):
            value = value.lower()
            if value in ('true', '1', 'yes'):
                return True
            if value in ('false', '0', 'no'):
                return False
        if isinstance(value, list):
            if len(value) > 0:
                return self.validate_vegetarien(value[0])
        return False

    def to_internal_value(self, data):
        if 'vegetarien' in data:
            data = data.copy()
            data['vegetarien'] = self.validate_vegetarien(data['vegetarien'])
            
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # L'image est déjà au format base64 avec le préfixe data URI
        return representation
class IngredientSerializer(serializers.ModelSerializer):
    recette = RecetteSerialiseur(read_only=True)
    recette_id = serializers.CharField(write_only=True)

    class Meta:
        model = Ingredient
        fields = ['_id', 'nom', 'quantite', 'unite', 'calories', 'proteines', 'glucides', 'lipides', 'recette', 'recette_id']

    def validate_recette_id(self, value):
        try:
            # Validation que la valeur est un ObjectId valide
            if not ObjectId.is_valid(value):
                raise serializers.ValidationError("L'ID de recette n'est pas un ObjectId valide")
            
            recette = Recette.objects.get(_id=ObjectId(value))
            return recette
        except Recette.DoesNotExist:
            raise serializers.ValidationError(f"La recette avec l'id {value} n'existe pas.")
        except Exception as e:
            raise serializers.ValidationError(f"Erreur de validation de l'ID de recette: {str(e)}")

    def validate(self, data):
        # Validation personnalisée
        required_fields = ['nom', 'quantite', 'unite']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError(f"Le champ {field} est requis.")
            
        # Validation des valeurs numériques
        numeric_fields = ['quantite', 'calories', 'proteines', 'glucides', 'lipides']
        for field in numeric_fields:
            if field in data and data[field] is not None:
                try:
                    float(data[field])
                except (TypeError, ValueError):
                    raise serializers.ValidationError(f"Le champ {field} doit être un nombre valide.")
                if float(data[field]) < 0:
                    raise serializers.ValidationError(f"Le champ {field} ne peut pas être négatif.")
                
        return data

    def create(self, validated_data):
        recette = validated_data.pop('recette_id')
        return Ingredient.objects.create(recette=recette, **validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.recette:
            representation['recette'] = instance.recette.nom
        return representation

class IngredientRecetteSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    recettes_aff = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = IngredientRecette
        fields = ['ingredient', 'quantite', 'recettes_aff']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        ingredient_data = representation.pop('ingredient')
        representation.update(ingredient_data)
        representation['nom'] = ingredient_data['nom']
        representation['valeurs_nutritionnelles'] = {
            'calories': ingredient_data['calories'],
            'proteines': ingredient_data['proteines'],
            'glucides': ingredient_data['glucides'],
            'lipides': ingredient_data['lipides'],
        }
        return representation

from rest_framework import serializers
from datetime import datetime, timedelta
from .models import Recette

