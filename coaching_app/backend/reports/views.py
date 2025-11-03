from rest_framework import viewsets
from .models import Report
from .serializers import ReportSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-report_date')
    serializer_class = ReportSerializer

# reports/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from childprofiles.models import ChildProfile
from attendance.models import Attendance
from coaches.models import Coach
from homevisits.models import HomeVisit

@api_view(['GET'])
def dashboard_summary(request):
    total_children = ChildProfile.objects.count()
    total_sessions = Attendance.objects.count()
    total_coaches = Coach.objects.count()
    total_communities = HomeVisit.objects.values('community').distinct().count()  # example field

    data = {
        "total_children": total_children,
        "total_sessions": total_sessions,
        "total_coaches": total_coaches,
        "total_communities": total_communities,
    }
    return Response(data)


from rest_framework import generics
from .models import Report
from .serializers import ReportSerializer

class ReportList(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer