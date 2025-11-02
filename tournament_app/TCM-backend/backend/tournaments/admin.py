from django.contrib import admin
from .models import Tournament, Team, Field, Match, Visitor, TournamentSnapshot

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'start_date', 'end_date', 'created_at']
    list_filter = ['status', 'start_date']
    search_fields = ['name', 'location', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'tournament', 'captain_name', 'created_at']
    list_filter = ['tournament']
    search_fields = ['name', 'captain_name']

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ['name', 'field_number', 'tournament', 'is_available']
    list_filter = ['tournament', 'is_available']

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['match_number', 'tournament', 'team_a', 'team_b', 'status', 'scheduled_datetime']
    list_filter = ['status', 'tournament', 'scheduled_datetime']
    search_fields = ['team_a__name', 'team_b__name']

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