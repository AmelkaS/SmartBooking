from django.db import models

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

