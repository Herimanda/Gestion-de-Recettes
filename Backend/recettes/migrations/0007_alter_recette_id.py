# Generated by Django 4.1.13 on 2024-10-18 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0006_recette_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recette',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]