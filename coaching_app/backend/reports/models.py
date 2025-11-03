from django.db import models
from childprofiles.models import ChildProfile
from coaches.models import Coach

class Report(models.Model):
    report_date = models.DateField(auto_now_add=True)
    total_children = models.IntegerField(default=0)
    total_coaches = models.IntegerField(default=0)
    attendance_rate = models.FloatField(default=0.0)
    avg_assessment_score = models.FloatField(default=0.0)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Report on {self.report_date}"
