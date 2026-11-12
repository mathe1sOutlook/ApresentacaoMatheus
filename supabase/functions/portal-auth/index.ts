// Casa Martech — porta de entrada da área do cliente.
// POST {action:"check", email}: primeira etapa do login. Devolve
//   {status:"nao"|"primeiro_acesso"|"senha"}. Limita tentativas por IP.
// POST {action:"invite", email, client_id, name?} (Bearer de membro da equipe):
//   cadastra o e-mail como cliente e cria a conta sem senha; o cliente define a
//   senha no primeiro acesso, pela própria tela de entrada.
// Ver admin/client-access-schema.sql e docs/plano-area-do-cliente.md.
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const LIMIT = 20;            // tentativas por IP...
const WINDOW_MIN = 10;       // ...nesta janela

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return respond({ error: "method" }, 405);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return respond({ error: "json" }, 400); }
  const action = str(body.action, 20);
  const db = admin();

  try {
    if (action === "check") {
      const email = str(body.email, 254).toLowerCase();
      if (!EMAIL.test(email)) return respond({ error: "email" }, 400);
      const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";
      const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
      const { count, error: ce } = await db.from("amaralesilva_portal_attempts")
        .select("id", { count: "exact", head: true }).eq("ip", ip).gte("at", since);
      if (ce) throw ce;
      if ((count || 0) >= LIMIT) return respond({ error: "limite" }, 429);
      await db.from("amaralesilva_portal_attempts").insert({ ip });
      // faxina barata: o que passou de 1 dia não serve mais
      await db.from("amaralesilva_portal_attempts").delete().lt("at", new Date(Date.now() - 86_400_000).toISOString());
      const { data, error } = await db.rpc("amaralesilva_client_login_status", { p_email: email });
      if (error) throw error;
      return respond({ status: data });
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
