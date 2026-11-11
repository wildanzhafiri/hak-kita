create table public.program_radar_program_candidates (
  id uuid primary key default gen_random_uuid(),
  record jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  detected_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id),
  program_id text references public.programs (id),
  constraint program_radar_program_candidates_program_id_key unique (program_id)
);

create unique index program_radar_program_candidates_record_id_idx
  on public.program_radar_program_candidates ((record -> 'program' ->> 'id'));

create index program_radar_program_candidates_status_detected_idx
  on public.program_radar_program_candidates (status, detected_at desc);

alter table public.program_radar_program_candidates enable row level security;
revoke all on table public.program_radar_program_candidates from public, anon, authenticated;
grant all on table public.program_radar_program_candidates to service_role;

create or replace function public.review_program_radar_program_candidate(
  p_candidate_id uuid,
  p_reviewer_id uuid,
  p_action text,
  p_program_id text default null,
  p_program_record jsonb default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate public.program_radar_program_candidates%rowtype;
begin
  select * into candidate
  from public.program_radar_program_candidates
  where id = p_candidate_id
  for update;

  if not found or candidate.status <> 'pending' then
    raise exception 'Radar program candidate is no longer pending';
  end if;

  if p_action = 'reject' then
    update public.program_radar_program_candidates
    set status = 'rejected', reviewed_at = now(), reviewed_by = p_reviewer_id
    where id = p_candidate_id;
    return null;
  end if;

  if p_action <> 'approve' then
    raise exception 'Invalid review action';
  end if;

  if p_program_id is null or p_program_record is null
     or p_program_record ->> 'id' <> p_program_id
     or p_program_record ->> 'verifikasi' <> 'belum' then
    raise exception 'Radar program review fields are invalid';
  end if;

  insert into public.programs (id, record)
  values (p_program_id, p_program_record);

  update public.program_radar_program_candidates
  set status = 'approved', reviewed_at = now(), reviewed_by = p_reviewer_id,
      program_id = p_program_id
  where id = p_candidate_id;

  return p_program_id;
end;
$$;

revoke all on function public.review_program_radar_program_candidate(uuid, uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.review_program_radar_program_candidate(uuid, uuid, text, text, jsonb) to service_role;
