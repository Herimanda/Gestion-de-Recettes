# liste_courses/vues.py
from rest_framework import viewsets
from .models import ListeCourses, ArticleCourses
from .serializers import ListeCoursesSerialiseur, ArticleCoursesSerialiseur

class ListeCoursesVueSet(viewsets.ModelViewSet):
    queryset = ListeCourses.objects.all()
    serializer_class = ListeCoursesSerialiseur

class ArticleCoursesVueSet(viewsets.ModelViewSet):
    queryset = ArticleCourses.objects.all()
    serializer_class = ArticleCoursesSerialiseur
