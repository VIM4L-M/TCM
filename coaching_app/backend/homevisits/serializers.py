# backend/homevisits/serializers.py
from rest_framework import serializers
from .models import HomeVisit
from childprofiles.models import ChildProfile

class HomeVisitSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.name', read_only=True)

    class Meta:
        model = HomeVisit
        fields = ['id', 'child', 'child_name', 'date', 'remarks']
