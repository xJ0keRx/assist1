function getLotteriesData() {
    const gridElement = document.getElementById('lotteriesGrid');
    if (gridElement && gridElement.dataset.lotteries) {
        return JSON.parse(gridElement.dataset.lotteries);
    }
    return []; // или fallback на статические данные
}

const lotteries = getLotteriesData();

// ========== ФУНКЦИОНАЛ СРАВНЕНИЯ ==========

// Получить список лотерей для сравнения
function getComparisonList() {
    const consent = getStorage("cookieConsent");
    if (consent === false) {
        return [];
    }
    
    return getStorage("comparisonList") || [];
}

// Сохранить список сравнения
function saveComparisonList(list) {
    setStorage("comparisonList", list);
}

// Добавить/удалить лотерею из сравнения
function toggleComparison(lotteryName) {
    let comparisonList = getComparisonList();
    const index = comparisonList.indexOf(lotteryName);
    
    if (index > -1) {
        // Удалить из сравнения
        comparisonList.splice(index, 1);
    } else {
        // Добавить в сравнение
        comparisonList.push(lotteryName);
    }
    
    saveComparisonList(comparisonList);
    updateComparisonUI();
}

// Обновить UI сравнения
function updateComparisonUI() {
    const comparisonList = getComparisonList();
    const compareBtn = document.getElementById("compareBtn");
    const compareCount = comparisonList.length;
    
    // Обновляем кнопки добавления в сравнение
    document.querySelectorAll('.compare-btn').forEach(btn => {
        const lotteryName = btn.getAttribute('data-lottery');
        if (comparisonList.includes(lotteryName)) {
            btn.innerHTML = '🗑️ Убрать из сравнения';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '⚖️ Добавить к сравнению';
            btn.classList.remove('active');
        }
    });
    
    // Обновляем кнопку перехода к сравнению
    if (compareCount > 0) {
        compareBtn.classList.remove('hidden');
        compareBtn.innerHTML = `⚖️ Перейти к сравнению (${compareCount})`;
        
        // Показываем уведомление если выбрано 2 или больше
        if (compareCount >= 2) {
            compareBtn.classList.add('pulse');
        } else {
            compareBtn.classList.remove('pulse');
        }
    } else {
        compareBtn.classList.add('hidden');
    }
}

// Переход к странице сравнения
function goToCompare() {
    const comparisonList = getComparisonList();
    if (comparisonList.length < 2) {
        alert('Для сравнения нужно выбрать хотя бы 2 лотереи');
        return;
    }
    
    // Показываем модальное окно с выбранными лотереями
    showComparisonModal();
}

// Показать модальное окно сравнения
function showComparisonModal() {
    const comparisonList = getComparisonList();
    const comparedLotteries = lotteries.filter(lottery => 
        comparisonList.includes(lottery.name)
    );

    const modal = document.createElement("div");
    modal.className = "comparison-modal";
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
        <div class="comparison-card" style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
            border: 2px solid rgba(99, 102, 241, 0.4);
            border-radius: 20px;
            padding: 2rem;
            max-width: 90%;
            max-height: 90vh;
            width: 800px;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                ">Сравнение лотерей</h3>
                <button class="btn btn-outline close-comparison" style="padding: 0.5rem 1rem;">✕</button>
            </div>
            
            <div class="comparison-table">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.3);">
                            <th style="padding: 1rem; text-align: left; color: var(--text);">Характеристика</th>
                            ${comparedLotteries.map(lottery => `
                                <th style="padding: 1rem; text-align: center; color: var(--text);">
                                    ${lottery.name}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.1);">
                            <td style="padding: 1rem; color: var(--text-secondary);">Цена билета</td>
                            ${comparedLotteries.map(lottery => `
                                <td style="padding: 1rem; text-align: center; color: var(--text);">
                                    ${lottery.price} ₽
                                </td>
                            `).join('')}
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.1);">
                            <td style="padding: 1rem; color: var(--text-secondary);">Джекпот</td>
                            ${comparedLotteries.map(lottery => `
                                <td style="padding: 1rem; text-align: center; color: var(--text);">
                                    ${lottery.jackpot}
                                </td>
                            `).join('')}
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.1);">
                            <td style="padding: 1rem; color: var(--text-secondary);">Частота розыгрышей</td>
                            ${comparedLotteries.map(lottery => `
                                <td style="padding: 1rem; text-align: center; color: var(--text);">
                                    ${lottery.drawDate}
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button class="btn btn-outline clear-comparison" style="padding: 0.75rem 1.5rem;">
                    🗑️ Очистить сравнение
                </button>
                <button class="btn btn-primary close-comparison" style="padding: 0.75rem 1.5rem;">
                    Закрыть
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработчики событий
    modal.querySelector('.close-comparison').addEventListener('click', function() {
        modal.remove();
    });

    modal.querySelector('.clear-comparison').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить список сравнения?')) {
            saveComparisonList([]);
            updateComparisonUI();
            modal.remove();
        }
    });

    // Закрытие по клику на оверлей
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Создать HTML для кнопки сравнения
function createCompareButtonHTML(lotteryName) {
    const comparisonList = getComparisonList();
    const isInComparison = comparisonList.includes(lotteryName);
    
    return `
        <button class="btn btn-outline compare-btn hover-only" 
                data-lottery="${lotteryName}"
                onclick="toggleComparison('${lotteryName}')">
            ${isInComparison ? '🗑️ Убрать из сравнения' : '⚖️ Добавить к сравнению'}
        </button>
    `;
}

// ========== COOKIE СОГЛАСИЕ ==========
function showCookieConsent() {
  const consent = getStorage("cookieConsent");
  if (consent) return; // Уже дано согласие

  const cookieBanner = document.createElement("div");
  cookieBanner.className = "cookie-consent";
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
  cookieBanner
    .querySelector(".accept-cookies")
    .addEventListener("click", function () {
      setStorage("cookieConsent", true);
      cookieBanner.style.display = "none";
    });

  cookieBanner
    .querySelector(".reject-cookies")
    .addEventListener("click", function () {
      setStorage("cookieConsent", false);
      // Очищаем все данные при отклонении
      localStorage.removeItem("userLotteryHistory");
      localStorage.removeItem("userLotteryRatings");
      localStorage.removeItem("userPreferences");
      localStorage.removeItem("comparisonList");
      cookieBanner.style.display = "none";
    });
}

// ========== РАБОТА С LOCALSTORAGE ==========
function setStorage(key, value) {
  try {
    // Проверяем согласие на cookies
    const consent = getStorage("cookieConsent");
    if (consent === false) {
      console.log("Cookies rejected by user");
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
    console.log("Saved to localStorage:", key, value);
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

function getStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return null;
  }
}

// Получить историю лотерей пользователя
function getUserHistory() {
  // Проверяем согласие на cookies
  const consent = getStorage("cookieConsent");
  if (consent === false) {
    return {};
  }

  let history = getStorage("userLotteryHistory");
  return history || {};
}

// Получить рейтинги пользователя
function getUserRatings() {
  // Проверяем согласие на cookies
  const consent = getStorage("cookieConsent");
  if (consent === false) {
    return {};
  }

  let ratings = getStorage("userLotteryRatings");
  return ratings || {};
}

// Записать, что пользователь кликнул на лотерею
function recordLotteryClick(lotteryName) {
  let history = getUserHistory();
  history[lotteryName] = (history[lotteryName] || 0) + 1;
  setStorage("userLotteryHistory", history);
}

// Сохранить рейтинг пользователя
function saveUserRating(lotteryName, rating) {
  let ratings = getUserRatings();
  ratings[lotteryName] = rating;
  setStorage("userLotteryRatings", ratings);

  // Обновляем отображение и секцию оценок
  renderAdaptiveLotteries();
  renderUserRatingsSection();
}

// Сбросить все оценки
function resetAllRatings() {
  if (confirm("Вы уверены, что хотите удалить все ваши оценки?")) {
    setStorage("userLotteryRatings", {});
    renderAdaptiveLotteries();
    renderUserRatingsSection();
    alert("Все оценки успешно удалены!");
  }
}

// Получить предпочтения пользователя
function getUserPreferences() {
  // Проверяем согласие на cookies
  const consent = getStorage("cookieConsent");
  if (consent === false) {
    return { types: [], prices: [], frequencies: [] };
  }

  return (
    getStorage("userPreferences") || { types: [], prices: [], frequencies: [] }
  );
}

// Сохранить предпочтения
function saveUserPreferences(prefs) {
  setStorage("userPreferences", prefs);
}

// Открыть лотерею в новой вкладке
function openLottery(url, lotteryName) {
  recordLotteryClick(lotteryName);
  window.open(url, "_blank");

  // Показывать модальное окно оценки через 3 секунды
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

  const modal = document.createElement("div");
  modal.className = "rating-modal";
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
                ${[1, 2, 3, 4, 5]
                  .map(
                    (star) => `
                    <button class="star-btn" data-rating="${star}" style="
                        background: none;
                        border: none;
                        font-size: 2.5rem;
                        cursor: pointer;
                        color: var(--text-tertiary);
                        transition: all 0.3s ease;
                    ">★</button>
                `
                  )
                  .join("")}
            </div>
            
            <div class="rating-text" style="color: var(--text-secondary); margin-bottom: 2rem; min-height: 1.5rem;">
                ${
                  selectedRating === 0
                    ? "Выберите оценку"
                    : `Вы выбрали: ${selectedRating} звезд`
                }
            </div>
            
            <div class="rating-actions" style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-outline skip-rating" style="padding: 0.75rem 1.5rem;">Пропустить</button>
                <button class="btn btn-primary confirm-rating" style="padding: 0.75rem 1.5rem;" disabled>Подтвердить оценку</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  const starsContainer = modal.querySelector(".rating-stars");
  const ratingText = modal.querySelector(".rating-text");
  const confirmBtn = modal.querySelector(".confirm-rating");
  const skipBtn = modal.querySelector(".skip-rating");
  const starButtons = starsContainer.querySelectorAll(".star-btn");

  // Функция обновления звезд
  function updateStars(rating) {
    starButtons.forEach((star, index) => {
      star.style.color = index < rating ? "#f59e0b" : "var(--text-tertiary)";
      star.style.transform = index < rating ? "scale(1.1)" : "scale(1)";
    });
    ratingText.textContent =
      rating === 0 ? "Выберите оценку" : `Вы выбрали: ${rating} звезд`;
    confirmBtn.disabled = rating === 0;
  }

  // Обработчики для звезд
  starButtons.forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-rating"));
      updateStars(selectedRating);
    });

    star.addEventListener("mouseenter", function () {
      const hoverRating = parseInt(this.getAttribute("data-rating"));
      updateStars(hoverRating);
    });

    star.addEventListener("mouseleave", function () {
      updateStars(selectedRating);
    });
  });

  // Кнопка подтверждения
  confirmBtn.addEventListener("click", function () {
    if (selectedRating > 0) {
      saveUserRating(lotteryName, selectedRating);

      // Показываем сообщение об успехе
      ratingText.innerHTML = `<span style="color: var(--success)">✅ Спасибо за вашу оценку!</span>`;
      confirmBtn.style.display = "none";
      skipBtn.textContent = "Закрыть";

      setTimeout(() => {
        modal.remove();
      }, 1500);
    }
  });

  // Кнопка пропуска/закрытия
  skipBtn.addEventListener("click", function () {
    modal.remove();
  });
}

// Рендеринг секции с оценками пользователя
function renderUserRatingsSection() {
  const userRatings = getUserRatings();
  const ratedLotteries = Object.keys(userRatings);

  let recommendationsSection = document.querySelector(
    ".recommendations-section"
  );

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
                ${ratedLotteries
                  .map((lotteryName) => {
                    const lottery = lotteries.find(
                      (l) => l.name === lotteryName
                    );
                    const userRating = userRatings[lotteryName];

                    if (!lottery) return "";

                    return `
                        <div class="recommendation-card rated-card" onclick="openLottery('${
                          lottery.url
                        }', '${lottery.name}')">
                            <div class="recommendation-icon">${getLotteryIcon(
                              lottery.type
                            )}</div>
                            <div class="recommendation-text">${
                              lottery.name
                            }</div>
                            <div class="user-rating-stars" style="display: flex; justify-content: center; gap: 0.2rem; margin: 0.5rem 0;">
                                ${[...Array(5)]
                                  .map(
                                    (_, i) => `
                                    <span style="color: ${
                                      i < userRating
                                        ? "#f59e0b"
                                        : "var(--text-tertiary)"
                                    }; font-size: 1.2rem;">★</span>
                                `
                                  )
                                  .join("")}
                            </div>
                            <div class="recommendation-desc">${
                              lottery.price
                            } ₽ • ${lottery.jackpot}</div>
                            <div class="rating-date" style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                                Ваша оценка: ${userRating}/5
                            </div>
                        </div>
                    `;
                  })
                  .join("")}
            </div>
        `;
  }

  // Добавляем стили для карточек с оценками
  if (!document.querySelector("#ratings-styles")) {
    const style = document.createElement("style");
    style.id = "ratings-styles";
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
    классическое: "🎰",
    числовое: "🔢",
    быстрое: "⚡",
    моментальное: "🎯",
    премиум: "💎",
  };
  return icons[type] || "🎲";
}

// Основная функция: отрендерить лотереи в исходном порядке
function renderAdaptiveLotteries() {
  const grid = document.getElementById("lotteriesGrid");
  grid.innerHTML = "";

  // Просто рендерим все лотереи в том порядке, в котором они пришли
  lotteries.forEach((lottery) => {
    const card = document.createElement("div");
    card.className = "lottery-card";

    card.innerHTML = `
            <div class="lottery-header">
                <div class="lottery-title">${lottery.name}</div>
                <div class="lottery-date">${lottery.drawDate}</div>
            </div>
            <div class="lottery-body">
                <div class="lottery-stats">
                    <div class="stat-item">
                        <span class="stat-label">Цена</span>
                        <span class="stat-value">${lottery.price} ₽</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Джекпот</span>
                        <span class="stat-value">${lottery.jackpot}</span>
                    </div>
                </div>
                <div class="lottery-actions">
                    <button class="btn btn-secondary" onclick="openLottery('${
                      lottery.url
                    }', '${lottery.name}')">Подробнее</button>
                    <button class="btn btn-primary" onclick="openLottery('${
                      lottery.url
                    }', '${lottery.name}')">Купить билет</button>
                </div>
                <!-- Контейнер для кнопки сравнения (появляется при наведении) -->
                <div class="compare-hover-container">
                    ${createCompareButtonHTML(lottery.name)}
                </div>
            </div>
        `;

    grid.appendChild(card);
  });

  // Обновляем UI сравнения после рендера
  updateComparisonUI();
}

function filterByCategory(element) {
  document
    .querySelectorAll(".category-badge")
    .forEach((badge) => badge.classList.remove("active"));
  element.classList.add("active");

  // Теперь категории просто меняют активное состояние, но не влияют на отображение
  // Можно оставить для визуального оформления или полностью удалить функционал
  renderAdaptiveLotteries();
}

let currentVisibleCount = 7;

function showMoreInstantLotteries() {
  const instantCards = document.querySelectorAll(".instant-image-card");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const showMoreContainer = document.getElementById("showMoreContainer");

  // Показываем следующую порцию карточек
  currentVisibleCount += 7;

  // Показываем карточки до текущего лимита
  instantCards.forEach((card, index) => {
    if (index < currentVisibleCount) {
      card.style.display = "block";
    }
  });

  // Скрываем кнопку если все карточки показаны
  if (currentVisibleCount >= instantCards.length) {
    showMoreContainer.classList.add("hidden");
  }
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
// Показ модального окна
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

// Скрытие модального окна
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Проверка, новый ли пользователь
function isNewUser() {
    return !localStorage.getItem('userVisited');
}

// Отметить пользователя как вернувшегося
function markUserAsReturning() {
    localStorage.setItem('userVisited', 'true');
}

// Инициализация модальных окон при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, новый ли пользователь
        // Показываем приветственное окно для новых пользователей
        setTimeout(() => {
            showModal('welcomeModal');
        }, 1200);
      

    // Обработчики для модального окна приветствия
    document.getElementById('newUserBtn').addEventListener('click', function () {
        markUserAsReturning();
        hideModal('welcomeModal');
        // Если пользователь ответил "Да, я новичок" - перекидываем на опрос
        setTimeout(() => {
            window.location.href = '/quests';
        }, 300);
    });

    document.getElementById('oldUserBtn').addEventListener('click', function () {
        markUserAsReturning();
        hideModal('welcomeModal');
        // Для старых пользователей тоже можно перекинуть на опрос или оставить на сайте
        // window.location.href = '/survey'; // раскомментируй если нужно
    });

    // Закрытие модального окна при клике на оверлей
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });

    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    hideModal(modal.id);
                }
            });
        }
    });
});

// ========== ФУНКЦИОНАЛ ПОИСКА ==========

// Выполнение поиска
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        alert('Введите поисковый запрос');
        return;
    }
    
    // Показываем индикатор загрузки
    showSearchLoading(true);
    
    // Выполняем AJAX запрос к серверу
    fetch(`/api/search/?q=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            showSearchLoading(false);
            
            if (data.success) {
                displaySearchResults(data.results, searchTerm);
            } else {
                alert('Ошибка поиска: ' + data.error);
            }
        })
        .catch(error => {
            showSearchLoading(false);
            console.error('Ошибка поиска:', error);
            alert('Произошла ошибка при поиске');
        });
}

// Показать/скрыть индикатор загрузки
function showSearchLoading(show) {
    const searchBox = document.querySelector('.hero-search-box');
    const existingLoader = searchBox.querySelector('.search-loading');
    
    if (show) {
        if (!existingLoader) {
            const loader = document.createElement('div');
            loader.className = 'search-loading';
            loader.innerHTML = '🔍 Поиск...';
            loader.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(30, 41, 59, 0.95);
                padding: 0.5rem;
                border-radius: 8px;
                margin-top: 5px;
                text-align: center;
                color: var(--text);
                z-index: 1000;
            `;
            searchBox.style.position = 'relative';
            searchBox.appendChild(loader);
        }
    } else {
        if (existingLoader) {
            existingLoader.remove();
        }
    }
}

// Отображение результатов поиска
function displaySearchResults(results, searchTerm) {
    // Создаем модальное окно для результатов
    const modal = document.createElement('div');
    modal.className = 'search-results-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.95);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 10000;
        backdrop-filter: blur(10px);
        padding: 2rem;
        overflow-y: auto;
    `;

    if (results.length === 0) {
        modal.innerHTML = `
            <div class="search-results-card" style="
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
                border: 2px solid rgba(99, 102, 241, 0.4);
                border-radius: 20px;
                padding: 3rem;
                max-width: 500px;
                width: 100%;
                text-align: center;
                margin-top: 10vh;
            ">
                <h3 style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                ">Ничего не найдено</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    По запросу "<strong>${searchTerm}</strong>" ничего не найдено.
                </p>
                <button class="btn btn-primary close-search-results" style="padding: 0.75rem 1.5rem;">
                    Закрыть
                </button>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="search-results-card" style="
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9));
                border: 2px solid rgba(99, 102, 241, 0.4);
                border-radius: 20px;
                padding: 2rem;
                max-width: 800px;
                width: 100%;
                margin-top: 5vh;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="
                        font-family: 'Orbitron', sans-serif;
                        font-size: 1.5rem;
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                    ">
                        Результаты поиска
                    </h3>
                    <span style="color: var(--text-secondary);">
                        Найдено: ${results.length}
                    </span>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--text-secondary);">
                        По запросу: "<strong style="color: var(--text);">${searchTerm}</strong>"
                    </p>
                </div>
                
                <div class="search-results-list" style="display: flex; flex-direction: column; gap: 1rem;">
                    ${results.map((lottery, index) => `
                        <div class="search-result-item" style="
                            background: rgba(255, 255, 255, 0.05);
                            border: 1.5px solid rgba(99, 102, 241, 0.2);
                            border-radius: 12px;
                            padding: 1.5rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        " onclick="openLottery('${lottery.url}', '${lottery.name}')">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h4 style="
                                        color: var(--text);
                                        margin-bottom: 0.5rem;
                                        font-family: 'Orbitron', sans-serif;
                                    ">${lottery.display_name}</h4>
                                    <div style="display: flex; gap: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                                        <span>Тип: ${lottery.type}</span>
                                        <span>Джекпот: ${lottery.jackpot || 'Не указан'}</span>
                                    </div>
                                </div>
                                ${lottery.is_duplicate ? `
                                    <div style="
                                        background: rgba(245, 158, 11, 0.2);
                                        color: #f59e0b;
                                        padding: 0.3rem 0.6rem;
                                        border-radius: 6px;
                                        font-size: 0.8rem;
                                        font-weight: 600;
                                    ">
                                        Дубликат
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 2rem;">
                    <button class="btn btn-outline close-search-results" style="padding: 0.75rem 1.5rem;">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
    }

    document.body.appendChild(modal);

    // Обработчики событий
    modal.querySelector('.close-search-results').addEventListener('click', function() {
        modal.remove();
    });

    // Закрытие по клику на оверлей
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    

    // Закрытие по Escape
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
}

// ========== ОБНОВЛЕННАЯ ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener("DOMContentLoaded", () => {
    // Показываем согласие на cookies
    showCookieConsent();
    
    const instantCards = document.querySelectorAll(".instant-image-card");
    const showMoreContainer = document.getElementById("showMoreContainer");
    instantCards.forEach((card, index) => {
        if (index >= 7) {
            card.style.display = "none";
        }
    });

    // Скрываем кнопку если карточек меньше 7
    if (instantCards.length <= 7) {
        showMoreContainer.classList.add("hidden");
    }

    renderAdaptiveLotteries();
    renderUserRatingsSection();
    updateComparisonUI();

    // Обработчик нажатия Enter в поле поиска
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Обработчик изменения в поле поиска (опционально - можно сделать live search)
    document.getElementById('searchInput').addEventListener('input', function(e) {
        // Здесь можно добавить live search с debounce
        // const query = e.target.value.trim();
        // if (query.length >= 2) {
        //     performLiveSearch(query);
        // }
    });
});

// Функция для live search (опционально)
function performLiveSearch(query) {
    // Аналогично performSearch, но с debounce и без модального окна
    // Можно показывать результаты прямо под поисковой строкой
}
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
  }
)