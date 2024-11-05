# Generated by Django 4.1.13 on 2024-09-23 09:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recettes', '0004_rename_titre_recette_nom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recette',
            name='cree_par',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
