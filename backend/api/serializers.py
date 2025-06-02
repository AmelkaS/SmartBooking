from rest_framework import serializers
from .models import User, Room, SystemUser, Reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'role']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity', 'equipment' ]

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer do rejestracji użytkownika systemowego.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = SystemUser
        fields = ['id', 'email', 'password']

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        user = SystemUser.objects.create_user(
            username=email,  
            email=email,
            password=password
        )
        return user
class SystemUserSerializer(serializers.ModelSerializer):
    """
    Serializer do odczytu danych użytkownika systemowego.
    """
    class Meta:
        model = SystemUser
        fields = ['id', 'email', 'role', 'date_joined', 'is_active']  

class ReservationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'user_email', 'room', 'room_name', 'start_time', 'end_time', 'student_count', 'status']
        read_only_fields = ['status']  # status ustawiany domyślnie jako 'PENDING'
