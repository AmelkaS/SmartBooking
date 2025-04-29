
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import SystemUser

class UserTests(APITestCase):
    def setUp(self):
        self.admin = SystemUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass',
            role='ADMIN'
        )
        self.client.login(username='admin', password='adminpass')

    def test_create_user(self):
        url = reverse('user-create')
        data = {'first_name': 'John', 'last_name': 'Doe', 'role': 'USER'}
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_users(self):
        url = reverse('user-list')
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
