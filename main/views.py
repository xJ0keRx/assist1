import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .models import Lottery
from .recommendations.engine import RecommendationEngine

def index(request):
    # Получаем лотереи
    ml_lotteries = Lottery.objects.filter(game_type='ml')
    lotteries = Lottery.objects.filter(game_type='draw')
    
    # Проверяем есть ли рекомендации в сессии
    recommendations = request.session.get('recommendations', [])
    questionnaire_completed = request.session.get('questionnaire_completed', False)
    
    # Подготавливаем данные для JavaScript
    lotteries_data = []
    for lottery in lotteries:
        lotteries_data.append({
            'id': lottery.id,
            'name': lottery.name,
            'price': lottery.bet_cost,
            'jackpot': lottery.super_prize,
            'rating': 4.5,
            'drawDate': lottery.start_date.strftime('%Y-%m-%d') if lottery.start_date else 'Скоро',
            'tags': ['популярное'],
            'probability': '1:8.1M',
            'type': lottery.game_type,
            'frequency': 'день',
            'url': lottery.href,
            'userRating': None
        })
    
    context = {
        'result': ml_lotteries,
        'lotteries_json': json.dumps(lotteries_data, ensure_ascii=False),
        'recommendations': recommendations,
        'questionnaire_completed': questionnaire_completed
    }
    return render(request, 'index.html', context)

def quests(request):
    return render(request, 'quests.html')

def compare(request):
    return render(request, 'compare.html')

@csrf_exempt
def search_lotteries(request):
    """Поиск лотерей по названию"""
    if request.method == 'GET':
        query = request.GET.get('q', '').strip()
        
        if not query:
            return JsonResponse({'success': False, 'error': 'Пустой запрос'})
        
        # Ищем лотереи по названию (регистронезависимо)
        lotteries = Lottery.objects.filter(
            Q(name__icontains=query) | Q(game_type__icontains=query)
        ).distinct()
        
        # Формируем результаты с уникальными названиями
        results = []
        name_count = {}
        
        for lottery in lotteries:
            lottery_name = lottery.name
            lottery_price = lottery.bet_cost or "Цена не указана"
            
            # Считаем сколько раз встречается это название
            if lottery_name in name_count:
                name_count[lottery_name] += 1
            else:
                name_count[lottery_name] = 1
            
            # Если название повторяется, добавляем цену к отображаемому имени
            display_name = lottery_name
            if name_count[lottery_name] > 1:
                display_name = f"{lottery_name} - {lottery_price}"
            
            results.append({
                'id': lottery.id,
                'name': lottery.name,
                'display_name': display_name,
                'price': lottery_price,
                'jackpot': lottery.super_prize,
                'type': lottery.game_type,
                'url': lottery.href,
                'preview_img': lottery.preview_img.url if lottery.preview_img else None,
                'is_duplicate': name_count[lottery_name] > 1
            })
        
        return JsonResponse({
            'success': True,
            'query': query,
            'results': results,
            'total_found': len(results)
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@csrf_exempt
def process_questionnaire(request):
    """Обработка опроса и генерация рекомендаций"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_answers = data.get('answers', [])
            
            # Создаем сессию если нет
            if not request.session.session_key:
                request.session.create()
            
            # Вычисляем рекомендации
            engine = RecommendationEngine()
            recommendations = engine.calculate_recommendations(
                user_answers, 
                request.session.session_key
            )
            
            # Сохраняем в сессии
            request.session['recommendations'] = recommendations
            request.session['questionnaire_completed'] = True
            
            return JsonResponse({
                'success': True,
                'recommendations': recommendations,
                'total_found': len(recommendations)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({'success': False, 'error': 'Invalid method'})

def get_recommendations(request):
    """API для получения рекомендаций"""
    engine = RecommendationEngine()
    
    if request.session.get('questionnaire_completed'):
        recommendations = request.session.get('recommendations', [])
    else:
        recommendations = engine.get_popular_lotteries()
    
    return JsonResponse({
        'recommendations': recommendations,
        'questionnaire_completed': request.session.get('questionnaire_completed', False)
    })