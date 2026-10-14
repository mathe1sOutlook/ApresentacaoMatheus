-- Testes de RLS, privilégios e guardas das tabelas amaralesilva_*. Roda num
-- banco descartável com o stub do Supabase (scripts/testar-banco.sh), tudo
-- numa transação desfeita no fim. Qualquer falha interrompe com "FALHOU".
\set ON_ERROR_STOP on
\set QUIET on
\o /dev/null
begin;

create function pg_temp.falha(sql text, codigo text, nome text) returns void language plpgsql as $$
begin
  begin
    execute sql;
  exception when others then
    if sqlstate = codigo then raise notice 'ok  %', nome; return; end if;
    raise exception 'FALHOU %: esperado erro %, veio % (%)', nome, codigo, sqlstate, sqlerrm;
  end;
  raise exception 'FALHOU %: esperado erro %, mas passou', nome, codigo;
end $$;

create function pg_temp.passa(sql text, nome text) returns void language plpgsql as $$
begin
  execute sql;
  raise notice 'ok  %', nome;
exception when others then
  raise exception 'FALHOU %: % (%)', nome, sqlerrm, sqlstate;
end $$;

create function pg_temp.linhas(sql text) returns text language plpgsql as $$
declare n bigint;
begin
  execute sql;
  get diagnostics n = row_count;
  return n::text;
end $$;

create function pg_temp.igual(atual text, esperado text, nome text) returns void language plpgsql as $$
begin
  if atual is distinct from esperado then
    raise exception 'FALHOU %: esperado %, veio %', nome, esperado, atual;
  end if;
  raise notice 'ok  %', nome;
end $$;

-- dados mínimos (como dono do banco)
insert into public.amaralesilva_clients (id, name) values ('00000000-0000-0000-0000-0000000000c1', 'Cliente teste');
insert into public.amaralesilva_projects (id, client_id, name, status, price_proposed)
values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000c1', 'Projeto teste', 'proposta_enviada', 1000);

-- ── anon: a chave publicável, sem login ──────────────────────────────────
select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;
select pg_temp.falha('select 1 from public.amaralesilva_clients',     '42501', 'anon não lê clientes');
select pg_temp.falha('select 1 from public.amaralesilva_projects',    '42501', 'anon não lê projetos');
select pg_temp.falha('select 1 from public.amaralesilva_notes',       '42501', 'anon não lê registros');
select pg_temp.falha('select 1 from public.amaralesilva_payments',    '42501', 'anon não lê parcelas');
select pg_temp.falha('select 1 from public.amaralesilva_members',     '42501', 'anon não lê membros');
select pg_temp.falha('select 1 from public.amaralesilva_adjustments', '42501', 'anon não lê ajustes');
select pg_temp.passa($q$insert into public.amaralesilva_leads (name, contact, need, lang, source) values ('Lead', 'lead@example.com', 'marca', 'pt', 'site')$q$,
  'anon envia lead válido');
select pg_temp.falha($q$insert into public.amaralesilva_leads (name, status) values ('Lead', 'convertido')$q$, '42501', 'anon não escolhe a situação do lead');
select pg_temp.falha($q$insert into public.amaralesilva_leads (name) values ('a'), ('b')$q$, 'P0001', 'um lead por requisição');
select pg_temp.falha($q$insert into public.amaralesilva_leads (name, origin_hash) values ('a', repeat('0', 64))$q$, '42501', 'anon não escreve a origem');
select pg_temp.falha('select 1 from public.amaralesilva_leads', '42501', 'anon não lê leads');

-- limite por origem: 3 envios por IP em 10 minutos
select set_config('request.headers', '{"cf-connecting-ip":"203.0.113.7"}', true);
select pg_temp.passa($q$insert into public.amaralesilva_leads (name) values ('IP 7 — 1')$q$, 'origem A, 1º envio');
select pg_temp.passa($q$insert into public.amaralesilva_leads (name) values ('IP 7 — 2')$q$, 'origem A, 2º envio');
select pg_temp.passa($q$insert into public.amaralesilva_leads (name) values ('IP 7 — 3')$q$, 'origem A, 3º envio');
select pg_temp.falha($q$insert into public.amaralesilva_leads (name) values ('IP 7 — 4')$q$, 'PGRST', 'origem A, 4º envio recusado (429)');
select set_config('request.headers', '{"x-forwarded-for":"198.51.100.9, 10.0.0.1"}', true);
select pg_temp.passa($q$insert into public.amaralesilva_leads (name) values ('IP 9')$q$, 'outra origem segue enviando');
reset role;

select pg_temp.igual((select count(*) from public.amaralesilva_leads where origin_hash is not null)::text, '4', 'lead aceito guarda a origem');
select pg_temp.igual((select count(*) from public.amaralesilva_leads where origin_hash like '%203.0.113%')::text, '0', 'origem guardada só como hash, nunca o IP');
select pg_temp.igual((select count(*) from public.amaralesilva_leads where name = 'Lead' and origin_hash is null)::text, '1', 'sem cabeçalho de origem o lead entra sem hash');

-- ── autenticado fora da allowlist ────────────────────────────────────────
select set_config('request.jwt.claims', '{"role":"authenticated","email":"intruso@example.com"}', true);
set local role authenticated;
select pg_temp.igual((select count(*) from public.amaralesilva_projects)::text, '0', 'intruso não vê projetos');
select pg_temp.igual((select count(*) from public.amaralesilva_leads)::text, '0', 'intruso não vê leads');
select pg_temp.igual((select count(*) from public.amaralesilva_adjustments)::text, '0', 'intruso não vê ajustes');
select pg_temp.falha($q$insert into public.amaralesilva_members (email, name) values ('intruso@example.com', 'Intruso')$q$, '42501', 'intruso não se põe na allowlist');
select pg_temp.falha($q$insert into public.amaralesilva_adjustments (project_id, topic, value_to) values ('00000000-0000-0000-0000-0000000000a1', 'escopo', 'x')$q$, '42501', 'intruso não lança ajuste');
reset role;

-- ── membro ───────────────────────────────────────────────────────────────
select set_config('request.jwt.claims', '{"role":"authenticated","email":"mathe1s.castro@gmail.com"}', true);
set local role authenticated;
select pg_temp.igual((select count(*) from public.amaralesilva_projects)::text, '1', 'membro vê projetos');
select pg_temp.passa($q$insert into public.amaralesilva_adjustments (project_id, topic, value_from, value_to, reason)
  values ('00000000-0000-0000-0000-0000000000a1', 'prazo', ' ', '75 dias', 'pedido do cliente')$q$, 'membro lança ajuste');
select pg_temp.igual((select author_email || ' @ ' || stage || ' de=' || coalesce(value_from, '∅') from public.amaralesilva_adjustments where source = 'manual'),
  'mathe1s.castro@gmail.com @ proposta_enviada de=∅', 'autor, etapa e vazio carimbados pelo banco');
select pg_temp.falha($q$insert into public.amaralesilva_adjustments (project_id, topic, value_to, source) values ('00000000-0000-0000-0000-0000000000a1', 'etapa', 'x', 'auto')$q$, '42501', 'membro não forja ajuste automático');
select pg_temp.falha($q$insert into public.amaralesilva_adjustments (project_id, topic, value_to, author_email) values ('00000000-0000-0000-0000-0000000000a1', 'escopo', 'x', 'bruno@example.com')$q$, '42501', 'membro não forja o autor');
select pg_temp.falha($q$insert into public.amaralesilva_adjustments (project_id, topic) values ('00000000-0000-0000-0000-0000000000a1', 'escopo')$q$, '23514', 'ajuste manual exige de ou para');
select pg_temp.falha($q$update public.amaralesilva_adjustments set value_to = 'editado'$q$, '42501', 'ajuste não se edita');

update public.amaralesilva_projects set price_proposed = 1200, status = 'ajuste_proposta' where id = '00000000-0000-0000-0000-0000000000a1';
update public.amaralesilva_projects set price_proposed = 1200, payment_terms = payment_terms where id = '00000000-0000-0000-0000-0000000000a1';
select pg_temp.igual((select string_agg(topic || ':' || coalesce(value_from, '∅') || '→' || value_to || '@' || stage, ' ' order by topic) from public.amaralesilva_adjustments where source = 'auto'),
  'etapa:proposta_enviada→ajuste_proposta@proposta_enviada preco_proposto:1000.00→1200.00@ajuste_proposta', 'mudança real gera registro automático, save repetido não');
select pg_temp.igual(pg_temp.linhas($q$delete from public.amaralesilva_adjustments where source = 'auto'$q$), '0', 'automático não se apaga');
select pg_temp.igual(pg_temp.linhas($q$delete from public.amaralesilva_adjustments where source = 'manual'$q$), '1', 'manual se apaga');
reset role;

rollback;
\o
\echo 'RESULTADO: todos os testes do banco passaram'
