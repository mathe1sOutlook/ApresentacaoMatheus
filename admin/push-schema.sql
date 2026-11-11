-- ═══ App e notificações (migração amaralesilva_push_notifications) ═══
-- Cada aparelho em que um membro ativa as notificações vira uma linha em
-- amaralesilva_push_subscriptions. O banco avisa a Edge Function push-notify
-- (via pg_net) quando: chega lead pelo site, uma parcela passa a "pago" e uma
-- tarefa é atribuída a alguém. A função assina com as chaves VAPID, que ela
-- mesma gera na primeira chamada e guarda em amaralesilva_push_config.

create extension if not exists pg_net with schema extensions;

create table public.amaralesilva_push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  member_email text not null,
  endpoint     text not null unique,
  p256dh       text not null,
  auth         text not null,
  user_agent   text,
  created_at   timestamptz not null default now(),
  last_ok_at   timestamptz
);
alter table public.amaralesilva_push_subscriptions enable row level security;
revoke all on public.amaralesilva_push_subscriptions from anon;
grant select, insert, update, delete on public.amaralesilva_push_subscriptions to authenticated;
grant all on public.amaralesilva_push_subscriptions to service_role;
-- cada membro vê e mexe só nos próprios aparelhos
create policy "amaralesilva push own devices" on public.amaralesilva_push_subscriptions
  for all to authenticated
  using (public.amaralesilva_is_member() and lower(member_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  with check (public.amaralesilva_is_member() and lower(member_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Linha única, sem política: só o service role (a Edge Function) e as
-- funções security definer abaixo leem. Guarda as chaves VAPID e o segredo
-- que o banco manda à função para provar que o aviso é dele.
create table public.amaralesilva_push_config (
  id            int primary key default 1 check (id = 1),
  vapid_public  text,
  vapid_private text,
  hook_secret   text not null default encode(extensions.gen_random_bytes(32), 'hex'),
  updated_at    timestamptz not null default now()
);
alter table public.amaralesilva_push_config enable row level security;
revoke all on public.amaralesilva_push_config from anon, authenticated;
grant all on public.amaralesilva_push_config to service_role;
insert into public.amaralesilva_push_config default values;

-- Dispara o aviso. p_to = só esse e-mail; p_exclude = todos menos esse (quem
-- fez a ação não precisa ser avisado dela). Nunca derruba a transação.
create or replace function public.amaralesilva_push(
  p_title text, p_body text, p_url text, p_tag text,
  p_to text default null, p_exclude text default null
) returns void
language plpgsql security definer set search_path = public, extensions
as $$
declare s text;
begin
  select hook_secret into s from public.amaralesilva_push_config where id = 1;
  if s is null then return; end if;
  perform net.http_post(
    url := 'https://wsgjbzsdewzplsnpfvdf.supabase.co/functions/v1/push-notify',
    body := jsonb_build_object('action', 'event', 'title', p_title, 'body', p_body,
      'url', p_url, 'tag', p_tag, 'to', p_to, 'exclude', p_exclude),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', s),
    timeout_milliseconds := 8000
  );
exception when others then
  raise warning 'amaralesilva_push: %', sqlerrm;
end $$;
revoke execute on function public.amaralesilva_push(text, text, text, text, text, text) from public, anon, authenticated;

create or replace function public.amaralesilva_push_on_lead() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  perform public.amaralesilva_push(
    'Lead novo pelo site',
    concat_ws(' · ', nullif(new.name, ''), nullif(new.company, ''), nullif(left(new.need, 80), '')),
    '/admin#/leads', 'lead-' || new.id);
  return new;
end $$;

create or replace function public.amaralesilva_push_on_payment() returns trigger
language plpgsql security definer set search_path = public
as $$
declare proj text;
begin
  if new.status = 'pago' and old.status is distinct from 'pago' then
    select name into proj from public.amaralesilva_projects where id = new.project_id;
    perform public.amaralesilva_push(
      'Pagamento recebido',
      concat_ws(' · ', 'R$ ' || replace(replace(replace(to_char(new.amount, 'FM999G999G990D00'), ',', '#'), '.', ','), '#', '.'),
        proj, nullif(new.description, '')),
      '/admin#/financeiro', 'pay-' || new.id,
      null, nullif(auth.jwt() ->> 'email', ''));
  end if;
  return new;
end $$;

create or replace function public.amaralesilva_push_on_task() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.assignee_email is not null and not new.done
     and lower(new.assignee_email) <> lower(coalesce(auth.jwt() ->> 'email', ''))
     and (tg_op = 'INSERT' or lower(old.assignee_email) is distinct from lower(new.assignee_email)) then
    perform public.amaralesilva_push(
      'Tarefa para você',
      concat_ws(' · ', new.title, 'prazo ' || to_char(new.due_date, 'DD/MM')),
      '/admin#/tarefas', 'task-' || new.id,
      new.assignee_email, null);
  end if;
  return new;
end $$;

revoke execute on function public.amaralesilva_push_on_lead() from public, anon, authenticated;
revoke execute on function public.amaralesilva_push_on_payment() from public, anon, authenticated;
revoke execute on function public.amaralesilva_push_on_task() from public, anon, authenticated;

create trigger amaralesilva_leads_push after insert on public.amaralesilva_leads
  for each row execute function public.amaralesilva_push_on_lead();
create trigger amaralesilva_payments_push after update of status on public.amaralesilva_payments
  for each row execute function public.amaralesilva_push_on_payment();
create trigger amaralesilva_tasks_push after insert or update of assignee_email on public.amaralesilva_tasks
  for each row execute function public.amaralesilva_push_on_task();
