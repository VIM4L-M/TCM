from django.urls import path
from . import views

urlpatterns = [
    path('', views.ChildListCreate.as_view(), name='child-list'),
    path('<int:pk>/', views.ChildDetail.as_view(), name='child-detail'),
]
