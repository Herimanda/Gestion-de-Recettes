# Generated by Django 4.1.13 on 2024-10-21 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0011_remove_recette_cree_par'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingredientrecette',
            name='recettes_aff',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
