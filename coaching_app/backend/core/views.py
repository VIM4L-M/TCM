from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Program, Site, Child, Coach, Session, Attendance, HomeVisit, Assessment, TransferHistory
from .serializers import (ProgramSerializer, SiteSerializer, ChildSerializer, CoachSerializer, SessionSerializer,
                          AttendanceSerializer, HomeVisitSerializer, AssessmentSerializer, TransferHistorySerializer)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all().select_related("program")
    serializer_class = SiteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ("program", "site_type")
    search_fields = ("name",)

class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all().prefetch_related("current_sites")
    serializer_class = ChildSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ("gender", "current_sites")
    search_fields = ("first_name", "last_name", "unique_id")
    ordering_fields = ("created_at", "first_name")

    @action(detail=True, methods=["get"])
    def attendance(self, request, pk=None):
        child = self.get_object()
        data = Attendance.objects.filter(child=child)
        serializer = AttendanceSerializer(data, many=True)
        return Response(serializer.data)

class TransferHistoryViewSet(viewsets.ModelViewSet):
    queryset = TransferHistory.objects.all()
    serializer_class = TransferHistorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    search_fields = ("name", "email")

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().select_related("site", "coach")
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ("site", "coach", "date")
    search_fields = ("notes",)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().select_related("session", "child")
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ("session", "child", "present")

class HomeVisitViewSet(viewsets.ModelViewSet):
    queryset = HomeVisit.objects.all().select_related("coach", "child")
    serializer_class = HomeVisitSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    search_fields = ("notes",)

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all().select_related("child")
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    filterset_fields = ("child", "type", "date")
    search_fields = ("notes",)
