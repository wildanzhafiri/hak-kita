create table public.program_news (
  id uuid primary key default gen_random_uuid(),
  program_id text not null references public.programs (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 8 and 180),
  summary text not null check (char_length(trim(summary)) between 20 and 600),
  source_url text not null check (source_url ~* '^https://([a-z0-9-]+\.)*go\.id(/|\?|#|$)'),
  published_on date not null,
  created_at timestamptz not null default now(),
  unique (program_id, source_url)
);

create index program_news_program_created_idx on public.program_news (program_id, created_at);

alter table public.program_news enable row level security;
revoke all on table public.program_news from anon, authenticated, public;
grant select, insert, update, delete on table public.program_news to service_role;

create table public.program_news_email_deliveries (
  id text primary key,
  user_id uuid not null,
  program_id text not null,
  news_id uuid not null references public.program_news (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, news_id),
  foreign key (user_id, program_id) references public.program_follows (user_id, program_id) on delete cascade
);

create index program_news_email_deliveries_status_idx on public.program_news_email_deliveries (status, claimed_at);

alter table public.program_news_email_deliveries enable row level security;
revoke all on table public.program_news_email_deliveries from anon, authenticated, public;
grant select, insert, update, delete on table public.program_news_email_deliveries to service_role;
