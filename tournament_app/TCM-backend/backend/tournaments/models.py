from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Tournament(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    description = models.TextField(blank=True)
    rules = models.TextField(blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tournaments', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
            models.Index(fields=['-created_at']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def teams_count(self):
        return self.teams.count()
    
    @property
    def matches_count(self):
        return self.matches.count()
    
    @property
    def fields_count(self):
        return self.fields.count()


class Team(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50, blank=True)
    logo = models.ImageField(upload_to='team_logos/', null=True, blank=True)
    
    captain_name = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.tournament.name}"


class Field(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    field_number = models.IntegerField()
    location_details = models.TextField(blank=True)
    
    is_available = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'field_number']
        ordering = ['field_number']
    
    def __str__(self):
        return f"Field {self.field_number} - {self.tournament.name}"


class Match(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('LIVE', 'Live'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('POSTPONED', 'Postponed'),
    ]
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    match_number = models.IntegerField()
    
    team_a = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team_a')
    team_b = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team_b')
    
    field = models.ForeignKey(Field, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    
    scheduled_datetime = models.DateTimeField()
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    
    team_a_score = models.IntegerField(default=0)
    team_b_score = models.IntegerField(default=0)
    winner = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'match_number']
        ordering = ['scheduled_datetime']
        verbose_name_plural = 'Matches'
    
    def __str__(self):
        return f"Match {self.match_number}: {self.team_a.name} vs {self.team_b.name}"


class Visitor(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='visitors')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    
    visit_date = models.DateField()
    checked_in = models.BooleanField(default=False)
    checked_in_at = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-visit_date']
    
    def __str__(self):
        return f"{self.name} - {self.tournament.name}"


class TournamentSnapshot(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='snapshots')
    snapshot_data = models.JSONField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Snapshot of {self.tournament.name} at {self.created_at}"