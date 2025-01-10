from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication


from core.serializers import UserSerializer


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
