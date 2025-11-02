from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Tournament, Team, Field, Match, Visitor, TournamentSnapshot
from .serializers import (
    TournamentListSerializer, TournamentDetailSerializer,
    TeamSerializer, FieldSerializer, MatchSerializer,
    VisitorSerializer, TournamentSnapshotSerializer
)

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'location', 'city']
    ordering_fields = ['created_at', 'start_date', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TournamentListSerializer
        return TournamentDetailSerializer
    
    def get_queryset(self):
        queryset = Tournament.objects.all()
        
        status_param = self.request.query_params.get('status', None)
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param.upper())
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(slug__icontains=search) |
                Q(location__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        tournament = self.get_object()
        tournament.status = 'PUBLISHED'
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def snapshot(self, request, pk=None):
        tournament = self.get_object()
        
        snapshot_data = {
            'tournament': TournamentDetailSerializer(tournament).data,
            'teams': TeamSerializer(tournament.teams.all(), many=True).data,
            'fields': FieldSerializer(tournament.fields.all(), many=True).data,
            'matches': MatchSerializer(tournament.matches.all(), many=True).data,
        }
        
        snapshot = TournamentSnapshot.objects.create(
            tournament=tournament,
            snapshot_data=snapshot_data,
            created_by=request.user,
            notes=request.data.get('notes', '')
        )
        
        serializer = TournamentSnapshotSerializer(snapshot)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def snapshots(self, request, pk=None):
        tournament = self.get_object()
        snapshots = tournament.snapshots.all()
        serializer = TournamentSnapshotSerializer(snapshots, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    def get_queryset(self):
        queryset = Team.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        return queryset


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    
    def get_queryset(self):
        queryset = Field.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        return queryset


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        queryset = Match.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        return queryset
    
    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        match = self.get_object()
        match.team_a_score = request.data.get('team_a_score', match.team_a_score)
        match.team_b_score = request.data.get('team_b_score', match.team_b_score)
        
        if match.team_a_score > match.team_b_score:
            match.winner = match.team_a
        elif match.team_b_score > match.team_a_score:
            match.winner = match.team_b
        
        match.save()
        serializer = self.get_serializer(match)
        return Response(serializer.data)


class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer
    
    def get_queryset(self):
        queryset = Visitor.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        return queryset
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        visitor = self.get_object()
        visitor.checked_in = True
        from django.utils import timezone
        visitor.checked_in_at = timezone.now()
        visitor.save()
        serializer = self.get_serializer(visitor)
        return Response(serializer.data)