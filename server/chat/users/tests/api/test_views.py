from unittest import mock
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from users.api.views import UserCreateAPIView
from users.factories import UserFactory


class RegisterUserTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_register__new_user(self):
        user = UserFactory.build()  # Build, don't create

        data = {"username": user.username, "email": user.email, "password": "let-me-in"}
        request = self.factory.post("/api/user/", data)
        with mock.patch(
            "users.api.views.send_welcome_email"
        ) as mock_send_welcome_email:
            response = UserCreateAPIView.as_view()(request)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(mock_send_welcome_email.call_count, 1)
            self.assertTrue(
                get_user_model().objects.filter(
                    username=user.username, email=user.email
                )
            )
            test_user = get_user_model().objects.get(username=user.username)
            self.assertTrue(test_user.check_password(data["password"]))

    def test_register__user_already_exists(self):
        user = UserFactory()  # Create, don't build

        data = {"username": user.username, "email": user.email, "password": "let-me-in"}
        request = self.factory.post("/api/user/", data)
        with mock.patch(
            "users.api.views.send_welcome_email"
        ) as mock_send_welcome_email:
            response = UserCreateAPIView.as_view()(request)
            response.render()
            self.assertEqual(response.status_code, 400)
            self.assertEqual(
                response.data,
                {"username": ["A user with that username already exists."]},
            )
            self.assertEqual(mock_send_welcome_email.call_count, 0)

    def test_register__user_already_logged_in(self):
        logged_in_user = UserFactory()  # Create, don't build
        new_user = UserFactory.build()  # Build, don't create

        data = {
            "username": new_user.username,
            "email": new_user.email,
            "password": "let-me-in",
        }
        request = self.factory.post("/api/user/", data)
        force_authenticate(request, logged_in_user)
        with mock.patch(
            "users.api.views.send_welcome_email"
        ) as mock_send_welcome_email:
            response = UserCreateAPIView.as_view()(request)
            response.render()
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.data, ["You have already signed up"])
            self.assertEqual(mock_send_welcome_email.call_count, 0)

    def test_register__user_invalid(self):
        data = {}
        request = self.factory.post("/api/user/", data)
        with mock.patch(
            "users.api.views.send_welcome_email"
        ) as mock_send_welcome_email:
            response = UserCreateAPIView.as_view()(request)
            response.render()
            self.assertEqual(response.status_code, 400)
            self.assertEqual(
                response.data,
                {
                    "username": ["This field is required."],
                    "password": ["This field is required."],
                },
            )
            self.assertEqual(mock_send_welcome_email.call_count, 0)
