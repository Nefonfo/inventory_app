import os

from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string

from django_rest_passwordreset.signals import reset_password_token_created
from dotenv import load_dotenv

load_dotenv()


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    context = {
        "current_user": reset_password_token.user,
        "username": reset_password_token.user.username,
        "email": reset_password_token.user.email,
        "reset_password_url": f"{os.getenv('FRONTEND_URL')}/auth/recover/{reset_password_token.key}",
    }
    email_html_message = render_to_string("email/user_reset_password.html", context)
    email_plaintext_message = render_to_string("email/user_reset_password.txt", context)

    msg = EmailMultiAlternatives(
        "Password Reset for Inventory App",
        email_plaintext_message,
        os.getenv("EMAIL_HOST_USER"),
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()