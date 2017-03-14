from __future__ import unicode_literals

from rest_framework.test import (
    APIRequestFactory,
    APITestCase,
    force_authenticate,
)

from users.api.serializers import UserReadOnlySerializer
from users.factories import UserFactory
from wall.api.views import MessageListCreateAPIView
from wall.factories import MessageFactory


class RegisterMessageTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_anonymous__empty_wall(self):
        request = self.factory.get('/api/wall/')

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_anonymous__wall_has_content(self):
        message = MessageFactory()  # Create, don't build
        request = self.factory.get('/api/wall/')

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)

        user_serializer = UserReadOnlySerializer(message.user)
        test_data = [{
            "message": message.message,
            "user": {
                "username": message.user.username,
                "avatar": user_serializer.get_avatar(message.user),
            },
            "timestamp": message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        }]
        self.assertEqual(response.data, test_data)

    def test_anonymous__cant_post_message(self):
        message = MessageFactory.build()  # Build, don't create
        data = {"message": message.message}
        request = self.factory.post('/api/wall/', data)

        response = MessageListCreateAPIView.as_view()(request, data)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.data,
            {'detail': 'Authentication credentials were not provided.'}
        )

    def test_authenticated__empty_wall(self):
        user = UserFactory()  # Create, don't build
        request = self.factory.get('/api/wall/')
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_authenticated__wall_has_content(self):
        user = UserFactory()  # Create, don't build
        message = MessageFactory(user=user)  # Create, don't build
        request = self.factory.get('/api/wall/')
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request)
        self.assertEqual(response.status_code, 200)

        user_serializer = UserReadOnlySerializer(message.user)
        test_data = [{
            "message": message.message,
            "user": {
                "username": message.user.username,
                "avatar": user_serializer.get_avatar(message.user),
            },
            "timestamp": message.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        }]
        self.assertEqual(response.data, test_data)

    def test_authenticated__can_post_message(self):
        user = UserFactory()  # Create, don't build
        message = MessageFactory(user=user)  # Create, don't build
        data = {"message": message.message}
        request = self.factory.post('/api/wall/', data)
        force_authenticate(request, user)

        response = MessageListCreateAPIView.as_view()(request, data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data, data)
