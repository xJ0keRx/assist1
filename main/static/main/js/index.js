        // Данные лотерей с ссылками
const lotteries = [
    { 
        name: 'Русское Лото', 
        price: 100, 
        jackpot: '50 млн ₽', 
        rating: 4.8, 
        drawDate: 'Каждый день', 
        tags: ['популярное', 'hot'], 
        probability: '1:45', 
        type: 'классическое', 
        frequency: 'день',
        url: 'https://www.stoloto.ru/ruslotto/game',
        userRating: null
    },
    // Добавьте эти объекты в массив lotteries
{ 
    name: 'Моментальная Удача', 
    price: 50, 
    jackpot: '1 млн ₽', 
    rating: 4.2, 
    drawDate: 'Мгновенно', 
    tags: ['моментальное', 'new'], 
    probability: '1:10', 
    type: 'моментальное', 
    frequency: 'час',
    url: 'https://www.stoloto.ru/ml/game',
    userRating: null
},
{ 
    name: 'Золотой Кубок', 
    price: 100, 
    jackpot: '2 млн ₽', 
    rating: 4.5, 
    drawDate: 'Мгновенно', 
    tags: ['моментальное', 'popular'], 
    probability: '1:15', 
    type: 'моментальное', 
    frequency: 'час',
    url: 'https://www.stoloto.ru/ml/game',
    userRating: null
},
// ... остальные моментальные лотереи
    { 
        name: 'Гослото 6/45', 
        price: 150, 
        jackpot: '30 млн ₽', 
        rating: 4.5, 
        drawDate: 'Вт, Пт', 
        tags: ['числовое', 'popular'], 
        probability: '1:8.1M', 
        type: 'числовое', 
        frequency: 'неделя',
        url: 'https://www.stoloto.ru/6x45/game',
        userRating: null
    },
    { 
        name: 'Спортлото', 
        price: 120, 
        jackpot: '25 млн ₽', 
        rating: 4.6, 
        drawDate: 'Ежедневно', 
        tags: ['классическое'], 
        probability: '1:3.2M', 
        type: 'классическое', 
        frequency: 'день',
        url: 'https://www.stoloto.ru/sportloto/game',
        userRating: null
    },
    { 
        name: 'Рапидо', 
        price: 80, 
        jackpot: '15 млн ₽', 
        rating: 4.4, 
        drawDate: 'Каждый час', 
        tags: ['быстрое', 'hot'], 
        probability: '1:500K', 
        type: 'быстрое', 
        frequency: 'час',
        url: 'https://www.stoloto.ru/rapido/game',
        userRating: null
    },
    { 
        name: 'ТриумфЛото', 
        price: 200, 
        jackpot: '100 млн ₽', 
        rating: 4.9, 
        drawDate: 'Пн, Сб', 
        tags: ['премиум', 'popular'], 
        probability: '1:10M', 
        type: 'премиум', 
        frequency: 'неделя',
        url: 'https://www.stoloto.ru/triumph/game',
        userRating: null
    },
    { 
        name: 'Кено', 
        price: 50, 
        jackpot: '5 млн ₽', 
        rating: 4.3, 
        drawDate: 'Круглосуточно', 
        tags: ['моментальное'], 
        probability: '1:100K', 
        type: 'моментальное', 
        frequency: 'час',
        url: 'https://www.stoloto.ru/keno/game',
        userRating: null
    },
    { 
        name: 'МегаЛот', 
        price: 110, 
        jackpot: '60 млн ₽', 
        rating: 4.7, 
        drawDate: 'Ежедневно', 
        tags: ['популярное'], 
        probability: '1:50', 
        type: 'классическое', 
        frequency: 'день',
        url: 'https://www.stoloto.ru/megalot/game',
        userRating: null
    },
    { 
        name: 'ПриватЛот', 
        price: 99, 
        jackpot: '40 млн ₽', 
        rating: 4.4, 
        drawDate: 'Вс, Чт', 
        tags: ['популярное'], 
        probability: '1:40', 
        type: 'числовое', 
        frequency: 'неделя',
        url: 'https://www.stoloto.ru/privatlot/game',
        userRating: null
    },
];

// ========== COOKIE СОГЛАСИЕ ==========
function showCookieConsent() {
    const consent = getStorage('cookieConsent');
    if (consent) return; // Уже дано согласие
    
    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-consent';
    cookieBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
        border: 2px solid rgba(99, 102, 241, 0.4);
        border-radius: 16px;
        padding: 1.5rem;
        z-index: 10000;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        margin: 0 auto;
    `;
    
    cookieBanner.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="font-size: 1.5rem;">🍪</div>
            <div style="flex: 1;">
                <h3 style="color: var(--text); margin-bottom: 0.5rem; font-family: 'Orbitron', sans-serif; font-size: 1.1rem;">
                    Использование файлов cookie
                </h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem;">
                    Мы используем файлы cookie для сохранения ваших оценок и предпочтений. Это помогает улучшить ваш опыт использования сайта.
                </p>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <button class="btn btn-primary accept-cookies" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">
                        Принять все
                    </button>
                    <button class="btn btn-outline reject-cookies" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">
                        Отклонить
                    </button>
                    <button class="btn btn-outline red" style="padding : 0.6rem 1.2rem; font-size: 0.85rem;">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(cookieBanner);
    
    // Обработчики кнопок
    cookieBanner.querySelector('.accept-cookies').addEventListener('click', function() {
        setStorage('cookieConsent', true);
        cookieBanner.style.display = 'none';
    });
    
    
    cookieBanner.querySelector('.reject-cookies').addEventListener('click', function() {
        setStorage('cookieConsent', false);
        // Очищаем все данные при отклонении
        localStorage.removeItem('userLotteryHistory');
        localStorage.removeItem('userLotteryRatings');
        localStorage.removeItem('userPreferences');
        cookieBanner.style.display = 'none';
    });
}

// ========== РАБОТА С LOCALSTORAGE ==========
function setStorage(key, value) {
    try {
        // Проверяем согласие на cookies
        const consent = getStorage('cookieConsent');
        if (consent === false) {
            console.log('Cookies rejected by user');
            return;
        }
        
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Saved to localStorage:', key, value);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Получить историю лотерей пользователя
function getUserHistory() {
    // Проверяем согласие на cookies
    const consent = getStorage('cookieConsent');
    if (consent === false) {
        return {};
    }
    
    let history = getStorage('userLotteryHistory');
    return history || {};
}

// Получить рейтинги пользователя
function getUserRatings() {
    // Проверяем согласие на cookies
    const consent = getStorage('cookieConsent');
    if (consent === false) {
        return {};
    }
    
    let ratings = getStorage('userLotteryRatings');
    return ratings || {};
}

// Записать, что пользователь кликнул на лотерею
function recordLotteryClick(lotteryName) {
    let history = getUserHistory();
    history[lotteryName] = (history[lotteryName] || 0) + 1;
    setStorage('userLotteryHistory', history);
}

// Сохранить рейтинг пользователя
function saveUserRating(lotteryName, rating) {
    let ratings = getUserRatings();
    ratings[lotteryName] = rating;
    setStorage('userLotteryRatings', ratings);
    
    // Обновляем отображение и секцию оценок
    renderAdaptiveLotteries();
    renderUserRatingsSection();
}

// Сбросить все оценки
function resetAllRatings() {
    if (confirm('Вы уверены, что хотите удалить все ваши оценки?')) {
        setStorage('userLotteryRatings', {});
        renderAdaptiveLotteries();
        renderUserRatingsSection();
        alert('Все оценки успешно удалены!');
    }
}

// Получить предпочтения пользователя
function getUserPreferences() {
    // Проверяем согласие на cookies
    const consent = getStorage('cookieConsent');
    if (consent === false) {
        return { types: [], prices: [], frequencies: [] };
    }
    
    return getStorage('userPreferences') || { types: [], prices: [], frequencies: [] };
}

// Сохранить предпочтения
function saveUserPreferences(prefs) {
    setStorage('userPreferences', prefs);
}

// ========== ФИЛЬТРАЦИЯ И АДАПТАЦИЯ ==========
function applyFilters() {
    const typeFilter = document.getElementById('filterType').value;
    const priceFilter = document.getElementById('filterPrice').value;
    const frequencyFilter = document.getElementById('filterFrequency').value;

    const prefs = {
        types: typeFilter ? [typeFilter] : [],
        prices: priceFilter ? [priceFilter] : [],
        frequencies: frequencyFilter ? [frequencyFilter] : []
    };
    saveUserPreferences(prefs);

    renderAdaptiveLotteries();
}

// Получить цену в число для фильтрации
function getPriceRange(priceString) {
    if (priceString === '50-100') return { min: 50, max: 100 };
    if (priceString === '100-200') return { min: 100, max: 200 };
    if (priceString === '200+') return { min: 200, max: 10000 };
    return { min: 0, max: 10000 };
}

// Открыть лотерею в новой вкладке
function openLottery(url, lotteryName) {
    recordLotteryClick(lotteryName);
    window.open(url, '_blank');
    
    // Показать модальное окно оценки через 3 секунды
    setTimeout(() => {
        showRatingModal(lotteryName);
    }, 3000);
}

// Показать модальное окно оценки
function showRatingModal(lotteryName) {
    const userRatings = getUserRatings();
    
    if (userRatings[lotteryName]) {
        return; // Уже оценил
    }
    
    let selectedRating = 0;
    
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
        <div class="rating-card" style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
            border: 2px solid rgba(99, 102, 241, 0.4);
            border-radius: 20px;
            padding: 2.5rem;
            max-width: 450px;
            width: 90%;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
        ">
            <h3 style="
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            ">Оцените лотерею</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Как вам лотерея "${lotteryName}"?</p>
            
            <div class="rating-stars" style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem;">
                ${[1,2,3,4,5].map(star => `
                    <button class="star-btn" data-rating="${star}" style="
                        background: none;
                        border: none;
                        font-size: 2.5rem;
                        cursor: pointer;
                        color: var(--text-tertiary);
                        transition: all 0.3s ease;
                    ">★</button>
                `).join('')}
            </div>
            
            <div class="rating-text" style="color: var(--text-secondary); margin-bottom: 2rem; min-height: 1.5rem;">
                ${selectedRating === 0 ? 'Выберите оценку' : `Вы выбрали: ${selectedRating} звезд`}
            </div>
            
            <div class="rating-actions" style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-outline skip-rating" style="padding: 0.75rem 1.5rem;">Пропустить</button>
                <button class="btn btn-primary confirm-rating" style="padding: 0.75rem 1.5rem;" disabled>Подтвердить оценку</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const starsContainer = modal.querySelector('.rating-stars');
    const ratingText = modal.querySelector('.rating-text');
    const confirmBtn = modal.querySelector('.confirm-rating');
    const skipBtn = modal.querySelector('.skip-rating');
    const starButtons = starsContainer.querySelectorAll('.star-btn');
    
    // Функция обновления звезд
    function updateStars(rating) {
        starButtons.forEach((star, index) => {
            star.style.color = index < rating ? '#f59e0b' : 'var(--text-tertiary)';
            star.style.transform = index < rating ? 'scale(1.1)' : 'scale(1)';
        });
        ratingText.textContent = rating === 0 ? 'Выберите оценку' : `Вы выбрали: ${rating} звезд`;
        confirmBtn.disabled = rating === 0;
    }
    
    // Обработчики для звезд
    starButtons.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStars(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            updateStars(hoverRating);
        });
        
        star.addEventListener('mouseleave', function() {
            updateStars(selectedRating);
        });
    });
    
    // Кнопка подтверждения
    confirmBtn.addEventListener('click', function() {
        if (selectedRating > 0) {
            saveUserRating(lotteryName, selectedRating);
            
            // Показываем сообщение об успехе
            ratingText.innerHTML = `<span style="color: var(--success)">✅ Спасибо за вашу оценку!</span>`;
            confirmBtn.style.display = 'none';
            skipBtn.textContent = 'Закрыть';
            
            setTimeout(() => {
                modal.remove();
            }, 1500);
        }
    });
    
    // Кнопка пропуска/закрытия
    skipBtn.addEventListener('click', function() {
        modal.remove();
    });
}

// Рендеринг секции с оценками пользователя
function renderUserRatingsSection() {
    const userRatings = getUserRatings();
    const ratedLotteries = Object.keys(userRatings);
    
    let recommendationsSection = document.querySelector('.recommendations-section');
    
    if (ratedLotteries.length === 0) {
        // Если оценок нет, показываем призыв оценить
        recommendationsSection.innerHTML = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 class="section-title">Ваши оценки</h2>
            </div>
            <div class="empty-ratings" style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
                <h3 style="color: var(--text); margin-bottom: 0.5rem;">Оцените лотереи</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Перейдите по ссылкам на лотереи и оставьте свои оценки, чтобы они появились здесь</p>
            </div>
        `;
    } else {
        // Показываем оценки пользователя
        recommendationsSection.innerHTML = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 class="section-title">Ваши оценки</h2>
                <button class="btn btn-outline" onclick="resetAllRatings()" style="font-size: 0.8rem; padding: 0.5rem 1rem;">
                    🗑️ Сбросить все
                </button>
            </div>
            <div class="recommendation-grid">
                ${ratedLotteries.map(lotteryName => {
                    const lottery = lotteries.find(l => l.name === lotteryName);
                    const userRating = userRatings[lotteryName];
                    
                    if (!lottery) return '';
                    
                    return `
                        <div class="recommendation-card rated-card" onclick="openLottery('${lottery.url}', '${lottery.name}')">
                            <div class="recommendation-icon">${getLotteryIcon(lottery.type)}</div>
                            <div class="recommendation-text">${lottery.name}</div>
                            <div class="user-rating-stars" style="display: flex; justify-content: center; gap: 0.2rem; margin: 0.5rem 0;">
                                ${[...Array(5)].map((_, i) => `
                                    <span style="color: ${i < userRating ? '#f59e0b' : 'var(--text-tertiary)'}; font-size: 1.2rem;">★</span>
                                `).join('')}
                            </div>
                            <div class="recommendation-desc">${lottery.price} ₽ • ${lottery.jackpot}</div>
                            <div class="rating-date" style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                                Ваша оценка: ${userRating}/5
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Добавляем стили для карточек с оценками
    if (!document.querySelector('#ratings-styles')) {
        const style = document.createElement('style');
        style.id = 'ratings-styles';
        style.textContent = `
            .rated-card {
                position: relative;
                border: 1.5px solid rgba(245, 158, 11, 0.3) !important;
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(99, 102, 241, 0.05)) !important;
            }
            
            .rated-card:hover {
                border-color: rgba(245, 158, 11, 0.6) !important;
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.1)) !important;
                transform: translateY(-6px);
                box-shadow: 0 15px 40px rgba(245, 158, 11, 0.25);
            }
            
            .empty-ratings {
                background: rgba(30, 41, 59, 0.4);
                border-radius: 14px;
                border: 1.5px dashed rgba(99, 102, 241, 0.3);
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
        `;
        document.head.appendChild(style);
    }
}

// Получить иконку для типа лотереи
function getLotteryIcon(type) {
    const icons = {
        'классическое': '🎰',
        'числовое': '🔢',
        'быстрое': '⚡',
        'моментальное': '🎯',
        'премиум': '💎'
    };
    return icons[type] || '🎲';
}

// Основная функция: отрендерить лотереи с учетом истории и фильтров
function renderAdaptiveLotteries() {
    const grid = document.getElementById('lotteriesGrid');
    grid.innerHTML = '';

    const typeFilter = document.getElementById('filterType').value;
    const priceFilter = document.getElementById('filterPrice').value;
    const frequencyFilter = document.getElementById('filterFrequency').value;
    const history = getUserHistory();
    const userRatings = getUserRatings();

    // Применить фильтры
    let filtered = lotteries.filter(lottery => {
        if (typeFilter && lottery.type !== typeFilter) return false;
        if (frequencyFilter && lottery.frequency !== frequencyFilter) return false;
        
        if (priceFilter) {
            const range = getPriceRange(priceFilter);
            if (lottery.price < range.min || lottery.price > range.max) return false;
        }
        
        return true;
    });

    // Сортировать только по истории просмотров (рейтинги не влияют на сортировку)
    filtered.sort((a, b) => {
        const countA = history[a.name] || 0;
        const countB = history[b.name] || 0;
        
        if (countA !== countB) return countB - countA;
        return b.rating - a.rating;
    });

    // Отрендерить карточки (БЕЗ плашки с оценкой)
    filtered.forEach(lottery => {
        const playCount = history[lottery.name] || 0;
        
        const card = document.createElement('div');
        card.className = 'lottery-card';
        
        card.innerHTML = `
            <div class="lottery-header">
                <div class="lottery-title">${lottery.name}</div>
                <div class="lottery-date">${lottery.drawDate}</div>
            </div>
            <div class="lottery-body">
                <div class="lottery-tags">
                    ${lottery.tags.map(tag => {
                        const tagClass = tag === 'hot' ? 'hot' : tag === 'popular' ? 'popular' : '';
                        return `<span class="tag ${tagClass}">${tag}</span>`;
                    }).join('')}
                </div>
                <div class="lottery-stats">
                    <div class="stat-item">
                        <span class="stat-label">Цена</span>
                        <span class="stat-value">${lottery.price} ₽</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Джекпот</span>
                        <span class="stat-value">${lottery.jackpot}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Шанс</span>
                        <span class="stat-value">${lottery.probability}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Рейтинг</span>
                        <span class="stat-value">${lottery.rating} ⭐</span>
                    </div>
                </div>
                <div class="lottery-rating">
                    <div class="stars">
                        ${[...Array(5)].map((_, i) => `<span class="star">${i < Math.floor(lottery.rating) ? '★' : '☆'}</span>`).join('')}
                    </div>
                    <span class="rating-count">${Math.floor(lottery.rating * 1000)} оценок</span>
                </div>
                <div class="lottery-actions">
                    <button class="btn btn-secondary" onclick="openLottery('${lottery.url}', '${lottery.name}')">Подробнее</button>
                    <button class="btn btn-primary" onclick="openLottery('${lottery.url}', '${lottery.name}')">Купить билет</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterByCategory(element) {
    document.querySelectorAll('.category-badge').forEach(badge => badge.classList.remove('active'));
    element.classList.add('active');
    
    const filter = element.textContent.trim().split(' ').pop().toLowerCase();
    renderAdaptiveLotteries();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Показываем согласие на cookies
    showCookieConsent();
    
    renderAdaptiveLotteries();
    renderUserRatingsSection();
});