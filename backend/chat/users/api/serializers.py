from __future__ import unicode_literals

from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username',)
        read_only_fields = ('username',)

    def create(self, validated_data):
        return None

    def update(self, instance, validated_data):
        return None
