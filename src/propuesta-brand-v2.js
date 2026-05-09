const WHATSAPP_NUMBER = '56972200928';
const DEFAULT_WHATSAPP_MESSAGE = 'Hola, quiero cotizar una solucion digital para mi negocio.';

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
  link.setAttribute('href', buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE));
});

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks?.classList.toggle('is-open', !isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navLinks?.classList.remove('is-open');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});
