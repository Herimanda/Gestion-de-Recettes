# liste_courses/modeles.py
from django.db import models
from utilisateurs.models import Utilisateur
from recettes.models import Ingredient

class ListeCourses(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    articles = models.ManyToManyField(Ingredient, through='ArticleCourses')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Liste de courses pour {self.utilisateur}"

class ArticleCourses(models.Model):
    liste_courses = models.ForeignKey(ListeCourses, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantite = models.FloatField()
    unite = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantite} {self.unite} de {self.ingredient.nom}"
