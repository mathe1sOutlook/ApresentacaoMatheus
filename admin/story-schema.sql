-- ═══ Área do cliente — Histórias: capítulos, personagens com fotos e escolhas ═══
-- Cópia de referência da migração `amaralesilva_story` (projeto mApps).
-- Para projetos de livro ilustrado (hoje: o Sítio Encantado do Carlos Lima). O
-- cliente escreve os capítulos, cadastra os personagens com fotos de rosto e de
-- perfil, e manda as escolhas de desenho que fez no livro (a prévia).
--
-- Só aparece para quem tem projeto com story_enabled = true. O cliente não lê
-- estas tabelas direto: lê amaralesilva_portal_story() e grava pelas funções
-- amaralesilva_portal_story_*, que conferem o dono do projeto. As fotos ficam
-- no bucket privado amaralesilva-client-files, em <client_id>/personagens/….

alter table public.amaralesilva_projects
  add column if not exists story_enabled boolean not null default false;

create table if not exists public.amaralesilva_story_characters (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.amaralesilva_projects(id) on delete cascade,
  name               text not null check (char_length(btrim(name)) between 1 and 80),
  notes              text check (notes is null or char_length(notes) <= 1000),
  created_by_email   text not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists amaralesilva_story_characters_project_idx
  on public.amaralesilva_story_characters (project_id, created_at);

create table if not exists public.amaralesilva_story_photos (
  id                 uuid primary key default gen_random_uuid(),
  character_id       uuid not null references public.amaralesilva_story_characters(id) on delete cascade,
  path               text not null unique,
  name               text not null check (char_length(name) between 1 and 200),
  size               bigint check (size is null or size >= 0),
  mime               text,
  angle              text not null default 'rosto' check (angle in ('rosto', 'perfil', 'corpo', 'outra')),
  uploaded_by_email  text not null,
  created_at         timestamptz not null default now()
);
create index if not exists amaralesilva_story_photos_character_idx
  on public.amaralesilva_story_photos (character_id, created_at);

create table if not exists public.amaralesilva_story_chapters (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid not null references public.amaralesilva_projects(id) on delete cascade,
  number             int  not null check (number > 0),
  title              text not null check (char_length(btrim(title)) between 1 and 160),
  body               text not null check (char_length(body) between 1 and 200000),
  created_by_email   text not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (project_id, number)
);

create table if not exists public.amaralesilva_story_choices (
  project_id         uuid primary key references public.amaralesilva_projects(id) on delete cascade,
  selection          jsonb not null,
  model              text,
  updated_by_email   text not null,
  updated_at         timestamptz not null default now()
);

alter table public.amaralesilva_story_characters enable row level security;
alter table public.amaralesilva_story_photos     enable row level security;
alter table public.amaralesilva_story_chapters   enable row level security;
alter table public.amaralesilva_story_choices    enable row level security;

drop policy if exists "amaralesilva story_characters members" on public.amaralesilva_story_characters;
create policy "amaralesilva story_characters members" on public.amaralesilva_story_characters
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());
drop policy if exists "amaralesilva story_photos members" on public.amaralesilva_story_photos;
create policy "amaralesilva story_photos members" on public.amaralesilva_story_photos
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());
drop policy if exists "amaralesilva story_chapters members" on public.amaralesilva_story_chapters;
create policy "amaralesilva story_chapters members" on public.amaralesilva_story_chapters
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());
drop policy if exists "amaralesilva story_choices members" on public.amaralesilva_story_choices;
create policy "amaralesilva story_choices members" on public.amaralesilva_story_choices
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());

-- Confere que quem chama pode mexer na história do projeto: a equipe sempre; o
-- cliente só no projeto dele marcado com story_enabled. Devolve o client_id.
create or replace function public.amaralesilva_story_guard(p_project uuid)
returns uuid
language plpgsql stable security definer
set search_path = public
as $$
declare
  r text := public.amaralesilva_my_role();
  cid uuid;
  en boolean;
begin
  if r is null then raise exception 'sem acesso' using errcode = '42501'; end if;
  select client_id, story_enabled into cid, en from public.amaralesilva_projects where id = p_project;
  if cid is null then raise exception 'projeto inexistente'; end if;
  if r = 'cliente' and not (en and cid in (select public.amaralesilva_my_client_ids())) then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  return cid;
end;
$$;
revoke execute on function public.amaralesilva_story_guard(uuid) from public, anon;
grant  execute on function public.amaralesilva_story_guard(uuid) to authenticated;

-- Tudo o que a tela do cliente precisa, de uma vez. Lista só os projetos do
-- cliente com story_enabled; para a equipe, devolve vazio (ela lê as tabelas).
create or replace function public.amaralesilva_portal_story()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'project_id', p.id,
    'project_name', p.name,
    'client_id', p.client_id,
    'characters', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'notes', c.notes,
        'photos', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', f.id, 'path', f.path, 'name', f.name, 'angle', f.angle, 'size', f.size,
            'created_at', f.created_at) order by f.created_at), '[]'::jsonb)
          from public.amaralesilva_story_photos f where f.character_id = c.id)
      ) order by c.created_at), '[]'::jsonb)
      from public.amaralesilva_story_characters c where c.project_id = p.id),
    'chapters', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', h.id, 'number', h.number, 'title', h.title, 'body', h.body,
        'updated_at', h.updated_at) order by h.number), '[]'::jsonb)
      from public.amaralesilva_story_chapters h where h.project_id = p.id),
    'choices', (select jsonb_build_object('selection', s.selection, 'model', s.model, 'updated_at', s.updated_at)
      from public.amaralesilva_story_choices s where s.project_id = p.id)
  ) order by p.created_at), '[]'::jsonb)
  from public.amaralesilva_projects p
  where p.story_enabled and p.client_id in (select public.amaralesilva_my_client_ids());
$$;

-- Capítulo: cria (p_id nulo) ou atualiza. O número é único por projeto.
create or replace function public.amaralesilva_portal_story_chapter_save(
  p_project uuid, p_id uuid, p_number int, p_title text, p_body text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  cid uuid := public.amaralesilva_story_guard(p_project);
  new_id uuid;
  cli text;
begin
  if p_id is null then
    insert into public.amaralesilva_story_chapters (project_id, number, title, body, created_by_email)
    values (p_project, p_number, left(btrim(p_title), 160), p_body, em)
    returning id into new_id;
  else
    update public.amaralesilva_story_chapters
       set number = p_number, title = left(btrim(p_title), 160), body = p_body, updated_at = now()
     where id = p_id and project_id = p_project
    returning id into new_id;
    if new_id is null then raise exception 'capítulo não encontrado'; end if;
  end if;
  if public.amaralesilva_my_role() = 'cliente' then
    select name into cli from public.amaralesilva_clients where id = cid;
    perform public.amaralesilva_push('Capítulo enviado pelo cliente',
      concat_ws(' · ', cli, 'Capítulo ' || p_number, left(btrim(p_title), 80)),
      '/admin#/historias', 'story-chapter-' || new_id);
  end if;
  return new_id;
end;
$$;

create or replace function public.amaralesilva_portal_story_chapter_delete(p_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare pid uuid; n int;
begin
  select project_id into pid from public.amaralesilva_story_chapters where id = p_id;
  if pid is null then raise exception 'capítulo não encontrado'; end if;
  perform public.amaralesilva_story_guard(pid);
  delete from public.amaralesilva_story_chapters where id = p_id;
end;
$$;

-- Personagem: cria (p_id nulo) ou atualiza nome e observações.
create or replace function public.amaralesilva_portal_story_character_save(
  p_project uuid, p_id uuid, p_name text, p_notes text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  new_id uuid;
begin
  perform public.amaralesilva_story_guard(p_project);
  if p_id is null then
    insert into public.amaralesilva_story_characters (project_id, name, notes, created_by_email)
    values (p_project, left(btrim(p_name), 80), nullif(left(btrim(coalesce(p_notes, '')), 1000), ''), em)
    returning id into new_id;
  else
    update public.amaralesilva_story_characters
       set name = left(btrim(p_name), 80), notes = nullif(left(btrim(coalesce(p_notes, '')), 1000), ''), updated_at = now()
     where id = p_id and project_id = p_project
    returning id into new_id;
    if new_id is null then raise exception 'personagem não encontrado'; end if;
  end if;
  return new_id;
end;
$$;

-- Remove o personagem e os cadastros das fotos. Os objetos do Storage saem
-- antes, pelo navegador (o cliente só apaga o que ele mesmo enviou).
create or replace function public.amaralesilva_portal_story_character_delete(p_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare pid uuid;
begin
  select project_id into pid from public.amaralesilva_story_characters where id = p_id;
  if pid is null then raise exception 'personagem não encontrado'; end if;
  perform public.amaralesilva_story_guard(pid);
  delete from public.amaralesilva_story_characters where id = p_id;
end;
$$;

-- Registra a foto depois do envio ao Storage. O caminho tem de ser da pasta do
-- cliente dono do projeto e o objeto tem de existir de fato.
create or replace function public.amaralesilva_portal_story_photo_register(
  p_character uuid, p_path text, p_name text, p_size bigint, p_mime text, p_angle text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  pid uuid; cid uuid; cname text; cli text; new_id uuid;
begin
  select c.project_id, c.name into pid, cname from public.amaralesilva_story_characters c where c.id = p_character;
  if pid is null then raise exception 'personagem não encontrado'; end if;
  cid := public.amaralesilva_story_guard(pid);
  if split_part(p_path, '/', 1) <> cid::text or split_part(p_path, '/', 2) <> 'personagens' then
    raise exception 'caminho inválido';
  end if;
  if not exists (select 1 from storage.objects where bucket_id = 'amaralesilva-client-files' and name = p_path) then
    raise exception 'arquivo não encontrado no armazenamento';
  end if;
  insert into public.amaralesilva_story_photos (character_id, path, name, size, mime, angle, uploaded_by_email)
  values (p_character, p_path, left(btrim(p_name), 200), p_size, p_mime,
          case when p_angle in ('rosto', 'perfil', 'corpo', 'outra') then p_angle else 'rosto' end, em)
  returning id into new_id;
  if public.amaralesilva_my_role() = 'cliente' then
    select name into cli from public.amaralesilva_clients where id = cid;
    perform public.amaralesilva_push('Foto de personagem enviada',
      concat_ws(' · ', cli, cname), '/admin#/historias', 'story-photo-' || p_character);
  end if;
  return new_id;
end;
$$;

-- Cliente remove só a foto que ele mesmo enviou (o objeto sai do Storage antes).
create or replace function public.amaralesilva_portal_story_photo_delete(p_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare pid uuid; em text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  select c.project_id into pid
    from public.amaralesilva_story_photos f join public.amaralesilva_story_characters c on c.id = f.character_id
   where f.id = p_id;
  if pid is null then raise exception 'foto não encontrada'; end if;
  perform public.amaralesilva_story_guard(pid);
  delete from public.amaralesilva_story_photos
   where id = p_id and (public.amaralesilva_my_role() = 'equipe' or lower(uploaded_by_email) = em);
  if not found then raise exception 'foto não encontrada'; end if;
end;
$$;

-- As escolhas de desenho feitas no livro (a prévia). Quem chama é a própria
-- página da prévia, que conhece só o slug: a função acha o projeto por ele.
create or replace function public.amaralesilva_portal_story_choices_save(
  p_slug text, p_selection jsonb, p_model text)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  pid uuid; cid uuid; cli text;
begin
  if jsonb_typeof(p_selection) is distinct from 'object' or length(p_selection::text) > 20000 then
    raise exception 'escolhas inválidas';
  end if;
  select project_id into pid from public.amaralesilva_previews where slug = p_slug;
  if pid is null then raise exception 'prévia não encontrada'; end if;
  cid := public.amaralesilva_story_guard(pid);
  insert into public.amaralesilva_story_choices (project_id, selection, model, updated_by_email)
  values (pid, p_selection, left(p_model, 60), em)
  on conflict (project_id) do update
    set selection = excluded.selection, model = excluded.model,
        updated_by_email = excluded.updated_by_email, updated_at = now();
  if public.amaralesilva_my_role() = 'cliente' then
    select name into cli from public.amaralesilva_clients where id = cid;
    perform public.amaralesilva_push('Escolhas do livro enviadas', cli, '/admin#/historias', 'story-choices-' || pid);
  end if;
end;
$$;

revoke execute on function
  public.amaralesilva_portal_story(),
  public.amaralesilva_portal_story_chapter_save(uuid, uuid, int, text, text),
  public.amaralesilva_portal_story_chapter_delete(uuid),
  public.amaralesilva_portal_story_character_save(uuid, uuid, text, text),
  public.amaralesilva_portal_story_character_delete(uuid),
  public.amaralesilva_portal_story_photo_register(uuid, text, text, bigint, text, text),
  public.amaralesilva_portal_story_photo_delete(uuid),
  public.amaralesilva_portal_story_choices_save(text, jsonb, text)
  from public, anon;
grant execute on function
  public.amaralesilva_portal_story(),
  public.amaralesilva_portal_story_chapter_save(uuid, uuid, int, text, text),
  public.amaralesilva_portal_story_chapter_delete(uuid),
  public.amaralesilva_portal_story_character_save(uuid, uuid, text, text),
  public.amaralesilva_portal_story_character_delete(uuid),
  public.amaralesilva_portal_story_photo_register(uuid, text, text, bigint, text, text),
  public.amaralesilva_portal_story_photo_delete(uuid),
  public.amaralesilva_portal_story_choices_save(text, jsonb, text)
  to authenticated;
