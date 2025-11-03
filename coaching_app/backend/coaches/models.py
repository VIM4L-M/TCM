from django.db import models

class Coach(models.Model):
    name = models.CharField(max_length=100)
    sessions = models.IntegerField(default=0)
    travel_hours = models.FloatField(default=0.0)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)


    def __str__(self):
        return self.name
