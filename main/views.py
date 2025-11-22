from django.shortcuts import render
from .models import Lottery

def home(request):
    # Получаем только лотереи с game_type == 'ml'
    ml_lotteries = Lottery.objects.filter(game_type='ml')
    
    context = {'result': ml_lotteries}
    print(ml_lotteries[0].preview_img if ml_lotteries else "Нет объектов")
    return render(request, 'base.html', context)