# backend/homevisits/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HomeVisitViewSet

router = DefaultRouter()
router.register('', HomeVisitViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
