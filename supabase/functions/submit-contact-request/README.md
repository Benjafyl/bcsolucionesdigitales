# submit-contact-request

Edge Function para recibir el formulario de contacto de la landing y guardar el flujo minimo en Supabase:

- `leads`
- `contact_requests`
- `conversations`
- `messages`

La funcion usa `SUPABASE_SERVICE_ROLE_KEY` solo dentro del runtime de Supabase Edge Functions. No debe exponerse al frontend.

## Request

```json
{
  "name": "Cliente Demo",
  "email": "cliente@example.com",
  "phone": "+56XXXXXXXXX",
  "company_name": "Empresa Demo",
  "service_interest": "Landing pages profesionales",
  "message": "Quiero cotizar una landing.",
  "accepted_whatsapp_contact": true
}
```

## Response

```json
{
  "success": true,
  "lead_id": "uuid",
  "contact_request_id": "uuid",
  "conversation_id": "uuid"
}
```

## CORS

Origenes permitidos:

- `https://bcsolucionesdigitales.com`
- `http://localhost:5173`

No conectar la landing hasta validar politicas de abuso, monitoreo y manejo de errores.
