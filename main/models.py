from django.db import models

class LotteryTag(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Название тега")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Тег лотереи"
        verbose_name_plural = "Теги лотерей"

class Lottery(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название лотереи")
    game_type = models.CharField(max_length=100, null=True, verbose_name="Тип игры")
    bet_cost = models.CharField(max_length=100, null=True, verbose_name="Стоимость ставки")
    super_prize = models.CharField(max_length=100, null=True, verbose_name="Суперприз")
    start_date = models.DateTimeField(null=True, verbose_name="Дата начала")
    end_date = models.DateTimeField(null=True, verbose_name="Дата окончания")
    href = models.CharField(max_length=250, null=True, verbose_name="Ссылка")
    prize_type = models.CharField(max_length=100, null=True, verbose_name="Тип приза")
    win_condition = models.IntegerField(null=True, verbose_name="Условие выигрыша")
    preview_img = models.ImageField(null=True, verbose_name='Изображение')
    
    # новые поля для рекомендаций
    tags = models.ManyToManyField(LotteryTag, blank=True, verbose_name="Теги")
    base_weight = models.IntegerField(default=0, verbose_name="Базовый вес", null=True)
    is_active = models.BooleanField(null=True, default=True, verbose_name="Активна")

    class Meta:
        verbose_name = "Лотерея"
        verbose_name_plural = "Лотереи"

    def __str__(self):
        return self.name

class UserRecommendation(models.Model):
    session_key = models.CharField(max_length=40, db_index=True, verbose_name="Ключ сессии")
    answers = models.JSONField(verbose_name="Ответы пользователя")
    recommended_lotteries = models.JSONField(verbose_name="Рекомендованные лотереи")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Рекомендация пользователя"
        verbose_name_plural = "Рекомендации пользователей"