# Plan WhatsApp API de Meta - BC Soluciones Digitales

## Objetivo

Usar WhatsApp como canal principal del agente comercial de ByC.

La web debe derivar al usuario al numero de WhatsApp del bot.

El bot debe atender, guardar datos, responder preguntas y ayudar a agendar reuniones.

## Flujo esperado

1. Usuario escribe al WhatsApp de ByC.
2. Meta envia un webhook al backend.
3. El backend valida la solicitud.
4. El backend identifica el numero del usuario.
5. El backend busca o crea lead en Supabase.
6. El backend guarda el mensaje.
7. El backend llama al agente.
8. El agente decide respuesta o herramienta.
9. El backend responde usando WhatsApp Cloud API.
10. Supabase guarda la accion.

## Webhook

Endpoint futuro sugerido:

`POST /webhooks/whatsapp`

Tambien puede requerirse:

`GET /webhooks/whatsapp`

para verificacion inicial del webhook de Meta.

## Variables esperadas

- `META_VERIFY_TOKEN`
- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`
- `META_WHATSAPP_BUSINESS_ACCOUNT_ID`
- `META_APP_SECRET`

## Reglas de seguridad

- Validar token de verificacion.
- Validar firma si se implementa.
- No exponer tokens en frontend.
- Registrar mensajes entrantes.
- Registrar respuestas salientes.
- Manejar errores de Meta.
- No crear un ChatGPT generico por WhatsApp.
- Mantener el bot limitado al contexto comercial de ByC.

## Opt-in

Si un usuario deja un formulario en la web y se desea contactarlo por WhatsApp, el formulario debe pedir consentimiento.

Texto sugerido:

"Acepto que BC Soluciones Digitales me contacte por WhatsApp sobre mi solicitud."

Guardar ese consentimiento en:

`contact_requests.accepted_whatsapp_contact`

## Botones web

La web debe incluir:

- boton a WhatsApp del bot;
- boton llamar a Benjamin;
- boton llamar a Carlos;
- correo;
- formulario.

Ejemplo de links:

```html
<a href="https://wa.me/56XXXXXXXXX">Hablar por WhatsApp</a>
<a href="tel:+56XXXXXXXXX">Llamar a Benjamin</a>
<a href="tel:+56XXXXXXXXX">Llamar a Carlos</a>
<a href="mailto:benjafyl@gmail.com">Enviar correo</a>
```

## Primeras respuestas del bot

Ejemplo:

"Hola, soy el asistente de BC Soluciones Digitales. Te puedo ayudar a entender que solucion necesitas, responder preguntas sobre nuestros servicios o coordinar una reunion con el equipo."

Preguntas utiles:

- Que tipo de negocio tienes?
- Que necesitas mejorar o automatizar?
- Buscas una web, una automatizacion, un sistema interno o asesoria?
- Tienes algun plazo aproximado?
- Quieres agendar una reunion?
