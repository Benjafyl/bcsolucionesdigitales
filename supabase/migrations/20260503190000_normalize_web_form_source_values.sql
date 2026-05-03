begin;

alter table public.leads
  drop constraint if exists leads_source_check;

alter table public.contact_requests
  drop constraint if exists contact_requests_source_check;

alter table public.conversations
  drop constraint if exists conversations_channel_check;

alter table public.business_channels
  drop constraint if exists business_channels_channel_check;

alter table public.leads
  alter column source set default 'web_form';

alter table public.contact_requests
  alter column source set default 'web_form';

update public.leads
set
  metadata = case
    when source in ('referral', 'other') then jsonb_set(metadata, '{previous_source}', to_jsonb(source), true)
    else metadata
  end,
  source = case
    when source = 'website' then 'web_form'
    when source in ('referral', 'other') then 'unknown'
    else source
  end
where source in ('website', 'referral', 'other');

update public.contact_requests
set
  metadata = case
    when source = 'other' then jsonb_set(metadata, '{previous_source}', to_jsonb(source), true)
    else metadata
  end,
  source = case
    when source = 'website' then 'web_form'
    when source = 'other' then 'unknown'
    else source
  end
where source in ('website', 'other');

update public.conversations
set
  metadata = case
    when channel = 'other' then jsonb_set(metadata, '{previous_channel}', to_jsonb(channel), true)
    else metadata
  end,
  channel = case
    when channel = 'website_form' then 'web_form'
    when channel = 'other' then 'manual'
    else channel
  end
where channel in ('website_form', 'other');

update public.business_channels
set
  metadata = jsonb_set(metadata, '{previous_channel}', to_jsonb(channel), true),
  channel = 'web_form',
  label = case when label = 'Sitio web' then 'Formulario web' else label end
where channel = 'website';

alter table public.leads
  add constraint leads_source_check
  check (source in ('web_form', 'whatsapp', 'phone', 'email', 'manual', 'unknown'));

alter table public.contact_requests
  add constraint contact_requests_source_check
  check (source in ('web_form', 'whatsapp', 'phone', 'email', 'manual', 'unknown'));

alter table public.conversations
  add constraint conversations_channel_check
  check (channel in ('web_form', 'whatsapp', 'email', 'phone', 'manual'));

alter table public.business_channels
  add constraint business_channels_channel_check
  check (channel in ('web_form', 'whatsapp', 'phone', 'email', 'calendar', 'instagram', 'facebook', 'other'));

commit;
