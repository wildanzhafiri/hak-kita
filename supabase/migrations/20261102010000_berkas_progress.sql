create table public.berkas_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  program_id text not null check (char_length(program_id) between 1 and 100),
  checked_item_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, program_id)
);

alter table public.berkas_progress enable row level security;

revoke all on table public.berkas_progress from anon, public;
grant select, insert, update, delete on table public.berkas_progress to authenticated;

create policy "Users can read their berkas progress"
on public.berkas_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their berkas progress"
on public.berkas_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their berkas progress"
on public.berkas_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their berkas progress"
on public.berkas_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);
