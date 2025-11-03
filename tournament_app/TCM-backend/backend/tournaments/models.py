from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

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
    max_players_per_team = models.IntegerField(default=15, help_text="Maximum players allowed per team")
    match_duration = models.IntegerField(default=55, help_text="Default match duration in minutes")
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

class Field(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    field_number = models.IntegerField()
    location = models.CharField(max_length=255, blank=True)
    
    is_available = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'field_number']
        ordering = ['field_number']
    
    def __str__(self):
        return f"Field {self.field_number} - {self.tournament.name}"

class Team(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50, blank=True)
    logo = models.ImageField(upload_to='team_logos/', null=True, blank=True)
    
    captain = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='captained_teams')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.tournament.name}"
    
    @property
    def average_spirit_score(self):
        """Calculate average spirit score received by this team"""
        received_scores = self.spirit_scores_received.all()
        if received_scores.exists():
            total = sum(score.total_score for score in received_scores)
            return total / received_scores.count()
        return None
    
    @property
    def members_count(self):
        """Count approved team members"""
        return self.members.filter(status='APPROVED').count()

class Match(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('LIVE', 'Live'),
        ('PENDING_VALIDATION', 'Pending Validation'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('POSTPONED', 'Postponed'),
        ('FORFEITED', 'Forfeited'),
    ]
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    match_number = models.IntegerField()
    
    team_a = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team_a')
    team_b = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches_as_team_b')
    
    field = models.ForeignKey(Field, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    
    scheduled_datetime = models.DateTimeField()
    duration = models.IntegerField(default=55, help_text="Match duration in minutes")
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    
    # Scoring
    team_a_score = models.IntegerField(default=0)
    team_b_score = models.IntegerField(default=0)
    winner = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    
    # Attendance
    team_a_arrived = models.BooleanField(default=False)
    team_b_arrived = models.BooleanField(default=False)
    
    # Volunteer & Validation
    assigned_volunteer = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_matches',
        limit_choices_to={'profile__role': 'VOLUNTEER'}
    )
    validated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='validated_matches',
        limit_choices_to={'profile__role': 'SCORING'}
    )
    validated_at = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'match_number']
        ordering = ['scheduled_datetime']
        verbose_name_plural = 'Matches'
    
    def __str__(self):
        return f"Match {self.match_number}: {self.team_a.name} vs {self.team_b.name}"
    
    @property
    def average_spirit_score(self):
        """Get average spirit score for this match"""
        spirit_scores = self.spirit_scores.all()
        if spirit_scores.exists():
            total = sum(score.total_score for score in spirit_scores)
            return total / spirit_scores.count()
        return None

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
# User Profile for Role Management
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('DIRECTOR', 'Tournament Director'),
        ('CAPTAIN', 'Team Captain'),
        ('PLAYER', 'Player'),
        ('VOLUNTEER', 'Volunteer/Field Official'),
        ('SCORING', 'Scoring Team'),
        ('SPONSOR', 'Sponsor/Partner'),
        ('FAN', 'Spectator/Fan'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FAN')
    phone = models.CharField(max_length=20, blank=True)
    organization = models.CharField(max_length=255, blank=True)  # For sponsors
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"


# Team Member / Player Roster
class TeamMember(models.Model):
    STATUS_CHOICES = [
        ('INVITED', 'Invited'),
        ('REQUESTED', 'Requested to Join'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_memberships')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPROVED')
    jersey_number = models.IntegerField(null=True, blank=True)
    position = models.CharField(max_length=50, blank=True)
    
    joined_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['team', 'player']
        ordering = ['jersey_number', 'player__username']
    
    def __str__(self):
        return f"{self.player.username} - {self.team.name}"


# Spirit Score Model
class SpiritScore(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='spirit_scores')
    from_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='spirit_scores_given')
    for_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='spirit_scores_received')
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_spirit_scores')
    
    # 5 Categories (0-4 each)
    rules_knowledge = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(4)])
    fouls_body_contact = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(4)])
    fair_mindedness = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(4)])
    positive_attitude = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(4)])
    communication = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(4)])
    
    total_score = models.IntegerField(default=10)  # Auto-calculated
    comments = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['match', 'from_team', 'for_team']
        ordering = ['-submitted_at']
    
    def save(self, *args, **kwargs):
        # Auto-calculate total
        self.total_score = (
            self.rules_knowledge + 
            self.fouls_body_contact + 
            self.fair_mindedness + 
            self.positive_attitude + 
            self.communication
        )
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.from_team.name} → {self.for_team.name}: {self.total_score}/20"


# Match Photos
class MatchPhoto(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='match_photos/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_photos')
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Photo for Match {self.match.match_number} - {self.match.tournament.name}"


# Tournament Sponsors
class TournamentSponsor(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament_sponsors')
    sponsor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sponsored_tournaments')
    
    logo = models.ImageField(upload_to='sponsor_logos/', null=True, blank=True)
    banner_image = models.ImageField(upload_to='sponsor_banners/', null=True, blank=True)
    website_url = models.URLField(blank=True)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['tournament', 'sponsor']
        ordering = ['display_order', '-created_at']
    
    def __str__(self):
        return f"{self.sponsor.username} sponsors {self.tournament.name}"