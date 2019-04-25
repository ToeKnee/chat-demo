import factory

from users.factories import UserFactory
from .models import Message


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    user = factory.SubFactory(UserFactory)
    message = factory.Faker("paragraph")
