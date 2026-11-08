create table public.condition_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null check (jsonb_typeof(profile) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.condition_profiles enable row level security;

revoke all on table public.condition_profiles from anon, public;
grant select, insert, update, delete on table public.condition_profiles to authenticated;

create policy "Users can read their condition profile"
on public.condition_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their condition profile"
on public.condition_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their condition profile"
on public.condition_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their condition profile"
on public.condition_profiles
for delete
to authenticated
using ((select auth.uid()) = user_id);
