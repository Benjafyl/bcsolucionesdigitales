create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  website_url text,
  contact_email text,
  contact_phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  description text not null,
  target_customer text,
  tone text not null default 'professional' check (tone in ('professional', 'friendly', 'technical', 'commercial')),
  opening_hours text,
  meeting_duration_minutes integer not null default 30 check (meeting_duration_minutes > 0 and meeting_duration_minutes <= 240),
  language text not null default 'es' check (language in ('es', 'en')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'sales', 'support', 'technical')),
  email text,
  phone text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  channel text not null check (channel in ('website', 'whatsapp', 'phone', 'email', 'calendar', 'instagram', 'facebook', 'other')),
  label text not null,
  value text not null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, channel, label)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null,
  starting_price_clp integer check (starting_price_clp is null or starting_price_clp >= 0),
  delivery_time_estimate text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  question text not null,
  answer text not null,
  category text not null default 'general',
  is_active boolean not null default true,
  display_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text,
  email text,
  phone text,
  company_name text,
  business_type text,
  service_interest text,
  budget_range text,
  urgency text check (urgency is null or urgency in ('low', 'medium', 'high', 'urgent')),
  source text not null default 'website' check (source in ('website', 'whatsapp', 'phone', 'email', 'referral', 'manual', 'other')),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'meeting_requested', 'meeting_scheduled', 'won', 'lost', 'archived')),
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company_name text,
  message text not null,
  accepted_whatsapp_contact boolean not null default false,
  source text not null default 'website' check (source in ('website', 'whatsapp', 'phone', 'email', 'manual', 'other')),
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'closed', 'spam')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  channel text not null check (channel in ('website_form', 'whatsapp', 'phone', 'email', 'manual', 'other')),
  external_thread_id text,
  status text not null default 'open' check (status in ('open', 'waiting_for_user', 'waiting_for_team', 'closed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool', 'human')),
  direction text not null default 'inbound' check (direction in ('inbound', 'outbound', 'internal')),
  content text not null,
  external_message_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.meeting_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  preferred_days text,
  preferred_time_range text,
  meeting_goal text,
  status text not null default 'new' check (status in ('new', 'proposed', 'scheduled', 'cancelled', 'expired', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  meeting_request_id uuid references public.meeting_requests(id) on delete set null,
  calendar_event_id text,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  meeting_link text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  context_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists public.agent_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  action_name text not null,
  action_input jsonb not null default '{}'::jsonb,
  action_output jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled', 'requires_confirmation')),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_business_profiles_organization_id on public.business_profiles(organization_id);
create index if not exists idx_team_members_organization_id on public.team_members(organization_id);
create index if not exists idx_business_channels_organization_id on public.business_channels(organization_id);
create index if not exists idx_business_channels_channel on public.business_channels(channel);
create index if not exists idx_services_organization_id on public.services(organization_id);
create index if not exists idx_services_active_order on public.services(organization_id, is_active, display_order);
create index if not exists idx_faqs_organization_id on public.faqs(organization_id);
create index if not exists idx_faqs_active_order on public.faqs(organization_id, is_active, display_order);
create index if not exists idx_leads_organization_id on public.leads(organization_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_contact_requests_organization_id on public.contact_requests(organization_id);
create index if not exists idx_contact_requests_status on public.contact_requests(status);
create index if not exists idx_conversations_organization_id on public.conversations(organization_id);
create index if not exists idx_conversations_lead_id on public.conversations(lead_id);
create index if not exists idx_conversations_channel_status on public.conversations(channel, status);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_meeting_requests_organization_id on public.meeting_requests(organization_id);
create index if not exists idx_meeting_requests_lead_id on public.meeting_requests(lead_id);
create index if not exists idx_meetings_organization_id on public.meetings(organization_id);
create index if not exists idx_meetings_lead_id on public.meetings(lead_id);
create index if not exists idx_meetings_start_time on public.meetings(start_time);
create index if not exists idx_agent_actions_organization_id on public.agent_actions(organization_id);
create index if not exists idx_agent_actions_conversation_id on public.agent_actions(conversation_id);
create index if not exists idx_agent_actions_lead_id on public.agent_actions(lead_id);
create index if not exists idx_agent_actions_status on public.agent_actions(status);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists set_business_profiles_updated_at on public.business_profiles;
create trigger set_business_profiles_updated_at
before update on public.business_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

drop trigger if exists set_business_channels_updated_at on public.business_channels;
create trigger set_business_channels_updated_at
before update on public.business_channels
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_requests_updated_at on public.contact_requests;
create trigger set_contact_requests_updated_at
before update on public.contact_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_meeting_requests_updated_at on public.meeting_requests;
create trigger set_meeting_requests_updated_at
before update on public.meeting_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_meetings_updated_at on public.meetings;
create trigger set_meetings_updated_at
before update on public.meetings
for each row execute function public.set_updated_at();

drop trigger if exists set_agent_actions_updated_at on public.agent_actions;
create trigger set_agent_actions_updated_at
before update on public.agent_actions
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.business_profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.business_channels enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;
alter table public.contact_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.meeting_requests enable row level security;
alter table public.meetings enable row level security;
alter table public.agent_actions enable row level security;
