from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Tournament, Team, Field, Match, Visitor, TournamentSnapshot,
    UserProfile, TeamMember, SpiritScore, MatchPhoto, TournamentSponsor
)

# ==================== USER & PROFILE SERIALIZERS ====================

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role', 'phone', 'profile']
        read_only_fields = ['id', 'is_staff', 'is_superuser']
    
    def get_profile(self, obj):
        """Include full profile data"""
        try:
            return {
                'role': obj.profile.role,
                'phone': obj.profile.phone,
            }
        except UserProfile.DoesNotExist:
            return None


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(
        choices=['DIRECTOR', 'CAPTAIN', 'PLAYER', 'VOLUNTEER', 'SCORING', 'SPONSOR', 'FAN'],
        default='FAN'
    )
    phone = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'phone']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        role = validated_data.pop('role', 'FAN')
        phone = validated_data.pop('phone', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Set is_staff for Director/Admin role
        if role == 'DIRECTOR':
            user.is_staff = True
            user.save()
        
        # Create profile
        UserProfile.objects.create(
            user=user,
            role=role,
            phone=phone
        )
        
        return user


# ==================== TEAM MEMBER SERIALIZERS ====================

class TeamMemberSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.username', read_only=True)
    player_email = serializers.CharField(source='player.email', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['joined_at', 'approved_at']


class TeamMemberCreateSerializer(serializers.Serializer):
    """For captain adding player by email"""
    email = serializers.EmailField()
    jersey_number = serializers.IntegerField(required=False, allow_null=True)
    position = serializers.CharField(required=False, allow_blank=True)


# ==================== TEAM SERIALIZERS ====================

class TeamListSerializer(serializers.ModelSerializer):
    captain_name = serializers.CharField(source='captain.username', read_only=True)
    members_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'tournament', 'name', 'short_name', 'captain', 'captain_name', 
                  'status', 'members_count', 'created_at']
        read_only_fields = ['created_at', 'updated_at']


class TeamDetailSerializer(serializers.ModelSerializer):
    captain_name = serializers.CharField(source='captain.username', read_only=True)
    captain_email = serializers.CharField(source='captain.email', read_only=True)
    members = TeamMemberSerializer(many=True, read_only=True)
    members_count = serializers.IntegerField(read_only=True)
    average_spirit_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# ==================== SPIRIT SCORE SERIALIZERS ====================

class SpiritScoreSerializer(serializers.ModelSerializer):
    from_team_name = serializers.CharField(source='from_team.name', read_only=True)
    for_team_name = serializers.CharField(source='for_team.name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True)
    
    class Meta:
        model = SpiritScore
        fields = '__all__'
        read_only_fields = ['total_score', 'submitted_at', 'updated_at']


# ==================== MATCH PHOTO SERIALIZERS ====================

class MatchPhotoSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = MatchPhoto
        fields = '__all__'
        read_only_fields = ['uploaded_at']


# ==================== FIELD SERIALIZERS ====================

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# ==================== MATCH SERIALIZERS ====================

class MatchListSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source='team_a.name', read_only=True)
    team_b_name = serializers.CharField(source='team_b.name', read_only=True)
    field_name = serializers.CharField(source='field.name', read_only=True)
    winner_name = serializers.CharField(source='winner.name', read_only=True)
    assigned_volunteer_name = serializers.CharField(source='assigned_volunteer.username', read_only=True)
    
    class Meta:
        model = Match
        fields = ['id', 'tournament', 'match_number', 'team_a', 'team_a_name', 
                  'team_b', 'team_b_name', 'field', 'field_name', 'scheduled_datetime',
                  'duration', 'status', 'team_a_score', 'team_b_score', 'winner', 
                  'winner_name', 'team_a_arrived', 'team_b_arrived', 
                  'assigned_volunteer', 'assigned_volunteer_name']
        read_only_fields = ['created_at', 'updated_at']


class MatchDetailSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source='team_a.name', read_only=True)
    team_b_name = serializers.CharField(source='team_b.name', read_only=True)
    field_name = serializers.CharField(source='field.name', read_only=True)
    winner_name = serializers.CharField(source='winner.name', read_only=True)
    assigned_volunteer_name = serializers.CharField(source='assigned_volunteer.username', read_only=True)
    validated_by_name = serializers.CharField(source='validated_by.username', read_only=True)
    spirit_scores = SpiritScoreSerializer(many=True, read_only=True)
    photos = MatchPhotoSerializer(many=True, read_only=True)
    average_spirit_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'validated_at']


# ==================== TOURNAMENT SERIALIZERS ====================

class TournamentSponsorSerializer(serializers.ModelSerializer):
    sponsor_name = serializers.CharField(source='sponsor.username', read_only=True)
    
    class Meta:
        model = TournamentSponsor
        fields = '__all__'
        read_only_fields = ['created_at']


class TournamentListSerializer(serializers.ModelSerializer):
    teams_count = serializers.IntegerField(read_only=True)
    matches_count = serializers.IntegerField(read_only=True)
    fields_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'slug', 'location', 'city', 'state', 'country',
                  'status', 'start_date', 'end_date', 'teams_count', 
                  'matches_count', 'fields_count', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']


class TournamentDetailSerializer(serializers.ModelSerializer):
    teams = TeamListSerializer(many=True, read_only=True)
    fields = FieldSerializer(many=True, read_only=True)
    matches = MatchListSerializer(many=True, read_only=True)
    tournament_sponsors = TournamentSponsorSerializer(many=True, read_only=True)
    teams_count = serializers.IntegerField(read_only=True)
    matches_count = serializers.IntegerField(read_only=True)
    fields_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['slug', 'created_by', 'created_at', 'updated_at']


# ==================== VISITOR SERIALIZERS ====================

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# ==================== SNAPSHOT SERIALIZERS ====================

class TournamentSnapshotSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = TournamentSnapshot
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']


# ==================== SCHEDULE GENERATION SERIALIZER ====================

class ScheduleGenerationSerializer(serializers.Serializer):
    """For auto-generating tournament schedules"""
    format = serializers.ChoiceField(
        choices=['ROUND_ROBIN', 'SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION']
    )
    start_date = serializers.DateField()
    start_time = serializers.TimeField()
    match_duration = serializers.IntegerField(default=55, min_value=30, max_value=120)
    break_duration = serializers.IntegerField(default=5, min_value=0, max_value=30)
    field_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )


# ==================== LEADERBOARD SERIALIZER ====================

class LeaderboardSerializer(serializers.Serializer):
    """For tournament standings"""
    rank = serializers.IntegerField()
    team_id = serializers.IntegerField()
    team_name = serializers.CharField()
    matches_played = serializers.IntegerField()
    wins = serializers.IntegerField()
    losses = serializers.IntegerField()
    draws = serializers.IntegerField()
    points = serializers.IntegerField()
    goals_for = serializers.IntegerField()
    goals_against = serializers.IntegerField()
    goal_difference = serializers.IntegerField()
    average_spirit_score = serializers.FloatField()