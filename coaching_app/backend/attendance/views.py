from rest_framework import generics
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceList(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
