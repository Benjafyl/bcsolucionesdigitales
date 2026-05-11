import './styles.css';

const WHATSAPP_NUMBER = '56972200928';
const DEFAULT_WHATSAPP_MESSAGE = 'Hola, quiero cotizar una solución digital para mi negocio.';

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

function normalizePath(pathname) {
  if (pathname === '/index.html') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
  link.setAttribute('href', buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE));
});

document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const linkPath = normalizePath(new URL(link.href).pathname);
  const currentPath = normalizePath(window.location.pathname);

  if (linkPath === currentPath) {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  }
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
  phone: (value) => (/^[+\d\s()-]{8,}$/.test(value.trim()) ? '' : 'Ingresa un teléfono válido.'),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Ingresa un correo válido.'),
  service: (value) => (value ? '' : 'Selecciona un servicio de interés.'),
  message: (value) => (value.trim().length >= 10 ? '' : 'Describe brevemente tu proyecto.'),
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
    setFormStatus('No pudimos validar tu envío. Inténtalo nuevamente.', 'is-error');
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
    `Mi teléfono es: ${values.phone}.`,
    `Descripción del proyecto: ${values.message}.`,
    '',
    'Quiero cotizar con B&C Soluciones.',
  ].join('\n');

  setFormStatus('Abriendo WhatsApp con tu solicitud...', 'is-success');
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener');
});
