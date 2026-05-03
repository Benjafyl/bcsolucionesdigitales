# Supabase - BC Soluciones Digitales

Este directorio contiene la estructura inicial de base de datos para el CRM comercial y futuro agente IA de BC Soluciones Digitales.

Proyecto Supabase:

- Project ID: `xhvkqkeqgnfxhwlibqrd`
- URL: `https://xhvkqkeqgnfxhwlibqrd.supabase.co`
- Nombre: `BYC Soluciones Digitales DB`

## Archivos

- `migrations/20260503170000_create_byc_initial_crm_schema.sql`: esquema inicial CRM/agent.
- `migrations/20260503190000_normalize_web_form_source_values.sql`: normaliza `web_form` en origenes/canales.
- `migrations/20260503200000_add_service_interest_to_contact_requests.sql`: agrega `service_interest` a solicitudes de contacto.
- `seed.sql`: datos iniciales de ByC con placeholders.
- `functions/submit-contact-request/`: Edge Function para recibir el formulario de contacto.
- `skills/supabase_database_manager.md`: instrucciones para futuras sesiones de Codex.

## Variables locales

Usar `.env.local` para valores reales. Ese archivo debe permanecer ignorado por Git.

Ver `.env.example` para los nombres esperados:

```env
SUPABASE_PROJECT_ID=xhvkqkeqgnfxhwlibqrd
SUPABASE_URL=https://xhvkqkeqgnfxhwlibqrd.supabase.co
SUPABASE_DB_PASSWORD=
SUPABASE_ACCESS_TOKEN=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

No guardar secretos reales en archivos versionados.

## Comandos CLI

```bash
supabase login
supabase link --project-ref xhvkqkeqgnfxhwlibqrd
supabase db push
supabase db seed
```

`supabase db reset` es destructivo: recrea la base local/remota objetivo segun configuracion y puede borrar datos. No usarlo en produccion ni en el proyecto real sin confirmacion explicita.

## Edge Function: submit-contact-request

La funcion `submit-contact-request` recibe el formulario web y crea:

- un `lead`;
- un `contact_request`;
- una `conversation`;
- un `message` inicial.

Desplegar:

```bash
supabase functions deploy submit-contact-request --no-verify-jwt --use-api
```

El flag `--no-verify-jwt` permite que la landing publica invoque la funcion sin exponer claves en el navegador. `--use-api` evita depender de Docker para empaquetar desde Windows. La funcion sigue usando `SUPABASE_SERVICE_ROLE_KEY` solo dentro del runtime de Supabase Edge Functions.

Probar localmente con variables locales:

```bash
supabase functions serve submit-contact-request --env-file .env.local --no-verify-jwt
```

Ejemplo de request local:

```bash
curl -i -X POST http://127.0.0.1:54321/functions/v1/submit-contact-request \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Cliente Demo\",\"email\":\"cliente@example.com\",\"phone\":\"+56XXXXXXXXX\",\"company_name\":\"Empresa Demo\",\"service_interest\":\"Landing pages profesionales\",\"message\":\"Quiero cotizar una landing.\",\"accepted_whatsapp_contact\":true}"
```

No conectar el frontend hasta definir monitoreo, limites anti-abuso y manejo operativo de leads.

## Seguridad

RLS queda activado en todas las tablas de la migracion inicial, pero no se crean politicas publicas todavia.

Hasta que existan backend y politicas RLS revisadas:

- no conectar la landing directamente a tablas Supabase;
- no usar `SUPABASE_SERVICE_ROLE_KEY` en frontend;
- no exponer credenciales en logs, commits ni capturas;
- aplicar cambios por migraciones revisables.
