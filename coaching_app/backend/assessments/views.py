from rest_framework import generics
from .models import Assessment
from .serializers import AssessmentSerializer

class AssessmentList(generics.ListCreateAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
