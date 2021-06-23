from spotify.views import AuthURl, IsAuthenticated, spotify_callback
from django.urls import path


urlpatterns = [
    path('get-auth-url', AuthURl.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view())
]
