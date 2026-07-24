// Lumora Dental — vanilla JavaScript interactions and scroll animations
const header = document.querySelector("#siteHeader");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primaryMenu");
const navLinks = document.querySelectorAll(".nav-links a, .nav-menu .btn");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const progressBars = document.querySelectorAll(".progress-bar");
const accordion = document.querySelector("#faqAccordion");
const testimonialTrack = document.querySelector("#testimonialTrack");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const carouselDots = document.querySelector("#carouselDots");
const carouselButtons = document.querySelectorAll(".carousel-btn");
const backToTop = document.querySelector(".back-to-top");
const appointmentForm = document.querySelector(".appointment-form");
const currentYear = document.querySelector("#currentYear");
 
let activeSlide = 0;
let carouselTimer;
 
const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 620);
};
 
const closeMenu = () => {
  navToggle.classList.remove("active");
  navMenu.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
};
 
const openMenu = () => {
  navToggle.classList.add("active");
  navMenu.classList.add("active");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
  document.body.classList.add("menu-open");
};
 
const toggleMenu = () => {
  navMenu.classList.contains("active") ? closeMenu() : openMenu();
};
 
const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const startTime = performance.now();
 
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
 
    counter.textContent = `${value.toLocaleString()}${suffix}`;
 
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = `${target.toLocaleString()}${suffix}`;
    }
  };
 
  requestAnimationFrame(update);
};
 
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -42px 0px" });
 
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });
 
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const progress = entry.target.dataset.progress || "0";
      entry.target.style.width = `${progress}%`;
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });
 
const setAccordionHeight = (item) => {
  const button = item.querySelector("button");
  const panel = item.querySelector(".accordion-panel");
  const isOpen = button.getAttribute("aria-expanded") === "true";
  panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
};
 
const setActiveFaq = (selectedItem) => {
  accordion.querySelectorAll(".accordion-item").forEach((item) => {
    const button = item.querySelector("button");
    const shouldOpen = item === selectedItem && button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    setAccordionHeight(item);
  });
};
 
const buildCarouselDots = () => {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartCarousel();
    });
    carouselDots.appendChild(dot);
  });
};
 
const updateCarousel = () => {
  testimonialTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
  carouselDots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === activeSlide);
    dot.setAttribute("aria-current", index === activeSlide ? "true" : "false");
  });
};
 
function goToSlide(index) {
  activeSlide = (index + testimonialCards.length) % testimonialCards.length;
  updateCarousel();
}
 
const startCarousel = () => {
  carouselTimer = window.setInterval(() => goToSlide(activeSlide + 1), 5200);
};
 
const restartCarousel = () => {
  window.clearInterval(carouselTimer);
  startCarousel();
};
 
const addRipple = (event) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
 
  ripple.className = "ripple";
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
 
  button.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 700);
};
 
const handleFormSubmit = (event) => {
  event.preventDefault();
  const status = appointmentForm.querySelector(".form-status");
 
  status.textContent = "Thank you. Our care team will contact you shortly.";
  appointmentForm.reset();
};
 
currentYear.textContent = new Date().getFullYear();
setHeaderState();
revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  revealObserver.observe(element);
});
counters.forEach((counter) => counterObserver.observe(counter));
progressBars.forEach((bar) => progressObserver.observe(bar));
 
navToggle.addEventListener("click", toggleMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  document.querySelectorAll(".accordion-item").forEach(setAccordionHeight);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
 
accordion.querySelectorAll(".accordion-item").forEach((item) => {
  item.querySelector("button").addEventListener("click", () => setActiveFaq(item));
  setAccordionHeight(item);
});
 
buildCarouselDots();
updateCarousel();
startCarousel();
carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.slide === "next" ? 1 : -1;
    goToSlide(activeSlide + direction);
    restartCarousel();
  });
});
 
document.querySelectorAll(".ripple-btn").forEach((button) => {
  button.addEventListener("click", addRipple);
});
 
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 
appointmentForm.addEventListener("submit", handleFormSubmit);