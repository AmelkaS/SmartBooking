from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

# Tymczasowa baza użytkowników (lista w pamięci)
users = [
    {"id": 1, "name": "Jan Kowalski", "email": "jan@example.com"},
    {"id": 2, "name": "Anna Nowak", "email": "anna@example.com"}
]

# Tymczasowa baza sal (lista w pamięci)
rooms = [
    {"id": 1, "name": "Sala 101", "capacity": 30, "equipment": "Projektor, Tablica"},
    {"id": 2, "name": "Laboratorium 202", "capacity": 20, "equipment": "Komputery, Rzutnik"}
]

@api_view(['GET'])
def user_list(request):
    return Response(users, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_detail(request, pk):
    user = next((u for u in users if u["id"] == pk), None)
    if user:
        return Response(user, status=status.HTTP_200_OK)
    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def user_create(request):
    new_user = request.data
    new_user["id"] = max(user["id"] for user in users) + 1 if users else 1
    users.append(new_user)
    return Response(new_user, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def user_update(request, pk):
    user = next((u for u in users if u["id"] == pk), None)
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    user.update(request.data)
    return Response(user, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def user_delete(request, pk):
    global users
    users = [u for u in users if u["id"] != pk]
    return Response(status=status.HTTP_204_NO_CONTENT)


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
