from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TournamentViewSet, TeamViewSet, FieldViewSet,
    MatchViewSet, VisitorViewSet
)

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'visitors', VisitorViewSet, basename='visitor')

urlpatterns = [
    path('', include(router.urls)),
]