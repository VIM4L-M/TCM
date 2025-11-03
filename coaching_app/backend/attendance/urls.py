from django.urls import path
from . import views

urlpatterns = [
    path('', views.AttendanceList.as_view(), name='attendance-list'),
]
