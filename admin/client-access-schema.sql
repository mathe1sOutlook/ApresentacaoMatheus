-- ═══ Área do cliente — fase 1: quem entra e com qual perfil ═══
-- Cópia de referência da migração `amaralesilva_client_access`, aplicada no
-- Supabase (projeto mApps, wsgjbzsdewzplsnpfvdf). Plano completo em
-- docs/plano-area-do-cliente.md.
--
-- O projeto é compartilhado e o Auth também: qualquer conta de outro app pode
-- se autenticar. Por isso o acesso NUNCA depende de "estar logado", só de
-- amaralesilva_my_role() devolver um perfil.

-- Quem pode entrar como cliente. Uma linha por e-mail; client_id aponta o
-- cliente (empresa) cujo projeto a pessoa enxerga.
create table if not exists public.amaralesilva_client_users (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.amaralesilva_clients(id) on delete cascade,
  email      text not null,
  name       text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index if not exists amaralesilva_client_users_email_key
  on public.amaralesilva_client_users (lower(email));
create index if not exists amaralesilva_client_users_client_idx
  on public.amaralesilva_client_users (client_id);

alter table public.amaralesilva_client_users enable row level security;

-- Só a equipe lê e escreve a lista. O cliente não enxerga nem a própria linha
-- por aqui: quem ele é vem de amaralesilva_my_role().
drop policy if exists "amaralesilva client_users members" on public.amaralesilva_client_users;
create policy "amaralesilva client_users members" on public.amaralesilva_client_users
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

-- Perfil de quem está logado: 'equipe', 'cliente' ou null.
create or replace function public.amaralesilva_my_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select case
    when public.amaralesilva_is_member() then 'equipe'
    when exists (
      select 1 from public.amaralesilva_client_users u
      where u.active and lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    ) then 'cliente'
    else null
  end;
$$;

-- Clientes (empresas) que a pessoa logada pode ver. Base das políticas e views
-- das próximas fases.
create or replace function public.amaralesilva_my_client_ids()
returns setof uuid
language sql stable security definer
set search_path = public
as $$
  select u.client_id from public.amaralesilva_client_users u
  where u.active and lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

revoke execute on function public.amaralesilva_my_role()       from public, anon;
revoke execute on function public.amaralesilva_my_client_ids() from public, anon;
grant  execute on function public.amaralesilva_my_role()       to authenticated;
grant  execute on function public.amaralesilva_my_client_ids() to authenticated;

-- Situação de um e-mail para a primeira etapa do login. Só a Edge Function
-- portal-auth (service role) chama: devolve 'nao' | 'primeiro_acesso' | 'senha'.
-- 'senha' = a conta já entrou alguma vez e tem senha; 'primeiro_acesso' =
-- cadastrado mas nunca entrou. O cadastro do cliente cria a conta com um hash
-- de senha aleatório (que ninguém conhece), então "tem senha" não basta para
-- separar os dois casos: o que vale é nunca ter entrado (last_sign_in_at).
-- Migração amaralesilva_login_status_primeiro_acesso.
create or replace function public.amaralesilva_client_login_status(p_email text)
returns text
language sql stable security definer
set search_path = public, auth
as $$
  select case
    when not exists (
      select 1 from public.amaralesilva_client_users u
      where u.active and lower(u.email) = lower(p_email)
    ) then 'nao'
    when exists (
      select 1 from auth.users a
      where lower(a.email) = lower(p_email)
        and a.last_sign_in_at is not null
        and coalesce(a.encrypted_password, '') <> ''
    ) then 'senha'
    else 'primeiro_acesso'
  end;
$$;
revoke execute on function public.amaralesilva_client_login_status(text) from public, anon, authenticated;
grant  execute on function public.amaralesilva_client_login_status(text) to service_role;

-- Limite de tentativas da etapa do e-mail (por IP, janela deslizante). Sem
-- política de RLS: só o service role da Edge Function lê e escreve.
create table if not exists public.amaralesilva_portal_attempts (
  id  bigint generated always as identity primary key,
  ip  text not null,
  at  timestamptz not null default now()
);
create index if not exists amaralesilva_portal_attempts_ip_at_idx
  on public.amaralesilva_portal_attempts (ip, at desc);
alter table public.amaralesilva_portal_attempts enable row level security;

-- ═══ Fase 2 — o que o cliente enxerga (migração amaralesilva_portal_overview) ═══
-- O cliente não lê as tabelas internas (split_*, preços, notas). Tudo o que a
-- área do cliente mostra sai desta função, que devolve só colunas seguras e só
-- do(s) cliente(s) da pessoa logada:
--   · projetos a partir de "proposta enviada" (nunca contato, proposta a enviar
--     ou perdido);
--   · contrato e parcelas só com o projeto fechado ou concluído; das parcelas,
--     descrição, vencimento e situação — nunca valor nem divisão;
--   · reuniões só com a marca shared_with_client (pauta e ata incluídas).
alter table public.amaralesilva_meetings
  add column if not exists shared_with_client boolean not null default false;

create or replace function public.amaralesilva_portal_overview()
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  ids uuid[] := array(select public.amaralesilva_my_client_ids());
  vis uuid[];
begin
  if coalesce(cardinality(ids), 0) = 0 then
    return jsonb_build_object('clients', '[]'::jsonb, 'projects', '[]'::jsonb, 'meetings', '[]'::jsonb);
  end if;

  vis := array(
    select p.id from public.amaralesilva_projects p
    where p.client_id = any(ids)
      and p.status in ('proposta_enviada', 'negociacao', 'fechado', 'concluido')
  );

  return jsonb_build_object(
    'clients', (
      select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'company', c.company) order by c.name), '[]'::jsonb)
      from public.amaralesilva_clients c where c.id = any(ids)
    ),
    'projects', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id, 'client_id', p.client_id, 'name', p.name, 'status', p.status,
        'proposal_url', p.proposal_url,
        'contract_url', case when p.status in ('fechado', 'concluido') then p.contract_url end,
        'payments', case when p.status in ('fechado', 'concluido') then (
          select coalesce(jsonb_agg(jsonb_build_object(
            'description', pa.description, 'due_date', pa.due_date, 'status', pa.status, 'paid_at', pa.paid_at
          ) order by pa.due_date), '[]'::jsonb)
          from public.amaralesilva_payments pa where pa.project_id = p.id
        ) else '[]'::jsonb end
      ) order by p.created_at desc), '[]'::jsonb)
      from public.amaralesilva_projects p where p.id = any(vis)
    ),
    'meetings', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', m.id, 'project_id', m.project_id, 'title', m.title, 'starts_at', m.starts_at,
        'ends_at', m.ends_at, 'location', m.location, 'topics', m.topics, 'minutes', m.minutes
      ) order by m.starts_at desc), '[]'::jsonb)
      from public.amaralesilva_meetings m
      where m.shared_with_client and (m.client_id = any(ids) or m.project_id = any(vis))
    )
  );
end;
$$;
revoke execute on function public.amaralesilva_portal_overview() from public, anon;
grant  execute on function public.amaralesilva_portal_overview() to authenticated;
