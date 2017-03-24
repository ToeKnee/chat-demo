from __future__ import unicode_literals

from django.test import TestCase
from rest_framework.authtoken.models import Token

from users.factories import UserFactory


class CreateAuthTokenTest(TestCase):
    def test_creates_token_for_user(self):
        user = UserFactory()
        self.assertEqual(Token.objects.filter(user=user).count(), 1)

    def test_creates_one_token_only(self):
        user = UserFactory()
        user.save()
        self.assertEqual(Token.objects.filter(user=user).count(), 1)
