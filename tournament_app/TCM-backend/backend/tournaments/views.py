from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Avg, Sum, F
from django.utils import timezone
from django.contrib.auth.models import User
from django.http import HttpResponse
from datetime import datetime, timedelta
import csv
import itertools

from .models import (
    Tournament, Team, Field, Match, Visitor, TournamentSnapshot,
    UserProfile, TeamMember, SpiritScore, MatchPhoto, TournamentSponsor
)
from .serializers import (
    TournamentListSerializer, TournamentDetailSerializer,
    TeamListSerializer, TeamDetailSerializer, TeamMemberSerializer,
    TeamMemberCreateSerializer, FieldSerializer, MatchListSerializer,
    MatchDetailSerializer, VisitorSerializer, TournamentSnapshotSerializer,
    UserProfileSerializer, UserSerializer, RegisterSerializer,
    SpiritScoreSerializer, MatchPhotoSerializer, TournamentSponsorSerializer,
    ScheduleGenerationSerializer, LeaderboardSerializer
)

# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register new user (Captain, Player, Volunteer, Fan)
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current logged-in user details"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ==================== USER PROFILE VIEWS ====================

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


# ==================== TOURNAMENT VIEWS ====================

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'location', 'city']
    ordering_fields = ['created_at', 'start_date', 'name']
    permission_classes = [AllowAny]  # Public can view
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TournamentListSerializer
        return TournamentDetailSerializer
    
    def get_queryset(self):
        queryset = Tournament.objects.all()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param.upper())
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(slug__icontains=search) |
                Q(location__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        # Only directors can create tournaments
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish tournament"""
        tournament = self.get_object()
        tournament.status = 'PUBLISHED'
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def snapshot(self, request, pk=None):
        """Create tournament snapshot"""
        tournament = self.get_object()
        
        snapshot_data = {
            'tournament': TournamentDetailSerializer(tournament).data,
            'teams': TeamListSerializer(tournament.teams.all(), many=True).data,
            'fields': FieldSerializer(tournament.fields.all(), many=True).data,
            'matches': MatchListSerializer(tournament.matches.all(), many=True).data,
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
        """Get all snapshots for a tournament"""
        tournament = self.get_object()
        snapshots = tournament.snapshots.all()
        serializer = TournamentSnapshotSerializer(snapshots, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def generate_schedule(self, request, pk=None):
        """Auto-generate tournament schedule"""
        tournament = self.get_object()
        serializer = ScheduleGenerationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        format_type = data['format']
        start_date = data['start_date']
        start_time = data['start_time']
        match_duration = data['match_duration']
        break_duration = data['break_duration']
        field_ids = data['field_ids']
        
        # Get teams and fields
        teams = list(tournament.teams.filter(status='APPROVED'))
        fields = Field.objects.filter(id__in=field_ids, tournament=tournament)
        
        if len(teams) < 2:
            return Response({'error': 'Need at least 2 approved teams'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not fields.exists():
            return Response({'error': 'No valid fields selected'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete existing matches for this tournament
        Match.objects.filter(tournament=tournament).delete()
        
        matches = []
        
        if format_type == 'ROUND_ROBIN':
            matches = self._generate_round_robin(tournament, teams, fields, start_date, start_time, match_duration, break_duration)
        elif format_type == 'SINGLE_ELIMINATION':
            matches = self._generate_single_elimination(tournament, teams, fields, start_date, start_time, match_duration, break_duration)
        elif format_type == 'DOUBLE_ELIMINATION':
            matches = self._generate_double_elimination(tournament, teams, fields, start_date, start_time, match_duration, break_duration)
        
        # Bulk create matches
        Match.objects.bulk_create(matches)
        
        return Response({
            'message': f'Generated {len(matches)} matches',
            'format': format_type,
            'matches_count': len(matches)
        }, status=status.HTTP_201_CREATED)
    
    def _generate_round_robin(self, tournament, teams, fields, start_date, start_time, match_duration, break_duration):
        """Generate round-robin schedule (everyone plays everyone)"""
        matches = []
        match_number = 1
        current_datetime = datetime.combine(start_date, start_time)
        field_list = list(fields)
        field_index = 0
        
        # Generate all possible pairings
        for team_a, team_b in itertools.combinations(teams, 2):
            match = Match(
                tournament=tournament,
                match_number=match_number,
                team_a=team_a,
                team_b=team_b,
                field=field_list[field_index],
                scheduled_datetime=current_datetime,
                duration=match_duration,
                status='SCHEDULED'
            )
            matches.append(match)
            
            match_number += 1
            field_index = (field_index + 1) % len(field_list)
            
            # If we've used all fields, move to next time slot
            if field_index == 0:
                current_datetime += timedelta(minutes=match_duration + break_duration)
        
        return matches
    
    def _generate_single_elimination(self, tournament, teams, fields, start_date, start_time, match_duration, break_duration):
        """Generate single elimination bracket"""
        matches = []
        match_number = 1
        current_datetime = datetime.combine(start_date, start_time)
        field_list = list(fields)
        field_index = 0
        
        # First round
        num_teams = len(teams)
        for i in range(0, num_teams - 1, 2):
            if i + 1 < num_teams:
                match = Match(
                    tournament=tournament,
                    match_number=match_number,
                    team_a=teams[i],
                    team_b=teams[i + 1],
                    field=field_list[field_index],
                    scheduled_datetime=current_datetime,
                    duration=match_duration,
                    status='SCHEDULED'
                )
                matches.append(match)
                
                match_number += 1
                field_index = (field_index + 1) % len(field_list)
                
                if field_index == 0:
                    current_datetime += timedelta(minutes=match_duration + break_duration)
        
        # TODO: Generate subsequent rounds (requires winners from previous rounds)
        # For now, just generate first round
        
        return matches
    
    def _generate_double_elimination(self, tournament, teams, fields, start_date, start_time, match_duration, break_duration):
        """Generate double elimination bracket (winner's and loser's bracket)"""
        # Similar to single elimination but with loser's bracket
        # For MVP, use single elimination logic
        return self._generate_single_elimination(tournament, teams, fields, start_date, start_time, match_duration, break_duration)
    
    @action(detail=True, methods=['get'])
    def leaderboard(self, request, pk=None):
        """Get tournament leaderboard/standings"""
        tournament = self.get_object()
        teams = tournament.teams.filter(status='APPROVED')
        
        leaderboard_data = []
        
        for team in teams:
            # Calculate stats
            matches_as_a = Match.objects.filter(tournament=tournament, team_a=team, status='COMPLETED')
            matches_as_b = Match.objects.filter(tournament=tournament, team_b=team, status='COMPLETED')
            
            wins = 0
            losses = 0
            draws = 0
            goals_for = 0
            goals_against = 0
            
            for match in matches_as_a:
                goals_for += match.team_a_score
                goals_against += match.team_b_score
                if match.winner == team:
                    wins += 1
                elif match.winner is None:
                    draws += 1
                else:
                    losses += 1
            
            for match in matches_as_b:
                goals_for += match.team_b_score
                goals_against += match.team_a_score
                if match.winner == team:
                    wins += 1
                elif match.winner is None:
                    draws += 1
                else:
                    losses += 1
            
            matches_played = wins + losses + draws
            points = wins * 3 + draws * 1
            goal_difference = goals_for - goals_against
            
            # Get average spirit score
            spirit_scores = SpiritScore.objects.filter(for_team=team)
            avg_spirit = spirit_scores.aggregate(Avg('total_score'))['total_score__avg'] or 0.0
            
            leaderboard_data.append({
                'team_id': team.id,
                'team_name': team.name,
                'matches_played': matches_played,
                'wins': wins,
                'losses': losses,
                'draws': draws,
                'points': points,
                'goals_for': goals_for,
                'goals_against': goals_against,
                'goal_difference': goal_difference,
                'average_spirit_score': round(avg_spirit, 2)
            })
        
        # Sort by points, then goal difference, then spirit score
        leaderboard_data.sort(key=lambda x: (x['points'], x['goal_difference'], x['average_spirit_score']), reverse=True)
        
        # Add rank
        for i, item in enumerate(leaderboard_data, 1):
            item['rank'] = i
        
        serializer = LeaderboardSerializer(leaderboard_data, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def export_schedule(self, request, pk=None):
        """Export match schedule as CSV"""
        tournament = self.get_object()
        matches = tournament.matches.all().order_by('scheduled_datetime')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="schedule_{tournament.slug}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Match #', 'Date', 'Time', 'Team A', 'Team B', 'Field', 'Status'])
        
        for match in matches:
            writer.writerow([
                match.match_number,
                match.scheduled_datetime.strftime('%Y-%m-%d'),
                match.scheduled_datetime.strftime('%H:%M'),
                match.team_a.name,
                match.team_b.name,
                match.field.name if match.field else 'TBD',
                match.status
            ])
        
        return response
    
    @action(detail=True, methods=['get'])
    def export_standings(self, request, pk=None):
        """Export final standings as CSV"""
        tournament = self.get_object()
        leaderboard_response = self.leaderboard(request, pk)
        leaderboard_data = leaderboard_response.data
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="standings_{tournament.slug}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Rank', 'Team', 'Played', 'Wins', 'Losses', 'Draws', 'Points', 'GF', 'GA', 'GD', 'Spirit Score'])
        
        for item in leaderboard_data:
            writer.writerow([
                item['rank'],
                item['team_name'],
                item['matches_played'],
                item['wins'],
                item['losses'],
                item['draws'],
                item['points'],
                item['goals_for'],
                item['goals_against'],
                item['goal_difference'],
                item['average_spirit_score']
            ])
        
        return response
    
    @action(detail=True, methods=['get'])
    def export_spirit_scores(self, request, pk=None):
        """Export spirit scores as CSV"""
        tournament = self.get_object()
        teams = tournament.teams.filter(status='APPROVED')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="spirit_scores_{tournament.slug}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Team', 'Average Spirit Score', 'Total Scores Received'])
        
        data = []
        for team in teams:
            spirit_scores = SpiritScore.objects.filter(for_team=team)
            avg_spirit = spirit_scores.aggregate(Avg('total_score'))['total_score__avg'] or 0.0
            count = spirit_scores.count()
            data.append((team.name, round(avg_spirit, 2), count))
        
        # Sort by average spirit score
        data.sort(key=lambda x: x[1], reverse=True)
        
        for item in data:
            writer.writerow(item)
        
        return response
    
    @action(detail=True, methods=['get'])
    def export_rosters(self, request, pk=None):
        """Export team rosters as CSV"""
        tournament = self.get_object()
        teams = tournament.teams.filter(status='APPROVED')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="rosters_{tournament.slug}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Team', 'Captain', 'Player Name', 'Jersey #', 'Position', 'Status'])
        
        for team in teams:
            members = team.members.all()
            for member in members:
                writer.writerow([
                    team.name,
                    team.captain.username if team.captain else '',
                    member.player.username,
                    member.jersey_number or '',
                    member.position or '',
                    member.status
                ])
        
        return response


# ==================== TEAM VIEWS ====================

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TeamListSerializer
        return TeamDetailSerializer
    
    def get_queryset(self):
        queryset = Team.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        
        # Filter by captain (my teams)
        if self.request.query_params.get('my_teams') == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(captain=self.request.user)
        
        return queryset
    
    def perform_create(self, serializer):
        # Captain creates team (status = PENDING by default)
        serializer.save(captain=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Director approves team registration"""
        team = self.get_object()
        team.status = 'APPROVED'
        team.save()
        return Response({'message': 'Team approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Director rejects team registration"""
        team = self.get_object()
        team.status = 'REJECTED'
        team.save()
        return Response({'message': 'Team rejected'})
    
    @action(detail=True, methods=['post'])
    def add_player(self, request, pk=None):
        """Captain adds player to team by email"""
        team = self.get_object()
        
        # Check if user is captain
        if team.captain != request.user:
            return Response({'error': 'Only captain can add players'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TeamMemberCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        # Check if player exists
        try:
            player = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No user found with this email'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already member
        if TeamMember.objects.filter(team=team, player=player).exists():
            return Response({'error': 'Player already in team'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check max players limit
        max_players = team.tournament.max_players_per_team
        current_count = team.members.filter(status='APPROVED').count()
        if current_count >= max_players:
            return Response({'error': f'Team is full (max {max_players} players)'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add player
        member = TeamMember.objects.create(
            team=team,
            player=player,
            status='APPROVED',  # Captain-added players are auto-approved
            jersey_number=serializer.validated_data.get('jersey_number'),
            position=serializer.validated_data.get('position', ''),
            approved_at=timezone.now()
        )
        
        return Response(TeamMemberSerializer(member).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def request_join(self, request, pk=None):
        """Player requests to join team"""
        team = self.get_object()
        player = request.user
        
        # Check if already member
        if TeamMember.objects.filter(team=team, player=player).exists():
            return Response({'error': 'Already requested or member'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create join request
        member = TeamMember.objects.create(
            team=team,
            player=player,
            status='REQUESTED',
            jersey_number=request.data.get('jersey_number'),
            position=request.data.get('position', '')
        )
        
        return Response(TeamMemberSerializer(member).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def join_requests(self, request, pk=None):
        """Get pending join requests for team"""
        team = self.get_object()
        
        # Check if user is captain
        if team.captain != request.user:
            return Response({'error': 'Only captain can view requests'}, status=status.HTTP_403_FORBIDDEN)
        
        requests = team.members.filter(status='REQUESTED')
        serializer = TeamMemberSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve_player(self, request, pk=None):
        """Captain approves player join request"""
        team = self.get_object()
        
        # Check if user is captain
        if team.captain != request.user:
            return Response({'error': 'Only captain can approve'}, status=status.HTTP_403_FORBIDDEN)
        
        member_id = request.data.get('member_id')
        try:
            member = TeamMember.objects.get(id=member_id, team=team, status='REQUESTED')
        except TeamMember.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check max players limit
        max_players = team.tournament.max_players_per_team
        current_count = team.members.filter(status='APPROVED').count()
        if current_count >= max_players:
            return Response({'error': f'Team is full (max {max_players} players)'}, status=status.HTTP_400_BAD_REQUEST)
        
        member.status = 'APPROVED'
        member.approved_at = timezone.now()
        member.save()
        
        return Response(TeamMemberSerializer(member).data)

    @action(detail=True, methods=['post'])
    def reject_player(self, request, pk=None):
        """Captain rejects player join request"""
        team = self.get_object()
        
        # Check if user is captain
        if team.captain != request.user:
            return Response({'error': 'Only captain can reject'}, status=status.HTTP_403_FORBIDDEN)
        
        member_id = request.data.get('member_id')
        try:
            member = TeamMember.objects.get(id=member_id, team=team, status='REQUESTED')
        except TeamMember.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
        
        member.delete()
        return Response({'message': 'Request rejected'})

    @action(detail=True, methods=['delete'])
    def remove_player(self, request, pk=None):
        """Captain removes player from team"""
        team = self.get_object()
        
        # Check if user is captain
        if team.captain != request.user:
            return Response({'error': 'Only captain can remove players'}, status=status.HTTP_403_FORBIDDEN)
        
        member_id = request.data.get('member_id')
        try:
            member = TeamMember.objects.get(id=member_id, team=team)
        except TeamMember.DoesNotExist:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
        
        member.delete()
        return Response({'message': 'Player removed'})

class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Field.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        return queryset

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return MatchListSerializer
        return MatchDetailSerializer

    def get_queryset(self):
        queryset = Match.objects.all()
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        
        # Filter by field
        field_id = self.request.query_params.get('field', None)
        if field_id:
            queryset = queryset.filter(field_id=field_id)
        
        # Filter by date
        date_filter = self.request.query_params.get('date', None)
        if date_filter:
            queryset = queryset.filter(scheduled_datetime__date=date_filter)
        
        # Volunteer's assigned matches
        if self.request.query_params.get('my_matches') == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(assigned_volunteer=request.user)
        
        return queryset

    @action(detail=True, methods=['post'])
    def assign_volunteer(self, request, pk=None):
        """Director assigns volunteer to match"""
        match = self.get_object()
        volunteer_id = request.data.get('volunteer_id')
        
        try:
            volunteer = User.objects.get(id=volunteer_id, profile__role='VOLUNTEER')
        except User.DoesNotExist:
            return Response({'error': 'Volunteer not found'}, status=status.HTTP_404_NOT_FOUND)
        
        match.assigned_volunteer = volunteer
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def volunteer_assign(self, request, pk=None):
        """Volunteer self-assigns to match"""
        match = self.get_object()
        
        # Check if user is volunteer
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'VOLUNTEER':
            return Response({'error': 'Only volunteers can self-assign'}, status=status.HTTP_403_FORBIDDEN)
        
        if match.assigned_volunteer:
            return Response({'error': 'Match already has volunteer'}, status=status.HTTP_400_BAD_REQUEST)
        
        match.assigned_volunteer = request.user
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def volunteer_unassign(self, request, pk=None):
        """Volunteer unassigns from match"""
        match = self.get_object()
        
        if match.assigned_volunteer != request.user:
            return Response({'error': 'Not assigned to this match'}, status=status.HTTP_403_FORBIDDEN)
        
        match.assigned_volunteer = None
        match.save()
        
        return Response({'message': 'Unassigned successfully'})

    @action(detail=True, methods=['post'])
    def mark_attendance(self, request, pk=None):
        """Volunteer marks team attendance"""
        match = self.get_object()
        
        # Check if volunteer
        if match.assigned_volunteer != request.user:
            return Response({'error': 'Not assigned to this match'}, status=status.HTTP_403_FORBIDDEN)
        
        match.team_a_arrived = request.data.get('team_a_arrived', match.team_a_arrived)
        match.team_b_arrived = request.data.get('team_b_arrived', match.team_b_arrived)
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def start_match(self, request, pk=None):
        """Volunteer starts match"""
        match = self.get_object()
        
        # Check if volunteer
        if match.assigned_volunteer != request.user:
            return Response({'error': 'Not assigned to this match'}, status=status.HTTP_403_FORBIDDEN)
        
        match.status = 'LIVE'
        match.actual_start_time = timezone.now()
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        """Volunteer updates match score"""
        match = self.get_object()
        
        # Check if volunteer
        if match.assigned_volunteer != request.user:
            return Response({'error': 'Not assigned to this match'}, status=status.HTTP_403_FORBIDDEN)
        
        match.team_a_score = request.data.get('team_a_score', match.team_a_score)
        match.team_b_score = request.data.get('team_b_score', match.team_b_score)
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def end_match(self, request, pk=None):
        """Volunteer ends match and submits for validation"""
        match = self.get_object()
        
        # Check if volunteer
        if match.assigned_volunteer != request.user:
            return Response({'error': 'Not assigned to this match'}, status=status.HTTP_403_FORBIDDEN)
        
        match.status = 'PENDING_VALIDATION'
        match.actual_end_time = timezone.now()
        
        # Determine winner
        if match.team_a_score > match.team_b_score:
            match.winner = match.team_a
        elif match.team_b_score > match.team_a_score:
            match.winner = match.team_b
        else:
            match.winner = None  # Draw
        
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def validate_score(self, request, pk=None):
        """Scoring team validates match result"""
        match = self.get_object()
        
        # Check if scoring team
        if not hasattr(request.user, 'profile') or request.user.profile.role != 'SCORING':
            return Response({'error': 'Only scoring team can validate'}, status=status.HTTP_403_FORBIDDEN)
        
        match.status = 'COMPLETED'
        match.validated_by = request.user
        match.validated_at = timezone.now()
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def correct_score(self, request, pk=None):
        """Scoring team corrects match score"""
        match = self.get_object()
        
        # Check if scoring team or director
        if not hasattr(request.user, 'profile') or request.user.profile.role not in ['SCORING', 'DIRECTOR']:
            return Response({'error': 'Only scoring team or director can correct scores'}, status=status.HTTP_403_FORBIDDEN)
        
        match.team_a_score = request.data.get('team_a_score', match.team_a_score)
        match.team_b_score = request.data.get('team_b_score', match.team_b_score)
        
        # Recalculate winner
        if match.team_a_score > match.team_b_score:
            match.winner = match.team_a
        elif match.team_b_score > match.team_a_score:
            match.winner = match.team_b
        else:
            match.winner = None
        
        match.save()
        
        return Response(MatchDetailSerializer(match).data)

    @action(detail=True, methods=['post'])
    def forfeit(self, request, pk=None):
        """Mark match as forfeited"""
        match = self.get_object()
        
        forfeiting_team = request.data.get('forfeiting_team')  # 'team_a' or 'team_b'
        
        match.status = 'FORFEITED'
        
        if forfeiting_team == 'team_a':
            match.winner = match.team_b
        elif forfeiting_team == 'team_b':
            match.winner = match.team_a
        
        match.save()
        
        return Response(MatchDetailSerializer(match).data)
    
class SpiritScoreViewSet(viewsets.ModelViewSet):
    queryset = SpiritScore.objects.all()
    serializer_class = SpiritScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = SpiritScore.objects.all()
        
        # Filter by match
        match_id = self.request.query_params.get('match', None)
        if match_id:
            queryset = queryset.filter(match_id=match_id)
        
        # Filter by team
        team_id = self.request.query_params.get('team', None)
        if team_id:
            queryset = queryset.filter(Q(from_team_id=team_id) | Q(for_team_id=team_id))
        
        return queryset

    def perform_create(self, serializer):
        # Check if captain
        team = serializer.validated_data['from_team']
        if team.captain != self.request.user:
            raise serializers.ValidationError('Only captain can submit spirit scores')
        
        serializer.save(submitted_by=self.request.user)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get matches where captain needs to submit spirit score"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get teams where user is captain
        captain_teams = Team.objects.filter(captain=request.user)
        
        pending_matches = []
        
        for team in captain_teams:
            # Get completed matches for this team
            completed_matches = Match.objects.filter(
                Q(team_a=team) | Q(team_b=team),
                status='COMPLETED'
            )
            
            for match in completed_matches:
                # Check if spirit score already submitted
                opponent = match.team_b if match.team_a == team else match.team_a
                
                exists = SpiritScore.objects.filter(
                    match=match,
                    from_team=team,
                    for_team=opponent
                ).exists()
                
                if not exists:
                    pending_matches.append({
                        'match_id': match.id,
                        'match_number': match.match_number,
                        'opponent': opponent.name,
                        'scheduled_datetime': match.scheduled_datetime,
                        'your_team': team.name
                    })
        
        return Response(pending_matches)

class MatchPhotoViewSet(viewsets.ModelViewSet):
    queryset = MatchPhoto.objects.all()
    serializer_class = MatchPhotoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = MatchPhoto.objects.all()
        
        # Filter by match
        match_id = self.request.query_params.get('match', None)
        if match_id:
            queryset = queryset.filter(match_id=match_id)
        
        # Filter by tournament
        tournament_id = self.request.query_params.get('tournament', None)
        if tournament_id:
            queryset = queryset.filter(match__tournament_id=tournament_id)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [AllowAny]
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
        visitor.checked_in_at = timezone.now()
        visitor.save()
        serializer = self.get_serializer(visitor)
        return Response(serializer.data)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def volunteer_dashboard(request):
    if not hasattr(request.user, 'profile') or request.user.profile.role != 'VOLUNTEER':
        return Response({'error': 'Only volunteers can access this'}, status=status.HTTP_403_FORBIDDEN)
    # Assigned matches
    assigned_matches = Match.objects.filter(assigned_volunteer=request.user).order_by('scheduled_datetime')

    # Available matches (no volunteer assigned)
    available_matches = Match.objects.filter(
        assigned_volunteer__isnull=True,
        status='SCHEDULED'
    ).order_by('scheduled_datetime')[:10]  # Limit to 10

    # Stats
    total_assigned = assigned_matches.count()
    completed = assigned_matches.filter(status='COMPLETED').count()
    upcoming = assigned_matches.filter(status='SCHEDULED').count()
    live = assigned_matches.filter(status='LIVE').count()

    return Response({
        'assigned_matches': MatchListSerializer(assigned_matches, many=True).data,
        'available_matches': MatchListSerializer(available_matches, many=True).data,
        'stats': {
            'total_assigned': total_assigned,
            'completed': completed,
            'upcoming': upcoming,
            'live': live
        }
    })