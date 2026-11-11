alter table public.program_news
  add column if not exists email_text text,
  add column if not exists extra_source_urls text[] not null default '{}';

alter table public.program_news
  add constraint program_news_email_text_length check (email_text is null or char_length(email_text) <= 1200);

alter table public.program_news
  drop constraint if exists program_news_program_id_source_url_key;

alter table public.program_news
  add constraint program_news_program_source_date_title_key unique (program_id, source_url, published_on, title);

create table public.program_radar_candidates (
  id uuid primary key default gen_random_uuid(),
  program_id text not null references public.programs (id) on delete cascade,
  source_url text not null check (source_url ~* '^https://([a-z0-9-]+\.)*go\.id(/|\?|#|$)'),
  source_fingerprint text not null check (length(source_fingerprint) = 64),
  evidence_quote text,
  draft_title text,
  draft_summary text,
  draft_email_text text,
  published_on date,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  detected_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id),
  news_id uuid references public.program_news (id),
  unique (program_id, source_url, source_fingerprint),
  constraint program_radar_candidates_evidence_length check (evidence_quote is null or char_length(evidence_quote) <= 2000),
  constraint program_radar_candidates_title_length check (draft_title is null or char_length(draft_title) between 8 and 180),
  constraint program_radar_candidates_summary_length check (draft_summary is null or char_length(draft_summary) between 20 and 600),
  constraint program_radar_candidates_email_length check (draft_email_text is null or char_length(draft_email_text) <= 1200)
);

create index program_radar_candidates_status_detected_idx
  on public.program_radar_candidates (status, detected_at desc);

alter table public.program_radar_candidates enable row level security;
revoke all on table public.program_radar_candidates from public, anon, authenticated;
grant all on table public.program_radar_candidates to service_role;

create or replace function public.review_program_radar_candidate(
  p_candidate_id uuid,
  p_reviewer_id uuid,
  p_action text,
  p_title text default null,
  p_summary text default null,
  p_published_on date default null,
  p_email_text text default null,
  p_extra_source_urls text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate public.program_radar_candidates%rowtype;
  published_news_id uuid;
  extra_source_url text;
begin
  select * into candidate
  from public.program_radar_candidates
  where id = p_candidate_id
  for update;

  if not found or candidate.status <> 'pending' then
    raise exception 'Radar candidate is no longer pending';
  end if;

  if p_action = 'reject' then
    update public.program_radar_candidates
    set status = 'rejected', reviewed_at = now(), reviewed_by = p_reviewer_id
    where id = p_candidate_id;
    return null;
  end if;

  if p_action <> 'approve' then
    raise exception 'Invalid review action';
  end if;

  if p_title is null or char_length(trim(p_title)) not between 8 and 180
     or p_summary is null or char_length(trim(p_summary)) not between 20 and 600
     or p_published_on is null or p_published_on > current_date
     or p_email_text is null or char_length(trim(p_email_text)) not between 20 and 1200 then
    raise exception 'Radar review fields are invalid';
  end if;

  foreach extra_source_url in array p_extra_source_urls loop
    if extra_source_url !~* '^https://([a-z0-9-]+\.)*go\.id(/|\?|#|$)' then
      raise exception 'Additional source must be an official HTTPS URL';
    end if;
  end loop;

  insert into public.program_news (
    program_id, title, summary, source_url, published_on, email_text, extra_source_urls
  ) values (
    candidate.program_id, trim(p_title), trim(p_summary), candidate.source_url,
    p_published_on, trim(p_email_text), p_extra_source_urls
  )
  returning id into published_news_id;

  update public.program_radar_candidates
  set status = 'approved', reviewed_at = now(), reviewed_by = p_reviewer_id,
      news_id = published_news_id, draft_title = trim(p_title),
      draft_summary = trim(p_summary), draft_email_text = trim(p_email_text),
      published_on = p_published_on
  where id = p_candidate_id;

  return published_news_id;
end;
$$;

revoke all on function public.review_program_radar_candidate(uuid, uuid, text, text, text, date, text, text[]) from public, anon, authenticated;
grant execute on function public.review_program_radar_candidate(uuid, uuid, text, text, text, date, text, text[]) to service_role;
