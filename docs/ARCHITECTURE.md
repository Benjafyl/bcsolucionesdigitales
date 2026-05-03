# Arquitectura - BC Soluciones Digitales

## Arquitectura actual

La web actual funciona con esta arquitectura:

GitHub
-> Dockploy
-> Docker
-> Traefik
-> Cloudflare Tunnel
-> Cloudflare DNS
-> Usuario final

## Flujo de solicitud web

Cuando un usuario entra a `bcsolucionesdigitales.com`:

1. Cloudflare recibe la solicitud.
2. Cloudflare Tunnel la envia al servidor local.
3. El tunel apunta a `http://localhost:80`.
4. Traefik, manejado por Dockploy, recibe la solicitud.
5. Traefik enruta segun dominio.
6. El contenedor Docker de la web responde.

## Componentes actuales

- Servidor local propio
- Ubuntu Server
- Docker
- Dockploy
- Traefik
- Cloudflare Tunnel
- Cloudflare DNS
- GitHub
- Vite
- HTML/CSS/JavaScript
- Nginx Alpine dentro del contenedor

## Componentes futuros

Para el agente comercial de ByC se proyectan:

- Backend API
- Supabase
- WhatsApp API de Meta
- Google Calendar API
- Ollama
- Modelo Qwen local
- Sistema de logs
- Sistema de notificaciones
- Panel privado futuro

## Arquitectura futura recomendada

bcsolucionesdigitales.com
-> landing liviana
-> botones de contacto y formulario

WhatsApp Business API
-> webhook publico
-> backend del agente
-> Supabase
-> Ollama/Qwen
-> Google Calendar
-> respuesta por WhatsApp

## Separacion recomendada

Idealmente, separar en servicios:

- `web`: landing publica
- `api`: backend del sistema
- `agent`: logica del agente o worker
- `db`: Supabase externo
- `ollama`: servicio local de IA
- `calendar`: integracion Google Calendar
- `whatsapp`: integracion Meta Cloud API

## Regla clave

El modelo de IA no debe ejecutar acciones directamente.

La responsabilidad debe dividirse asi:

- El modelo interpreta y redacta.
- El backend valida.
- Supabase guarda.
- Las herramientas ejecutan.
- Los humanos revisan acciones importantes.

## Multi-cliente futuro

ByC sera el primer "cliente interno".

La estructura debe pensarse para que despues se pueda replicar en otros negocios.

Cada cliente futuro deberia tener:

- organizacion;
- servicios;
- preguntas frecuentes;
- leads;
- conversaciones;
- reuniones;
- configuracion propia;
- calendario propio;
- numero de WhatsApp propio o canal asignado.
