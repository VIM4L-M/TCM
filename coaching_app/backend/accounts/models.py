from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin','Programme Director'),
        ('manager','Programme Manager'),
        ('coach','Coach'),
        ('data_team','Data Team'),
        ('coordinator','Coordinator'),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, blank=True, null=True)
