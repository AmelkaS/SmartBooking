from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User, Room, Reservation, Equipment, RoomEquipment 
from .serializers import UserSerializer, RoomSerializer, RegisterSerializer, ReservationSerializer, SystemUserSerializer
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from messaging.publisher import send_message

@api_view(['POST'])
def queue_test(request):
    msg = request.data.get("message", "Hello from Django!")
    send_message(msg)
    return Response({"status": "queued", "message": msg})

class HelloView(APIView):
    @swagger_auto_schema(
        operation_description="Zwraca powitanie",
        responses={200: "OK"}
    )
    def get(self, request):
        return Response({"message": "Hello from Swagger!"})

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@swagger_auto_schema(
    method='post',
    request_body=RegisterSerializer,
    responses={201: RegisterSerializer, 400: "Bad Request"},
    operation_description="Rejestracja nowego użytkownika systemowego"
)
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    responses={200: UserSerializer(many=True)},
    operation_description="Lista wszystkich użytkowników"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='get',
    responses={200: UserSerializer, 404: "User not found"},
    operation_description="Szczegóły użytkownika na podstawie ID"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='post',
    request_body=UserSerializer,
    responses={201: UserSerializer, 400: "Bad Request"},
    operation_description="Dodanie nowego użytkownika (tylko dla administratora)"
)
@api_view(['POST'])
@permission_classes([IsAdmin])
def user_create(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    request_body=UserSerializer,
    responses={200: UserSerializer, 404: "User not found", 400: "Bad Request"},
    operation_description="Aktualizacja użytkownika (tylko dla administratora)"
)
@api_view(['PUT'])
@permission_classes([IsAdmin])
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

@swagger_auto_schema(
    method='delete',
    responses={204: "Deleted", 404: "User not found"},
    operation_description="Usunięcie użytkownika (tylko dla administratora)"
)
@api_view(['DELETE'])
@permission_classes([IsAdmin])
def user_delete(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# ROOMS

@swagger_auto_schema(
    method='get',
    responses={200: RoomSerializer(many=True)},
    operation_description="Lista wszystkich sal"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_list(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='get',
    responses={200: RoomSerializer, 404: "Room not found"},
    operation_description="Szczegóły sali na podstawie ID"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_detail(request, pk):
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = RoomSerializer(room)
    return Response(serializer.data)

@swagger_auto_schema(
    method='post',
    request_body=RoomSerializer,
    responses={201: RoomSerializer, 400: "Bad Request"},
    operation_description="Dodanie nowej sali (tylko dla administratora)"
)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def room_create(request):
    serializer = RoomSerializer(data=request.data)
    if serializer.is_valid():
        room = serializer.save()
        equipment_ids = request.data.get('equipment', [])
        if equipment_ids:
            for eq_id in equipment_ids:
                RoomEquipment.objects.create(room=room, equipment_id=eq_id)
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='put',
    request_body=RoomSerializer,
    responses={200: RoomSerializer, 404: "Room not found", 400: "Bad Request"},
    operation_description="Aktualizacja sali (tylko dla administratora)"
)
@api_view(['PUT'])
@permission_classes([IsAdmin])
def room_update(request, pk):
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = RoomSerializer(room, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    responses={204: "Deleted", 404: "Room not found"},
    operation_description="Usunięcie sali (tylko dla administratora)"
)
@api_view(['DELETE'])
@permission_classes([IsAdmin])
def room_delete(request, pk):
    try:
        room = Room.objects.get(pk=pk)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def equipment_list(request):
    equipment = Equipment.objects.all()
    return Response([{'id': eq.id, 'name': eq.name} for eq in equipment])

# RESERVATIONS

# Lista rezerwacji (dla ADMIN lub właściciela)
@swagger_auto_schema(
    method='get',
    responses={200: ReservationSerializer(many=True)},
    operation_description="Lista wszystkich rezerwacji (dla admina) lub użytkownika"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservation_list(request):
    if request.user.role == 'ADMIN':
        reservations = Reservation.objects.all()
    else:
        reservations = Reservation.objects.filter(user=request.user)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)

# Tworzenie rezerwacji (domyślnie status = PENDING)
@swagger_auto_schema(
    method='post',
    request_body=ReservationSerializer,
    responses={201: ReservationSerializer, 400: "Bad Request"},
    operation_description="Utworzenie nowej rezerwacji sali (tylko zalogowani użytkownicy)"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reservation_create(request):
    data = request.data.copy()
    data['user'] = request.user.id

    if request.user.role == 'ADMIN':
        data['status'] = 'APPROVED'  # admin może od razu zatwierdzić
    else:
        data['status'] = 'PENDING'  # user musi czekać na akceptację

    serializer = ReservationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Zmiana statusu rezerwacji (tylko dla ADMINA)
@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'status': openapi.Schema(type=openapi.TYPE_STRING, enum=['APPROVED', 'REJECTED']),
        }
    ),
    responses={200: "OK", 404: "Not found"},
    operation_description="Zatwierdzanie lub odrzucanie rezerwacji (ADMIN)"
)
@api_view(['PATCH'])
@permission_classes([IsAdmin])
def reservation_update_status(request, pk):
    try:
        reservation = Reservation.objects.get(pk=pk)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

    status_value = request.data.get('status')
    if status_value not in ['APPROVED', 'REJECTED']:
        return Response({"error": "Nieprawidłowy status"}, status=status.HTTP_400_BAD_REQUEST)

    reservation.status = status_value
    reservation.save()
    return Response({"status": "updated"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = SystemUserSerializer(request.user)
    return Response(serializer.data)

