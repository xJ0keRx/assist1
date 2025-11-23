import json
from urllib.parse import urlparse
import requests
from datetime import datetime
from django.utils.timezone import make_aware
from .models import Lottery, LotteryTag
import os
from django.db import connection

def format_prize(prize_amount):
    if prize_amount is None:
        return None
    
    if prize_amount < 1000:
        return f"{prize_amount}"
    
    elif prize_amount < 1000000:
        thousands = round(prize_amount / 1000)
        return f"{thousands} ТЫС"
    
    elif prize_amount < 1000000000:
        millions = round(prize_amount / 1000000)
        return f"{millions} МЛН"
    
    else:
        billions = round(prize_amount / 1000000000)
        return f"{billions} МЛРД"

def truncate(model):
    """Очистка таблицы с учетом типа БД"""
    model.objects.all().delete()
    
    # Для SQLite сбрасываем автоинкремент
    if connection.vendor == 'sqlite':
        with connection.cursor() as cursor:
            cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{model._meta.db_table}';")

def create_or_get_tags():
    """Создает теги если их нет и возвращает словарь тегов"""
    tags_mapping = {
        'classic_numbers': 'Классические числовые лотереи',
        'instant_scratch': 'Мгновенные лотереи',
        'bonus_games': 'Лотереи с бонусными играми',
        'low_bet': 'Низкая стоимость',
        'medium_bet': 'Средняя стоимость', 
        'high_bet': 'Высокая стоимость',
        'premium_bet': 'Премиальная стоимость',
        'jackpot_focused': 'Ориентированы на джекпот',
        'frequent_wins': 'Частые выигрыши',
        'quick_game': 'Быстрая игра',
        'strategic_game': 'Стратегическая игра',
        'money_prizes': 'Денежные призы',
        'mixed_prizes': 'Смешанные призы',
        'daily': 'Ежедневные розыгрыши',
        'weekly': 'Еженедельные розыгрыши',
        'special': 'Специальные розыгрыши',
    }
    
    tags_dict = {}
    for tag_name, description in tags_mapping.items():
        tag, created = LotteryTag.objects.get_or_create(
            name=tag_name,
            defaults={'description': description}
        )
        tags_dict[tag_name] = tag
        if created:
            print(f'Создан тег: {tag_name}')
    
    return tags_dict

def determine_lottery_tags(lottery, tags_dict):
    """Определяет какие теги присвоить лотерее на основе ее характеристик"""
    tags_to_add = []
    
    # Определяем теги по типу игры
    if lottery.game_type == 'ml':
        tags_to_add.extend(['instant_scratch', 'quick_game'])
    elif lottery.game_type == 'draw':
        tags_to_add.extend(['classic_numbers', 'strategic_game'])
    elif lottery.game_type == 'bingo':
        tags_to_add.extend(['bonus_games'])
    
    # Определяем теги по стоимости ставки
    try:
        if lottery.bet_cost:
            cost_str = str(lottery.bet_cost).lower()
            if any(x in cost_str for x in ['50', '100', '150', '200', '250', '300', 'до 300']):
                tags_to_add.append('low_bet')
            elif any(x in cost_str for x in ['350', '400', '450', '500', '300-500']):
                tags_to_add.append('medium_bet')
            elif any(x in cost_str for x in ['600', '700', '800', '900', '1000', '500-1000']):
                tags_to_add.append('high_bet')
            elif any(x in cost_str for x in ['1500', '2000', '5000', '10000', 'более 1000']):
                tags_to_add.append('premium_bet')
    except:
        pass
    
    # Определяем теги по суперпризу
    try:
        if lottery.super_prize:
            prize_str = str(lottery.super_prize).lower()
            if any(x in prize_str for x in ['млн', 'млрд', 'миллион', 'миллиард']):
                tags_to_add.append('jackpot_focused')
            else:
                tags_to_add.append('frequent_wins')
    except:
        pass
    
    # Определяем теги по частоте розыгрышей (на основе названия и типа)
    lottery_name_lower = lottery.name.lower()
    if any(x in lottery_name_lower for x in ['рапидо', 'кено', 'момента', 'быстр']):
        tags_to_add.append('daily')
    elif any(x in lottery_name_lower for x in ['лото', 'числ', 'тираж']):
        tags_to_add.append('weekly')
    else:
        tags_to_add.append('special')
    
    # Все лотереи имеют денежные призы
    tags_to_add.append('money_prizes')
    
    # Убираем дубликаты
    tags_to_add = list(set(tags_to_add))
    
    # Возвращаем объекты тегов
    return [tags_dict[tag_name] for tag_name in tags_to_add if tag_name in tags_dict]

GAMES = {
    "zabava": "Забава",
    "keno2": "Кено", 
    "ruslotto": "Русское лото",
    "oxota": "Охота",
    "oxota-vyzov": "Охота Вызов",
    "luckycard": "Лаки Кард", 
    "rapido": "Рапидо",
    "4x20": "4 из 20",
    "dvazhdydva": "ДваждыДва",
    "gzhl": "Жилищная лотерея",
    "klava": "Клава",
    "5x36plus": "5 из 36 Плюс",
    "6x45": "6 из 45",
    "7x49": "7 из 49",
    "rocketbingo": 'Лото Экспресс',
    "fzp": 'Золотая подкова'
}

def parse_timestamp(timestamp_int):
    """Конвертирует timestamp (int) в datetime объект для PostgreSQL"""
    if not timestamp_int:
        return None
    try:
        dt = datetime.fromtimestamp(timestamp_int)
        return make_aware(dt)
    except (ValueError, AttributeError, TypeError):
        return None

def update_lotteries_from_api():
    """Обновляет данные лотерей в БД из API"""
    url = "https://www.stoloto.ru/p/api/mobile/api/v35/service/games/info-new"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded",
        "Device-Type": "MOBILE",
        "Gosloto-Partner": "bXMjXFRXZ3coWXh6R3s1NTdUX3dnWlBMLUxmdg",
        "Connection": "keep-alive",
        "Referer": "https://www.stoloto.ru/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors", 
        "Sec-Fetch-Site": "same-origin",
    }

    try:
        print("Начинаем запрос к API...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"API вернуло статус: {response.status_code}")
        print(f"Количество игр в ответе: {len(data.get('games', []))}")
        
        # Создаем теги если их нет
        tags_dict = create_or_get_tags()
        print(f"Доступно тегов: {len(tags_dict)}")
        
        truncate(Lottery) # очистка бд
        games_processed = 0
        
        for game_data in data.get('games', []):
            game_code = game_data.get('name')
            
            if not game_code:
                continue
                
            print(f"Обрабатываем игру: {game_code}")
            
            if game_code in GAMES:
                print(f"Найдена игра в словаре: {game_code}")
                
                # Получаем информацию о следующем тираже
                next_draw = game_data.get('draw', {})
                
                # Подготовка данных для модели
                lottery_data = {
                    'name': GAMES[game_code],
                    'game_type': 'draw' if game_code not in ['gzhl', 'ruslotto', 'rocketbingo', 'fzp', 'udachanascdachu'] else 'bingo',
                    'bet_cost': format_prize(next_draw.get('betCost')),
                    'super_prize': format_prize(next_draw.get('superPrize')),
                    'start_date': parse_timestamp(next_draw.get('startSalesDate')),
                    'end_date': parse_timestamp(next_draw.get('stopSalesDate')),
                    'href': f"https://www.stoloto.ru/{game_code}/game",
                    'prize_type': "Денежный",
                    'win_condition': None,
                    'base_weight': 10,  # Базовый вес для рекомендаций
                    'is_active': True
                }
                
                print(f'Данные для {game_code}:')
                print(f'  - Название: {lottery_data["name"]}')
                print(f'  - Стоимость ставки: {lottery_data["bet_cost"]}')
                print(f'  - Суперприз: {lottery_data["super_prize"]}')

                # Создаем или обновляем запись в БД
                lottery, created = Lottery.objects.update_or_create(
                    name=lottery_data['name'],
                    defaults=lottery_data
                )
                
                # Определяем и добавляем теги
                lottery_tags = determine_lottery_tags(lottery, tags_dict)
                lottery.tags.set(lottery_tags)
                
                if created:
                    print(f'Создана новая запись: {lottery.name} с тегами: {[tag.name for tag in lottery_tags]}')
                else:
                    print(f'Обновлена существующая запись: {lottery.name} с тегами: {[tag.name for tag in lottery_tags]}')
                
                games_processed += 1
            else:
                print(f"Игра {game_code} не найдена в словаре GAMES")

        # Обработка моментальных лотерей
        print('\n=== ОБРАБОТКА МОМЕНТАЛЬНЫХ ЛОТЕРЕЙ ===')
        url = "https://api.stoloto.ru/cms/api/moment-cards-section?platform=MS&user-segment=ALL"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }

        response = requests.get(url, headers=headers)
        data_json = response.json()
        
        instant_lotteries_processed = 0
        
        # Парсим momentCards
        for i, lottery_data in enumerate(data_json["data"][0]["momentCards"]):
            lottery_id = lottery_data.get("lotteryId")
            super_prize = lottery_data.get("superPrizeValue")
            displayed_name = lottery_data.get("displayedName", "N/A")
            preview_images = lottery_data.get("previewImages", [])
            
            if lottery_id and super_prize is not None:
                print(f'\n--- Моментальная лотерея {i+1} ---')
                print(f'Название: {displayed_name}')
                
                lottery_db_data = {
                    'name': displayed_name,
                    'game_type': 'ml',
                    'bet_cost': lottery_data.get('ticketPriceInfo'),
                    'super_prize': super_prize,
                    'start_date': None,
                    'end_date': None,
                    'href': "https://www.stoloto.ru/map/buy",
                    'prize_type': "Денежный",
                    'win_condition': None,
                    'preview_img': preview_images[0]['image'] if preview_images else None,
                    'base_weight': 8,  # Чуть меньший вес для моментальных лотерей
                    'is_active': True
                }
                
                # Создаем или обновляем запись в БД
                lottery, created = Lottery.objects.update_or_create(
                    name=lottery_db_data['name'],
                    defaults=lottery_db_data
                )
                
                # Определяем и добавляем теги для моментальных лотерей
                lottery_tags = determine_lottery_tags(lottery, tags_dict)
                lottery.tags.set(lottery_tags)
                
                if created:
                    print(f'Создана моментальная лотерея: {lottery.name} с тегами: {[tag.name for tag in lottery_tags]}')
                else:
                    print(f'Обновлена моментальная лотерея: {lottery.name} с тегами: {[tag.name for tag in lottery_tags]}')
                
                instant_lotteries_processed += 1

        print(f'\n=== ИТОГИ ===')
        print(f'Обработано тиражных лотерей: {games_processed}')
        print(f'Обработано моментальных лотерей: {instant_lotteries_processed}')
        print(f'Всего лотерей в базе: {Lottery.objects.count()}')
        
        return games_processed + instant_lotteries_processed > 0
        
    except requests.RequestException as e:
        print(f"Ошибка при запросе к API: {e}")
        return False
    except Exception as e:
        print(f"Ошибка при обработке данных: {e}")
        import traceback
        print(traceback.format_exc())
        return False

def initialize_lotteries():
    """Инициализация данных лотерей при запуске проекта"""
    print("Запуск инициализации лотерей...")
    success = update_lotteries_from_api()
    print(f"Инициализация завершена: {'Успешно' if success else 'С ошибкой'}")
    return success