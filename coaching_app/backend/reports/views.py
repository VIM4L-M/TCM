from rest_framework import generics
from .models import Report
from .serializers import ReportSerializer

class ReportList(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
