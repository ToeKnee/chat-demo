from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
