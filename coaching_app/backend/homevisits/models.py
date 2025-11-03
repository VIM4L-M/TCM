# backend/homevisits/models.py
from django.db import models
from childprofiles.models import ChildProfile

class HomeVisit(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='home_visits')
    date = models.DateField()
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.child.name} - {self.date}"
