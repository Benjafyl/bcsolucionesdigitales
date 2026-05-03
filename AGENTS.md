# AGENTS.md - BC Soluciones Digitales

## Rol de este archivo

Este archivo entrega contexto e instrucciones permanentes para Codex dentro del repositorio de BC Soluciones Digitales.

Antes de modificar codigo, Codex debe leer este archivo y, cuando corresponda, revisar tambien la documentacion dentro de `docs/`.

## Contexto general

Este repositorio corresponde a la web publica y futura plataforma de BC Soluciones Digitales.

La web publica actual es:

https://bcsolucionesdigitales.com

Tambien se contempla:

https://www.bcsolucionesdigitales.com

La web actualmente funciona como landing de presentacion comercial.

## Arquitectura actual de despliegue

El flujo actual de despliegue es:

GitHub
-> Dockploy
-> Docker
-> Traefik
-> Cloudflare Tunnel
-> Cloudflare DNS
-> bcsolucionesdigitales.com

El servidor local usa Dockploy y Traefik como reverse proxy.

Cloudflare Tunnel apunta hacia `http://localhost:80`, donde Traefik enruta hacia el contenedor correspondiente.

El tunel de Cloudflare se llama:

`servidor-byc`

El dominio `bcsolucionesdigitales.com` fue comprado en Hostinger y luego conectado a Cloudflare mediante cambio de nameservers.

## Estado actual de la web

La primera version de la web esta funcionando publicamente.

La web actual es una landing liviana construida con:

- Vite
- Vanilla JavaScript
- HTML
- CSS
- Docker
- Nginx Alpine dentro del contenedor

No hay backend completo todavia.

La web debe mantenerse liviana, rapida y clara.

## Reglas importantes de infraestructura

- No usar Nginx del sistema para servir esta web.
- No apagar ni reemplazar `dockploy-traefik`.
- No cambiar el puerto 80 de Traefik sin justificacion.
- No borrar el tunel `servidor-byc`.
- No crear registros A apuntando a IP publica.
- Los dominios deben seguir pasando por Cloudflare Tunnel.
- Dockploy debe manejar el deploy de la app.
- Traefik debe enrutar por hostname.
- El deploy se activa por push a la rama `main`.

## Objetivo comercial de BC Soluciones Digitales

BC Soluciones Digitales ofrece o planea ofrecer:

- creacion de sitios web;
- landing pages profesionales;
- automatizaciones para negocios;
- asistentes con IA;
- sistemas internos a medida;
- integracion con WhatsApp API de Meta;
- gestion de leads;
- agenda automatica de reuniones;
- resumenes comerciales para preparar reuniones.

## Decision de producto

El canal principal de contacto NO sera un chatbot pesado incrustado en la web.

La web debe funcionar como vitrina liviana y captadora de contactos.

El canal principal inteligente sera WhatsApp, conectado mediante WhatsApp API de Meta.

La web debe priorizar:

- boton principal hacia WhatsApp del bot;
- formulario de contacto;
- boton para llamar a Benjamin;
- boton para llamar a Carlos;
- correo de contacto;
- servicios claros;
- confianza comercial;
- carga rapida;
- diseno responsive.

## Futuro agente IA

El agente IA de ByC debe funcionar principalmente detras de WhatsApp.

Flujo esperado:

Usuario escribe por WhatsApp
-> Meta envia mensaje al webhook
-> backend recibe mensaje
-> backend guarda contacto y mensaje en Supabase
-> backend consulta datos reales de ByC
-> backend llama a Ollama/Qwen en el servidor
-> agente responde por WhatsApp
-> si el usuario quiere reunion, consulta calendario
-> propone horarios reales
-> agenda reunion
-> guarda resumen del lead en Supabase
-> notifica a Benjamin/Carlos

## Base de datos recomendada

La base de datos recomendada para el MVP es Supabase.

Supabase debe guardar:

- leads;
- mensajes;
- conversaciones;
- servicios;
- preguntas frecuentes;
- solicitudes de reunion;
- reuniones agendadas;
- resumenes comerciales;
- acciones ejecutadas por el agente;
- formularios de contacto.

## IA local

El servidor usa Ollama con un modelo Qwen local.

El modelo local debe actuar como motor de lenguaje, no como dueno absoluto del sistema.

El modelo NO debe ejecutar acciones directamente.

El backend debe controlar las herramientas:

- guardar lead;
- buscar servicios;
- responder FAQs;
- consultar disponibilidad;
- crear reunion;
- guardar resumen;
- notificar a Benjamin/Carlos;
- enviar respuesta por WhatsApp.

## Seguridad

- Nunca exponer claves privadas en frontend.
- Nunca guardar API keys reales en archivos versionados.
- Usar `.env` local y variables configuradas en Dockploy.
- La `SUPABASE_SERVICE_ROLE_KEY` solo puede usarse en backend.
- Las credenciales de Meta, Google Calendar y Supabase no deben quedar en codigo.
- Validar webhooks de Meta.
- Validar entradas de formularios.
- Registrar acciones importantes del agente.
- Confirmar acciones sensibles cuando corresponda.

## Estilo de desarrollo

Antes de modificar:

1. revisar estructura actual del repo;
2. identificar tecnologia exacta;
3. mantener lo que ya funciona;
4. proponer cambios minimos;
5. evitar reescrituras innecesarias;
6. mantener compatibilidad con Docker/Dockploy;
7. documentar variables de entorno nuevas;
8. no agregar dependencias pesadas sin justificacion.

## Archivos de documentacion relacionados

Revisar tambien:

- `docs/PROJECT_CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/AI_AGENT_PLAN.md`
- `docs/SUPABASE_PLAN.md`
- `docs/WHATSAPP_META_PLAN.md`
- `docs/ENVIRONMENT_VARIABLES.md`
