from django.shortcuts import render
from .models import Lottery

# Create your views here.
def home(request):
    lotteries = Lottery.objects.all()
    
    context = {'result': lotteries}
    return render(request, 'home.html', context)