# Generated by Django 4.1.13 on 2024-09-23 09:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('recettes', '0001_initial'),
        ('liste_courses', '0002_initial'),
        ('utilisateurs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='listecourses',
            name='utilisateur',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utilisateurs.utilisateur'),
        ),
        migrations.AddField(
            model_name='articlecourses',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recettes.ingredient'),
        ),
        migrations.AddField(
            model_name='articlecourses',
            name='liste_courses',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='liste_courses.listecourses'),
        ),
    ]
