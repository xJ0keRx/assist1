from django.db import models

# Create your models here.
class Lottery(models.Model):
    name = models.CharField(max_length=100)
    game_type = models.CharField(max_length=100,null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    href = models.CharField(max_length=250,null=True)
    is_event = models.BooleanField(default=False)
    prize_type = models.CharField(max_length=100,null=True)
    win_condition = models.IntegerField(null=True)