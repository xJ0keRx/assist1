import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
django.setup()

from django.db.models import Q
from ..models import Lottery, LotteryTag

class RecommendationEngine:
    def __init__(self):
        self.answer_weights = self._initialize_weights()
    
    def _initialize_weights(self):
        return {
            # Формат игры
            "Классические числовые лотереи (выбираю числа)": {"classic_numbers": 10},
            "Быстрые мгновенные лотереи (скрейч-карты)": {"instant_scratch": 10},
            "Лотереи с дополнительными бонусными играми": {"bonus_games": 10},
            "Все форматы интересны, главное - шанс выиграть": {"classic_numbers": 3, "instant_scratch": 3, "bonus_games": 3},
            
            # Стоимость ставки
            "До 300 рублей": {"low_bet": 10},
            "300-500 рублей": {"medium_bet": 10},
            "500-1000 рублей": {"high_bet": 10},
            "Более 1000 рублей": {"premium_bet": 10},
            
            # Важность суперприза
            "Очень важен - играю только за крупный джекпот": {"jackpot_focused": 10},
            "Важен, но небольшие выигрыши тоже радуют": {"jackpot_focused": 5, "frequent_wins": 5},
            "Не главное - чаще играю ради процесса и эмоций": {"frequent_wins": 8},
            "Предпочитаю лотереи с частыми, но меньшими выигрышами": {"frequent_wins": 10},
            
            # Время на игру
            "Минимальное - мгновенный результат": {"quick_game": 10},
            "5-15 минут на заполнение и проверку": {"quick_game": 5, "strategic_game": 5},
            "Готов изучать стратегии и анализировать": {"strategic_game": 10},
            "Время не имеет значения, главное - результат": {"quick_game": 3, "strategic_game": 3},
            
            # Тип призов
            "Только денежные выигрыши": {"money_prizes": 10},
            "Деньги плюс дополнительные бонусы": {"mixed_prizes": 10},
            "Интересные неденежные призы (техника, путешествия)": {"mixed_prizes": 10},
            "Любые призы, главное - выигрывать": {"money_prizes": 5, "mixed_prizes": 5},
            
            # Частота игры
            "Ежедневно - быстрые розыгрыши": {"daily": 10},
            "1-2 раза в неделю - регулярно, но не часто": {"weekly": 10},
            "По настроению или особым случаям": {"special": 8},
            "Только когда накапливается крупный джекпот": {"jackpot_focused": 10, "special": 5},
            
            # Мотивация
            "Возможность изменить жизнь крупным выигрышем": {"jackpot_focused": 10},
            "Азарт и эмоции от процесса игры": {"bonus_games": 8},
            "Развлечение и приятное времяпровождение": {"frequent_wins": 8},
            "Социальный аспект - игра с друзьями/коллегами": {"classic_numbers": 8}
        }
    
    def calculate_recommendations(self, user_answers, session_key=None):
        tag_weights = {}
        
        # Собираем веса из ответов
        for question_data in user_answers:
            answers = question_data['answers']
            
            for answer in answers:
                if answer in self.answer_weights:
                    for tag, weight in self.answer_weights[answer].items():
                        tag_weights[tag] = tag_weights.get(tag, 0) + weight
        
        # Получаем все активные лотереи
        lotteries = Lottery.objects.filter(is_active=True).prefetch_related('tags')
        print('нашло', len(lotteries))
        recommendations = []
        for lottery in lotteries:
            score = lottery.base_weight
            lottery_tags = set(lottery.tags.values_list('name', flat=True))
            
            # Добавляем вес за совпадение тегов
            for tag in lottery_tags:
                if tag in tag_weights:
                    score += tag_weights[tag]
            gt = {'draw': 'Числовая', 'ml': 'Моментальная лотерея', 'bingo': 'Русское лото'}


            if score > 0:
                recommendations.append({
                    'lottery_id': lottery.id,
                    'name': lottery.name,
                    'score': min(score, 100),
                    'game_type': gt[lottery.game_type],
                    'bet_cost': lottery.bet_cost if str(lottery.bet_cost)[-1] == '₽' else lottery.bet_cost + ' ₽',
                    'super_prize': lottery.super_prize,
                    'preview_img': str(lottery.preview_img) if lottery.preview_img else None,
                    'href': lottery.href,
                    'match_percentage': min(score, 100)
                })
        
        # Сортируем по рейтингу
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        # Сохраняем рекомендации
        if session_key:
            from ..models import UserRecommendation
            UserRecommendation.objects.update_or_create(
                session_key=session_key,
                defaults={
                    'answers': user_answers,
                    'recommended_lotteries': recommendations[:12]
                }
            )
        
        return recommendations[:12]
    
    def get_popular_lotteries(self, limit=6):
        """Возвращает популярные лотереи"""
        popular = Lottery.objects.filter(is_active=True).order_by('-base_weight')[:limit]
        
        return [{
            'lottery_id': lot.id,
            'name': lot.name,
            'score': 50,
            'game_type': lot.game_type,
            'bet_cost': lot.bet_cost,
            'super_prize': lot.super_prize,
            'preview_img': str(lot.preview_img) if lot.preview_img else None,
            'href': lot.href,
            'match_percentage': 50,
            'is_popular': True
        } for lot in popular]