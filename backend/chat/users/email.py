from __future__ import unicode_literals

from django.core.mail import send_mail


def send_welcome_email(user):
    """ Send a welcome email to the specified user """

    # Usually I would use something like Foundation Emails and send
    # HTML + plain text emails. But for simplicity, plain text emails
    # will do.
    # http://foundation.zurb.com/

    message = """Hi {username},

Welcome to Chat Wall. We hope you have fun chatting with other wallers.

--
Kind Regards,
  Chat Wall Team
""".format(
        username=user.username
    )

    send_mail(
        'Welcome to Chat Wall',
        message,
        'chat@chatwall.com',
        [user.email],
        fail_silently=False,
    )
