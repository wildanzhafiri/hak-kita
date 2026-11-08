create table if not exists public.program_source_observations (
  source_url text primary key,
  baseline_fingerprint text not null,
  latest_fingerprint text not null,
  etag text,
  last_modified text,
  first_checked_at timestamptz not null default now(),
  last_checked_at timestamptz not null default now(),
  changed_at timestamptz,
  last_error text,
  constraint program_source_observations_baseline_hash check (length(baseline_fingerprint) = 64),
  constraint program_source_observations_latest_hash check (length(latest_fingerprint) = 64)
);

alter table public.program_source_observations enable row level security;

revoke all on table public.program_source_observations from public, anon, authenticated;
grant all on table public.program_source_observations to service_role;

create table if not exists public.program_knowledge_documents (
  id text primary key,
  program_id text not null references public.programs(id) on delete cascade,
  record jsonb not null,
  updated_at timestamptz not null default now(),
  constraint program_knowledge_documents_record_object check (jsonb_typeof(record) = 'object'),
  constraint program_knowledge_documents_record_id_matches check (record ->> 'id' = id),
  constraint program_knowledge_documents_program_id_matches check (record ->> 'programId' = program_id)
);

create index if not exists program_knowledge_documents_program_id_idx
  on public.program_knowledge_documents (program_id);

alter table public.program_knowledge_documents enable row level security;

revoke all on table public.program_knowledge_documents from public, anon, authenticated;
grant all on table public.program_knowledge_documents to service_role;
