create table public.information_records (
  id text primary key check (char_length(id) between 1 and 100),
  kind text not null check (kind in ('program', 'layanan'))
);

alter table public.information_records enable row level security;
revoke all on table public.information_records from public, anon, authenticated;
grant all on table public.information_records to service_role;

update public.programs
set record = jsonb_set(
  jsonb_set(
    record,
    '{jenis}',
    to_jsonb(
      case
        when record ->> 'jenis' = 'layanan'
          or record ->> 'kategori' = 'Layanan Administrasi'
          or record ->> 'kategori' in (
            'Kependudukan & Dokumen Pribadi',
            'Kendaraan & Transportasi',
            'Kesehatan & Jaminan Sosial',
            'Pekerjaan & Usaha',
            'Perpajakan',
            'Pendidikan & Dokumen Akademik',
            'Pertanahan & Bangunan',
            'Pengaduan & Informasi Publik'
          )
        then 'layanan'
        else 'program'
      end
    ),
    true
  ),
  '{kategori}',
  to_jsonb(
    case
      when record ->> 'kategori' <> 'Layanan Administrasi' then record ->> 'kategori'
      else case id
        when 'akta-kelahiran' then 'Kependudukan & Dokumen Pribadi'
        when 'kartu-keluarga' then 'Kependudukan & Dokumen Pribadi'
        when 'ktp-el' then 'Kependudukan & Dokumen Pribadi'
        when 'npwp' then 'Perpajakan'
        when 'paspor-baru' then 'Kependudukan & Dokumen Pribadi'
        when 'pendaftaran-jkn' then 'Kesehatan & Jaminan Sosial'
        when 'perpanjangan-sim' then 'Kendaraan & Transportasi'
        when 'sim-baru' then 'Kendaraan & Transportasi'
        else record ->> 'kategori'
      end
    end
  ),
  true
)
where record ->> 'jenis' is distinct from 'program'
   or record ->> 'kategori' = 'Layanan Administrasi';

do $$
begin
  if exists (
    select 1
    from public.programs as information
    where information.record ->> 'jenis' = 'layanan'
      and (
        exists (select 1 from public.obstacle_reports as reports where reports.program_id = information.id)
        or exists (select 1 from public.program_news as news where news.program_id = information.id)
        or exists (select 1 from public.program_radar_candidates as candidates where candidates.program_id = information.id)
        or exists (select 1 from public.program_radar_program_candidates as candidates where candidates.program_id = information.id)
        or exists (select 1 from public.program_follows as follows where follows.program_id = information.id)
      )
  ) then
    raise exception 'Program/service split stopped: service rows are linked to program-only activity data';
  end if;
end;
$$;

insert into public.information_records (id, kind)
select id, record ->> 'jenis'
from public.programs;

create or replace function public.sync_information_record_registry()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  information_kind text;
  affected_rows integer;
begin
  if tg_op = 'DELETE' then
    if tg_table_name = 'programs'
       and exists (select 1 from public.public_services where id = old.id) then
      return old;
    end if;
    if tg_table_name = 'public_services'
       and exists (select 1 from public.programs where id = old.id) then
      return old;
    end if;
    delete from public.information_records where id = old.id;
    return old;
  end if;

  information_kind := case tg_table_name
    when 'programs' then 'program'
    when 'public_services' then 'layanan'
    else null
  end;

  if new.record ->> 'jenis' is distinct from information_kind then
    raise exception 'Information kind does not match its storage table';
  end if;

  insert into public.information_records (id, kind)
  values (new.id, information_kind)
  on conflict (id) do update set kind = excluded.kind
  where information_records.kind = excluded.kind;
  get diagnostics affected_rows = row_count;
  if affected_rows = 0 then
    raise exception using
      errcode = '23505',
      message = 'Information ID already belongs to another kind';
  end if;

  return new;
end;
$$;

create trigger programs_registry_sync
after insert or update or delete on public.programs
for each row execute function public.sync_information_record_registry();

create table public.public_services (
  id text primary key,
  record jsonb not null,
  updated_at timestamptz not null default now(),
  constraint public_services_record_object check (jsonb_typeof(record) = 'object'),
  constraint public_services_record_id_matches check (record ->> 'id' = id),
  constraint public_services_record_kind check (record ->> 'jenis' = 'layanan')
);

alter table public.public_services enable row level security;
revoke all on table public.public_services from public, anon, authenticated;
grant all on table public.public_services to service_role;

create trigger public_services_registry_sync
after insert or update or delete on public.public_services
for each row execute function public.sync_information_record_registry();

insert into public.public_services (id, record, updated_at)
select id, record, updated_at
from public.programs
where record ->> 'jenis' = 'layanan';

alter table public.program_knowledge_documents
  add column public_service_id text references public.public_services(id) on delete cascade,
  alter column program_id drop not null;

update public.program_knowledge_documents as documents
set public_service_id = documents.program_id,
    program_id = null
where exists (
  select 1
  from public.public_services as services
  where services.id = documents.program_id
);

alter table public.program_knowledge_documents
  drop constraint program_knowledge_documents_program_id_fkey,
  drop constraint program_knowledge_documents_program_id_matches,
  add constraint program_knowledge_documents_program_id_fkey
    foreign key (program_id) references public.programs(id) on delete cascade,
  add constraint program_knowledge_documents_information_id check (
    (program_id is not null and public_service_id is null and record ->> 'programId' = program_id)
    or (program_id is null and public_service_id is not null and record ->> 'programId' = public_service_id)
  );

create index program_knowledge_documents_public_service_id_idx
  on public.program_knowledge_documents (public_service_id);

delete from public.programs where record ->> 'jenis' = 'layanan';

alter table public.programs
  add constraint programs_record_kind check (record ->> 'jenis' = 'program');
