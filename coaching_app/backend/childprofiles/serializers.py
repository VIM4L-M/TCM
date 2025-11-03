from rest_framework import serializers
from .models import ChildProfile

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildProfile
        fields = '__all__'
