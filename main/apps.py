from django.apps import AppConfig

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    _initialized = False  # Флаг для отслеживания инициализации
    
    def ready(self):
        if not self._initialized:
            from .parsing_script import initialize_lotteries
            initialize_lotteries()
            self._initialized = True