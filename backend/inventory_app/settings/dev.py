from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-2f(zeo7e5z&&p$ld@f0q6y8^a!kh8gibt2=hm$6+!0j4mz7-om"

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

INSTALLED_APPS += ["django.contrib.admin"]

try:
    from .local import *
except ImportError:
    pass
