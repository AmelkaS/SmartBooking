from rest_framework import serializers
from .models import User, Room

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'role']

class RoomSerializer(serializer.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity', 'equipment' ]