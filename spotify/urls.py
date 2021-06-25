from spotify.views import *
from django.urls import path


urlpatterns = [
    path('get-auth-url', AuthURl.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view())
]
