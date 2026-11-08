create table if not exists public.programs (
  id text primary key,
  record jsonb not null,
  updated_at timestamptz not null default now(),
  constraint programs_record_object check (jsonb_typeof(record) = 'object'),
  constraint programs_record_id_matches check (record ->> 'id' = id)
);

alter table public.programs enable row level security;

revoke all on table public.programs from public, anon, authenticated;
grant all on table public.programs to service_role;
