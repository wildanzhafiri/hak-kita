create table public.program_follows (
  user_id uuid not null references auth.users (id) on delete cascade,
  program_id text not null check (char_length(program_id) between 1 and 100),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, program_id)
);

alter table public.program_follows enable row level security;

revoke all on table public.program_follows from anon, public;
grant select, insert, update, delete on table public.program_follows to authenticated;

create policy "Users can read their followed programs"
on public.program_follows
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can follow programs with their account"
on public.program_follows
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can acknowledge updates to their followed programs"
on public.program_follows
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can stop following their programs"
on public.program_follows
for delete
to authenticated
using ((select auth.uid()) = user_id);
