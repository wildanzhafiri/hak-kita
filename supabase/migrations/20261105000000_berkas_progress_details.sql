alter table public.berkas_progress
  add column answers jsonb not null default '{}'::jsonb,
  add column note text not null default '',
  add column details_updated_at timestamptz,
  add constraint berkas_progress_answers_shape check (
    jsonb_typeof(answers) = 'object'
    and octet_length(answers::text) <= 4096
    and answers::text !~ '[0-9]{16}'
  ),
  add constraint berkas_progress_note_safe check (
    char_length(note) <= 500
    and note !~ '[0-9]([[:space:].-]*[0-9]){15}'
  );
