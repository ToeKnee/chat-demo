from __future__ import unicode_literals

from rest_framework import serializers
from wall.models import Message


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = ('message', 'user', 'timestamp')
