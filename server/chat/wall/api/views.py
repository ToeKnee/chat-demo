

from django.conf import settings

from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .serializers import MessageSerializer
from wall.models import Message


class MessageListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def get_queryset(self):
        latest_messages = Message.objects.all().only("id").order_by("-timestamp")[:settings.PER_PAGE]
        queryset = Message.objects.filter(id__in=latest_messages).order_by("timestamp")
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        Message.objects.create(
            user=request.user,
            message=serializer.data["message"],
        )
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
