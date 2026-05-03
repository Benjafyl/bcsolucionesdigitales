# Variables de entorno - BC Soluciones Digitales

Este archivo documenta las variables de entorno esperadas para futuras integraciones.

No guardar valores reales en el repositorio.

Usar `.env.example` si mas adelante se necesita un archivo de ejemplo.

## Supabase

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Reglas:

- `SUPABASE_ANON_KEY` puede usarse en frontend solo si las politicas RLS estan correctamente configuradas.
- `SUPABASE_SERVICE_ROLE_KEY` solo puede usarse en backend.
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al navegador.

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
