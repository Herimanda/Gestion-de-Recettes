# recettes/analyseur_nutritionnel.py

from .models import Recette, IngredientRecette

class AnalyseurNutritionnel:
    
    @staticmethod
    def calculer_valeurs_nutritionnelles(recette):
        """
        Calcule les valeurs nutritionnelles totales d'une recette
        """
        calories_totales = 0
        proteines_totales = 0
        glucides_totaux = 0
        lipides_totaux = 0

        ingredients_recette = IngredientRecette.objects.filter(recette=recette)
        
        for ingredient_recette in ingredients_recette:
            ingredient = ingredient_recette.ingredient
            quantite = ingredient_recette.quantite
            
            calories_totales += ingredient.calories * (quantite / 100)
            proteines_totales += ingredient.proteines * (quantite / 100)
            glucides_totaux += ingredient.glucides * (quantite / 100)
            lipides_totaux += ingredient.lipides * (quantite / 100)

        return {
            'calories': calories_totales,
            'proteines': proteines_totales,
            'glucides': glucides_totaux,
            'lipides': lipides_totaux,
        }
