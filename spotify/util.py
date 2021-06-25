from datetime import timedelta

from django.http import response
from requests.api import head
from .models import SpotifyToken
from django.utils import timezone
from requests import post, put, get
from decouple import config

CLIENT_ID = config('CLIENT_ID')
CLIENT_SECRET = config('CLIENT_SECRET')
BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_token(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in_t, refresh_token):
    tokens = get_user_token(session_id)
    # if expires_in_t is None:
    #     expires_in_t = 3600
    expires_in = timezone.now() + timedelta(seconds=expires_in_t)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   "refresh_token", "expires_in", "token_type"])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_token(session_id)
    if tokens:
        expiry = tokens.expires_in
        print(expiry)
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False


def refresh_spotify_token(session_id):
    refresh_token = get_user_token(session_id)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_token(session_id)
    headers = {'Content-Type': 'application/json',
               "Authorization": "Bearer "+tokens.access_token}

    if post_:
        post(BASE_URL+endpoint, headers=headers)

    if put_:
        put(BASE_URL+endpoint, headers=headers)

    response = get(BASE_URL+endpoint, {}, headers=headers)
    print(response)

    try:
        return response.json()
    except:
        return {"Error": "Issue with request"}
