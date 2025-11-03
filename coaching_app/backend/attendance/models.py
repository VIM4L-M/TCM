from django.db import models
from childprofiles.models import ChildProfile

class Attendance(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE)
    session_date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.child.name} - {self.session_date} ({self.status})"
