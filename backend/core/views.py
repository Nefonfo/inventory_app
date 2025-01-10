from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication


from core.serializers import UserSerializer, ChangePasswordSerializer


class ObtainAuthTokenCustom(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class ProfileView(RetrieveUpdateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def _get_allowed_fields(self):
        return {"username", "email", "first_name", "last_name", "user_photo"}

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        invalid_fields = list(
            filter(
                lambda field: field not in self._get_allowed_fields(),
                request.data.keys(),
            )
        )
        if len(invalid_fields):
            return Response(
                {
                    "details": [
                        f"You are not allowed to update the following fields: {', '.join(invalid_fields)}"
                    ]
                },
                status=403,
            )

        serializer = self.get_serializer(
            self.get_object(), data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ChangePasswordView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def put(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        user = get_user_model().objects.get(pk=self.request.user.id)
        if not user.check_password(raw_password=old_password):
            return Response({"details": "The password don't match"}, status=400)
        else:
            user.set_password(new_password)
            user.save()
            return Response({"success": "Password changed successfully"}, status=200)
