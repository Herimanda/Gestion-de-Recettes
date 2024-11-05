from django.contrib.auth.models import AbstractUser, Group, Permission

from django.db import models
from bson import ObjectId



class Utilisateur(AbstractUser):

    groups = models.ManyToManyField(

        Group,

        related_name='utilisateur_groups',  # Nom unique pour éviter les conflits

        blank=True,

        help_text='The groups this user belongs to.',

        related_query_name='utilisateur',

    )

    user_permissions = models.ManyToManyField(

        Permission,

        related_name='utilisateur_permissions',  # Nom unique pour éviter les conflits

        blank=True,

        help_text='Specific permissions for this user.',

        related_query_name='utilisateur',

    )



    def __str__(self):

        

        return self.username

    

class Preference(models.Model):

    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)

    est_vegetarien = models.BooleanField(default=False)

    allergies = models.ManyToManyField('Allergie', blank=True)

    objectif_calories = models.FloatField(default=2000)  # Objectif quotidien en kcal

    objectif_proteines = models.FloatField(default=50)   # Objectif en grammes

    objectif_glucides = models.FloatField(default=250)   # Objectif en grammes

    objectif_lipides = models.FloatField(default=70)     # Objectif en grammes



    def obtenir_objectifs_nutritionnels(self):

        return {

            'calories': self.objectif_calories,

            'proteines': self.objectif_proteines,

            'glucides': self.objectif_glucides,

            'lipides': self.objectif_lipides,

        }



class Allergie(models.Model):

    nom = models.CharField(max_length=255)

    description = models.TextField(blank=True, null=True)  

    gravite = models.CharField(max_length=50, choices=[('faible', 'Faible'), ('moyenne', 'Moyenne'), ('elevee', 'Élevée')], default='faible')



    def __str__(self):

        return self.nom


