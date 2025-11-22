const surveyConfig = {
  questions: [
    {
      question: "Как часто вы участвуете в лотереях?",
      answers: [
        "🔥 Регулярно, несколько раз в неделю",
        "⚡ Периодически, 1-2 раза в месяц",
        "💫 Редко, от случая к случаю",
        "🎯 Никогда не участвовал(а)",
      ],
      multiple: false,
    },
    {
      question: "Какую сумму вы обычно готовы потратить на лотерейный билет?",
      answers: [
        "💰 До 300 рублей",
        "💵 300-500 рублей",
        "💎 500-1000 рублей",
        "🏆 Более 1000 рублей",
      ],
      multiple: false,
    },
    {
      question: "Что для вас важнее в лотерее?",
      answers: [
        "🎊 Размер джекпота",
        "📊 Вероятность выигрыша",
        "⏰ Частота розыгрышей",
        "🎁 Дополнительные призы и акции",
      ],
      multiple: true,
    },
    {
      question: "В какие типы лотерей вы предпочитаете играть?",
      answers: [
        "🔢 Числовые (Гослото, Русское лото)",
        "⚡ Мгновенные лотереи",
        "⚽ Спортивные (Спортлото)",
        "🎪 Темаческие (Жилищная лотерея)",
      ],
      multiple: true,
    },
    {
      question: "Как вы обычно узнаете о результатах лотерей?",
      answers: [
        "🌐 Проверяю на официальном сайте",
        "📱 Получаю уведомления в приложении",
        "📺 Смотрю телевизионные розыгрыши",
        "🏪 Узнаю в точках продаж",
      ],
      multiple: true,
    },
    {
      question: "Любите ли вы что бы от вас что-то зависело",
      answers: [
        "💭 Да",
        "🎮 Больше да, чем нет",
        "🍀 Больше нет, чем да",
        "📜 Нет",
      ],
      multiple: false,
    },
    {
      question: "Готовы ли вы получать персонализированные предложения?",
      answers: [
        "✅ Да, хочу получать лучшие предложения",
        "⭐ Только самые выгодные варианты",
        "🎯 Предпочитаю выбирать самостоятельно",
        "❌ Нет, не хочу получать предложения",
      ],
      multiple: false,
    },
  ],
};

// Переменные состояния
let currentQuestionIndex = 0;
let selectedAnswers = [];
let userAnswers = [];

// Элементы DOM
const currentQuestionEl = document.getElementById("currentQuestion");
const answersContainerEl = document.getElementById("answersContainer");
const progressFillEl = document.getElementById("progressFill");
const progressPercentEl = document.getElementById("progressPercent");
const continueBtnEl = document.getElementById("continueBtn");

// Инициализация опросника
function initSurvey() {
  showQuestion(currentQuestionIndex);
  updateProgress();

  // Обработчик кнопки продолжения
  continueBtnEl.addEventListener("click", goToNextQuestion);

  // Плавное появление
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
}

// Показать вопрос
function showQuestion(index) {
  const question = surveyConfig.questions[index];
  selectedAnswers = [];

  // Обновляем вопрос (счетчик больше не обновляем)
  currentQuestionEl.textContent = question.question;

  // Очищаем и добавляем варианты ответов
  answersContainerEl.innerHTML = "";
  question.answers.forEach((answer, answerIndex) => {
    const answerEl = document.createElement("div");
    answerEl.className = "answer-option";
    answerEl.innerHTML = `
          <p class="answer-text">${answer}</p>
        `;

    answerEl.addEventListener("click", () =>
      selectAnswer(answerIndex, answerEl, question.multiple)
    );
    answersContainerEl.appendChild(answerEl);
  });

  // Сбрасываем кнопку продолжения
  continueBtnEl.disabled = !question.multiple; // Для множественного выбора кнопка активна сразу
}

// Выбор ответа
function selectAnswer(answerIndex, answerEl, isMultiple) {
  if (isMultiple) {
    // Множественный выбор
    const index = selectedAnswers.indexOf(answerIndex);
    if (index === -1) {
      // Добавляем ответ
      selectedAnswers.push(answerIndex);
      answerEl.classList.add("selected");
    } else {
      // Убираем ответ
      selectedAnswers.splice(index, 1);
      answerEl.classList.remove("selected");
    }

    // Для множественного выбора кнопка всегда активна
    continueBtnEl.disabled = false;
  } else {
    // Одиночный выбор
    // Снимаем выделение со всех ответов
    document.querySelectorAll(".answer-option").forEach((el) => {
      el.classList.remove("selected");
    });

    // Выделяем выбранный ответ
    answerEl.classList.add("selected");
    selectedAnswers = [answerIndex];

    // Активируем кнопку продолжения
    continueBtnEl.disabled = false;
  }
}

// Переход к следующему вопросу
function goToNextQuestion() {
  if (selectedAnswers.length === 0) return;

  // Сохраняем ответ
  const currentQuestion = surveyConfig.questions[currentQuestionIndex];
  userAnswers.push({
    questionIndex: currentQuestionIndex,
    answerIndexes: [...selectedAnswers],
    answerTexts: selectedAnswers.map((index) => currentQuestion.answers[index]),
    multiple: currentQuestion.multiple,
  });

  // Переходим к следующему вопросу или завершаем
  currentQuestionIndex++;

  if (currentQuestionIndex < surveyConfig.questions.length) {
    showQuestion(currentQuestionIndex);
    updateProgress();
  } else {
    completeSurvey();
  }
}

// Обновление прогресса
function updateProgress() {
  const progress = (currentQuestionIndex / surveyConfig.questions.length) * 100;
  progressFillEl.style.width = `${progress}%`;
  progressPercentEl.textContent = `${Math.round(progress)}%`;
}

// Завершение опроса
function completeSurvey() {
  console.log("Опрос завершен! Ответы:", userAnswers);

  // Сохраняем в localStorage
  localStorage.setItem("userLotteryPreferences", JSON.stringify(userAnswers));
  localStorage.setItem("surveyCompleted", "true");

  // Показываем сообщение о завершении
  currentQuestionEl.textContent = "🎉 Спасибо за прохождение опроса!";
  answersContainerEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">Ваши предпочтения сохранены!</p>
          <p>Теперь мы сможем подобрать для вас идеальные лотереи на основе ваших ответов.</p>
        </div>
      `;
  progressFillEl.style.width = "100%";
  progressPercentEl.textContent = "100%";
  continueBtnEl.textContent = "Перейти к лотереям";
  continueBtnEl.disabled = false;

  // Меняем обработчик для завершения
  continueBtnEl.onclick = () => {
    window.location.href = "/"; // Вернуться на главную
  };
}

// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", initSurvey);
