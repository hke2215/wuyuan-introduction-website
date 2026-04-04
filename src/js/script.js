document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const handleScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }

  const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    ".season-card, .highlight-card, .arch-card, .culture-card, " +
      ".village-item, .timeline-item, .poetry-content, .section-header",
  );
  animateElements.forEach((el, i) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
