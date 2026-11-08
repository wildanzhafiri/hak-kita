create table public.saved_programs (
  user_id uuid not null references auth.users (id) on delete cascade,
  program_id text not null check (char_length(program_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, program_id)
);

alter table public.saved_programs enable row level security;

revoke all on table public.saved_programs from anon, public;
grant select, insert, delete on table public.saved_programs to authenticated;

create policy "Users can read their saved programs"
on public.saved_programs
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can save their own programs"
on public.saved_programs
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can remove their own programs"
on public.saved_programs
for delete
to authenticated
using ((select auth.uid()) = user_id);
