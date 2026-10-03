-- ═══ Amaral & Silva — Admin/CRM interno ═══
-- Cópia de referência da migração aplicada no Supabase (projeto mApps,
-- wsgjbzsdewzplsnpfvdf) como `amaralesilva_admin_crm`. O projeto é
-- compartilhado com outras apps; tudo daqui leva o prefixo amaralesilva_.

-- Allowlist de acesso: só e-mails listados aqui (login Google) enxergam os dados.
create table public.amaralesilva_members (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  name       text not null,
  created_at timestamptz not null default now()
);

-- Checagem usada por todas as policies. SECURITY DEFINER para consultar a
-- allowlist sem recursão de RLS na própria tabela de membros.
create or replace function public.amaralesilva_is_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.amaralesilva_members m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- EXECUTE default vem de PUBLIC; fecha tudo e reabre só para authenticated,
-- que é o papel sob o qual as policies RLS avaliam a função.
revoke execute on function public.amaralesilva_is_member() from public, anon;
grant execute on function public.amaralesilva_is_member() to authenticated;

create table public.amaralesilva_clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  email      text,
  phone      text,
  origin     text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Preços: price_proposed é o valor CHEIO da proposta (o parcelado, quando há
-- parcelamento) e é o número que o funil mostra; price_cash é a condição à
-- vista quando a proposta oferece desconto no pagamento único (migração
-- amaralesilva_projects_duas_condicoes), e installments_count diz em quantas
-- vezes o parcelado é oferecido — o valor da parcela é derivado na tela, nunca
-- gravado. price_final é o que foi fechado, e é ele que registra qual das duas
-- condições venceu. price_proposed NÃO é "à vista": os R$ 12.500 do projeto
-- MediaPortal (o site) foram entrada de 30% + 3 parcelas reais.
create table public.amaralesilva_projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid references public.amaralesilva_clients(id) on delete set null,
  name           text not null,
  site_url       text,
  status         text not null default 'contato'
                 check (status in ('contato','proposta_a_enviar','proposta_enviada','negociacao','fechado','concluido','perdido')),
  proposal_url   text,
  contract_url   text,
  price_proposed numeric(12,2),
  price_cash     numeric(12,2) constraint amaralesilva_projects_price_cash_nonneg check (price_cash is null or price_cash >= 0),
  installments_count smallint  constraint amaralesilva_projects_installments_min check (installments_count is null or installments_count >= 2),
  price_final    numeric(12,2),
  payment_terms  text,
  split_matheus  numeric(5,2) not null default 50,
  split_bruno    numeric(5,2) not null default 50,
  description    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Devolutivas do cliente, combinados e registros de conversa, por projeto.
create table public.amaralesilva_notes (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.amaralesilva_projects(id) on delete cascade,
  kind         text not null default 'nota' check (kind in ('devolutiva','combinado','conversa','nota')),
  content      text not null,
  author_email text,
  created_at   timestamptz not null default now()
);

-- Agenda: reuniões com pauta (topics) e ata do que foi proposto (minutes).
create table public.amaralesilva_meetings (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references public.amaralesilva_projects(id) on delete set null,
  client_id  uuid references public.amaralesilva_clients(id) on delete set null,
  title      text not null,
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  location   text,
  topics     text,
  minutes    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Parcelas: dias de pagamento e divisão entre Matheus e Bruno.
-- split_* nulos herdam a divisão configurada no projeto. amount_* (migração
-- amaralesilva_payments_fixed_shares) fixa a parte de alguém em R$ — tem
-- prioridade sobre os percentuais e o lado não preenchido recebe o restante.
create table public.amaralesilva_payments (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.amaralesilva_projects(id) on delete cascade,
  description    text,
  amount         numeric(12,2) not null,
  due_date       date not null,
  status         text not null default 'previsto' check (status in ('previsto','pago')),
  paid_at        date,
  split_matheus  numeric(5,2),
  split_bruno    numeric(5,2),
  amount_matheus numeric(12,2) check (amount_matheus is null or amount_matheus >= 0),
  amount_bruno   numeric(12,2) check (amount_bruno   is null or amount_bruno   >= 0),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.amaralesilva_tasks (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid references public.amaralesilva_projects(id) on delete set null,
  title          text not null,
  details        text,
  assignee_email text,
  due_date       date,
  done           boolean not null default false,
  done_at        timestamptz,
  created_by     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index amaralesilva_projects_client_idx  on public.amaralesilva_projects (client_id);
create index amaralesilva_projects_status_idx  on public.amaralesilva_projects (status);
create index amaralesilva_notes_project_idx    on public.amaralesilva_notes (project_id);
create index amaralesilva_meetings_project_idx on public.amaralesilva_meetings (project_id);
create index amaralesilva_meetings_client_idx  on public.amaralesilva_meetings (client_id);
create index amaralesilva_meetings_starts_idx  on public.amaralesilva_meetings (starts_at);
create index amaralesilva_payments_project_idx on public.amaralesilva_payments (project_id);
create index amaralesilva_payments_due_idx     on public.amaralesilva_payments (due_date);
create index amaralesilva_tasks_project_idx    on public.amaralesilva_tasks (project_id);
create index amaralesilva_tasks_due_idx        on public.amaralesilva_tasks (due_date);

create or replace function public.amaralesilva_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger amaralesilva_clients_touch  before update on public.amaralesilva_clients  for each row execute function public.amaralesilva_set_updated_at();
create trigger amaralesilva_projects_touch before update on public.amaralesilva_projects for each row execute function public.amaralesilva_set_updated_at();
create trigger amaralesilva_meetings_touch before update on public.amaralesilva_meetings for each row execute function public.amaralesilva_set_updated_at();
create trigger amaralesilva_payments_touch before update on public.amaralesilva_payments for each row execute function public.amaralesilva_set_updated_at();
create trigger amaralesilva_tasks_touch    before update on public.amaralesilva_tasks    for each row execute function public.amaralesilva_set_updated_at();

alter table public.amaralesilva_members  enable row level security;
alter table public.amaralesilva_clients  enable row level security;
alter table public.amaralesilva_projects enable row level security;
alter table public.amaralesilva_notes    enable row level security;
alter table public.amaralesilva_meetings enable row level security;
alter table public.amaralesilva_payments enable row level security;
alter table public.amaralesilva_tasks    enable row level security;

create policy "amaralesilva members full access" on public.amaralesilva_members
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_clients
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_projects
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_notes
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_meetings
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_payments
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva members full access" on public.amaralesilva_tasks
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

insert into public.amaralesilva_members (email, name)
values ('mathe1s.castro@gmail.com', 'Matheus Silva')
on conflict (email) do nothing;

-- ═══ Migração amaralesilva_leads ═══
-- Leads do formulário público do site (#contato). O site insere como anon
-- (política só de INSERT, com source='site' e status='novo'); só membros
-- leem e editam. Convertido em cliente pelo painel, guarda o client_id.
create table public.amaralesilva_leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  company    text check (company is null or char_length(company) <= 120),
  contact    text check (contact is null or char_length(contact) <= 160),
  need       text not null default 'nao-sei' check (need in ('marca','sistema','ambos','nao-sei')),
  message    text check (message is null or char_length(message) <= 2000),
  lang       text not null default 'pt' check (lang in ('pt','en')),
  source     text not null default 'site' check (char_length(source) <= 40),
  status     text not null default 'novo' check (status in ('novo','em_contato','convertido','descartado')),
  client_id  uuid references public.amaralesilva_clients(id) on delete set null,
  user_agent text check (user_agent is null or char_length(user_agent) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index amaralesilva_leads_created_idx on public.amaralesilva_leads (created_at desc);
create index amaralesilva_leads_status_idx  on public.amaralesilva_leads (status);

create trigger amaralesilva_leads_touch before update on public.amaralesilva_leads
  for each row execute function public.amaralesilva_set_updated_at();

alter table public.amaralesilva_leads enable row level security;

revoke all on public.amaralesilva_leads from anon;
grant insert on public.amaralesilva_leads to anon;

create policy "amaralesilva members full access" on public.amaralesilva_leads
  for all to authenticated
  using (public.amaralesilva_is_member())
  with check (public.amaralesilva_is_member());

create policy "amaralesilva site inserts leads" on public.amaralesilva_leads
  for insert to anon
  with check (source = 'site' and status = 'novo' and client_id is null);

-- ═══ Migração amaralesilva_leads_hardening ═══
-- 1) anon só insere as colunas que o formulário preenche (id, status,
--    client_id, created_at, updated_at e user_agent ficam fora do alcance);
-- 2) trava por statement: uma linha por requisição e no máximo 30 leads a
--    cada 10 minutos para o papel anon (anti-flood simples).
revoke insert on public.amaralesilva_leads from anon;
grant insert (name, company, contact, need, message, lang, source) on public.amaralesilva_leads to anon;

create or replace function public.amaralesilva_leads_guard()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  n int;
begin
  if coalesce(auth.role(), '') <> 'anon' then
    return null;
  end if;
  select count(*) into n from inserted;
  if n > 1 then
    raise exception 'one lead per request' using errcode = 'P0001';
  end if;
  select count(*) into n from public.amaralesilva_leads
   where created_at > now() - interval '10 minutes';
  if n > 30 then
    raise exception 'too many leads, try again later' using errcode = 'P0001';
  end if;
  return null;
end;
$$;

create trigger amaralesilva_leads_guard
  after insert on public.amaralesilva_leads
  referencing new table as inserted
  for each statement execute function public.amaralesilva_leads_guard();

-- ═══ Migração amaralesilva_anon_hardening ═══
-- O papel anônimo (a chave publicável que vai no browser, sem login) não tem
-- por que ter privilégio nenhum nas tabelas do CRM: a RLS já devolvia zero
-- linhas para ele, isto tira a dependência dela. Leads fica como está — o
-- formulário público do site insere como anon, com política e grant próprios.
revoke all on public.amaralesilva_clients, public.amaralesilva_projects, public.amaralesilva_notes,
  public.amaralesilva_meetings, public.amaralesilva_payments, public.amaralesilva_tasks,
  public.amaralesilva_members from anon;

-- ═══ Migração amaralesilva_site_metrics ═══
-- Medição própria do site (mesmo desenho do /admin/metricas da Media Portal):
-- o site grava o FATO (visita, seção vista, clique, medida de velocidade) e
-- nunca quem fez — sem cookie, sem identificador de visitante, sem IP e sem
-- texto digitado. A conta é feita AQUI, no banco, por uma função que devolve
-- só totais: nenhuma linha crua chega ao navegador do painel.
--
-- O papel anônimo (a chave publicável do site) só INSERE, e só nas colunas
-- que o script preenche; a leitura é de membros, pela função abaixo.

create table public.amaralesilva_site_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- nome do evento: visita_pagina, secao_vista, nav_clique, lead_envio_ok,
  -- web_vital_lcp… (minúsculas e sublinhado, nada mais)
  name       text not null check (name ~ '^[a-z][a-z0-9_]{1,59}$'),
  -- caminho da página ("/" ou "/en"); sem parâmetros, sem fragmento
  page       text not null default '/' check (page ~ '^/[a-z0-9/_-]{0,119}$'),
  lang       text not null default 'pt' check (lang in ('pt', 'en')),
  -- só valores curtos e sem dado pessoal: origem (canal), aparelho, seção,
  -- destino de um clique, valor de uma medida de velocidade
  meta       jsonb not null default '{}'::jsonb
             check (jsonb_typeof(meta) = 'object' and pg_column_size(meta) <= 1500),
  -- navegador que se declara controlado por programa (verificador de link,
  -- teste automatizado): fica fora das contas de pessoas
  automation boolean not null default false
);

comment on table public.amaralesilva_site_events is
  'Medição própria do site casamartech.com.br: só o fato, nunca a pessoa. Lida pela função amaralesilva_site_metrics.';

create index amaralesilva_site_events_created_at_idx
  on public.amaralesilva_site_events (created_at desc);
create index amaralesilva_site_events_name_created_at_idx
  on public.amaralesilva_site_events (name, created_at desc);

alter table public.amaralesilva_site_events enable row level security;

revoke all on public.amaralesilva_site_events from anon, authenticated;
grant insert (name, page, lang, meta, automation) on public.amaralesilva_site_events to anon;
grant select on public.amaralesilva_site_events to authenticated;

-- O site grava; as travas de conteúdo são os CHECKs da própria tabela.
create policy "amaralesilva site inserts events" on public.amaralesilva_site_events
  for insert to anon
  with check (true);

-- Só membros leem — e, na prática, só pela função de totais.
create policy "amaralesilva members read events" on public.amaralesilva_site_events
  for select to authenticated
  using (public.amaralesilva_is_member());

-- Anti-flood, no mesmo molde do guard dos leads: um lote tem no máximo 25
-- linhas (o script do site junta até 20 antes de enviar) e o papel anônimo
-- não passa de 4.000 registros a cada 10 minutos. O site não tem servidor
-- próprio para limitar por endereço, então o teto é global: numa enxurrada a
-- medição perde registros, mas o banco não é inundado.
create or replace function public.amaralesilva_site_events_guard()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  n int;
begin
  if coalesce(auth.role(), '') <> 'anon' then
    return null;
  end if;
  select count(*) into n from inserted;
  if n > 25 then
    raise exception 'too many events per request' using errcode = 'P0001';
  end if;
  select count(*) into n from public.amaralesilva_site_events
   where created_at > now() - interval '10 minutes';
  if n > 4000 then
    raise exception 'too many events, try again later' using errcode = 'P0001';
  end if;
  return null;
end;
$$;

create trigger amaralesilva_site_events_guard
  after insert on public.amaralesilva_site_events
  referencing new table as inserted
  for each statement execute function public.amaralesilva_site_events_guard();

-- ── A leitura: um período em dias, um JSON com tudo que o painel mostra ──
-- Dias contados no fuso de São Paulo. "Pessoas" = registros sem a marca de
-- automação. O período anterior (mesmo tamanho, logo antes) volta junto para
-- a comparação dos cartões. Tempo e velocidade saem pela MEDIANA e pelo p75,
-- nunca pela média: uma única abertura numa rede ruim não pode reescrever o
-- número do mês (aprendizado do /admin/metricas da Media Portal).
create or replace function public.amaralesilva_site_metrics(p_dias int default 30)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with params as (
    select
      greatest(1, least(coalesce(p_dias, 30), 365)) as dias,
      (now() at time zone 'America/Sao_Paulo')::date as hoje
  ),
  janela as (
    select
      dias,
      hoje,
      (hoje - (dias - 1)) as de_dia,
      ((hoje - (dias - 1))::timestamp at time zone 'America/Sao_Paulo') as de,
      (((hoje - (dias - 1)) - dias)::timestamp at time zone 'America/Sao_Paulo') as de_anterior
    from params
  ),
  eventos as (
    select e.*, (e.created_at at time zone 'America/Sao_Paulo')::date as dia
    from public.amaralesilva_site_events e, janela j
    where e.created_at >= j.de
  ),
  pessoas as (
    select * from eventos where not automation
  ),
  acoes as (
    select * from pessoas
    where name not in ('visita_pagina', 'secao_vista')
      and name not like 'web_vital_%'
  ),
  anteriores as (
    select e.*
    from public.amaralesilva_site_events e, janela j
    where e.created_at >= j.de_anterior and e.created_at < j.de and not e.automation
  ),
  dias as (
    select generate_series(j.de_dia, j.hoje, interval '1 day')::date as dia from janela j
  ),
  visitas_por_dia as (
    select dia, count(*)::int as visitas from pessoas where name = 'visita_pagina' group by dia
  ),
  acoes_por_dia as (
    select dia, count(*)::int as acoes from acoes group by dia
  ),
  serie as (
    select d.dia, coalesce(v.visitas, 0) as visitas, coalesce(a.acoes, 0) as acoes
    from dias d
    left join visitas_por_dia v on v.dia = d.dia
    left join acoes_por_dia a on a.dia = d.dia
  ),
  vitais as (
    select
      substr(name, 11) as indicador,
      (meta ->> 'valor')::numeric as valor
    from pessoas
    where name like 'web_vital_%'
      and jsonb_typeof(meta -> 'valor') = 'number'
  )
  select jsonb_build_object(
    'dias', (select dias from janela),
    'de', (select de_dia from janela),
    'ate', (select hoje from janela),
    'resumo', jsonb_build_object(
      'visitas', (select count(*) from pessoas where name = 'visita_pagina'),
      'visitas_automacao', (select count(*) from eventos where name = 'visita_pagina' and automation),
      'acoes', (select count(*) from acoes),
      'contatos', (select count(*) from acoes where name = 'lead_envio_ok'),
      'whatsapp', (select count(*) from acoes where name = 'whatsapp_clique'),
      'dia_tipico', (select round(percentile_cont(0.5) within group (order by visitas)) from serie),
      'dia_maximo', (select max(visitas) from serie)
    ),
    'anterior', jsonb_build_object(
      'visitas', (select count(*) from anteriores where name = 'visita_pagina'),
      'acoes', (select count(*) from anteriores
                 where name not in ('visita_pagina', 'secao_vista') and name not like 'web_vital_%'),
      'contatos', (select count(*) from anteriores where name = 'lead_envio_ok'),
      'whatsapp', (select count(*) from anteriores where name = 'whatsapp_clique')
    ),
    'por_dia', (select coalesce(jsonb_agg(jsonb_build_object('dia', dia, 'visitas', visitas, 'acoes', acoes) order by dia), '[]'::jsonb) from serie),
    'origens', (
      select coalesce(jsonb_agg(jsonb_build_object('chave', chave, 'n', n) order by n desc, chave), '[]'::jsonb)
      from (
        select coalesce(nullif(meta ->> 'origem', ''), 'direto') as chave, count(*) as n
        from pessoas where name = 'visita_pagina'
        group by 1 order by n desc limit 12
      ) o
    ),
    'aparelhos', (
      select coalesce(jsonb_agg(jsonb_build_object('chave', chave, 'n', n) order by n desc, chave), '[]'::jsonb)
      from (
        select coalesce(nullif(meta ->> 'aparelho', ''), 'desconhecido') as chave, count(*) as n
        from pessoas where name = 'visita_pagina' group by 1
      ) a
    ),
    'idiomas', (
      select coalesce(jsonb_agg(jsonb_build_object('chave', chave, 'n', n) order by n desc, chave), '[]'::jsonb)
      from (select lang as chave, count(*) as n from pessoas where name = 'visita_pagina' group by 1) i
    ),
    'paginas', (
      select coalesce(jsonb_agg(jsonb_build_object('chave', chave, 'n', n) order by n desc, chave), '[]'::jsonb)
      from (select page as chave, count(*) as n from pessoas where name = 'visita_pagina' group by 1 order by n desc limit 12) p
    ),
    'secoes', (
      select coalesce(jsonb_agg(jsonb_build_object('chave', chave, 'n', n) order by n desc, chave), '[]'::jsonb)
      from (
        select coalesce(nullif(meta ->> 'secao', ''), '?') as chave, count(*) as n
        from pessoas where name = 'secao_vista' group by 1
      ) s
    ),
    'acoes', (
      select coalesce(jsonb_agg(jsonb_build_object('name', name, 'detalhe', detalhe, 'n', n) order by n desc, name, detalhe), '[]'::jsonb)
      from (
        select name, coalesce(meta ->> 'detalhe', '') as detalhe, count(*) as n
        from acoes group by 1, 2 order by n desc limit 60
      ) ac
    ),
    'velocidade', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'indicador', indicador, 'n', n, 'mediana', mediana, 'p75', p75
      ) order by indicador), '[]'::jsonb)
      from (
        select
          indicador,
          count(*) as n,
          round(percentile_cont(0.5) within group (order by valor)::numeric, 3) as mediana,
          round(percentile_cont(0.75) within group (order by valor)::numeric, 3) as p75
        from vitais
        where valor >= 0 and valor <= 120000
        group by indicador
      ) v
    )
  );
$$;

comment on function public.amaralesilva_site_metrics(int) is
  'Totais do site para a tela Métricas do painel: visitas, ações, origens, aparelhos, seções alcançadas e velocidade (mediana e p75) num período em dias, mais o período anterior para comparação.';

revoke execute on function public.amaralesilva_site_metrics(int) from public, anon;
grant execute on function public.amaralesilva_site_metrics(int) to authenticated;

-- ═══ Migração amaralesilva_site_events_guard_grants ═══
-- Função de gatilho não é para ser chamada pela API (o advisor acusa
-- SECURITY DEFINER exposto ao anon): só o gatilho a executa.
revoke execute on function public.amaralesilva_site_events_guard() from public, anon, authenticated;
