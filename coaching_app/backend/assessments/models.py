from django.db import models
from childprofiles.models import ChildProfile

class Assessment(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE)
    assessment_date = models.DateField()
    score = models.FloatField()
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.child.name} - {self.assessment_date} ({self.score})"
