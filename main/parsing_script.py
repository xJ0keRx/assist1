import json
from urllib.parse import urlparse
import requests
from datetime import datetime
from django.utils.timezone import make_aware
from .models import Lottery
import os
from django.db import connection

def format_prize(prize_amount):
    if prize_amount is None:
        return None
    
    prize_str = str(prize_amount)
    formatted = []
    
    # Разбиваем строку на группы по 3 цифры с конца
    for i in range(len(prize_str), 0, -3):
        start = max(0, i - 3)
        formatted.append(prize_str[start:i])
    
    return ' '.join(reversed(formatted)) + ' ₽'

def download_image(url, folder, filename):
    """Скачивает изображение и сохраняет в указанную папку"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Создаем папку если её нет
        os.makedirs(folder, exist_ok=True)
        
        # Полный путь к файлу
        filepath = os.path.join(folder, filename)
        
        # Сохраняем изображение
        with open(filepath, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        return filepath
    except Exception as e:
        print(f"Ошибка при скачивании {url}: {e}")
        return None


def truncate(model):
    with connection.cursor() as cursor:
        cursor.execute(f'TRUNCATE TABLE "{Lottery._meta.db_table}" CASCADE;')
    # Lottery.objects.delete().all()


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
    "7x49": "7 из 49"
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
                    'game_type': 'draw',
                    'bet_cost': format_prize(next_draw.get('betCost')),
                    'super_prize': format_prize(next_draw.get('superPrize')),
                    'start_date': parse_timestamp(next_draw.get('startSalesDate')),
                    'end_date': parse_timestamp(next_draw.get('stopSalesDate')),
                    'href': f"https://www.stoloto.ru/{game_code}/game",
                    'prize_type': "Денежный",  # По умолчанию
                    'win_condition': None  # Это поле нужно уточнить из API
                }
                
                print(f'Данные для {game_code}:')
                print(f'  - Название: {lottery_data["name"]}')
                print(f'  - Стоимость ставки: {lottery_data["bet_cost"]}')
                print(f'  - Суперприз: {lottery_data["super_prize"]}')
                print(f'  - Дата начала: {lottery_data["start_date"]}')
                print(f'  - Дата окончания: {lottery_data["end_date"]}')
                
                

                # Создаем или обновляем запись в БД
                lottery, created = Lottery.objects.update_or_create(
                    game_type=game_code,
                    defaults=lottery_data
                )
                
                
                if created:
                    print(f'Создана новая запись: {lottery.name}')
                else:
                    print(f'Обновлена существующая запись: {lottery.name}')
                
                games_processed += 1
            else:
                print(f"Игра {game_code} не найдена в словаре GAMES")
        

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
        
        print('\n=== ЛОТЕРЕИ И СУПЕРПРИЗЫ ===')
        
        # Создаем папку для изображений
        # images_folder = 'lottery_images'
        # os.makedirs(images_folder, exist_ok=True)
        
        # Парсим momentCards
        for i, lottery in enumerate(data_json["data"][0]["momentCards"]):
            lottery_id = lottery.get("lotteryId")
            super_prize = lottery.get("superPrizeValue")
            displayed_name = lottery.get("displayedName", "N/A")
            preview_images = lottery.get("previewImages", [])
            if lottery_id and super_prize is not None:
                print(f'\n--- Лотерея {i+1} ---')
                print(f'Название: {displayed_name}')
                print(f'Lottery ID: {lottery_id}')
                print(f'Super Prize Value: {super_prize}')
                print(f'Изображение url: {preview_images[0]['image']}')
            lottery_data = {
                    'name': lottery.get("displayedName", "N/A"),
                    'game_type': 'ml',
                    'bet_cost': lottery.get('ticketPriceInfo'),
                    'super_prize': lottery.get("superPrizeValue"),
                    'start_date': None,
                    'end_date': None,
                    'href': "https://www.stoloto.ru/map/buy",
                    'prize_type': "Денежный",  # По умолчанию
                    'win_condition': None,  # Это поле нужно уточнить из API
                    'preview_img': preview_images[0]['image']
                }
                
            lottery, created = Lottery.objects.update_or_create(
                game_type=game_code,
                defaults=lottery_data
            )
                
            print(f'\nКоличество лотерей: {len(data_json["data"][0]["momentCards"])}')
            # print(f'Изображения сохранены в папку: {images_folder}')



        print(f"Обработано игр: {games_processed}")
        return games_processed > 0
        
    except requests.RequestException as e:
        print(f"Ошибка при запросе к API: {e}")
        return False
    except Exception as e:
        print(f"Ошибка при обработке данных: {e}")
        import traceback
        print(traceback.format_exc())
        return False
    


# Функция для вызова при старте Django проекта
def initialize_lotteries():
    """Инициализация данных лотерей при запуске проекта"""
    print("Запуск инициализации лотерей...")
    success = update_lotteries_from_api()
    print(f"Инициализация завершена: {'Успешно' if success else 'С ошибкой'}")
    return success