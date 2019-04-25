

from django.contrib.auth import get_user_model
from django.test import TestCase

from users.api.serializers import UserSerializer, UserReadOnlySerializer
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


class UserReadOnlySerializerTest(TestCase):
    def test_read_fields(self):
        user = UserFactory.build()
        serializer = UserReadOnlySerializer(user)

        self.assertEqual(serializer.data["username"], user.username)

    def test_create(self):
        user = UserFactory.build()
        data = {
            "username": user.username,
        }
        serializer = UserReadOnlySerializer()
        test_user = serializer.create(validated_data=data)

        self.assertIsNone(test_user)
        self.assertEqual(get_user_model().objects.count(), 0)

    def test_update(self):
        user = UserFactory()
        data = {
            "username": "change-username",
        }
        serializer = UserReadOnlySerializer()
        test_user = serializer.update(instance=user, validated_data=data)

        self.assertIsNone(test_user)
        user.refresh_from_db()
        self.assertNotEqual(user.username, data["username"])

    def test_get_avatar(self):
        user = UserFactory(email="test@example.com")
        serializer = UserReadOnlySerializer(user)

        self.assertEqual(
            serializer.get_avatar(user),
            "https://www.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?d=mm"
        )
