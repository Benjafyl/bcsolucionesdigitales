import './styles.css';

const WHATSAPP_NUMBER = '56972200928';
const DEFAULT_WHATSAPP_MESSAGE = 'Hola, quiero cotizar una solucion digital para mi negocio.';

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const quoteForm = document.querySelector('#quoteForm');
const formStatus = document.querySelector('.form-status');
const formLoadedAtField = document.querySelector('#formLoadedAt');
const pageLoadedAt = Date.now();

if (formLoadedAtField) {
  formLoadedAtField.value = String(pageLoadedAt);
}

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
    navLinks.classList.remove('is-open');
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

const validators = {
  name: (value) => (value.trim().length >= 2 ? '' : 'Ingresa tu nombre.'),
  company: (value) => (value.trim().length >= 2 ? '' : 'Ingresa el nombre de tu empresa o negocio.'),
  phone: (value) => (/^[+\d\s()-]{8,}$/.test(value.trim()) ? '' : 'Ingresa un telefono valido.'),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Ingresa un correo valido.'),
  service: (value) => (value ? '' : 'Selecciona un servicio de interes.'),
  message: (value) => (value.trim().length >= 10 ? '' : 'Describe brevemente tu proyecto.'),
  humanCheck: (value) => (value.trim().toUpperCase() === 'BYC' ? '' : 'Escribe BYC para validar el formulario.'),
};

function setFieldError(fieldName, message) {
  const errorNode = document.querySelector(`[data-error-for="${fieldName}"]`);
  const input = document.querySelector(`[name="${fieldName}"]`);

  if (errorNode) {
    errorNode.textContent = message;
  }

  input?.classList.toggle('has-error', Boolean(message));
}

function setFormStatus(message, statusClass = '') {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.className = `form-status${statusClass ? ` ${statusClass}` : ''}`;
}

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const values = Object.fromEntries(formData.entries());
  const botField = String(values.website || '').trim();
  const loadedAt = Number(values.formLoadedAt || pageLoadedAt);
  const elapsedSeconds = (Date.now() - loadedAt) / 1000;
  let firstInvalidField = null;

  if (botField) {
    setFormStatus('No pudimos validar tu envio. Intentalo nuevamente.', 'is-error');
    return;
  }

  if (elapsedSeconds < 3) {
    setFormStatus('Espera unos segundos y vuelve a enviar el formulario.', 'is-error');
    return;
  }

  Object.entries(validators).forEach(([fieldName, validate]) => {
    const error = validate(String(values[fieldName] || ''));
    setFieldError(fieldName, error);

    if (error && !firstInvalidField) {
      firstInvalidField = quoteForm.querySelector(`[name="${fieldName}"]`);
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    setFormStatus('Revisa los campos marcados antes de enviar.', 'is-error');
    return;
  }

  const message = [
    `Hola, soy ${values.name}.`,
    `Tengo el negocio/empresa: ${values.company}.`,
    `Me interesa: ${values.service}.`,
    `Mi correo es: ${values.email}.`,
    `Mi telefono es: ${values.phone}.`,
    `Descripcion del proyecto: ${values.message}.`,
    '',
    'Quiero cotizar con B&C Soluciones Digitales.',
  ].join('\n');

  setFormStatus('Abriendo WhatsApp con tu solicitud...', 'is-success');
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener');
});
