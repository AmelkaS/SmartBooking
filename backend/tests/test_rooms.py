
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import SystemUser, Room

class RoomTests(APITestCase):
    def setUp(self):
        self.admin = SystemUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass',
            role='ADMIN'
        )
        self.client.login(username='admin', password='adminpass')

    def test_create_room(self):
        url = reverse('room-create')
        data = {'name': 'Sala 101', 'capacity': 30, 'equipment': 'Projektor'}
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_rooms(self):
        Room.objects.create(name='Sala 102', capacity=25, equipment='Tablica')
        url = reverse('room-list')
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
