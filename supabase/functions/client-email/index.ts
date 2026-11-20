// Casa Martech — e-mails aos clientes, enviados pelo Resend.
//
// POST {action:"preview"|"send", kind, project_id, ref_id?, to?, how_to_pay?}
//   (Bearer de membro da equipe). "preview" monta o e-mail e devolve
//   {subject, html, text, recipients}; "send" envia e grava o histórico em
//   amaralesilva_client_emails. kind: atualizacao (ref_id = prévia), proposta,
//   acompanhamento, cobranca (ref_id = parcela).
// GET/POST ?stop=<token>: "Parar lembretes" do acompanhamento, sem login.
//   GET mostra um botão (robô que abre link não descadastra ninguém); POST,
//   inclusive o one-click do cabeçalho List-Unsubscribe-Post, grava na hora.
//
// Segredos da função (nunca no repositório): RESEND_API_KEY e EMAIL_FROM
// ("CASA MARTECH <avisos@casamartech.com.br>", de um domínio verificado no
// Resend). Sem eles, "preview" funciona e "send" recusa com aviso claro.
// Destinatário só pode ser o e-mail do cliente do projeto ou um acesso ativo
// dele na área do cliente: a função não envia para endereço digitado.
// Ver admin/client-emails-schema.sql.
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import * as T from "./templates.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM = Deno.env.get("EMAIL_FROM") || "";
const SITE = "https://www.casamartech.com.br";
const PORTAL = SITE + "/cliente";
const WHATSAPP = "https://wa.me/5511999773471";
const SELF_URL = SUPABASE_URL + "/functions/v1/client-email";
const TZ = "America/Sao_Paulo";
const KINDS = ["atualizacao", "proposta", "acompanhamento", "cobranca"] as const;
type Kind = typeof KINDS[number];
const ROLE: Record<string, string> = { "Matheus Silva": "Tecnologia e dados", "Bruno Amaral": "Marca e estratégia" };

const db = () => createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Cache-Control": "no-store",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const page = (title: string, body: string, status = 200) => new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${T.esc(title)}</title></head>
<body style="margin:0;background:#E7E3DA;font:16px/1.6 Arial,sans-serif;color:#2A2C33">
<main style="max-width:520px;margin:12vh auto;padding:32px;background:#FBFAF7;border:1px solid #D6D1C5;border-radius:8px">
<p style="margin:0 0 12px;font:bold 12px 'Courier New',monospace;letter-spacing:2px">CASA MARTECH</p>${body}</main></body></html>`,
  { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const lc = (s: string | null | undefined) => String(s || "").trim().toLowerCase();
const firstName = (s: string | null | undefined) => String(s || "").trim().split(/\s+/)[0] || "";
const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...opts }).format(new Date(iso.length === 10 ? iso + "T12:00:00-03:00" : iso));
const short = (iso: string) => fmtDate(iso, { day: "2-digit", month: "2-digit", year: "numeric" });
const long = (iso: string) => fmtDate(iso, { day: "numeric", month: "long" });
const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const todaySP = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
const absUrl = (u: string | null) => {
  if (!u) return "";
  const full = u.startsWith("/") ? SITE + u : u;
  return /^https:\/\/[^\s"<>]+$/.test(full) ? full : "";
};

type Member = { email: string; name: string; tier: string | null };
async function member(req: Request): Promise<Member | null> {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const anon = createClient(SUPABASE_URL, PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await anon.auth.getUser(auth.slice(7));
  if (error || !user?.email) return null;
  const { data, error: e2 } = await db().from("amaralesilva_members").select("email,name,tier");
  if (e2) throw e2;
  return (data || []).find((m: Member) => lc(m.email) === lc(user.email)) || null;
}

/* Mesma regra do banco (amaralesilva_sees): compartilhado, meu, ou sou dev. */
const sees = (m: Member, owner: string | null) => owner == null || lc(owner) === lc(m.email) || m.tier === "dev";

class Refuse extends Error {}

type Built = { mail: T.Mail; to: string; replyTo: string[]; fromName: string; headers: Record<string, string>; stopToken: string; refId: string | null };

async function build(m: Member, body: Record<string, unknown>, members: Member[]): Promise<{ built: Built | null; recipients: { email: string; label: string }[] }> {
  const kind = str(body.kind, 20) as Kind;
  if (!KINDS.includes(kind)) throw new Refuse("tipo de e-mail inválido");
  const projectId = str(body.project_id, 40);
  if (!UUID.test(projectId)) throw new Refuse("projeto inválido");
  const s = db();

  const { data: proj, error } = await s.from("amaralesilva_projects").select("*").eq("id", projectId).maybeSingle();
  if (error) throw error;
  if (!proj || !sees(m, proj.owner_email)) throw new Refuse("projeto não encontrado");
  if (!proj.client_id) throw new Refuse("o projeto não tem cliente cadastrado");
  const { data: cli } = await s.from("amaralesilva_clients").select("*").eq("id", proj.client_id).maybeSingle();
  if (!cli) throw new Refuse("cliente não encontrado");
  const { data: users } = await s.from("amaralesilva_client_users").select("email,name,active").eq("client_id", cli.id);

  /* Destinatários permitidos: acessos ativos da área do cliente + o e-mail do cadastro. */
  const recipients: { email: string; label: string; name: string }[] = [];
  for (const u of users || []) if (u.active && u.email) recipients.push({ email: lc(u.email), label: `${u.name || u.email} (acesso à área)`, name: u.name || "" });
  if (cli.email && !recipients.some((r) => r.email === lc(cli.email))) recipients.push({ email: lc(cli.email), label: `${cli.email} (cadastro do cliente)`, name: "" });
  const pub = recipients.map(({ email, label }) => ({ email, label }));

  const wanted = lc(str(body.to, 200));
  const rec = wanted ? recipients.find((r) => r.email === wanted) : recipients[0];
  if (wanted && !rec) throw new Refuse("destinatário não é do cliente deste projeto");
  if (!rec) return { built: null, recipients: pub };
  /* Acesso cadastrado com o nome da empresa ("Pedralumen") não vira "Olá, Pedralumen". */
  const plain = (x: string | null | undefined) => lc(x).normalize("NFD").replace(/[̀-ͯ]/g, "");
  const isCompany = [cli.name, cli.company].some((n) => n && plain(n) === plain(rec.name));
  const first = isCompany ? "" : firstName(rec.name);

  const me: T.Signer = { name: m.name, role: ROLE[m.name] || "CASA MARTECH" };
  const all = members.map((x) => lc(x.email));
  const stopToken = crypto.randomUUID();
  const refId = str(body.ref_id, 40);
  let mail: T.Mail, replyTo = [lc(m.email)], fromName = `${m.name} · CASA MARTECH`;
  const headers: Record<string, string> = {};

  if (kind === "atualizacao") {
    if (!UUID.test(refId)) throw new Refuse("escolha a versão da prévia");
    const { data: v } = await s.from("amaralesilva_previews").select("*").eq("id", refId).eq("project_id", proj.id).maybeSingle();
    if (!v) throw new Refuse("prévia não encontrada neste projeto");
    if (!["publicada", "ajustes"].includes(v.status)) throw new Refuse("publique a versão antes de avisar o cliente");
    if (!["proposta_enviada", "negociacao", "fechado", "concluido"].includes(proj.status)) {
      throw new Refuse("o cliente só vê a prévia com o projeto a partir de \"proposta enviada\"");
    }
    if (!(users || []).some((u) => u.active && lc(u.email) === rec.email)) {
      throw new Refuse("esse e-mail não tem acesso à área do cliente; libere o acesso antes");
    }
    mail = T.atualizacao({ first, project: proj.name, version: v.version, title: v.title, url: `${SITE}/cliente/previa/?id=${v.id}`, portal: PORTAL, signer: me, site: SITE });
  } else if (kind === "proposta" || kind === "acompanhamento") {
    const url = absUrl(proj.proposal_url);
    if (!url) throw new Refuse("cadastre a URL da proposta no projeto");
    if (kind === "proposta") {
      mail = T.proposta({ first, project: proj.name, url, date: long(new Date().toISOString()), site: SITE });
      replyTo = all; fromName = "Bruno Amaral e Matheus Silva · CASA MARTECH";
    } else {
      const { data: out } = await s.from("amaralesilva_email_optouts").select("email").eq("project_id", proj.id).eq("email", rec.email).maybeSingle();
      if (out) throw new Refuse("essa pessoa pediu para não receber lembretes desta proposta");
      const { data: prev } = await s.from("amaralesilva_client_emails").select("created_at")
        .eq("project_id", proj.id).eq("kind", "proposta").eq("to_email", rec.email).eq("status", "enviado")
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      const stopUrl = `${SELF_URL}?stop=${stopToken}`;
      mail = T.acompanhamento({ first, project: proj.name, url, sentOn: prev ? long(prev.created_at) : null, stopUrl, signer: me, whatsapp: WHATSAPP, site: SITE });
      headers["List-Unsubscribe"] = `<${stopUrl}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }
  } else {
    if (!UUID.test(refId)) throw new Refuse("escolha a parcela");
    const { data: pays } = await s.from("amaralesilva_payments").select("*").eq("project_id", proj.id).order("due_date");
    const list = pays || [];
    const idx = list.findIndex((x) => x.id === refId);
    if (idx < 0) throw new Refuse("parcela não encontrada neste projeto");
    const pay = list[idx];
    if (pay.status === "pago") throw new Refuse("essa parcela já está paga");
    if (!pay.due_date) throw new Refuse("a parcela não tem vencimento");
    if (!(Number(pay.amount) > 0)) throw new Refuse("a parcela não tem valor");
    const { data: ck } = await s.from("amaralesilva_infinitepay_checkouts").select("checkout_url,valid_until,state")
      .eq("payment_id", pay.id).eq("state", "created").gt("valid_until", new Date().toISOString())
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    const checkout = ck && /^https:\/\//.test(ck.checkout_url || "") ? ck.checkout_url : null;
    let howToPay = str(body.how_to_pay, 600);
    if (!checkout && !howToPay) {
      /* Na pré-visualização mostra o lugar do campo; no envio, recusa. */
      if (str(body.action, 20) !== "preview") throw new Refuse("gere o link de cobrança (Pix/cartão) ou escreva como pagar");
      howToPay = "[escreva como pagar no campo acima]";
    }
    mail = T.cobranca({
      first, project: proj.name, position: `${idx + 1} de ${list.length}`, description: pay.description || "",
      due: short(pay.due_date), dueLong: long(pay.due_date), amount: brl(Number(pay.amount)),
      checkout, howToPay, portal: PORTAL, site: SITE, overdue: pay.due_date < todaySP(),
    });
    replyTo = all; fromName = "CASA MARTECH";
  }
  return { built: { mail, to: rec.email, replyTo, fromName, headers, stopToken, refId: refId || null }, recipients: pub };
}

/* "Nome <endereço>" com o nome trocado: o endereço é sempre o de EMAIL_FROM. */
function fromWith(name: string): string {
  const addr = (FROM.match(/<([^>]+)>/) || [, FROM])[1]!.trim();
  return `${name.replace(/["<>]/g, "")} <${addr}>`;
}

async function stop(req: Request, token: string): Promise<Response> {
  if (!UUID.test(token)) return page("Link inválido", "<p>Este link não é válido.</p>", 400);
  if (req.method === "GET") {
    return page("Parar lembretes", `<h1 style="font:normal 26px Georgia,serif;margin:0 0 12px">Parar os lembretes desta proposta?</h1>
<p>Você continua recebendo avisos de prévia e de cobrança, se tiver um projeto com a gente.</p>
<form method="post"><button type="submit" style="margin-top:8px;padding:14px 22px;border:0;border-radius:8px;background:#C9A24E;color:#0B0D12;font:bold 15px Arial,sans-serif;cursor:pointer">Parar lembretes</button></form>`);
  }
  const s = db();
  const { data: row } = await s.from("amaralesilva_client_emails").select("project_id,to_email").eq("stop_token", token).maybeSingle();
  if (row) await s.from("amaralesilva_email_optouts").upsert({ project_id: row.project_id, email: lc(row.to_email) }, { onConflict: "project_id,email", ignoreDuplicates: true });
  /* Mesma resposta com ou sem registro: o link não revela nada. */
  return page("Pronto", `<h1 style="font:normal 26px Georgia,serif;margin:0 0 12px">Pronto.</h1><p>Não mandamos mais lembretes sobre esta proposta.</p>`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = new URL(req.url);
  const token = url.searchParams.get("stop");
  if (token !== null) {
    try { return await stop(req, token); } catch (_) { return page("Erro", "<p>Não foi possível registrar agora. Tente de novo em instantes.</p>", 500); }
  }
  if (req.method !== "POST") return json({ error: "método não permitido" }, 405);

  try {
    const m = await member(req);
    if (!m) return json({ error: "sem permissão" }, 403);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const action = str(body.action, 20);
    const { data: members } = await db().from("amaralesilva_members").select("email,name,tier");
    const { built, recipients } = await build(m, body, (members || []) as Member[]);

    if (action === "preview") {
      return json({
        recipients, configured: !!(RESEND_KEY && FROM),
        ...(built ? { to: built.to, subject: built.mail.subject, html: built.mail.html, text: built.mail.text } : {}),
      });
    }
    if (action !== "send") return json({ error: "ação inválida" }, 400);
    if (!built) throw new Refuse("o cliente não tem e-mail cadastrado nem acesso à área");
    if (!RESEND_KEY || !FROM) throw new Refuse("envio ainda não configurado: faltam RESEND_API_KEY e EMAIL_FROM na função");

    const s = db();
    /* Clique duplo: o mesmo aviso para a mesma pessoa em menos de 2 min. */
    const since = new Date(Date.now() - 120_000).toISOString();
    let dup = s.from("amaralesilva_client_emails").select("id", { count: "exact", head: true })
      .eq("project_id", body.project_id as string).eq("kind", body.kind as string).eq("to_email", built.to).eq("status", "enviado").gte("created_at", since);
    dup = built.refId ? dup.eq("ref_id", built.refId) : dup.is("ref_id", null);
    const { count } = await dup;
    if ((count || 0) > 0) throw new Refuse("esse e-mail acabou de ser enviado");

    const id = crypto.randomUUID();
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json", "Idempotency-Key": id },
      body: JSON.stringify({
        from: fromWith(built.fromName), to: [built.to], reply_to: built.replyTo,
        subject: built.mail.subject, html: built.mail.html, text: built.mail.text,
        headers: built.headers, tags: [{ name: "kind", value: body.kind as string }],
      }),
    });
    const res = await r.json().catch(() => ({})) as { id?: string; message?: string };
    const ok = r.ok && !!res.id;
    await s.from("amaralesilva_client_emails").insert({
      id, project_id: body.project_id, kind: body.kind, ref_id: built.refId, to_email: built.to,
      subject: built.mail.subject, status: ok ? "enviado" : "falhou", resend_id: res.id || null,
      error: ok ? null : String(res.message || r.status).slice(0, 300), sent_by: lc(m.email), stop_token: built.stopToken,
    });
    if (!ok) return json({ error: "o Resend recusou: " + String(res.message || r.status).slice(0, 200) }, 502);
    return json({ ok: true, to: built.to });
  } catch (e) {
    if (e instanceof Refuse) return json({ error: e.message }, 422);
    console.error("client-email", e instanceof Error ? e.message : e);
    return json({ error: "falha interna" }, 500);
  }
});
