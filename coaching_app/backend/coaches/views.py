from rest_framework import generics
from .models import Coach
from .serializers import CoachSerializer

class CoachList(generics.ListCreateAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer
