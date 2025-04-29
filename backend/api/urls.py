from django.urls import path
from .views import (
    user_list, user_detail, user_create, user_update, user_delete,
    room_list, room_detail, room_create, room_update, room_delete,
    register_user, CustomTokenObtainPairView

)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Endpointy użytkowników
    path('users/', user_list, name='user_list'), 
    path('users/<int:pk>/', user_detail, name='user_detail'),  
    path('users/create/', user_create, name='user_create'),  
    path('users/<int:pk>/update/', user_update, name='user_update'),  
    path('users/<int:pk>/delete/', user_delete, name='user_delete'),  

    # Endpointy sal
    path('rooms/', room_list, name='room_list'),  
    path('rooms/<int:pk>/', room_detail, name='room_detail'),  
    path('rooms/create/', room_create, name='room_create'),  
    path('rooms/<int:pk>/update/', room_update, name='room_update'),  
    path('rooms/<int:pk>/delete/', room_delete, name='room_delete'), 

    # Endpointy logowania i rejestracji
    path('register/', register_user, name='register_user'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
