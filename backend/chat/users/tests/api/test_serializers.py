from __future__ import unicode_literals

from django.test import TestCase

from users.api.serializers import UserSerializer
from users.factories import UserFactory


class UserSerializerTest(TestCase):
    def test_fields(self):
        user = UserFactory.build()
        serializer = UserSerializer(user)

        self.assertEqual(serializer.data["username"], user.username)
        self.assertEqual(serializer.data["email"], user.email)
