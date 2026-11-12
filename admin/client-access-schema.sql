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
-- 'senha' = existe conta com senha definida; 'primeiro_acesso' = cadastrado
-- mas ainda sem senha.
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
      where lower(a.email) = lower(p_email) and coalesce(a.encrypted_password, '') <> ''
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
