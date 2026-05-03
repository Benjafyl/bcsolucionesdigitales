# Plan del agente IA - BC Soluciones Digitales

## Objetivo

Crear un asistente comercial para BC Soluciones Digitales.

El agente debe atender potenciales clientes principalmente por WhatsApp, guardar informacion en Supabase y ayudar a agendar reuniones.

## Canal principal

El canal principal sera WhatsApp conectado mediante WhatsApp API de Meta.

La web no debe tener un chatbot pesado incrustado salvo que se decida explicitamente mas adelante.

## Flujo general

Usuario escribe por WhatsApp
-> Meta envia webhook al backend
-> backend valida el mensaje
-> backend guarda contacto y mensaje en Supabase
-> backend recupera datos reales de ByC
-> backend llama a Ollama/Qwen
-> modelo interpreta intencion
-> backend ejecuta herramientas controladas
-> backend responde por WhatsApp
-> si hay oportunidad comercial, se agenda reunion
-> se guarda resumen en Supabase

## Capacidades esperadas

El agente debe poder:

- saludar y explicar que hace ByC;
- responder preguntas sobre servicios;
- pedir datos faltantes;
- clasificar intencion del usuario;
- detectar si es lead comercial;
- guardar lead;
- actualizar lead;
- resumir necesidad;
- proponer reunion;
- consultar disponibilidad;
- agendar reunion;
- entregar contexto a Benjamin/Carlos.

## Intenciones iniciales

El agente debe clasificar mensajes en intenciones como:

- `general_question`
- `service_interest`
- `website_request`
- `automation_request`
- `ai_agent_request`
- `custom_system_request`
- `pricing_question`
- `schedule_meeting`
- `contact_human`
- `unknown`

## Datos que debe intentar capturar

- nombre;
- telefono;
- correo;
- empresa;
- rubro;
- servicio de interes;
- problema principal;
- urgencia;
- presupuesto aproximado si el usuario lo menciona;
- preferencia de horario;
- resumen de necesidad.

## Herramientas controladas

El modelo no ejecuta acciones directamente.

El backend debe exponer herramientas como:

- `get_business_profile`
- `get_services`
- `get_faqs`
- `create_lead`
- `update_lead`
- `save_message`
- `summarize_lead`
- `check_calendar_availability`
- `create_calendar_event`
- `notify_owner`
- `send_whatsapp_message`

## Reglas del agente

- No inventar precios si no estan en base de datos.
- No prometer fechas exactas sin calendario.
- No confirmar reunion sin crear evento real.
- No decir que una persona humana respondio si fue el bot.
- No hablar de temas que no tengan relacion con ByC.
- No funcionar como ChatGPT generico.
- Mantener tono profesional, claro y cercano.
- Derivar a humano cuando el usuario lo pida o cuando falte informacion critica.

## Resumen para reunion

Cuando se agenda una reunion, generar un resumen como:

- nombre del lead;
- empresa;
- rubro;
- necesidad principal;
- dolor detectado;
- servicio recomendado;
- urgencia;
- canal de entrada;
- historial corto de conversacion;
- preguntas recomendadas para la reunion.

## MVP por fases

Fase 1:

- Supabase;
- tablas iniciales;
- formulario web guardando leads;
- documentacion de variables.

Fase 2:

- webhook WhatsApp;
- guardar mensajes;
- responder manual o semi-automatico.

Fase 3:

- conectar Ollama/Qwen;
- responder con datos reales;
- clasificar intencion;
- guardar resumen.

Fase 4:

- conectar Google Calendar;
- consultar disponibilidad;
- agendar reunion.

Fase 5:

- panel privado para ver leads, conversaciones y reuniones.
