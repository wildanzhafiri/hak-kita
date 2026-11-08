create table public.program_email_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null default false,
  enabled_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.program_email_preferences enable row level security;

revoke all on table public.program_email_preferences from anon, public;
grant select, insert, update, delete on table public.program_email_preferences to authenticated;

create policy "Users can read their email preference"
on public.program_email_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their email preference"
on public.program_email_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their email preference"
on public.program_email_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their email preference"
on public.program_email_preferences for delete to authenticated
using ((select auth.uid()) = user_id);

create function public.set_program_email_preference_times()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  if tg_op = 'INSERT' then
    new.enabled_at = now();
  elsif new.enabled and not old.enabled then
    new.enabled_at = now();
  else
    new.enabled_at = old.enabled_at;
  end if;
  return new;
end;
$$;

create trigger set_program_email_preference_times
before insert or update on public.program_email_preferences
for each row execute function public.set_program_email_preference_times();

revoke all on function public.set_program_email_preference_times() from anon, authenticated, public;

create table public.program_email_state (
  user_id uuid not null,
  program_id text not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id, program_id),
  foreign key (user_id, program_id) references public.program_follows (user_id, program_id) on delete cascade
);

alter table public.program_email_state enable row level security;
revoke all on table public.program_email_state from anon, authenticated, public;
grant select, insert, update, delete on table public.program_email_state to service_role;

create table public.program_email_deliveries (
  id text primary key,
  user_id uuid not null,
  program_id text not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (user_id, program_id) references public.program_follows (user_id, program_id) on delete cascade
);

create index program_email_deliveries_status_idx on public.program_email_deliveries (status, claimed_at);

alter table public.program_email_deliveries enable row level security;
revoke all on table public.program_email_deliveries from anon, authenticated, public;
grant select, insert, update, delete on table public.program_email_deliveries to service_role;
