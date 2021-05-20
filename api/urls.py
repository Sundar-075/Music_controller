from django.urls import path
from .views import JoinRoom, LeaveRoom, Roomview, CreateRoomView, GetRoom, UserInRoom

urlpatterns = [
    path('home', Roomview.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view())
]
