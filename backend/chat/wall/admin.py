from __future__ import unicode_literals

from django.contrib import admin

from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    date_hierarchy = 'timestamp'
    list_display = ('message', 'user', 'timestamp',)
    search_fields = ('message', 'user__username', 'user__email',)
