from django.conf import settings
from django.core.management.commands.runserver import Command as BaseRunserverCommand


class Command(BaseRunserverCommand):
    default_addr = settings.BACKEND_HOST
    default_port = str(settings.BACKEND_PORT)
