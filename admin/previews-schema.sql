-- ═══ Área do cliente — fase 3: prévias, comentários e aprovação ═══
-- Cópia de referência da migração `amaralesilva_previews` (projeto mApps).
-- Plano em docs/plano-area-do-cliente.md. Os arquivos de cada prévia vivem no
-- repositório, em previa/<slug>/, e só abrem com sessão válida: o
-- middleware.js pergunta a amaralesilva_preview_access(slug) com o token da
-- pessoa. A tabela guarda só o cadastro e o estado de cada versão.
--
-- O cliente nunca lê estas tabelas direto: tudo passa pelas funções
-- amaralesilva_portal_* (security definer), que checam o dono do projeto.

create table if not exists public.amaralesilva_previews (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.amaralesilva_projects(id) on delete cascade,
  version      int  not null check (version > 0),
  title        text,
  slug         text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,80}$'),
  status       text not null default 'rascunho'
               check (status in ('rascunho', 'publicada', 'ajustes', 'aprovada', 'substituida')),
  published_at timestamptz,
  approved_at  timestamptz,
  approved_by  text,
  created_at   timestamptz not null default now(),
  unique (project_id, version)
);

create table if not exists public.amaralesilva_preview_comments (
  id           uuid primary key default gen_random_uuid(),
  preview_id   uuid not null references public.amaralesilva_previews(id) on delete cascade,
  parent_id    uuid references public.amaralesilva_preview_comments(id) on delete cascade,
  author_email text not null,
  author_name  text not null,
  author_role  text not null check (author_role in ('cliente', 'equipe')),
  kind         text not null default 'comentario' check (kind in ('comentario', 'ajuste', 'aprovacao')),
  body         text not null check (char_length(body) between 1 and 2000),
  path         text,
  x            numeric(6, 3) check (x is null or (x >= 0 and x <= 100)),
  y            numeric(9, 1) check (y is null or y >= 0),
  resolved     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists amaralesilva_preview_comments_preview_idx on public.amaralesilva_preview_comments (preview_id, created_at);
create index if not exists amaralesilva_previews_project_idx on public.amaralesilva_previews (project_id);

alter table public.amaralesilva_previews enable row level security;
alter table public.amaralesilva_preview_comments enable row level security;
drop policy if exists "amaralesilva previews members" on public.amaralesilva_previews;
create policy "amaralesilva previews members" on public.amaralesilva_previews
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());
drop policy if exists "amaralesilva preview_comments members" on public.amaralesilva_preview_comments;
create policy "amaralesilva preview_comments members" on public.amaralesilva_preview_comments
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());

-- Quem pode abrir uma versão: a equipe vê todas; o cliente, as que não são
-- rascunho de projeto dele já na fase de proposta enviada em diante.
create or replace function public.amaralesilva_preview_visible(p_preview uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select case
    when public.amaralesilva_is_member() then exists (select 1 from public.amaralesilva_previews where id = p_preview)
    else exists (
      select 1 from public.amaralesilva_previews v
      join public.amaralesilva_projects p on p.id = v.project_id
      where v.id = p_preview and v.status <> 'rascunho'
        and p.client_id in (select public.amaralesilva_my_client_ids())
        and p.status in ('proposta_enviada', 'negociacao', 'fechado', 'concluido')
    )
  end;
$$;

-- Chamada pelo middleware.js (com o token da pessoa) a cada arquivo de
-- /previa/<slug>/.
create or replace function public.amaralesilva_preview_access(p_slug text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((
    select public.amaralesilva_preview_visible(v.id)
    from public.amaralesilva_previews v where v.slug = p_slug
  ), false);
$$;

-- Prévias do(s) cliente(s) da pessoa logada, para a tela inicial.
create or replace function public.amaralesilva_portal_previews()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'project_id', v.project_id, 'version', v.version, 'title', v.title,
    'status', v.status, 'published_at', v.published_at, 'approved_at', v.approved_at,
    'open_comments', (select count(*) from public.amaralesilva_preview_comments c
                      where c.preview_id = v.id and c.parent_id is null and c.kind = 'comentario' and not c.resolved)
  ) order by v.version desc), '[]'::jsonb)
  from public.amaralesilva_previews v
  join public.amaralesilva_projects p on p.id = v.project_id
  where v.status <> 'rascunho'
    and p.client_id in (select public.amaralesilva_my_client_ids())
    and p.status in ('proposta_enviada', 'negociacao', 'fechado', 'concluido');
$$;

create or replace function public.amaralesilva_portal_preview(p_id uuid)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare r text := public.amaralesilva_my_role(); pv record;
begin
  if r is null or not public.amaralesilva_preview_visible(p_id) then return null; end if;
  select v.*, p.name as pname, c.name as cname into pv
  from public.amaralesilva_previews v
  join public.amaralesilva_projects p on p.id = v.project_id
  left join public.amaralesilva_clients c on c.id = p.client_id
  where v.id = p_id;
  return jsonb_build_object(
    'role', r,
    'preview', jsonb_build_object(
      'id', pv.id, 'project_id', pv.project_id, 'project_name', pv.pname, 'client_name', pv.cname,
      'version', pv.version, 'title', pv.title, 'slug', pv.slug, 'status', pv.status,
      'published_at', pv.published_at, 'approved_at', pv.approved_at),
    'versions', (
      select coalesce(jsonb_agg(jsonb_build_object('id', x.id, 'version', x.version, 'status', x.status) order by x.version), '[]'::jsonb)
      from public.amaralesilva_previews x
      where x.project_id = pv.project_id and (r = 'equipe' or x.status <> 'rascunho'))
  );
end;
$$;

create or replace function public.amaralesilva_portal_comments(p_preview uuid)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
begin
  if public.amaralesilva_my_role() is null or not public.amaralesilva_preview_visible(p_preview) then return '[]'::jsonb; end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', c.id, 'parent_id', c.parent_id, 'author_name', c.author_name, 'author_role', c.author_role,
      'kind', c.kind, 'body', c.body, 'path', c.path, 'x', c.x, 'y', c.y, 'resolved', c.resolved,
      'created_at', c.created_at,
      'mine', lower(c.author_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    ) order by c.created_at), '[]'::jsonb)
    from public.amaralesilva_preview_comments c where c.preview_id = p_preview
  );
end;
$$;

create or replace function public.amaralesilva_portal_add_comment(
  p_preview uuid, p_body text, p_path text, p_x numeric, p_y numeric, p_parent uuid)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  r text := public.amaralesilva_my_role();
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  b text := btrim(coalesce(p_body, ''));
  nm text; new_id uuid;
begin
  if r is null or not public.amaralesilva_preview_visible(p_preview) then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if char_length(b) < 1 or char_length(b) > 2000 then raise exception 'comentário vazio ou longo demais'; end if;
  if p_parent is not null and not exists (
    select 1 from public.amaralesilva_preview_comments where id = p_parent and preview_id = p_preview and parent_id is null
  ) then raise exception 'comentário de origem inválido'; end if;
  if r = 'equipe' then
    select name into nm from public.amaralesilva_members where lower(email) = em;
  else
    select coalesce(nullif(name, ''), split_part(email, '@', 1)) into nm from public.amaralesilva_client_users where lower(email) = em;
  end if;
  insert into public.amaralesilva_preview_comments (preview_id, parent_id, author_email, author_name, author_role, kind, body, path, x, y)
  values (p_preview, p_parent, em, coalesce(nm, split_part(em, '@', 1)), r, 'comentario', b, left(p_path, 300),
          case when p_x between 0 and 100 then p_x end, case when p_y >= 0 then p_y end)
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.amaralesilva_portal_approve(p_preview uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare em text := lower(coalesce(auth.jwt() ->> 'email', '')); n int;
begin
  if public.amaralesilva_my_role() is distinct from 'cliente' or not public.amaralesilva_preview_visible(p_preview) then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  update public.amaralesilva_previews set status = 'aprovada', approved_at = now(), approved_by = em
  where id = p_preview and status in ('publicada', 'ajustes');
  get diagnostics n = row_count;
  if n = 0 then raise exception 'esta versão não está aberta para aprovação'; end if;
  insert into public.amaralesilva_preview_comments (preview_id, author_email, author_name, author_role, kind, body)
  values (p_preview, em, coalesce((select coalesce(nullif(name, ''), split_part(email, '@', 1)) from public.amaralesilva_client_users where lower(email) = em), em), 'cliente', 'aprovacao', 'Aprovou esta versão.');
end;
$$;

create or replace function public.amaralesilva_portal_request_changes(p_preview uuid, p_body text)
returns void
language plpgsql security definer
set search_path = public
as $$
declare em text := lower(coalesce(auth.jwt() ->> 'email', '')); b text := btrim(coalesce(p_body, '')); n int;
begin
  if public.amaralesilva_my_role() is distinct from 'cliente' or not public.amaralesilva_preview_visible(p_preview) then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if char_length(b) < 1 or char_length(b) > 2000 then raise exception 'descreva os ajustes (até 2000 caracteres)'; end if;
  update public.amaralesilva_previews set status = 'ajustes' where id = p_preview and status in ('publicada', 'ajustes');
  get diagnostics n = row_count;
  if n = 0 then raise exception 'esta versão não está aberta para ajustes'; end if;
  insert into public.amaralesilva_preview_comments (preview_id, author_email, author_name, author_role, kind, body)
  values (p_preview, em, coalesce((select coalesce(nullif(name, ''), split_part(email, '@', 1)) from public.amaralesilva_client_users where lower(email) = em), em), 'cliente', 'ajuste', b);
end;
$$;

-- Avisa a dupla (Web Push, ver push-schema.sql) quando o cliente comenta,
-- pede ajustes ou aprova.
create or replace function public.amaralesilva_push_on_preview_comment() returns trigger
language plpgsql security definer set search_path = public
as $$
declare proj text; ver int;
begin
  if new.author_role = 'cliente' then
    select p.name, v.version into proj, ver
    from public.amaralesilva_previews v join public.amaralesilva_projects p on p.id = v.project_id where v.id = new.preview_id;
    perform public.amaralesilva_push(
      case new.kind when 'aprovacao' then 'Prévia aprovada' when 'ajuste' then 'Cliente pediu ajustes' else 'Comentário na prévia' end,
      concat_ws(' · ', proj, 'v' || ver, new.author_name, left(new.body, 80)),
      '/admin#/previas', 'prev-' || new.preview_id);
  end if;
  return new;
end $$;
revoke execute on function public.amaralesilva_push_on_preview_comment() from public, anon, authenticated;
drop trigger if exists amaralesilva_preview_comments_push on public.amaralesilva_preview_comments;
create trigger amaralesilva_preview_comments_push after insert on public.amaralesilva_preview_comments
  for each row execute function public.amaralesilva_push_on_preview_comment();

revoke execute on function public.amaralesilva_preview_visible(uuid), public.amaralesilva_preview_access(text),
  public.amaralesilva_portal_previews(), public.amaralesilva_portal_preview(uuid), public.amaralesilva_portal_comments(uuid),
  public.amaralesilva_portal_add_comment(uuid, text, text, numeric, numeric, uuid),
  public.amaralesilva_portal_approve(uuid), public.amaralesilva_portal_request_changes(uuid, text) from public, anon;
grant execute on function public.amaralesilva_preview_visible(uuid), public.amaralesilva_preview_access(text),
  public.amaralesilva_portal_previews(), public.amaralesilva_portal_preview(uuid), public.amaralesilva_portal_comments(uuid),
  public.amaralesilva_portal_add_comment(uuid, text, text, numeric, numeric, uuid),
  public.amaralesilva_portal_approve(uuid), public.amaralesilva_portal_request_changes(uuid, text) to authenticated;
