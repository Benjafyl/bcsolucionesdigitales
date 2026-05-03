import './styles.css';

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');

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
  { threshold: 0.16 },
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('.form-status');
const CONTACT_FUNCTION_URL =
  import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION_URL ||
  'https://xhvkqkeqgnfxhwlibqrd.supabase.co/functions/v1/submit-contact-request';
const SUBMIT_SUCCESS_MESSAGE = 'Solicitud enviada correctamente. Te contactaremos pronto.';
const SUBMIT_ERROR_MESSAGE = 'No pudimos enviar tu solicitud. Intenta nuevamente o escríbenos por WhatsApp.';
let isSubmittingContactForm = false;

const validators = {
  name: (value) => (value.trim().length >= 2 ? '' : 'Ingresa tu nombre.'),
  email: (value) =>
    !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Ingresa un email valido.',
  message: (value) => (value.trim().length >= 5 ? '' : 'Escribe un mensaje de al menos 5 caracteres.'),
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

function setSubmitState(isSubmitting) {
  isSubmittingContactForm = isSubmitting;

  const submitButton = contactForm?.querySelector('[type="submit"]');
  if (submitButton) {
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'Enviando...' : 'Enviar consulta';
  }
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (isSubmittingContactForm) {
    return;
  }

  const formData = new FormData(contactForm);
  const values = Object.fromEntries(formData.entries());
  let firstInvalidField = null;

  Object.entries(validators).forEach(([fieldName, validate]) => {
    const error = validate(String(values[fieldName] || ''));
    setFieldError(fieldName, error);

    if (error && !firstInvalidField) {
      firstInvalidField = contactForm.querySelector(`[name="${fieldName}"]`);
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    setFormStatus('Revisa los campos marcados antes de enviar.', 'is-error');
    return;
  }

  const payload = {
    name: String(values.name || '').trim(),
    email: String(values.email || '').trim() || null,
    phone: String(values.phone || '').trim() || null,
    company_name: String(values.company_name || '').trim() || null,
    service_interest: String(values.service_interest || '').trim() || null,
    message: String(values.message || '').trim(),
    accepted_whatsapp_contact: values.accepted_whatsapp_contact === 'on',
  };

  setSubmitState(true);
  setFormStatus('Enviando solicitud...');

  try {
    const response = await fetch(CONTACT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error('submit_failed');
    }

    contactForm.reset();
    Object.keys(validators).forEach((fieldName) => setFieldError(fieldName, ''));
    setFormStatus(SUBMIT_SUCCESS_MESSAGE, 'is-success');
  } catch {
    setFormStatus(SUBMIT_ERROR_MESSAGE, 'is-error');
  } finally {
    setSubmitState(false);
  }
});
