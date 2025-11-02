from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

GENDER_CHOICES = (("M", "Male"), ("F", "Female"), ("O", "Other"))

class Program(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Site(models.Model):
    # A community or school
    SITE_TYPE = (("community", "Community"), ("school", "School"))
    name = models.CharField(max_length=255)
    site_type = models.CharField(max_length=20, choices=SITE_TYPE, default="community")
    address = models.TextField(blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="sites")

    def __str__(self):
        return f"{self.name} ({self.site_type})"

class Child(models.Model):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120, blank=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default="M")
    unique_id = models.CharField(max_length=50, unique=True)
    current_sites = models.ManyToManyField(Site, related_name="children", blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def full_name(self):
        return (self.first_name + " " + self.last_name).strip()

    def __str__(self):
        return f"{self.full_name()} ({self.unique_id})"

class TransferHistory(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="transfers")
    from_site = models.ForeignKey(Site, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    to_site = models.ForeignKey(Site, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    reason = models.TextField(blank=True)
    date = models.DateField()

    def __str__(self):
        return f"Transfer {self.child.unique_id} on {self.date}"

class Coach(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    sites = models.ManyToManyField(Site, related_name="coaches", blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Session(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="sessions")
    coach = models.ForeignKey(Coach, on_delete=models.SET_NULL, null=True, related_name="sessions")
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.site.name} on {self.date}"

class Attendance(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="attendances")
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="attendances")
    present = models.BooleanField(default=False)
    recorded_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "child")

    def __str__(self):
        return f"{self.child.unique_id} - {self.session.date} - {'P' if self.present else 'A'}"

class HomeVisit(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="home_visits")
    coach = models.ForeignKey(Coach, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"HomeVisit {self.child.unique_id} on {self.date}"

class Assessment(models.Model):
    # LSAS like assessments; store score / JSON for flexibility
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="assessments")
    assessor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    type = models.CharField(max_length=50, default="LSAS")
    score = models.FloatField(null=True, blank=True)
    data = models.JSONField(null=True, blank=True)  # store itemized responses
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"Assessment {self.child.unique_id} on {self.date}"
