from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from utilisateurs.views import (
    UtilisateurVueSet, 
    LoginView, 
    RegisterView, 
    PreferenceView, 
    PlanRepasView,
    CurrentUserView  # Ajout de l'import
)
from recettes.views import RecetteVueSet, IngredientViewSet, PlanRepasRandomViewSet
from plan_repas.views import PlanRepasVueSet, RepasViewSet
from liste_courses.views import ListeCoursesVueSet, ArticleCoursesVueSet

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurVueSet)
router.register(r'recettes', RecetteVueSet)
router.register(r'listes-courses', ListeCoursesVueSet, basename='listes-courses')
router.register(r'ingredients', IngredientViewSet)
router.register(r'articlescourses', ArticleCoursesVueSet)
router.register(r'planrepas', PlanRepasVueSet, basename='planrepas')
router.register(r'repas', RepasViewSet, basename='repas')
router.register(r'plan_repas', PlanRepasRandomViewSet, basename='plan_repas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/preferences/', PreferenceView.as_view(), name='preferences'),
    path('api/current-user/', CurrentUserView.as_view(), name='current-user'),  # Nouvel endpoint
    path('planrepas/', PlanRepasView.as_view(), name='plan-repas'),
]