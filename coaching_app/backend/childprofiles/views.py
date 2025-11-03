from rest_framework import generics
from .models import ChildProfile
from .serializers import ChildSerializer

class ChildListCreate(generics.ListCreateAPIView):
    queryset = ChildProfile.objects.all()
    serializer_class = ChildSerializer

class ChildDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChildProfile.objects.all()
    serializer_class = ChildSerializer
