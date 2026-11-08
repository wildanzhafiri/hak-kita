create type public.obstacle_report_stage as enum (
  'mencari-informasi',
  'memenuhi-persyaratan',
  'menyiapkan-berkas',
  'mengajukan',
  'menunggu-verifikasi',
  'mengikuti-seleksi',
  'menerima-hasil'
);

create table public.obstacle_reports (
  id bigint generated always as identity primary key,
  program_id text not null references public.programs (id) on delete cascade,
  stage public.obstacle_report_stage not null,
  region_code text not null check (region_code ~ '^(ID|[0-9]{2}|[0-9]{4})$'),
  created_at timestamptz not null default now()
);

alter table public.obstacle_reports enable row level security;

revoke all on table public.obstacle_reports from public, anon, authenticated;
grant insert on table public.obstacle_reports to service_role;

create view public.obstacle_report_aggregates as
with privacy_threshold as (
  select 5::bigint as minimum_count
)
select
  reports.program_id,
  reports.stage,
  reports.region_code,
  count(*)::integer as report_count
from public.obstacle_reports as reports
cross join privacy_threshold
group by reports.program_id, reports.stage, reports.region_code, privacy_threshold.minimum_count
having count(*) >= privacy_threshold.minimum_count;

revoke all on table public.obstacle_report_aggregates from public;
grant select on table public.obstacle_report_aggregates to anon, authenticated;
