from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.role}'

    
class Equipment(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class RoomEquipment(models.Model):
    room = models.ForeignKey('Room', on_delete=models.CASCADE)
    equipment = models.ForeignKey('Equipment', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('room', 'equipment')
        db_table = 'api_room_equipment'

    def __str__(self):
        return f"{self.room.name} - {self.equipment.name} ({self.quantity})"
    
class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    equipment = models.ManyToManyField('Equipment', through='RoomEquipment', blank=True)

    def __str__(self):
        return f'{self.name} - {self.capacity} osób'
    
class Reservation(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Oczekująca'),
        ('APPROVED', 'Zatwierdzona'),
        ('REJECTED', 'Odrzucona'),
    )

    user = models.ForeignKey('SystemUser', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    student_count = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    def __str__(self):
        return f"{self.user} → {self.room} ({self.start_time} - {self.end_time})"




class SystemUser(AbstractUser):
    """
    Systemowy użytkownik odpowiedzialny za logowanie i rejestrację.
    Dziedziczy z AbstractUser, co oznacza, że zawiera wszystkie pola i funkcjonalności standardowego użytkownika Django
    """
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('USER', 'User'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER')

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set", 
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  
        blank=True,
    )

    def __str__(self):
        # Zwraca czytelną reprezentację użytkownika
        return f"{self.username}"
