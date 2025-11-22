from django.db import models

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

    class Meta:
        verbose_name = "Лотерея"
        verbose_name_plural = "Лотереи"

    def __str__(self):
        return self.name