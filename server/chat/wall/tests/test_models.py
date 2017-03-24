from __future__ import unicode_literals

from django.test import TestCase
from wall.factories import MessageFactory


class MessageTest(TestCase):
    def test_str(self):
        message = MessageFactory.build()
        self.assertEqual(str(message), message.message)
