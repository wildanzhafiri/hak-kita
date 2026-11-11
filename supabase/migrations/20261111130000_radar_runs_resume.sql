alter table public.program_radar_runs
  add column if not exists cursor jsonb,
  add column if not exists lease_until timestamptz;
