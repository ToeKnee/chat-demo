from __future__ import unicode_literals

from django.test import TestCase

from wall.api.serializers import MessageSerializer
from wall.factories import MessageFactory


class MessageSerializerTest(TestCase):
    def test_read_fields(self):
        message = MessageFactory.build()
        serializer = MessageSerializer(message)

        self.assertEqual(serializer.data["message"], message.message)
        self.assertEqual(serializer.data["user"]["username"], message.user.username)
        self.assertEqual(
            serializer.data["timestamp"],
            message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        )
