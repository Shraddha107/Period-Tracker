document.querySelectorAll('.toggle-btn').forEach((button, index) => {
  button.addEventListener('click', () => {
    // Toggle button styles
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Slide background indicator
    const sliderBg = document.querySelector('.toggle-slider-bg');
    if (sliderBg) {
      sliderBg.style.left = index === 0 ? '6px' : 'calc(50% + 6px)';
    }

    // Toggle section visibility
    const selected = button.getAttribute('data-section');
    document.querySelectorAll('.toggle-section').forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(selected + 'Section');
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: targetSection.offsetTop - 20, behavior: 'smooth' });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  const suggestionsSection = document.getElementById("suggestions");
  const suggestionsList = document.getElementById("suggestionsList");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {};

    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }

    try {
      const res = await fetch("http://localhost:8000/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to get suggestions");

      const data = await res.json();

      suggestionsList.innerHTML = "";
      data.suggestions.forEach((tip) => {
        const li = document.createElement("li");
        li.textContent = tip;
        suggestionsList.appendChild(li);
      });

      suggestionsSection.hidden = false;
      window.scrollTo({ top: suggestionsSection.offsetTop - 20, behavior: "smooth" });

    } catch (error) {
      alert("Oops! Could not get suggestions, try again later.");
    }
  });
});
const surveyForm = document.getElementById("surveyForm");
const suggestionsBox = document.getElementById("suggestions");
const suggestionsList = document.getElementById("suggestionsList");

surveyForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const tips = [
    "Stay hydrated, girly. Water fixes everything.",
    "Track your cycle consistently for accurate results.",
    "Use a heating pad or try a warm bath to ease cramps.",
    "Light yoga stretches can help with mood swings.",
    "Cut down salty food during bloating days."
  ];
  suggestionsBox.hidden = false;
  suggestionsList.innerHTML = "";
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    suggestionsList.appendChild(li);
  });
});

// Myth-busting carousel logic
const cards = document.querySelectorAll(".myth-card");
let index = 0;

document.getElementById("prevMyth").addEventListener("click", () => {
  cards[index].classList.remove("active");
  index = (index - 1 + cards.length) % cards.length;
  cards[index].classList.add("active");
});

document.getElementById("nextMyth").addEventListener("click", () => {
  cards[index].classList.remove("active");
  index = (index + 1) % cards.length;
  cards[index].classList.add("active");
});