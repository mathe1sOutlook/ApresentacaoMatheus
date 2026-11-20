-- ═══ E-mails aos clientes (Resend) ═══
-- Cópia de referência da migração `amaralesilva_client_emails` (projeto mApps).
-- Quem envia é a Edge Function client-email (supabase/functions/client-email),
-- com a service_role: o navegador só lê o histórico. A chave do Resend é
-- segredo da função (RESEND_API_KEY) e nunca passa pelo banco.
--
-- Os quatro tipos são transacionais (execução ou negociação do contrato):
-- atualização de prévia, proposta, acompanhamento da proposta e cobrança.
-- O acompanhamento é o único que se repete por iniciativa nossa, por isso
-- tem descadastro em 1 clique (stop_token + amaralesilva_email_optouts).

create table if not exists public.amaralesilva_client_emails (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.amaralesilva_projects(id) on delete cascade,
  kind        text not null check (kind in ('atualizacao', 'proposta', 'acompanhamento', 'cobranca')),
  ref_id      uuid,                    -- a prévia ou a parcela do aviso
  to_email    text not null,
  subject     text not null,
  status      text not null default 'enviado' check (status in ('enviado', 'falhou')),
  resend_id   text,
  error       text,
  sent_by     text not null,           -- e-mail do membro que disparou
  stop_token  uuid not null default gen_random_uuid() unique,
  created_at  timestamptz not null default now()
);
create index if not exists amaralesilva_client_emails_project_idx
  on public.amaralesilva_client_emails (project_id, created_at desc);

-- "Parar lembretes": quem clicou não recebe mais acompanhamento daquele
-- projeto. Não bloqueia prévia, proposta nem cobrança.
create table if not exists public.amaralesilva_email_optouts (
  project_id  uuid not null references public.amaralesilva_projects(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now(),
  primary key (project_id, email)
);

alter table public.amaralesilva_client_emails enable row level security;
alter table public.amaralesilva_email_optouts enable row level security;
revoke all on public.amaralesilva_client_emails, public.amaralesilva_email_optouts from anon, authenticated;
grant select on public.amaralesilva_client_emails, public.amaralesilva_email_optouts to authenticated;
grant all on public.amaralesilva_client_emails, public.amaralesilva_email_optouts to service_role;

drop policy if exists "amaralesilva client_emails members read" on public.amaralesilva_client_emails;
create policy "amaralesilva client_emails members read" on public.amaralesilva_client_emails
  for select to authenticated using (public.amaralesilva_sees_project(project_id));
drop policy if exists "amaralesilva email_optouts members read" on public.amaralesilva_email_optouts;
create policy "amaralesilva email_optouts members read" on public.amaralesilva_email_optouts
  for select to authenticated using (public.amaralesilva_sees_project(project_id));
