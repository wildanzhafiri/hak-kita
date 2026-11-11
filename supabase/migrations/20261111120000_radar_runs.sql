create table if not exists public.program_radar_runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('discovery', 'monitoring')),
  status text not null default 'running' check (status in ('running', 'done', 'failed', 'stopped')),
  state jsonb not null,
  stop_requested boolean not null default false,
  dismissed boolean not null default false,
  started_by uuid references auth.users (id) on delete set null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists program_radar_runs_started_at_idx
  on public.program_radar_runs (started_at desc);

alter table public.program_radar_runs enable row level security;
revoke all on table public.program_radar_runs from public, anon, authenticated;
grant all on table public.program_radar_runs to service_role;
