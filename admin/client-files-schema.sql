-- ═══ Área do cliente — fase 4: arquivos nos dois sentidos ═══
-- Cópia de referência da migração `amaralesilva_client_files` (projeto mApps).
-- O cliente envia o que a equipe pediu (logotipo, textos, acessos) e recebe o
-- que a equipe entrega. Os arquivos ficam num bucket PRIVADO do Storage, em
-- <client_id>/<project_id|geral>/<uuid>-<nome>; a tabela guarda o cadastro.
-- Plano em docs/plano-area-do-cliente.md.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('amaralesilva-client-files', 'amaralesilva-client-files', false, 26214400, array[
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf', 'application/zip', 'application/x-zip-compressed',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv', 'application/json', 'application/postscript',
  'font/otf', 'font/ttf', 'font/woff', 'font/woff2', 'video/mp4', 'audio/mpeg'
])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.amaralesilva_client_files (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid not null references public.amaralesilva_clients(id) on delete cascade,
  project_id         uuid references public.amaralesilva_projects(id) on delete set null,
  name               text not null check (char_length(name) between 1 and 200),
  path               text not null unique,
  size               bigint check (size is null or size >= 0),
  mime               text,
  note               text check (note is null or char_length(note) <= 500),
  uploaded_by_email  text not null,
  uploaded_by_name   text,
  uploaded_by_role   text not null check (uploaded_by_role in ('cliente', 'equipe')),
  created_at         timestamptz not null default now()
);
create index if not exists amaralesilva_client_files_client_idx on public.amaralesilva_client_files (client_id, created_at desc);
alter table public.amaralesilva_client_files enable row level security;
drop policy if exists "amaralesilva client_files members" on public.amaralesilva_client_files;
create policy "amaralesilva client_files members" on public.amaralesilva_client_files
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());

-- Storage: a equipe mexe em tudo; o cliente só na pasta do próprio cliente, e
-- só apaga o que ele mesmo enviou.
drop policy if exists "amaralesilva client files select" on storage.objects;
create policy "amaralesilva client files select" on storage.objects for select to authenticated
  using (bucket_id = 'amaralesilva-client-files' and (
    public.amaralesilva_is_member()
    or (storage.foldername(name))[1] in (select c::text from public.amaralesilva_my_client_ids() c)));
drop policy if exists "amaralesilva client files insert" on storage.objects;
create policy "amaralesilva client files insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'amaralesilva-client-files' and (
    public.amaralesilva_is_member()
    or (storage.foldername(name))[1] in (select c::text from public.amaralesilva_my_client_ids() c)));
drop policy if exists "amaralesilva client files delete" on storage.objects;
create policy "amaralesilva client files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'amaralesilva-client-files' and (
    public.amaralesilva_is_member()
    or (owner_id = (select auth.uid()::text)
        and (storage.foldername(name))[1] in (select c::text from public.amaralesilva_my_client_ids() c))));

-- O cliente lê só pelas funções abaixo.
create or replace function public.amaralesilva_portal_files()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'client_id', f.client_id, 'project_id', f.project_id, 'name', f.name, 'path', f.path,
    'size', f.size, 'mime', f.mime, 'note', f.note, 'by_role', f.uploaded_by_role, 'by_name', f.uploaded_by_name,
    'mine', lower(f.uploaded_by_email) = lower(coalesce(auth.jwt() ->> 'email', '')),
    'created_at', f.created_at) order by f.created_at desc), '[]'::jsonb)
  from public.amaralesilva_client_files f
  where f.client_id in (select public.amaralesilva_my_client_ids());
$$;

-- Registra o arquivo depois do envio ao Storage. Confere que o caminho é de um
-- cliente da pessoa (ou que é equipe), que o projeto é desse cliente e que o
-- objeto existe de fato no bucket.
create or replace function public.amaralesilva_portal_register_file(
  p_path text, p_name text, p_size bigint, p_mime text, p_project uuid, p_note text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  r text := public.amaralesilva_my_role();
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  cid uuid; nm text; new_id uuid;
begin
  if r is null then raise exception 'sem acesso' using errcode = '42501'; end if;
  begin cid := split_part(p_path, '/', 1)::uuid; exception when others then raise exception 'caminho inválido'; end;
  if r = 'cliente' and cid not in (select public.amaralesilva_my_client_ids()) then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if not exists (select 1 from public.amaralesilva_clients where id = cid) then raise exception 'cliente inexistente'; end if;
  if p_project is not null and not exists (select 1 from public.amaralesilva_projects where id = p_project and client_id = cid) then
    raise exception 'projeto não é deste cliente';
  end if;
  if not exists (select 1 from storage.objects where bucket_id = 'amaralesilva-client-files' and name = p_path) then
    raise exception 'arquivo não encontrado no armazenamento';
  end if;
  if r = 'equipe' then
    select name into nm from public.amaralesilva_members where lower(email) = em;
  else
    select coalesce(nullif(name, ''), split_part(email, '@', 1)) into nm from public.amaralesilva_client_users where lower(email) = em;
  end if;
  insert into public.amaralesilva_client_files (client_id, project_id, name, path, size, mime, note, uploaded_by_email, uploaded_by_name, uploaded_by_role)
  values (cid, p_project, left(btrim(p_name), 200), p_path, p_size, p_mime, nullif(left(btrim(coalesce(p_note, '')), 500), ''), em, coalesce(nm, split_part(em, '@', 1)), r)
  returning id into new_id;
  return new_id;
end;
$$;

-- Cliente remove o que ele mesmo enviou (o objeto sai do Storage antes, pelo
-- navegador, com a política de delete acima).
create or replace function public.amaralesilva_portal_delete_file(p_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare n int;
begin
  if public.amaralesilva_my_role() is distinct from 'cliente' then raise exception 'sem acesso' using errcode = '42501'; end if;
  delete from public.amaralesilva_client_files
  where id = p_id and uploaded_by_role = 'cliente'
    and lower(uploaded_by_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and client_id in (select public.amaralesilva_my_client_ids());
  get diagnostics n = row_count;
  if n = 0 then raise exception 'arquivo não encontrado'; end if;
end;
$$;

create or replace function public.amaralesilva_push_on_client_file() returns trigger
language plpgsql security definer set search_path = public
as $$
declare cli text;
begin
  if new.uploaded_by_role = 'cliente' then
    select name into cli from public.amaralesilva_clients where id = new.client_id;
    perform public.amaralesilva_push('Arquivo enviado pelo cliente',
      concat_ws(' · ', cli, left(new.name, 80)), '/admin#/arquivos', 'file-' || new.id);
  end if;
  return new;
end $$;
revoke execute on function public.amaralesilva_push_on_client_file() from public, anon, authenticated;
drop trigger if exists amaralesilva_client_files_push on public.amaralesilva_client_files;
create trigger amaralesilva_client_files_push after insert on public.amaralesilva_client_files
  for each row execute function public.amaralesilva_push_on_client_file();

revoke execute on function public.amaralesilva_portal_files(), public.amaralesilva_portal_register_file(text, text, bigint, text, uuid, text),
  public.amaralesilva_portal_delete_file(uuid) from public, anon;
grant execute on function public.amaralesilva_portal_files(), public.amaralesilva_portal_register_file(text, text, bigint, text, uuid, text),
  public.amaralesilva_portal_delete_file(uuid) to authenticated;
