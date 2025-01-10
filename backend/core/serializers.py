from django.contrib.auth import get_user_model

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    user_photo = serializers.ImageField(use_url=False)

    class Meta:
        model = get_user_model()
        fields = ["username", "email", "first_name", "last_name", "user_photo"]
