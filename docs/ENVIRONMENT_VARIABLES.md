# Variables de entorno - BC Soluciones Digitales

Este archivo documenta las variables de entorno esperadas para futuras integraciones.

No guardar valores reales en el repositorio.

Usar `.env.example` si mas adelante se necesita un archivo de ejemplo.

## Supabase

```env
SUPABASE_PROJECT_ID=xhvkqkeqgnfxhwlibqrd
SUPABASE_URL=https://xhvkqkeqgnfxhwlibqrd.supabase.co
SUPABASE_DB_PASSWORD=
SUPABASE_ACCESS_TOKEN=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_CONTACT_FUNCTION_URL=https://xhvkqkeqgnfxhwlibqrd.supabase.co/functions/v1/submit-contact-request
```

Reglas:

- `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD` y `SUPABASE_ACCESS_TOKEN` se usan para tareas locales de CLI y administracion.
- `SUPABASE_ANON_KEY` puede usarse en frontend solo si las politicas RLS estan correctamente configuradas.
- `SUPABASE_SERVICE_ROLE_KEY` solo puede usarse en backend.
- `VITE_SUPABASE_CONTACT_FUNCTION_URL` puede exponerse al frontend porque es solo la URL publica de la Edge Function.
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al navegador.
- Nunca imprimir tokens, passwords ni claves Supabase en consola o logs.

## Supabase Edge Functions

Las Edge Functions de Supabase reciben por defecto:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=
```

Reglas:

- `submit-contact-request` usa `SUPABASE_SERVICE_ROLE_KEY` solo dentro del runtime de la funcion.
- La landing no debe recibir `SUPABASE_SERVICE_ROLE_KEY`.
- Para pruebas locales, cargar secretos con `supabase functions serve --env-file .env.local`.
- No versionar archivos `.env` bajo `supabase/functions/`.

## Meta WhatsApp API

```env
META_VERIFY_TOKEN=
META_ACCESS_TOKEN=
META_PHONE_NUMBER_ID=
META_WHATSAPP_BUSINESS_ACCOUNT_ID=
META_APP_SECRET=
```

Reglas:

- No exponer tokens al frontend.
- Validar webhooks.
- Registrar errores.
- Rotar tokens si se filtran.

## Google Calendar

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_CALENDAR_ID=
GOOGLE_REFRESH_TOKEN=
```

Reglas:

- Usar una cuenta/calendario controlado por ByC.
- Verificar disponibilidad antes de crear eventos.
- Volver a verificar disponibilidad justo antes de confirmar.
- Guardar `calendar_event_id` en Supabase.

## Ollama

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

Notas:

- Ollama corre localmente en el servidor.
- El modelo se usa como motor de lenguaje.
- El backend controla herramientas y acciones.

## Backend

```env
APP_ENV=development
APP_PORT=3000
APP_PUBLIC_URL=
CORS_ALLOWED_ORIGINS=
```

## Seguridad general

- Nunca subir `.env` real.
- Mantener `.env.example` sin secretos.
- Configurar variables reales en Dockploy o entorno del servidor.
- Documentar cualquier variable nueva cuando se agregue una integracion.
