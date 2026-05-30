const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-scroll-progress]");
const tabs = document.querySelectorAll("[data-service]");
const panel = document.querySelector("[data-panel]");
const revealItems = document.querySelectorAll(".scroll-reveal");
const parallaxItems = document.querySelectorAll(".parallax-media");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const services = {
  therapy: {
    label: "Individual Therapy",
    title: "Private, focused therapy for high-achieving lives.",
    body:
      "Deepen self-understanding, identify patterns, and build emotional resilience without flattening ambition or drive.",
    bullets: [
      "Stress, identity, and transition work",
      "Support for performance pressure and burnout",
      "Secure online sessions",
    ],
  },
  coaching: {
    label: "Performance Coaching",
    title: "Mental skills and clarity for people built to perform.",
    body:
      "A structured coaching space for ambitious people who want sharper focus, stronger routines, better recovery, and a healthier relationship with excellence.",
    bullets: [
      "Athletes, executives, founders, and artists",
      "Goal architecture and accountability",
      "Pressure, focus, confidence, and recovery",
    ],
  },
  assessment: {
    label: "Psychological Assessments",
    title: "Clearer answers for diagnosis, treatment, and self-understanding.",
    body:
      "Assessment services can help clarify ADHD, autism spectrum concerns, personality patterns, and broader diagnostic questions when a fuller picture is needed.",
    bullets: [
      "ADHD and autism evaluations",
      "Personality and diagnostic clarification",
      "Practical recommendations and reports",
    ],
  },
};

let ticking = false;

const updateScrollEffects = () => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = maxScroll > 0 ? scrollY / maxScroll : 0;

  header?.classList.toggle("scrolled", scrollY > 18);
  progress?.style.setProperty("--scroll-progress", progressValue.toFixed(4));

  if (!reduceMotion.matches) {
    const viewportHeight = window.innerHeight;

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.bottom < -120 || rect.top > viewportHeight + 120) {
        return;
      }

      const itemCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const offset = ((viewportCenter - itemCenter) / viewportHeight) * 22;

      item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });
  }

  ticking = false;
};

const requestScrollUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
};

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -14% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

const handleReducedMotionChange = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  parallaxItems.forEach((item) => item.style.setProperty("--parallax-y", "0px"));
  requestScrollUpdate();
};

if (typeof reduceMotion.addEventListener === "function") {
  reduceMotion.addEventListener("change", handleReducedMotionChange);
} else if (typeof reduceMotion.addListener === "function") {
  reduceMotion.addListener(handleReducedMotionChange);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = services[tab.dataset.service];

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    panel.innerHTML = `
      <p class="panel-label">${selected.label}</p>
      <h3>${selected.title}</h3>
      <p>${selected.body}</p>
      <ul>
        ${selected.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    `;
  });
});

updateScrollEffects();

window.setTimeout(() => {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}, 0);
