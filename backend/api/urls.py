from django.urls import path
from .views import (
    user_list, user_detail, user_create, user_update, user_delete,
    room_list, room_detail, room_create, room_update, room_delete
)

urlpatterns = [
    # Endpointy użytkowników
    path('users/', user_list, name='user_list'),  # Pobranie listy użytkowników
    path('users/<int:pk>/', user_detail, name='user_detail'),  # Pobranie pojedynczego użytkownika
    path('users/create/', user_create, name='user_create'),  # Dodanie nowego użytkownika
    path('users/<int:pk>/update/', user_update, name='user_update'),  # Aktualizacja użytkownika
    path('users/<int:pk>/delete/', user_delete, name='user_delete'),  # Usunięcie użytkownika

    # Endpointy sal
    path('rooms/', room_list, name='room_list'),  # Pobranie listy sal
    path('rooms/<int:pk>/', room_detail, name='room_detail'),  # Pobranie pojedynczej sali
    path('rooms/create/', room_create, name='room_create'),  # Dodanie nowej sali
    path('rooms/<int:pk>/update/', room_update, name='room_update'),  # Aktualizacja sali
    path('rooms/<int:pk>/delete/', room_delete, name='room_delete'),  # Usunięcie sali
]
