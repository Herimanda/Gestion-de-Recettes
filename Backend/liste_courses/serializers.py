# liste_courses/serializeurs.py
from rest_framework import serializers
from .models import ListeCourses, ArticleCourses

class ArticleCoursesSerialiseur(serializers.ModelSerializer):
    class Meta:
        model = ArticleCourses
        fields = '__all__'

class ListeCoursesSerialiseur(serializers.ModelSerializer):
    articles = ArticleCoursesSerialiseur(many=True)

    class Meta:
        model = ListeCourses
        fields = '__all__'
