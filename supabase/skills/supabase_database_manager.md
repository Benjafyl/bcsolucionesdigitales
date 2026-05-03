# Supabase Database Manager - BC Soluciones Digitales

Instrucciones para futuras sesiones de Codex que trabajen con Supabase en este repo.

## Principios

- Mantener `supabase/migrations/` como fuente de verdad del esquema.
- Preferir cambios aditivos y reversibles.
- No borrar tablas, columnas ni datos sin confirmacion explicita.
- No conectar la landing directamente a Supabase hasta que existan politicas RLS seguras.
- No usar `supabase db reset` en produccion ni contra el proyecto real.

## Variables de entorno

Los valores reales deben vivir en `.env.local`, Dockploy o el entorno seguro del servidor.

No escribir secretos reales en archivos versionados. `.env.example` solo debe contener placeholders.

Variables esperadas:

```env
SUPABASE_PROJECT_ID=xhvkqkeqgnfxhwlibqrd
SUPABASE_URL=https://xhvkqkeqgnfxhwlibqrd.supabase.co
SUPABASE_DB_PASSWORD=
SUPABASE_ACCESS_TOKEN=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Antes de operar contra la base real, verificar:

- `.env.local` existe;
- las variables requeridas existen;
- el proyecto linkeado es exactamente `xhvkqkeqgnfxhwlibqrd`;
- no se imprimen secretos en consola;
- no se requiere `db reset`;
- no hay cambios destructivos.

## Supabase CLI

Comandos base:

```bash
supabase login
supabase link --project-ref xhvkqkeqgnfxhwlibqrd
supabase db push
supabase db seed
```

Usar `supabase db push` para aplicar migraciones pendientes. Usar `supabase db seed` solo cuando `seed.sql` sea idempotente o se haya revisado que no duplicara datos.

No usar `supabase db reset` en el proyecto real. Si alguien lo propone, detenerse y explicar que es destructivo.

## Migraciones

Para cambios de esquema:

1. Revisar migraciones existentes y documentacion en `docs/`.
2. Crear una migracion nueva con timestamp y nombre claro.
3. Evitar reescribir migraciones ya aplicadas, salvo que el proyecto aun no las haya recibido y se confirme.
4. Incluir claves foraneas, checks, indices, timestamps y RLS cuando corresponda.
5. Aplicar con CLI o herramienta Supabase autorizada.
6. Verificar con consultas SQL que tablas, columnas, constraints e indices existan.

No hacer cambios one-off directamente en produccion sin reflejarlos en el repo.

## Datos y seed

El seed debe ser idempotente cuando sea posible:

- usar `on conflict` donde existan claves unicas;
- evitar duplicar FAQs o miembros de equipo;
- mantener placeholders para telefonos y correos no confirmados;
- no insertar secretos, tokens ni claves API.

No borrar datos de leads, conversaciones, mensajes, reuniones ni acciones del agente sin confirmacion explicita.

## Llaves Supabase

`SUPABASE_ANON_KEY`:

- puede usarse en frontend solo con RLS y politicas publicas estrictas;
- no debe permitir leer o escribir datos sensibles por defecto;
- todavia no debe conectarse a la landing en esta fase.

`SUPABASE_SERVICE_ROLE_KEY`:

- solo backend o tareas administrativas controladas;
- nunca frontend;
- nunca logs;
- nunca commits;
- nunca respuestas de Codex.

## Seguridad operativa

- Validar entradas antes de insertar datos.
- Registrar acciones importantes del agente en `agent_actions`.
- Confirmar acciones sensibles, como crear reuniones o enviar notificaciones.
- Rotar credenciales si se exponen accidentalmente.
- Mantener RLS activado en tablas del CRM.
