document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".lottery-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";

      // Анимация прогресс-баров внутри карточки
      const progressBars = card.querySelectorAll(".progress-fill");
      progressBars.forEach((bar, barIndex) => {
        const width = bar.style.width;
        bar.style.width = "0";

        setTimeout(() => {
          bar.style.transition = "width 1s ease-in-out";
          bar.style.width = width;
        }, barIndex * 200);
      });
    }, 300 + index * 200);
  });
});
