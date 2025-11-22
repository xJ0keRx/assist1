from django.apps import AppConfig


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    def ready(self):
        # Импортируем здесь чтобы избежать circular imports
        from .parsing_script import initialize_lotteries
        print('ready')
        initialize_lotteries()