from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TournamentViewSet, TeamViewSet, FieldViewSet, MatchViewSet,
    VisitorViewSet, UserProfileViewSet, SpiritScoreViewSet,
    MatchPhotoViewSet, login_user, register_user, current_user, volunteer_dashboard
)

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'visitors', VisitorViewSet, basename='visitor')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'spirit-scores', SpiritScoreViewSet, basename='spiritscore')
router.register(r'match-photos', MatchPhotoViewSet, basename='matchphoto')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_user, name='login'),
    path('auth/register/', register_user, name='register'),
    path('auth/me/', current_user, name='current-user'),
    path('volunteer/dashboard/', volunteer_dashboard, name='volunteer-dashboard'),
]