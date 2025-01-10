from django.contrib.auth import get_user_model

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    user_photo = serializers.ImageField(use_url=False, required=False, allow_null=True)

    class Meta:
        model = get_user_model()
        fields = ["username", "email", "first_name", "last_name", "user_photo"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, min_length=8)
    new_password = serializers.CharField(required=True, min_length=8)
