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
