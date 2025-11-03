# backend/homevisits/views.py
from rest_framework import viewsets
from .models import HomeVisit
from .serializers import HomeVisitSerializer

class HomeVisitViewSet(viewsets.ModelViewSet):
    queryset = HomeVisit.objects.all()
    serializer_class = HomeVisitSerializer
