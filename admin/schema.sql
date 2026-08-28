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

create table public.amaralesilva_projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid references public.amaralesilva_clients(id) on delete set null,
  name           text not null,
  site_url       text,
  status         text not null default 'contato'
                 check (status in ('contato','proposta_enviada','negociacao','fechado','concluido','perdido')),
  proposal_url   text,
  contract_url   text,
  price_proposed numeric(12,2),
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
-- split_* nulos herdam a divisão configurada no projeto.
create table public.amaralesilva_payments (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.amaralesilva_projects(id) on delete cascade,
  description   text,
  amount        numeric(12,2) not null,
  due_date      date not null,
  status        text not null default 'previsto' check (status in ('previsto','pago')),
  paid_at       date,
  split_matheus numeric(5,2),
  split_bruno   numeric(5,2),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
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
