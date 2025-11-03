from django.db import models

class ChildProfile(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    community = models.CharField(max_length=100)
    programme = models.CharField(max_length=100)

    def __str__(self):
        return self.name
