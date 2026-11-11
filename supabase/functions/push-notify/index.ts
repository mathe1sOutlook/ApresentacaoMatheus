// Casa Martech — notificações do painel (Web Push).
// POST {action:"key"}: chave pública VAPID (gera o par na primeira chamada).
// POST {action:"test"}: membro logado; manda um teste aos aparelhos dele.
// POST {action:"event",title,body,url,tag,to?,exclude?} com x-push-secret:
//   chamado pelo banco (public.amaralesilva_push) — lead novo, parcela paga,
//   tarefa atribuída. Ver admin/push-schema.sql.
// Sem secrets para configurar: as chaves VAPID e o segredo do banco ficam em
// amaralesilva_push_config, que só o service role lê.
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const PUBLIC_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SUBJECT = "https://www.casamartech.com.br";
const SUBS = "amaralesilva_push_subscriptions";
const CONF = "amaralesilva_push_config";

const admin = () => createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const headers = {
  "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
  "Access-Control-Allow-Methods": "POST, OPTIONS", "Cache-Control": "no-store",
};
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const b64u = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

type Conf = { vapid_public: string | null; vapid_private: string | null; hook_secret: string };

async function config(): Promise<Conf> {
  const db = admin();
  const { data, error } = await db.from(CONF).select("vapid_public,vapid_private,hook_secret").eq("id", 1).single();
  if (error) throw error;
  if (data.vapid_public && data.vapid_private) return data as Conf;
  // Primeiro uso: gera o par P-256 com WebCrypto. Pública = ponto bruto (65
  // bytes), privada = escalar d — os formatos que o web-push espera.
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as CryptoKeyPair;
  const pub = b64u(await crypto.subtle.exportKey("raw", pair.publicKey));
  const jwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  // só grava se ninguém gravou antes (duas primeiras chamadas simultâneas)
  await db.from(CONF).update({ vapid_public: pub, vapid_private: jwk.d, updated_at: new Date().toISOString() })
    .eq("id", 1).is("vapid_public", null);
  const again = await db.from(CONF).select("vapid_public,vapid_private,hook_secret").eq("id", 1).single();
  if (again.error) throw again.error;
  return again.data as Conf;
}

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

function sameSecret(a: string, b: string) {
  if (!a || a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

type Msg = { title: string; body: string; url: string; tag: string };

async function send(conf: Conf, msg: Msg, to: string | null, exclude: string | null) {
  webpush.setVapidDetails(SUBJECT, conf.vapid_public!, conf.vapid_private!);
  const db = admin();
  const { data: subs, error } = await db.from(SUBS).select("id,member_email,endpoint,p256dh,auth");
  if (error) throw error;
  const list = (subs || []).filter((s) => {
    const e = s.member_email.toLowerCase();
    return (!to || e === to.toLowerCase()) && (!exclude || e !== exclude.toLowerCase());
  });
  const payload = JSON.stringify(msg);
  let sent = 0;
  await Promise.all(list.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400, urgency: "high" });
      sent++;
      await db.from(SUBS).update({ last_ok_at: new Date().toISOString() }).eq("id", s.id);
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      // 404/410: o aparelho desinstalou ou revogou — a inscrição morreu
      if (code === 404 || code === 410) await db.from(SUBS).delete().eq("id", s.id);
      else console.error("push falhou", code, err instanceof Error ? err.message : String(err));
    }
  }));
  return { sent, targets: list.length };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return respond({ error: "Método inválido." }, 405);
  if (!SUPABASE_URL || !SERVICE_KEY || !PUBLIC_KEY) return respond({ error: "Servidor sem configuração." }, 503);
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return respond({ error: "JSON inválido." }, 400);
    const action = str(body.action, 20);
    const conf = await config();

    if (action === "key") return respond({ key: conf.vapid_public });

    if (action === "test") {
      const email = await memberEmail(req);
      if (!email) return respond({ error: "Acesso negado." }, 403);
      const r = await send(conf, { title: "CASA MARTECH", body: "Notificações funcionando neste aparelho.", url: "/admin#/dashboard", tag: "teste" }, email, null);
      return respond(r);
    }

    if (action === "event") {
      if (!sameSecret(req.headers.get("x-push-secret") || "", conf.hook_secret)) return respond({ error: "Acesso negado." }, 403);
      const url = str(body.url, 200);
      const msg = {
        title: str(body.title, 80) || "CASA MARTECH",
        body: str(body.body, 240),
        url: url.startsWith("/admin") ? url : "/admin#/dashboard",
        tag: str(body.tag, 80),
      };
      return respond(await send(conf, msg, str(body.to, 200) || null, str(body.exclude, 200) || null));
    }
    return respond({ error: "Ação desconhecida." }, 400);
  } catch (err) {
    console.error("push-notify", err instanceof Error ? err.message : String(err));
    return respond({ error: "Falha ao processar." }, 502);
  }
});
