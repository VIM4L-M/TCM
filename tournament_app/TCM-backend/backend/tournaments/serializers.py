from rest_framework import serializers
from .models import Tournament, Team, Field, Match, Visitor, TournamentSnapshot

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MatchSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source='team_a.name', read_only=True)
    team_b_name = serializers.CharField(source='team_b.name', read_only=True)
    field_name = serializers.CharField(source='field.name', read_only=True)
    winner_name = serializers.CharField(source='winner.name', read_only=True)
    
    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


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
    teams = TeamSerializer(many=True, read_only=True)
    fields = FieldSerializer(many=True, read_only=True)
    matches = MatchSerializer(many=True, read_only=True)
    teams_count = serializers.IntegerField(read_only=True)
    matches_count = serializers.IntegerField(read_only=True)
    fields_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['slug', 'created_by', 'created_at', 'updated_at']


class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TournamentSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentSnapshot
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']