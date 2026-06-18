// ===== En-tête : ombre au défilement =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== Menu mobile =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

// Fermer le menu après un clic sur un lien
nav.querySelectorAll('a[href^="#"]').forEach((lien) => {
  lien.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ===== Animations à l'apparition =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ===== Formulaire de contact =====
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Pas de serveur branché : on confirme la prise en compte côté client.
  success.classList.add('visible');
  form.reset();
  setTimeout(() => success.classList.remove('visible'), 6000);
});
