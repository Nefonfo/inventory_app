from django.urls import path, include
from core.views import ObtainAuthTokenCustom, ProfileView, ChangePasswordView

core_urls = [
    path("auth/", ObtainAuthTokenCustom.as_view(), name="api_token_auth"),
    path(
        "auth/password_reset",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("user/profile/", ProfileView.as_view(), name="profile"),
    path("user/profile/change_password", ChangePasswordView.as_view(), name="profile"),
]
