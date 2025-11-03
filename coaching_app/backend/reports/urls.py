from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportList.as_view(), name='report-list'),
    path('dashboard-summary/', views.dashboard_summary, name='dashboard-summary'),
]
