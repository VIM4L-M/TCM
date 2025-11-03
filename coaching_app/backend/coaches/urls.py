from django.urls import path
from . import views

urlpatterns = [
    path('', views.CoachList.as_view(), name='coach-list'),
]
