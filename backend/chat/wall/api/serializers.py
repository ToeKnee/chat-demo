from __future__ import unicode_literals

from rest_framework import serializers
from users.api.serializers import UserReadOnlySerializer
from wall.models import Message


class MessageSerializer(serializers.ModelSerializer):
    user = UserReadOnlySerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('message', 'user', 'timestamp')
