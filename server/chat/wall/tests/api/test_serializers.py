import hashlib

from django.test import TestCase

from wall.api.serializers import MessageSerializer
from wall.factories import MessageFactory


class MessageSerializerTest(TestCase):
    def test_read_fields(self):
        message = MessageFactory()
        serializer = MessageSerializer(message)

        self.assertEqual(
            serializer.data["key"],
            hashlib.md5(str(message.id).encode("utf-8")).hexdigest(),
        )
        self.assertEqual(serializer.data["message"], message.message)
        self.assertEqual(serializer.data["user"]["username"], message.user.username)
        self.assertEqual(
            serializer.data["timestamp"],
            message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        )

    def test_get_key(self):
        message = MessageFactory(id=1)
        serializer = MessageSerializer(message)

        self.assertEqual(
            serializer.get_key(message), "c4ca4238a0b923820dcc509a6f75849b"
        )

    def test_get_key__dict(self):
        message = MessageFactory.build()
        serializer = MessageSerializer(message)

        self.assertIsNone(serializer.get_key({"message": message}))
