from django.core import mail
from django.test import TestCase

from users.email import send_welcome_email
from users.factories import UserFactory


class SendWelcomeEmailTest(TestCase):
    def test_welcome_email(self):
        user = UserFactory.build()
        send_welcome_email(user)

        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(user.email, mail.outbox[0].recipients())
        self.assertIn(user.username, mail.outbox[0].body)

    def test_user_with_no_email_address(self):
        user = UserFactory.build(email=None)
        self.assertIsNone(send_welcome_email(user))
        self.assertEqual(len(mail.outbox), 0)
