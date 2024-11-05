from djongo import models
from bson import ObjectId
import base64

class Recette(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    nom = models.CharField(max_length=255)
    description = models.TextField()
    instructions = models.TextField()
    vegetarien = models.BooleanField(default=False)
    categorie = models.CharField(max_length=50)
    image = models.TextField(blank=True, null=True)

    def set_image(self, image_file):
        if image_file:
            try:
                # Lire le contenu de l'image
                image_data = image_file.read()
                if len(image_data) <= 1000000:  # 1 MB limit
                    # Encoder en base64 avec le préfixe data URI
                    image_base64 = base64.b64encode(image_data).decode('utf-8')
                    self.image = f"data:image/{image_file.content_type.split('/')[-1]};base64,{image_base64}"
                else:
                    raise ValueError("L'image dépasse la taille limite de 1 Mo")
            except Exception as e:
                raise ValueError(f"Erreur lors du traitement de l'image: {str(e)}")

# Les autres modèles restent inchangés
class Ingredient(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    nom = models.CharField(max_length=255)
    quantite = models.FloatField()
    unite = models.CharField(max_length=50)
    calories = models.FloatField()
    proteines = models.FloatField()
    glucides = models.FloatField()
    lipides = models.FloatField()
    recette = models.ForeignKey(Recette, on_delete=models.CASCADE, related_name='ingredients')

    def __str__(self):
        return f"{self.nom} ({self.quantite} {self.unite})"

# In models.py, update the IngredientRecette model
class IngredientRecette(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    recette = models.CharField(max_length=24)
    ingredient = models.CharField(max_length=24)
    quantite = models.FloatField()
    recettes_aff = models.CharField(max_length=255, blank=True, null=True)  # New field

    objects = models.DjongoManager()

    def __str__(self):
        return f"{self.quantite}g d'ingrédient dans la recette {self.recette}"

    class Meta:
        abstract = False