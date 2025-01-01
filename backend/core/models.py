from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from core.managers import UserManager


# Create your models here.


class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def display_name(self):
        return str(self)


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=80, null=True, blank=False)
    last_name = models.CharField(max_length=80, null=True, blank=False)
    user_photo = models.ImageField(upload_to="user_photo/", blank=True, null=True)

    REQUIRED_FIELDS = ["email", "first_name", "last_name"]
    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["email"], name="unique_email")
        ]