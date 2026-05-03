alter table public.contact_requests
  add column if not exists service_interest text;

