from djongo import models  # Changez cet import
from bson import ObjectId
from utilisateurs.models import Utilisateur
from recettes.models import Recette
from django.core.exceptions import ValidationError

class Repas(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    recette = models.ForeignKey(Recette, on_delete=models.CASCADE)
    date = models.DateField()
    type_repas = models.CharField(max_length=50, choices=[
        ('Petit-déjeuner', 'Petit-déjeuner'),
        ('Déjeuner', 'Déjeuner'),
        ('Dîner', 'Dîner')
    ])

    objects = models.DjongoManager()  # Ajoutez ceci pour la gestion MongoDB

    def __str__(self):
        return f"{self.utilisateur} - {self.type_repas} le {self.date}"

    class Meta:
        abstract = False

def validate_repas_data(value):
    """Valide la structure des données de repas"""
    if not isinstance(value, dict):
        raise ValidationError('repas_data doit être un dictionnaire')

    if 'repas_par_jour' not in value:
        raise ValidationError('repas_data doit contenir la clé repas_par_jour')

    if not isinstance(value['repas_par_jour'], dict):
        raise ValidationError('repas_par_jour doit être un dictionnaire')

class PlanRepas(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    date_debut = models.DateField()
    date_fin = models.DateField()
    repas_data = models.JSONField(
        default=dict,
        validators=[validate_repas_data],
        help_text="Structure attendue: {'repas_par_jour': {...}}"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        """Validation supplémentaire du modèle"""
        super().clean()
        if not self.repas_data:
            self.repas_data = {'repas_par_jour': {}}

        # Assurer que la structure est correcte
        if not isinstance(self.repas_data, dict):
            raise ValidationError({'repas_data': 'Doit être un dictionnaire'})

        if 'repas_par_jour' not in self.repas_data:
            self.repas_data = {'repas_par_jour': self.repas_data}

    def save(self, *args, **kwargs):
        """Surcharge de la méthode save pour assurer la structure correcte"""
        if not self.repas_data:
            self.repas_data = {'repas_par_jour': {}}

        # Si repas_data est un dict mais n'a pas repas_par_jour
        if isinstance(self.repas_data, dict) and 'repas_par_jour' not in self.repas_data:
            self.repas_data = {'repas_par_jour': self.repas_data}

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Plan repas de {self.utilisateur.username} du {self.date_debut} au {self.date_fin}"
