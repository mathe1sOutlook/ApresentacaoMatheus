// Casa Martech — porta de entrada da área do cliente.
// POST {action:"check", email, turnstile}: primeira etapa do login. Devolve
//   {status:"nao"|"primeiro_acesso"|"senha"}. Limita tentativas por IP.
// POST {action:"recover", email, turnstile, redirect_to?}: envia o link de criar
//   ou trocar a senha, só para e-mail de cliente cadastrado. Mesmo limite por IP.
// POST {action:"invite", email, client_id, name?} (Bearer de membro da equipe):
//   cadastra o e-mail como cliente e cria a conta sem senha; o cliente define a
//   senha no primeiro acesso, pela própria tela de entrada.
//
// Cloudflare Turnstile: "check" e "recover" exigem o token do widget da tela de
// entrada, conferido no Cloudflare com o segredo TURNSTILE_SECRET_KEY (segredo da
// função, nunca no repositório). Sem o segredo configurado a conferência é
// pulada, para que publicar este código antes de configurar não derrube o login.
// A conferência é só nestas rotas: o Auth do projeto é compartilhado com outros
// apps e não foi alterado.
// Ver admin/client-access-schema.sql e docs/plano-area-do-cliente.md.
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY") || "";
const LIMIT = 20;            // tentativas por IP...
const WINDOW_MIN = 10;       // ...nesta janela
/* Para onde o link do e-mail pode voltar: são as Redirect URLs de /entrar
   cadastradas no Supabase. Qualquer outro valor cai na primeira. */
const REDIRECTS = [
  "https://www.casamartech.com.br/entrar",
  "https://casamartech.vercel.app/entrar",
  "https://amaralesilva.vercel.app/entrar",
];

const admin = () => createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const headers = {
  "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store",
};
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function memberEmail(req: Request): Promise<string | null> {
  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const client = createClient(SUPABASE_URL, PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser(auth.slice(7));
  if (error || !user?.email) return null;
  const email = user.email.toLowerCase();
  const { data, error: e2 } = await admin().from("amaralesilva_members").select("email");
  if (e2) throw e2;
  return (data || []).some((m: { email: string }) => m.email.toLowerCase() === email) ? email : null;
}

/* Limite por IP, janela deslizante. Devolve true quando estourou. */
async function limited(db: ReturnType<typeof admin>, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
  const { count, error } = await db.from("amaralesilva_portal_attempts")
    .select("id", { count: "exact", head: true }).eq("ip", ip).gte("at", since);
  if (error) throw error;
  if ((count || 0) >= LIMIT) return true;
  await db.from("amaralesilva_portal_attempts").insert({ ip });
  // faxina barata: o que passou de 1 dia não serve mais
  await db.from("amaralesilva_portal_attempts").delete().lt("at", new Date(Date.now() - 86_400_000).toISOString());
  return false;
}

/* Confere o token do Turnstile no Cloudflare. Sem segredo configurado, não
   exige. Com segredo, falha fechada: sem token, token inválido, resposta ruim
   ou Cloudflare fora do ar contam como recusa. */
async function turnstileOk(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true;
  if (!token) return false;
  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET);
  form.append("response", token);
  if (ip && ip !== "?") form.append("remoteip", ip);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    return j.success === true;
  } catch (_e) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return respond({ error: "method" }, 405);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return respond({ error: "json" }, 400); }
  const action = str(body.action, 20);
  const db = admin();

  try {
    if (action === "check" || action === "recover") {
      const email = str(body.email, 254).toLowerCase();
      if (!EMAIL.test(email)) return respond({ error: "email" }, 400);
      const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";
      if (await limited(db, ip)) return respond({ error: "limite" }, 429);
      if (!(await turnstileOk(str(body.turnstile, 2100), ip))) return respond({ error: "captcha" }, 400);
      const { data: status, error } = await db.rpc("amaralesilva_client_login_status", { p_email: email });
      if (error) throw error;

      if (action === "check") return respond({ status });

      // recover: só e-mail de cliente cadastrado recebe o link. Para os outros a
      // resposta é a mesma, sem enviar nada, para não revelar quem é cliente.
      if (status === "nao") return respond({ ok: true });
      const wanted = str(body.redirect_to, 200);
      const redirectTo = REDIRECTS.includes(wanted) ? wanted : REDIRECTS[0];
      // fluxo implícito (padrão): o link precisa abrir em outro aparelho, sem o
      // verificador do PKCE, que só existe no navegador que pediu.
      const anon = createClient(SUPABASE_URL, PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false, flowType: "implicit" } });
      const { error: re } = await anon.auth.resetPasswordForEmail(email, { redirectTo });
      if (re) {
        const rate = re.status === 429 || /rate/i.test(String(re.code || re.message || ""));
        return respond({ error: rate ? "limite_email" : "envio" }, rate ? 429 : 502);
      }
      return respond({ ok: true });
    }

    if (action === "invite") {
      if (!(await memberEmail(req))) return respond({ error: "forbidden" }, 403);
      const email = str(body.email, 254).toLowerCase();
      const clientId = str(body.client_id, 64);
      const name = str(body.name, 120) || null;
      if (!EMAIL.test(email) || !clientId) return respond({ error: "dados" }, 400);
      // índice único é em lower(email), então não dá para usar upsert por coluna
      const { data: found, error: fe } = await db.from("amaralesilva_client_users").select("id").eq("email", email).maybeSingle();
      if (fe) throw fe;
      const { error: ie } = found
        ? await db.from("amaralesilva_client_users").update({ client_id: clientId, name, active: true }).eq("id", found.id)
        : await db.from("amaralesilva_client_users").insert({ email, client_id: clientId, name, active: true });
      if (ie) throw ie;
      // conta sem senha: createUser falha se o e-mail já existe, e está certo
      const { error: ue } = await db.auth.admin.createUser({ email, email_confirm: true });
      if (ue && !/already|registered|exists/i.test(ue.message)) throw ue;
      const { data } = await db.rpc("amaralesilva_client_login_status", { p_email: email });
      return respond({ status: data });
    }

    return respond({ error: "action" }, 400);
  } catch (e) {
    console.error("portal-auth", e);
    return respond({ error: "interno" }, 500);
  }
});
