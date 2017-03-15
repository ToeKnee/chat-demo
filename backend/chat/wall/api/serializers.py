from __future__ import unicode_literals

import hashlib

from rest_framework import serializers
from users.api.serializers import UserReadOnlySerializer
from wall.models import Message


class MessageSerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField(read_only=True)
    user = UserReadOnlySerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('key', 'message', 'user', 'timestamp')

    def get_key(self, obj):
        """ Return a hash of the ID

        Return md5 instead of the raw id because:
        * We don't want to expose obj.id as it gives away information about the size of our app
        * We want to be fast and don't need to be Cryptographically secure
        """
        if hasattr(obj, "id"):
            hashed_id = hashlib.md5(str(obj.id).encode("utf-8")).hexdigest()
            return hashed_id
        else:
            return None
