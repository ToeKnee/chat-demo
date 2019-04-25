

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _


@python_2_unicode_compatible
class Message(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("User"),
        related_name="messages",
        on_delete=models.CASCADE
    )
    message = models.TextField(_("Message"))
    timestamp = models.DateTimeField(
        _("Timestamp"),
        default=timezone.now,
        editable=False,
        db_index=True
    )

    def __str__(self):
        return self.message
