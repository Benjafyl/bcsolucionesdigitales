# Plan Supabase - BC Soluciones Digitales

## Objetivo

Usar Supabase como base de datos principal del MVP comercial de ByC.

Supabase almacenara:

- perfil del negocio;
- servicios;
- FAQs;
- leads;
- conversaciones;
- mensajes;
- formularios de contacto;
- solicitudes de reunion;
- reuniones;
- resumenes;
- acciones del agente.

## Proyecto

Nombre sugerido del proyecto Supabase:

`byc-soluciones`

## Tablas recomendadas

### `organizations`

Representa una organizacion o cliente.

Campos sugeridos:

- `id`
- `name`
- `slug`
- `website_url`
- `contact_email`
- `contact_phone`
- `created_at`

### `business_profiles`

Perfil comercial de la organizacion.

Campos sugeridos:

- `id`
- `organization_id`
- `description`
- `target_customer`
- `tone`
- `opening_hours`
- `meeting_duration_minutes`
- `created_at`

### `services`

Servicios ofrecidos.

Campos sugeridos:

- `id`
- `organization_id`
- `name`
- `description`
- `starting_price_clp`
- `is_active`
- `created_at`

### `faqs`

Preguntas frecuentes.

Campos sugeridos:

- `id`
- `organization_id`
- `question`
- `answer`
- `is_active`
- `created_at`

### `leads`

Potenciales clientes.

Campos sugeridos:

- `id`
- `organization_id`
- `name`
- `email`
- `phone`
- `company_name`
- `business_type`
- `service_interest`
- `budget_range`
- `urgency`
- `source`
- `status`
- `summary`
- `created_at`

Valores permitidos para `source`:

- `web_form`
- `whatsapp`
- `phone`
- `email`
- `manual`
- `unknown`

### `conversations`

Conversaciones por canal.

Campos sugeridos:

- `id`
- `organization_id`
- `lead_id`
- `channel`
- `status`
- `created_at`

Valores permitidos para `channel`:

- `web_form`
- `whatsapp`
- `email`
- `phone`
- `manual`

### `messages`

Mensajes individuales.

Campos sugeridos:

- `id`
- `conversation_id`
- `role`
- `content`
- `metadata`
- `created_at`

Roles permitidos:

- `user`
- `assistant`
- `system`
- `tool`

### `contact_requests`

Formularios enviados desde la web.

Campos sugeridos:

- `id`
- `organization_id`
- `name`
- `email`
- `phone`
- `company_name`
- `message`
- `accepted_whatsapp_contact`
- `service_interest`
- `status`
- `created_at`

Valores permitidos para `source`:

- `web_form`
- `whatsapp`
- `phone`
- `email`
- `manual`
- `unknown`

## Flujo formulario web

La landing debe enviar el formulario a la Edge Function `submit-contact-request`, no directamente a tablas Supabase.

Payload esperado:

- `name`
- `email`
- `phone`
- `company_name`
- `service_interest`
- `message`
- `accepted_whatsapp_contact`

La Edge Function valida los datos, busca la organizacion `byc` y crea:

- un `lead` con `source = web_form` y `status = new`;
- un `contact_request` asociado con `source = web_form`;
- una `conversation` con `channel = web_form` y `status = open`;
- un `message` inicial con `role = user`.

La `SUPABASE_SERVICE_ROLE_KEY` solo se usa dentro de la Edge Function. No debe llegar al navegador.

### `meeting_requests`

Solicitudes de reunion.

Campos sugeridos:

- `id`
- `organization_id`
- `lead_id`
- `preferred_days`
- `preferred_time_range`
- `meeting_goal`
- `status`
- `created_at`

### `meetings`

Reuniones confirmadas.

Campos sugeridos:

- `id`
- `organization_id`
- `lead_id`
- `calendar_event_id`
- `title`
- `start_time`
- `end_time`
- `meeting_link`
- `status`
- `context_summary`
- `created_at`

### `agent_actions`

Registro de acciones ejecutadas por el agente.

Campos sugeridos:

- `id`
- `organization_id`
- `conversation_id`
- `lead_id`
- `action_name`
- `action_input`
- `action_output`
- `status`
- `created_at`

## Seguridad

- Activar RLS en tablas expuestas.
- No usar `service_role` en frontend.
- El frontend solo debe enviar formularios al backend.
- El backend se comunica con Supabase usando claves privadas.
- Validar datos antes de insertar.
- Registrar acciones del agente.

## Datos iniciales ByC

Organizacion:

- `name`: BC Soluciones Digitales
- `slug`: byc
- `website_url`: https://bcsolucionesdigitales.com
- `contact_email`: benjafyl@gmail.com
- `contact_phone`: +56XXXXXXXXX

Servicios iniciales:

- Landing page profesional
- Automatizacion con IA
- Sistema web a medida
- Integraciones digitales

FAQs iniciales:

- Que hace BC Soluciones Digitales?
- Puedo agendar una reunion?
- Trabajan con inteligencia artificial?
- Pueden crear una web para mi negocio?
- Pueden automatizar procesos de atencion?

## Migraciones

No crear migraciones reales todavia salvo que se solicite.

Este archivo es un plan de diseno de base de datos.
