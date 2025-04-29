from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.role}'

class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField()
    equipment = models.TextField()

    def __str__(self):
        return f'{self.name} - {self.capacity} osób'
    
class Equipment(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.quantity})"
    
class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.user} → {self.room} ({self.start_time} - {self.end_time})"

class RoomEquipment(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('room', 'equipment')

class SystemUser(AbstractUser):
    """
    Systemowy użytkownik odpowiedzialny za logowanie i rejestrację.
    Dziedziczy z AbstractUser, co oznacza, że zawiera wszystkie pola i funkcjonalności standardowego użytkownika Django
    """
    email = models.EmailField(unique=True)
    # username = models.CharField(max_length=150, unique=True)

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
