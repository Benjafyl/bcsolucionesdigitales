const WHATSAPP_NUMBER = '56972200928';
const DEFAULT_WHATSAPP_MESSAGE =
  'Hola, quiero cotizar una solución digital para mi negocio con B&C Soluciones.';

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const form = document.querySelector('#lead-form');
const formStatus = document.querySelector('#form-status');
const heroCard = document.querySelector('.hero-card');

const summaryService = document.querySelector('#summary-service');
const summaryTimeline = document.querySelector('#summary-timeline');
const summarySize = document.querySelector('#summary-size');
const summaryChannel = document.querySelector('#summary-channel');

const serviceInput = form?.querySelector('[name="service"]');
const timelineInput = form?.querySelector('[name="timeline"]');
const sizeInput = form?.querySelector('[name="companySize"]');
const channelInput = form?.querySelector('[name="channel"]');
const startedAtInput = document.querySelector('#form-started-at');

if (startedAtInput) {
  startedAtInput.value = String(Date.now());
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

requestAnimationFrame(() => {
  document.documentElement.classList.add('is-ready');
});

function updateSummary() {
  if (summaryService && serviceInput) {
    summaryService.textContent = serviceInput.value || 'Por definir';
  }

  if (summaryTimeline && timelineInput) {
    summaryTimeline.textContent = timelineInput.value || 'Por definir';
  }

  if (summarySize && sizeInput) {
    summarySize.textContent = sizeInput.value || 'Por definir';
  }

  if (summaryChannel && channelInput) {
    summaryChannel.textContent = channelInput.value || 'Por definir';
  }
}

[serviceInput, timelineInput, sizeInput, channelInput].forEach((input) => {
  input?.addEventListener('change', updateSummary);
});

updateSummary();

function setStatus(message, type) {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');

  if (type) {
    formStatus.classList.add(type);
  }
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const botField = String(formData.get('companySite') || '').trim();
  const startedAt = Number(formData.get('formStartedAt') || 0);
  const elapsed = Date.now() - startedAt;

  if (botField) {
    setStatus('No se pudo validar la solicitud.', 'is-error');
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus('Completa los campos requeridos para continuar.', 'is-error');
    return;
  }

  if (!startedAt || elapsed < 4000) {
    setStatus('Espera unos segundos y vuelve a enviar la solicitud.', 'is-error');
    return;
  }

  const payload = {
    fullName: String(formData.get('fullName') || '').trim(),
    businessName: String(formData.get('businessName') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    service: String(formData.get('service') || '').trim(),
    timeline: String(formData.get('timeline') || '').trim(),
    companySize: String(formData.get('companySize') || '').trim(),
    channel: String(formData.get('channel') || '').trim(),
    message: String(formData.get('message') || '').trim(),
  };

  const whatsappMessage = [
    'Hola, quiero solicitar una propuesta con B&C Soluciones.',
    '',
    `Nombre: ${payload.fullName}`,
    `Empresa: ${payload.businessName}`,
    `Email: ${payload.email}`,
    `WhatsApp: ${payload.phone}`,
    `Servicio: ${payload.service}`,
    `Plazo: ${payload.timeline}`,
    `Tamaño del negocio: ${payload.companySize}`,
    `Canal principal: ${payload.channel}`,
    '',
    'Problema o necesidad:',
    payload.message,
  ].join('\n');

  setStatus('Solicitud lista. Abriendo WhatsApp para enviarla.', 'is-success');
  window.open(buildWhatsAppUrl(whatsappMessage), '_blank', 'noopener');
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

document.querySelectorAll('[data-stagger-group]').forEach((group) => {
  Array.from(group.children).forEach((child, index) => {
    if (!child.classList.contains('reveal')) {
      return;
    }

    child.style.setProperty('--reveal-delay', `${index * 70}ms`);
  });
});

if (heroCard) {
  const heroImage = heroCard.querySelector('img');

  window.addEventListener(
    'scroll',
    () => {
      const offset = Math.min(window.scrollY * 0.04, 18);
      if (heroImage) {
        heroImage.style.setProperty('--image-shift', `${offset.toFixed(2)}px`);
      }
    },
    { passive: true },
  );
}
