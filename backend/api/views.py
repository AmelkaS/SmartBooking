from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User
from .serializers import UserSerializer

# Tymczasowa baza sal
rooms = [
    {"id": 1, "name": "Sala 101", "capacity": 30, "equipment": "Projektor, Tablica"},
    {"id": 2, "name": "Laboratorium 202", "capacity": 20, "equipment": "Komputery, Rzutnik"}
]

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def user_create(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def user_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def user_delete(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
# ROOMS

@api_view(['GET'])
def room_list(request):
    return Response(rooms, status=status.HTTP_200_OK)

@api_view(['GET'])
def room_detail(request, pk):
    room = next((r for r in rooms if r["id"] == pk), None)
    if room:
        return Response(room, status=status.HTTP_200_OK)
    return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def room_create(request):
    new_room = request.data
    new_room["id"] = max(room["id"] for room in rooms) + 1 if rooms else 1
    rooms.append(new_room)
    return Response(new_room, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def room_update(request, pk):
    room = next((r for r in rooms if r["id"] == pk), None)
    if not room:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    room.update(request.data)
    return Response(room, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def room_delete(request, pk):
    global rooms
    rooms = [r for r in rooms if r["id"] != pk]
    return Response(status=status.HTTP_204_NO_CONTENT)
