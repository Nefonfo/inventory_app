from django.urls import path
from core.views import ObtainAuthTokenCustom, ProfileView

core_urls = [
    path("auth/", ObtainAuthTokenCustom.as_view(), name="api_token_auth"),
    path("user/profile/", ProfileView.as_view(), name="profile"),
]