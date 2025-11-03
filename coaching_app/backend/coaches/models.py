from django.db import models

class Coach(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    specialization = models.CharField(max_length=100)
    assigned_community = models.CharField(max_length=100)

    def __str__(self):
        return self.name
