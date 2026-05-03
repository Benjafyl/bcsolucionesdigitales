insert into public.organizations (
  name,
  slug,
  website_url,
  contact_email,
  contact_phone,
  metadata
)
values (
  'BC Soluciones Digitales',
  'byc',
  'https://bcsolucionesdigitales.com',
  'contacto@bcsolucionesdigitales.com',
  '+56XXXXXXXXX',
  '{"notes":"Organizacion inicial para el MVP comercial de ByC."}'::jsonb
)
on conflict (slug) do update
set
  name = excluded.name,
  website_url = excluded.website_url,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  metadata = excluded.metadata;

with org as (
  select id from public.organizations where slug = 'byc'
)
insert into public.business_profiles (
  organization_id,
  description,
  target_customer,
  tone,
  opening_hours,
  meeting_duration_minutes,
  metadata
)
select
  org.id,
  'BC Soluciones Digitales crea sitios web, automatizaciones con IA, sistemas internos e integraciones digitales para negocios que quieren ordenar su operacion y captar mas clientes.',
  'Negocios, emprendedores y equipos comerciales que necesitan presencia digital, automatizacion practica y sistemas simples de operar.',
  'professional',
  'Horario comercial por confirmar',
  30,
  '{"calendar":"Por conectar en una fase posterior."}'::jsonb
from org
on conflict (organization_id) do update
set
  description = excluded.description,
  target_customer = excluded.target_customer,
  tone = excluded.tone,
  opening_hours = excluded.opening_hours,
  meeting_duration_minutes = excluded.meeting_duration_minutes,
  metadata = excluded.metadata;

with org as (
  select id from public.organizations where slug = 'byc'
)
insert into public.team_members (
  organization_id,
  full_name,
  role,
  email,
  phone,
  metadata
)
select org.id, member.full_name, member.role, member.email, member.phone, member.metadata
from org
cross join (
  values
    ('Benjamín', 'owner', 'benjamin@example.com', '+56XXXXXXXXX', '{"placeholder":true}'::jsonb),
    ('Carlos', 'owner', 'carlos@example.com', '+56XXXXXXXXX', '{"placeholder":true}'::jsonb)
) as member(full_name, role, email, phone, metadata)
where not exists (
  select 1
  from public.team_members existing
  where existing.organization_id = org.id
    and existing.full_name = member.full_name
);

with org as (
  select id from public.organizations where slug = 'byc'
)
insert into public.business_channels (
  organization_id,
  channel,
  label,
  value,
  is_primary,
  metadata
)
select org.id, channel.channel, channel.label, channel.value, channel.is_primary, channel.metadata
from org
cross join (
  values
    ('web_form', 'Formulario web', 'https://bcsolucionesdigitales.com', true, '{"placeholder":false}'::jsonb),
    ('email', 'Correo de contacto', 'contacto@bcsolucionesdigitales.com', true, '{"placeholder":false}'::jsonb),
    ('whatsapp', 'WhatsApp bot', '+56XXXXXXXXX', true, '{"placeholder":true}'::jsonb),
    ('phone', 'Telefono Benjamin', '+56XXXXXXXXX', false, '{"placeholder":true}'::jsonb),
    ('phone', 'Telefono Carlos', '+56XXXXXXXXX', false, '{"placeholder":true}'::jsonb)
) as channel(channel, label, value, is_primary, metadata)
on conflict (organization_id, channel, label) do update
set
  value = excluded.value,
  is_primary = excluded.is_primary,
  metadata = excluded.metadata;

with org as (
  select id from public.organizations where slug = 'byc'
)
insert into public.services (
  organization_id,
  name,
  slug,
  description,
  display_order,
  metadata
)
select org.id, service.name, service.slug, service.description, service.display_order, service.metadata
from org
cross join (
  values
    ('Landing pages profesionales', 'landing-pages-profesionales', 'Sitios livianos, claros y responsive para presentar servicios, generar confianza y captar contactos por WhatsApp, llamada o formulario.', 10, '{"initial":true}'::jsonb),
    ('Automatizaciones con IA', 'automatizaciones-con-ia', 'Asistentes y flujos automatizados para responder clientes, ordenar informacion y reducir tareas repetitivas.', 20, '{"initial":true}'::jsonb),
    ('Sistemas web a medida', 'sistemas-web-a-medida', 'Aplicaciones internas, paneles, formularios y herramientas digitales adaptadas al proceso real del negocio.', 30, '{"initial":true}'::jsonb),
    ('Integraciones digitales', 'integraciones-digitales', 'Conexion entre formularios, WhatsApp, bases de datos, calendarios, correos y otros sistemas.', 40, '{"initial":true}'::jsonb)
) as service(name, slug, description, display_order, metadata)
on conflict (organization_id, slug) do update
set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  metadata = excluded.metadata;

with org as (
  select id from public.organizations where slug = 'byc'
)
insert into public.faqs (
  organization_id,
  question,
  answer,
  category,
  display_order,
  metadata
)
select org.id, faq.question, faq.answer, faq.category, faq.display_order, faq.metadata
from org
cross join (
  values
    ('Que servicios ofrece BC Soluciones Digitales?', 'Creamos landing pages profesionales, automatizaciones con IA, sistemas web a medida e integraciones digitales para negocios.', 'servicios', 10, '{"initial":true}'::jsonb),
    ('Puedo agendar una reunion?', 'Si. Podemos coordinar una reunion para entender tu negocio, revisar tu necesidad y proponer una solucion concreta.', 'reuniones', 20, '{"initial":true}'::jsonb),
    ('Trabajan con inteligencia artificial?', 'Si. Usamos IA para crear asistentes y automatizaciones practicas, siempre controladas por un backend y conectadas a datos reales del negocio.', 'ia', 30, '{"initial":true}'::jsonb),
    ('Usan WhatsApp para atender clientes?', 'El canal principal planificado es WhatsApp mediante la API de Meta, conectado a Supabase y al backend del agente comercial.', 'whatsapp', 40, '{"initial":true}'::jsonb),
    ('Pueden crear una web para mi negocio?', 'Si. Podemos crear una landing clara, rapida y responsive enfocada en explicar tus servicios y captar contactos.', 'servicios', 50, '{"initial":true}'::jsonb),
    ('Pueden automatizar procesos de atencion?', 'Si. Podemos ayudar a ordenar consultas, capturar leads, resumir solicitudes y preparar reuniones comerciales.', 'ia', 60, '{"initial":true}'::jsonb)
) as faq(question, answer, category, display_order, metadata)
where not exists (
  select 1
  from public.faqs existing
  where existing.organization_id = org.id
    and existing.question = faq.question
);
