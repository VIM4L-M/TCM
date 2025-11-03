from rest_framework import viewsets
from .models import ChildProfile
from .serializers import ChildProfileSerializer

class ChildProfileViewSet(viewsets.ModelViewSet):
    queryset = ChildProfile.objects.all()
    serializer_class = ChildProfileSerializer
