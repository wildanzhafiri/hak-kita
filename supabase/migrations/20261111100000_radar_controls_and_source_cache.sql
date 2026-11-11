alter table public.program_source_observations
  add column if not exists source_text text,
  add column if not exists content_updated_at timestamptz;

create table if not exists public.program_radar_settings (
  id boolean primary key default true check (id),
  automatic_discovery_enabled boolean not null default true,
  monitoring_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.program_radar_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.program_radar_settings enable row level security;
revoke all on table public.program_radar_settings from public, anon, authenticated;
grant all on table public.program_radar_settings to service_role;
