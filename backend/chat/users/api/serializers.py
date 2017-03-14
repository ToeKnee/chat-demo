from __future__ import unicode_literals

import hashlib

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
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('username', 'avatar',)
        read_only_fields = ('username', 'avatar',)

    def create(self, validated_data):
        return None

    def update(self, instance, validated_data):
        return None

    def get_avatar(self, obj):
        hashed_email = hashlib.md5(obj.email.encode("utf-8")).hexdigest()
        url = "https://www.gravatar.com/avatar/{hashed_email}?d=mm"
        return url.format(hashed_email=hashed_email)
