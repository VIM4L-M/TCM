from django.contrib import admin
from .models import (
    Tournament, Team, Field, Match, Visitor, TournamentSnapshot,
    UserProfile, TeamMember, SpiritScore, MatchPhoto, TournamentSponsor
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone', 'organization', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'organization']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'start_date', 'end_date', 'max_players_per_team', 'created_at']
    list_filter = ['status', 'start_date']
    search_fields = ['name', 'location', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament', 'captain', 'status', 'members_count', 'created_at']
    list_filter = ['tournament', 'status']
    search_fields = ['name', 'captain__username']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['player', 'team', 'status', 'jersey_number', 'position', 'joined_at']
    list_filter = ['status', 'team__tournament']
    search_fields = ['player__username', 'team__name']
    readonly_fields = ['joined_at']

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ['name', 'field_number', 'tournament', 'is_available']
    list_filter = ['tournament', 'is_available']

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['match_number', 'tournament', 'team_a', 'team_b', 'status', 'scheduled_datetime', 'assigned_volunteer', 'validated_by']
    list_filter = ['status', 'tournament', 'scheduled_datetime', 'team_a_arrived', 'team_b_arrived']
    search_fields = ['team_a__name', 'team_b__name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SpiritScore)
class SpiritScoreAdmin(admin.ModelAdmin):
    list_display = ['match', 'from_team', 'for_team', 'total_score', 'submitted_by', 'submitted_at']
    list_filter = ['match__tournament', 'submitted_at']
    search_fields = ['from_team__name', 'for_team__name', 'submitted_by__username']
    readonly_fields = ['total_score', 'submitted_at', 'updated_at']

@admin.register(MatchPhoto)
class MatchPhotoAdmin(admin.ModelAdmin):
    list_display = ['match', 'caption', 'uploaded_by', 'uploaded_at']
    list_filter = ['match__tournament', 'uploaded_at']
    search_fields = ['match__tournament__name', 'caption', 'uploaded_by__username']
    readonly_fields = ['uploaded_at']

@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament', 'visit_date', 'checked_in', 'created_at']
    list_filter = ['checked_in', 'visit_date', 'tournament']
    search_fields = ['name', 'email']

@admin.register(TournamentSnapshot)
class TournamentSnapshotAdmin(admin.ModelAdmin):
    list_display = ['tournament', 'created_by', 'created_at']
    list_filter = ['created_at', 'tournament']
    readonly_fields = ['created_at']

@admin.register(TournamentSponsor)
class TournamentSponsorAdmin(admin.ModelAdmin):
    list_display = ['tournament', 'sponsor', 'display_order', 'created_at']
    list_filter = ['tournament', 'created_at']
    search_fields = ['tournament__name', 'sponsor__username']
    readonly_fields = ['created_at']