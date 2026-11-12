-- ═══ Área do cliente — fase 5: passagem para as contas do cliente ═══
-- Cópia de referência da migração `amaralesilva_handoff` (projeto mApps).
-- O site nasce hospedado de forma provisória na CASA MARTECH e, aprovado,
-- migra para as contas do cliente. Cada projeto tem um checklist do que muda de
-- mãos (site, domínio, código-fonte…), mantido pela equipe e lido pelo cliente.
-- Plano em docs/plano-area-do-cliente.md.

create table if not exists public.amaralesilva_handoff_items (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.amaralesilva_projects(id) on delete cascade,
  title         text not null check (char_length(title) between 1 and 120),
  from_where    text check (from_where is null or char_length(from_where) <= 200),
  to_where      text check (to_where is null or char_length(to_where) <= 200),
  status        text not null default 'a_definir'
                check (status in ('a_definir', 'aguarda_cliente', 'em_andamento', 'concluido')),
  client_action text check (client_action is null or char_length(client_action) <= 600),
  note          text check (note is null or char_length(note) <= 600),
  position      int  not null default 0,
  done_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists amaralesilva_handoff_items_project_idx on public.amaralesilva_handoff_items (project_id, position, created_at);
alter table public.amaralesilva_handoff_items enable row level security;
drop policy if exists "amaralesilva handoff members" on public.amaralesilva_handoff_items;
create policy "amaralesilva handoff members" on public.amaralesilva_handoff_items
  for all to authenticated using (public.amaralesilva_is_member()) with check (public.amaralesilva_is_member());

create or replace function public.amaralesilva_handoff_touch() returns trigger
language plpgsql set search_path = public
as $$
begin
  new.updated_at := now();
  if new.status = 'concluido' and (tg_op = 'INSERT' or old.status is distinct from 'concluido') then new.done_at := now();
  elsif new.status <> 'concluido' then new.done_at := null; end if;
  return new;
end $$;
drop trigger if exists amaralesilva_handoff_touch on public.amaralesilva_handoff_items;
create trigger amaralesilva_handoff_touch before insert or update on public.amaralesilva_handoff_items
  for each row execute function public.amaralesilva_handoff_touch();

-- O cliente lê só pelas funções abaixo, e só de projetos dele já na fase de
-- proposta enviada em diante (mesma regra de amaralesilva_portal_overview).
create or replace function public.amaralesilva_portal_handoff()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'project_id', i.project_id, 'title', i.title, 'from_where', i.from_where, 'to_where', i.to_where,
    'status', i.status, 'client_action', i.client_action, 'note', i.note, 'done_at', i.done_at
  ) order by i.position, i.created_at), '[]'::jsonb)
  from public.amaralesilva_handoff_items i
  join public.amaralesilva_projects p on p.id = i.project_id
  where p.client_id in (select public.amaralesilva_my_client_ids())
    and p.status in ('proposta_enviada', 'negociacao', 'fechado', 'concluido');
$$;

-- "Já fiz": o cliente avisa que cumpriu o que pedimos. Vai de aguarda_cliente
-- para em_andamento e a dupla é avisada.
create or replace function public.amaralesilva_portal_handoff_confirm(p_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare it record; n int;
begin
  if public.amaralesilva_my_role() is distinct from 'cliente' then raise exception 'sem acesso' using errcode = '42501'; end if;
  select i.title, p.name as pname into it
  from public.amaralesilva_handoff_items i join public.amaralesilva_projects p on p.id = i.project_id
  where i.id = p_id and p.client_id in (select public.amaralesilva_my_client_ids());
  if not found then raise exception 'item não encontrado'; end if;
  update public.amaralesilva_handoff_items set status = 'em_andamento' where id = p_id and status = 'aguarda_cliente';
  get diagnostics n = row_count;
  if n = 0 then raise exception 'este item não está aguardando você'; end if;
  perform public.amaralesilva_push('Cliente confirmou um passo da migração', concat_ws(' · ', it.pname, it.title), '/admin#/migracao', 'hand-' || p_id);
end;
$$;

revoke execute on function public.amaralesilva_portal_handoff(), public.amaralesilva_portal_handoff_confirm(uuid) from public, anon;
grant execute on function public.amaralesilva_portal_handoff(), public.amaralesilva_portal_handoff_confirm(uuid) to authenticated;
