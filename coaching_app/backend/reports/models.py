from django.db import models

class Report(models.Model):
    title = models.CharField(max_length=150)
    created_on = models.DateTimeField(auto_now_add=True)
    report_type = models.CharField(max_length=50, choices=[
        ('Attendance', 'Attendance'),
        ('Assessment', 'Assessment'),
        ('HomeVisit', 'Home Visit'),
    ])
    description = models.TextField()

    def __str__(self):
        return f"{self.title} ({self.report_type})"
