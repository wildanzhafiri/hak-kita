create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

revoke all on table public.user_roles from anon, public, authenticated;
grant select on table public.user_roles to authenticated;

create policy "Users can read their own role"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id);

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where lower(email) = lower('adminkita@hakkita.com')
on conflict (user_id) do update set role = excluded.role;
