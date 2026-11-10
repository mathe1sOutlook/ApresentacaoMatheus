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


-- ═══ Integração InfinitePay ═══
-- Referência sincronizada com admin/infinitepay-schema.sql.
-- InfinitePay Casa Martech: tentativas auditaveis, sem chave no navegador.
-- Aplicar no Supabase mApps (wsgjbzsdewzplsnpfvdf).
create table if not exists public.amaralesilva_infinitepay_checkouts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.amaralesilva_payments(id) on delete cascade,
  order_nsu text not null unique,
  amount_cents bigint not null check (amount_cents >= 100),
  checkout_url text,
  valid_until timestamptz not null,
  state text not null default 'prepared'
    check (state in ('prepared','created','paid')),
  transaction_nsu text unique,
  invoice_slug text,
  capture_method text check (capture_method is null or capture_method in ('pix','credit_card')),
  paid_amount_cents bigint,
  receipt_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists amaralesilva_infinitepay_payment_idx
  on public.amaralesilva_infinitepay_checkouts (payment_id, created_at desc);
alter table public.amaralesilva_infinitepay_checkouts enable row level security;
revoke all on public.amaralesilva_infinitepay_checkouts from anon, authenticated;
grant select on public.amaralesilva_infinitepay_checkouts to authenticated;
grant all on public.amaralesilva_infinitepay_checkouts to service_role;
create policy "amaralesilva members read checkout attempts"
on public.amaralesilva_infinitepay_checkouts for select to authenticated
using (public.amaralesilva_is_member());

-- A API interna recebe acesso apenas pela service_role; os membros nunca
-- podem invocar estas rotinas diretamente com a chave publicavel.
create or replace function public.amaralesilva_infinitepay_prepare(p_payment_id uuid)
returns public.amaralesilva_infinitepay_checkouts
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_payment public.amaralesilva_payments%rowtype;
  v_attempt public.amaralesilva_infinitepay_checkouts%rowtype;
begin
  select * into v_payment
    from public.amaralesilva_payments where id = p_payment_id for update;
  if not found then raise exception 'Parcela nao encontrada'; end if;
  if v_payment.status = 'pago' then raise exception 'Parcela ja foi paga'; end if;
  if v_payment.amount < 1 then raise exception 'Valor minimo para checkout: R$ 1,00'; end if;
  select * into v_attempt
    from public.amaralesilva_infinitepay_checkouts
    where payment_id = p_payment_id
      and valid_until > now()
    order by created_at desc limit 1;
  if found then return v_attempt; end if;
  insert into public.amaralesilva_infinitepay_checkouts
    (payment_id, order_nsu, amount_cents, valid_until)
  values (
    p_payment_id,
    'cm-' || replace(p_payment_id::text, '-', '') || '-' ||
      substring(replace(gen_random_uuid()::text, '-', '') from 1 for 12),
    round(v_payment.amount * 100)::bigint,
    now() + interval '7 days'
  ) returning * into v_attempt;
  return v_attempt;
end;
$$;
revoke all on function public.amaralesilva_infinitepay_prepare(uuid)
  from public, anon, authenticated;
grant execute on function public.amaralesilva_infinitepay_prepare(uuid) to service_role;

-- A Edge Function consulta payment_check ANTES desta chamada. A escrita
-- no financeiro e no historico ocorre em uma mesma transacao.
create or replace function public.amaralesilva_infinitepay_confirm(
  p_order_nsu text,
  p_transaction_nsu text,
  p_invoice_slug text,
  p_capture_method text,
  p_paid_amount_cents bigint,
  p_receipt_url text
)
returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_attempt public.amaralesilva_infinitepay_checkouts%rowtype;
  v_payment public.amaralesilva_payments%rowtype;
begin
  select * into v_attempt from public.amaralesilva_infinitepay_checkouts
    where order_nsu = p_order_nsu for update;
  if not found then return false; end if;
  if v_attempt.state = 'paid' then
    return v_attempt.transaction_nsu = p_transaction_nsu;
  end if;
  if p_capture_method not in ('pix','credit_card') then
    raise exception 'Meio de pagamento desconhecido';
  end if;
  if coalesce(p_transaction_nsu, '') = '' or coalesce(p_invoice_slug, '') = '' then
    raise exception 'Identificadores da transacao ausentes';
  end if;
  select * into v_payment from public.amaralesilva_payments
    where id = v_attempt.payment_id for update;
  if not found or round(v_payment.amount * 100)::bigint <> v_attempt.amount_cents then
    raise exception 'Valor da parcela diverge da cobranca';
  end if;
  if v_payment.status = 'pago' then
    raise exception 'Parcela foi quitada fora desta cobranca; conciliar manualmente';
  end if;
  if exists (select 1 from public.amaralesilva_infinitepay_checkouts
    where payment_id = v_attempt.payment_id and state = 'paid') then
    raise exception 'Parcela ja possui pagamento confirmado';
  end if;
  update public.amaralesilva_infinitepay_checkouts
    set state = 'paid', transaction_nsu = p_transaction_nsu,
        invoice_slug = p_invoice_slug, capture_method = p_capture_method,
        paid_amount_cents = p_paid_amount_cents, receipt_url = p_receipt_url,
        verified_at = now()
    where id = v_attempt.id;
  update public.amaralesilva_payments
    set status = 'pago', paid_at = (now() at time zone 'America/Sao_Paulo')::date
    where id = v_attempt.payment_id;
  return true;
end;
$$;
revoke all on function public.amaralesilva_infinitepay_confirm(text,text,text,text,bigint,text)
  from public, anon, authenticated;
grant execute on function public.amaralesilva_infinitepay_confirm(text,text,text,text,bigint,text)
  to service_role;

-- Mantem coerencia financeira: uma cobranca ativa ou paga impede editar
-- valor/projeto e excluir a parcela, mesmo por uma tela antiga do painel.
create or replace function public.amaralesilva_guard_infinitepay_payment()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_active boolean;
  v_paid boolean;
begin
  select
    coalesce(bool_or(state = 'paid' or valid_until > now()), false),
    coalesce(bool_or(state = 'paid'), false)
    into v_active, v_paid
    from public.amaralesilva_infinitepay_checkouts
    where payment_id = old.id;
  if not v_active then
    return case when tg_op = 'DELETE' then old else new end;
  end if;
  if tg_op = 'DELETE' then
    raise exception 'Nao e possivel excluir parcela com checkout ativo ou pago';
  end if;
  if new.amount is distinct from old.amount
     or new.project_id is distinct from old.project_id then
    raise exception 'Nao altere valor/projeto enquanto existir checkout ativo ou pago';
  end if;
  if v_paid and new.status <> 'pago' then
    raise exception 'Pagamento confirmado pela InfinitePay nao pode ser revertido manualmente';
  end if;
  if not v_paid and old.status <> 'pago' and new.status = 'pago' then
    raise exception 'Aguarde a confirmacao da InfinitePay antes de marcar como pago';
  end if;
  return new;
end;
$$;
drop trigger if exists amaralesilva_guard_infinitepay_payment
  on public.amaralesilva_payments;
create trigger amaralesilva_guard_infinitepay_payment
before update or delete on public.amaralesilva_payments
for each row execute function public.amaralesilva_guard_infinitepay_payment();
revoke all on function public.amaralesilva_guard_infinitepay_payment()
  from public, anon, authenticated;

-- Impede exclusao em cascata de projeto com cobranca vinculada.
create or replace function public.amaralesilva_guard_infinitepay_project()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if exists (
    select 1 from public.amaralesilva_infinitepay_checkouts c
    join public.amaralesilva_payments p on p.id = c.payment_id
    where p.project_id = old.id
      and (c.state = 'paid' or c.valid_until > now())
  ) then
    raise exception 'Projeto com cobranca InfinitePay ativa ou quitada nao pode ser excluido';
  end if;
  return old;
end;
$$;
drop trigger if exists amaralesilva_guard_infinitepay_project on public.amaralesilva_projects;
create trigger amaralesilva_guard_infinitepay_project
before delete on public.amaralesilva_projects
for each row execute function public.amaralesilva_guard_infinitepay_project();
revoke all on function public.amaralesilva_guard_infinitepay_project()
  from public, anon, authenticated;
