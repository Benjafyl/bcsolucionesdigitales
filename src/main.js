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
const destinationEmail = 'contacto@bcsolucionesdigitales.com';

const validators = {
  name: (value) => (value.trim().length >= 2 ? '' : 'Ingresa tu nombre.'),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Ingresa un email valido.'),
  phone: (value) => (/^[+\d\s()-]{8,}$/.test(value.trim()) ? '' : 'Ingresa un telefono valido.'),
  message: (value) => (value.trim().length >= 10 ? '' : 'Escribe un mensaje de al menos 10 caracteres.'),
};

function setFieldError(fieldName, message) {
  const errorNode = document.querySelector(`[data-error-for="${fieldName}"]`);
  const input = document.querySelector(`[name="${fieldName}"]`);

  if (errorNode) {
    errorNode.textContent = message;
  }

  input?.classList.toggle('has-error', Boolean(message));
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

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
    if (formStatus) {
      formStatus.textContent = 'Revisa los campos marcados antes de enviar.';
      formStatus.className = 'form-status is-error';
    }
    return;
  }

  const subject = encodeURIComponent(`Consulta desde bcsolucionesdigitales.com - ${values.name}`);
  const body = encodeURIComponent(
    `Nombre: ${values.name}\nEmail: ${values.email}\nTelefono: ${values.phone}\n\nMensaje:\n${values.message}`,
  );

  window.location.href = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;

  if (formStatus) {
    formStatus.textContent = 'Mensaje preparado en tu cliente de correo.';
    formStatus.className = 'form-status is-success';
  }
});
