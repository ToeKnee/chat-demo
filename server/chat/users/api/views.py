

from rest_framework.generics import CreateAPIView
from rest_framework.validators import ValidationError

from .serializers import UserSerializer
from users.email import send_welcome_email


class UserCreateAPIView(CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            raise ValidationError("You have already signed up")
        user = serializer.save()
        user.set_password(serializer.data["password"])
        send_welcome_email(user=user)
