import hashlib

from django.test import override_settings
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from users.api.serializers import UserReadOnlySerializer
from users.factories import UserFactory
from wall.api.views import MessageListCreateAPIView
from wall.factories import MessageFactory


class MessageListCreateTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_anonymous__empty_wall(self):
        request = self.factory.get("/api/wall/")

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_anonymous__wall_has_content(self):
        message = MessageFactory()  # Create, don't build
        request = self.factory.get("/api/wall/")

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)

        user_serializer = UserReadOnlySerializer(message.user)
        test_data = [
            {
                "key": hashlib.md5(str(message.id).encode("utf-8")).hexdigest(),
                "message": message.message,
                "user": {
                    "username": message.user.username,
                    "avatar": user_serializer.get_avatar(message.user),
                },
                "timestamp": message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            }
        ]
        self.assertEqual(response.data, test_data)

    def test_anonymous__cant_post_message(self):
        message = MessageFactory.build()  # Build, don't create
        data = {"message": message.message}
        request = self.factory.post("/api/wall/", data)

        response = MessageListCreateAPIView.as_view()(request, data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.data, {"detail": "Authentication credentials were not provided."}
        )

    def test_authenticated__empty_wall(self):
        user = UserFactory()  # Create, don't build
        request = self.factory.get("/api/wall/")
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_authenticated__wall_has_content(self):
        user = UserFactory()  # Create, don't build
        message = MessageFactory(user=user)  # Create, don't build
        request = self.factory.get("/api/wall/")
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)

        user_serializer = UserReadOnlySerializer(message.user)
        test_data = [
            {
                "key": hashlib.md5(str(message.id).encode("utf-8")).hexdigest(),
                "message": message.message,
                "user": {
                    "username": message.user.username,
                    "avatar": user_serializer.get_avatar(message.user),
                },
                "timestamp": message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            }
        ]
        self.assertEqual(response.data, test_data)

    def test_authenticated__can_post_message(self):
        user = UserFactory()  # Create, don't build
        message = MessageFactory(user=user)  # Create, don't build
        data = {"message": message.message}
        request = self.factory.post("/api/wall/", data)
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request, data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["message"], data["message"])

    @override_settings(PER_PAGE=2)
    def test_get_queryset__limited_to_PER_PAGE(self):
        oldest_message = MessageFactory()
        middle_message = MessageFactory()
        newest_message = MessageFactory()

        queryset = MessageListCreateAPIView().get_queryset()
        self.assertNotIn(oldest_message, queryset)
        self.assertIn(middle_message, queryset)
        self.assertIn(newest_message, queryset)
        self.assertEqual([middle_message, newest_message], list(queryset))
