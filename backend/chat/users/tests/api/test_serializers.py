from __future__ import unicode_literals

from django.test import TestCase

from users.api.serializers import UserSerializer
from users.factories import UserFactory


class UserSerializerTest(TestCase):
    def test_read_fields(self):
        user = UserFactory.build()
        serializer = UserSerializer(user)

        self.assertEqual(serializer.data["username"], user.username)
        self.assertEqual(serializer.data["email"], user.email)

    def test_create(self):
        user = UserFactory.build()
        data = {
            "username": user.username,
            "email": user.email,
            "password": "let-me-in",
        }
        serializer = UserSerializer()

        test_user = serializer.create(validated_data=data)
        self.assertEqual(user.username, test_user.username)
        self.assertEqual(user.email, test_user.email)
        self.assertTrue(test_user.check_password(data["password"]))
