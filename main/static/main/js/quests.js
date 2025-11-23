const surveyConfig = {
  questions: [
    {
      question: "Какой формат игры вам ближе?",
      answers: [
        "Классические числовые лотереи (выбираю числа)",
        "Быстрые мгновенные лотереи (скрейч-карты)",
        "Лотереи с дополнительными бонусными играми",
        "Все форматы интересны, главное - шанс выиграть",
      ],
      multiple: false,
    },
    {
      question: "Какую сумму вы обычно готовы потратить на лотерейный билет?",
      answers: [
        "До 300 рублей",
        "300-500 рублей",
        "500-1000 рублей",
        "Более 1000 рублей",
      ],
      multiple: false,
    },
    {
      question: "Насколько важен для вас суперприз??",
      answers: [
        "Очень важен - играю только за крупный джекпот",
        "Важен, но небольшие выигрыши тоже радуют",
        "Не главное - чаще играю ради процесса и эмоций",
        "Предпочитаю лотереи с частыми, но меньшими выигрышами",
      ],
      multiple: true,
    },
    {
      question: "Сколько времени готовы уделять лотерее?",
      answers: [
        "Минимальное - мгновенный результат",
        "5-15 минут на заполнение и проверку",
        "Готов изучать стратегии и анализировать",
        "ТВремя не имеет значения, главное - результат",
      ],
      multiple: true,
    },
    {
      question: "Что для вас важнее в призах?",
      answers: [
        "Только денежные выигрыши",
        "Деньги плюс дополнительные бонусы",
        "Интересные неденежные призы (техника, путешествия)",
        "Любые призы, главное - выигрывать",
      ],
      multiple: true,
    },
    {
      question: "Как часто предпочитаете играть?",
      answers: [
        "Ежедневно - быстрые розыгрыши",
        "1-2 раза в неделю - регулярно, но не частот",
        "По настроению или особым случаям",
        "Только когда накапливается крупный джекпот",
      ],
      multiple: false,
    },
    {
      question: "Что больше мотивирует вас к игре?",
      answers: [
        "Возможность изменить жизнь крупным выигрышем",
        "Азарт и эмоции от процесса игры",
        "Развлечение и приятное времяпровождение",
        "Социальный аспект - игра с друзьями/коллегами",
      ],
      multiple: false,
    },
  ],
};

let currentQuestionIndex = 0;
let selectedAnswers = [];
let userAnswers = [];

const currentQuestionEl = document.getElementById("currentQuestion");
const answersContainerEl = document.getElementById("answersContainer");
const progressFillEl = document.getElementById("progressFill");
const progressPercentEl = document.getElementById("progressPercent");
const continueBtnEl = document.getElementById("continueBtn");

function initSurvey() {
  showQuestion(currentQuestionIndex);
  updateProgress();

  continueBtnEl.addEventListener("click", goToNextQuestion);

  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
}

function showQuestion(index) {
  const question = surveyConfig.questions[index];
  selectedAnswers = [];

  currentQuestionEl.textContent = question.question;
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

  continueBtnEl.disabled = !question.multiple;
}

function selectAnswer(answerIndex, answerEl, isMultiple) {
  if (isMultiple) {
    const index = selectedAnswers.indexOf(answerIndex);
    if (index === -1) {
      selectedAnswers.push(answerIndex);
      answerEl.classList.add("selected");
    } else {
      selectedAnswers.splice(index, 1);
      answerEl.classList.remove("selected");
    }
    continueBtnEl.disabled = false;
  } else {
    document.querySelectorAll(".answer-option").forEach((el) => {
      el.classList.remove("selected");
    });
    answerEl.classList.add("selected");
    selectedAnswers = [answerIndex];
    continueBtnEl.disabled = false;
  }
}

function goToNextQuestion() {
  if (selectedAnswers.length === 0) return;

  const currentQuestion = surveyConfig.questions[currentQuestionIndex];
  userAnswers.push({
    question: currentQuestion.question,
    answers: selectedAnswers.map((index) => currentQuestion.answers[index]),
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < surveyConfig.questions.length) {
    showQuestion(currentQuestionIndex);
    updateProgress();
  } else {
    completeSurvey();
  }
}

function updateProgress() {
  const progress = (currentQuestionIndex / surveyConfig.questions.length) * 100;
  progressFillEl.style.width = `${progress}%`;
  progressPercentEl.textContent = `${Math.round(progress)}%`;
}

// ОБНОВЛЕННАЯ ФУНКЦИЯ ЗАВЕРШЕНИЯ ОПРОСА
async function completeSurvey() {
  console.log("Опрос завершен! Ответы:", userAnswers);

  // Показываем загрузку
  continueBtnEl.disabled = true;
  continueBtnEl.textContent = "Формируем рекомендации...";

  try {
    // Отправляем ответы на сервер
    const response = await fetch('/process-questionnaire/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ answers: userAnswers })
    });

    const data = await response.json();

    if (data.success) {
      // Показываем успешное завершение
      currentQuestionEl.textContent = "🎉 Рекомендации готовы!";
      answersContainerEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">Мы подобрали для вас ${data.total_found} лотерей</p>
          <p>На основе ваших предпочтений система нашла идеальные варианты</p>
        </div>
      `;
      progressFillEl.style.width = "100%";
      progressPercentEl.textContent = "100%";
      continueBtnEl.textContent = "Смотреть рекомендации →";
      continueBtnEl.disabled = false;

      // Меняем обработчик для перехода на главную
      continueBtnEl.onclick = () => {
        window.location.href = "/";
      };
    } else {
      throw new Error(data.error);
    }

  } catch (error) {
    console.error('Ошибка:', error);
    currentQuestionEl.textContent = "😕 Произошла ошибка";
    answersContainerEl.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--error);">
        <p>Не удалось обработать ваши ответы. Попробуйте позже.</p>
      </div>
    `;
    continueBtnEl.textContent = "Вернуться на главную";
    continueBtnEl.onclick = () => {
      window.location.href = "/";
    };
  }
}

// Вспомогательная функция для CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document.addEventListener("DOMContentLoaded", initSurvey);