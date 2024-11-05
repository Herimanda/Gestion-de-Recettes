# Script pour générer des données de test dans un fichier Django `tests.py`

from django.test import TestCase
from utilisateurs.models import Utilisateur, Preference, Allergie
from recettes.models import Recette, Ingredient, IngredientRecette
from intelligent.planificateur_intelligent import PlanificateurIntelligent

class PlanificateurRepasTestCase(TestCase):

    def setUp(self):
        # Créer des utilisateurs
        self.utilisateur1 = Utilisateur.objects.create_user(
            username='utilisateur1', password='motdepasse', email='utilisateur1@example.com'
        )
        
        # Créer des préférences alimentaires pour l'utilisateur
        allergie_noix = Allergie.objects.create(nom="Noix")
        preference1 = Preference.objects.create(
            utilisateur=self.utilisateur1,
            est_vegetarien=False,
            objectif_calories=2000,
            objectif_proteines=60,
            objectif_glucides=250,
            objectif_lipides=70,
        )
        preference1.allergies.add(allergie_noix)

        # Créer des ingrédients
        ingredient1 = Ingredient.objects.create(nom="Poulet", calories=165, proteines=31, glucides=0, lipides=4)
        ingredient2 = Ingredient.objects.create(nom="Riz", calories=130, proteines=2.7, glucides=28, lipides=0.3)
        ingredient3 = Ingredient.objects.create(nom="Légumes", calories=50, proteines=3, glucides=10, lipides=0.5)
        ingredient4 = Ingredient.objects.create(nom="Tofu", calories=70, proteines=8, glucides=2, lipides=4)
        ingredient5 = Ingredient.objects.create(nom="Noix", calories=607, proteines=15, glucides=21, lipides=56)

        # Créer des recettes
        recette1 = Recette.objects.create(nom="Poulet au riz", vegetarien=False, categorie='déjeuner')
        IngredientRecette.objects.create(recette=recette1, ingredient=ingredient1, quantite=200)  # 200g de poulet
        IngredientRecette.objects.create(recette=recette1, ingredient=ingredient2, quantite=150)  # 150g de riz
        IngredientRecette.objects.create(recette=recette1, ingredient=ingredient3, quantite=100)  # 100g de légumes

        recette2 = Recette.objects.create(nom="Salade de tofu", vegetarien=True, categorie='dîner')
        IngredientRecette.objects.create(recette=recette2, ingredient=ingredient4, quantite=150)  # 150g de tofu
        IngredientRecette.objects.create(recette=recette2, ingredient=ingredient3, quantite=200)  # 200g de légumes

        recette3 = Recette.objects.create(nom="Poulet sauté aux légumes", vegetarien=False, categorie='déjeuner')
        IngredientRecette.objects.create(recette=recette3, ingredient=ingredient1, quantite=150)  # 150g de poulet
        IngredientRecette.objects.create(recette=recette3, ingredient=ingredient3, quantite=200)  # 200g de légumes

        # Recette avec allergie
        recette4 = Recette.objects.create(nom="Salade de fruits secs", vegetarien=True, categorie='goûter')
        IngredientRecette.objects.create(recette=recette4, ingredient=ingredient5, quantite=50)  # 50g de noix

    def test_generation_plan_repas(self):
        # Instancier le planificateur intelligent avec l'utilisateur 1
        planificateur = PlanificateurIntelligent(self.utilisateur1)

        # Générer un plan de repas pour 7 jours
        plan_repas = planificateur.generer_plan_repas(jours=7)

        # Vérifier que le plan de repas contient 7 jours de repas
        self.assertEqual(len(plan_repas), 7)

        # Vérifier que chaque jour contient 3 repas (petit déjeuner, déjeuner, dîner)
        for jour in plan_repas:
            self.assertIn('petit_dejeuner', jour)
            self.assertIn('dejeuner', jour)
            self.assertIn('diner', jour)

        # Vérifier que les recettes contiennent des ingrédients non allergènes
        for jour in plan_repas:
            for type_repas, recette in jour.items():
                if recette:
                    ingredients = IngredientRecette.objects.filter(recette=recette)
                    for ingredient in ingredients:
                        self.assertNotIn(ingredient.ingredient.nom, ['Noix'], "L'utilisateur est allergique aux noix!")

        print("Tous les tests de génération de plan de repas ont réussi.")

if __name__ == '__main__':
    TestCase.main()
