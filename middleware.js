// Barreira das prévias: /previa/<slug>/… só abre com sessão válida de quem
// pode ver aquela versão (o cliente dono do projeto ou a equipe).
//
// Como funciona: as páginas do portal gravam o access token do Supabase no
// cookie cm_at (Path=/previa). Aqui o token é entregue ao próprio banco, que o
// valida e responde amaralesilva_preview_route(slug): null sem acesso; {} para
// a pasta estática em previa/<slug>/; {upstream, bypass_env} para um site com
// servidor (ex. o Next.js da Pedralum) publicado num deploy da Vercel, que
// aqui é repassado pela mesma origem, para o visualizador continuar lendo o
// iframe e marcando pontos. Nenhum segredo mora neste arquivo: a chave abaixo
// é a publicável, a mesma do HTML; o segredo de bypass do deploy de destino
// vem de uma variável de ambiente PREVIA_BYPASS_* do projeto na Vercel.
// Ver docs/plano-area-do-cliente.md e admin/previews-schema.sql.
//
// Routing Middleware da Vercel, sem framework nem dependência: devolver a
// resposta "x-middleware-next" deixa o pedido seguir para o arquivo estático.

export const config = { matcher: ['/previa/:path*'] };

const SUPABASE_URL = 'https://wsgjbzsdewzplsnpfvdf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uUuSrKXuJXalJ79WO0PxDg_QpIEOfvA';
const TTL_MS = 60 * 1000;           // vale por 1 min para não consultar a cada imagem
const MAX_CACHE = 500;
const UPSTREAM = /^https:\/\/[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.vercel\.app$/;
const BYPASS_ENV = /^PREVIA_BYPASS_[A-Z0-9_]{1,40}$/;
const ROBOTS = 'noindex, nofollow, noarchive, nosnippet';

const cache = new Map();            // "<fim do token>|<slug>" -> { route, exp }

const proceed = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

function deny(request) {
  const wantsPage = (request.headers.get('accept') || '').includes('text/html');
  if (wantsPage) return Response.redirect(new URL('/entrar', request.url), 302);
  return new Response('Acesso restrito', { status: 401, headers: { 'cache-control': 'no-store' } });
}

function cookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return '';
}

/* O cookie da sessão (cm_at) nunca sai daqui: o site de destino não precisa
   dele e não deve recebê-lo. Os demais cookies seguem. */
function cookiesSemSessao(request) {
  const raw = request.headers.get('cookie') || '';
  return raw.split(';').map((p) => p.trim()).filter((p) => p && !p.startsWith('cm_at=')).join('; ');
}

const HOP = ['host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'content-length', 'accept-encoding', 'cookie'];

/* Repassa o pedido ao deploy de destino, na mesma rota (o deploy foi gerado
   com basePath /previa/<slug>). */
async function repassar(request, slug, route, env) {
  const url = new URL(request.url);
  const root = '/previa/' + slug;
  /* A raiz chega com barra (vercel.json manda /previa/<slug> para
     /previa/<slug>/); o Next serve a raiz do basePath sem ela e redirecionaria
     de volta. */
  const path = url.pathname === root + '/' ? root : url.pathname;
  const target = new URL(path + url.search, route.upstream);

  const headers = new Headers();
  for (const [k, v] of request.headers) {
    if (!HOP.includes(k.toLowerCase()) && !k.toLowerCase().startsWith('x-vercel-')) headers.set(k, v);
  }
  const ck = cookiesSemSessao(request);
  if (ck) headers.set('cookie', ck);
  const secret = route.bypass_env ? env[route.bypass_env] : '';
  if (secret) headers.set('x-vercel-protection-bypass', secret);

  const init = { method: request.method, headers, redirect: 'manual' };
  if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();

  let r;
  try { r = await fetch(target, init); }
  catch (e) { return new Response('Prévia indisponível no momento.', { status: 502, headers: { 'cache-control': 'no-store', 'x-robots-tag': ROBOTS } }); }

  const out = new Headers(r.headers);
  /* o fetch já descomprime o corpo */
  out.delete('content-encoding'); out.delete('content-length'); out.delete('transfer-encoding');
  /* redirecionamento para o próprio deploy volta para este domínio */
  const loc = out.get('location');
  if (loc) {
    try {
      const l = new URL(loc, target);
      if (l.origin === target.origin) out.set('location', l.pathname + l.search + l.hash);
    } catch (e) { /* mantém como veio */ }
  }
  /* resposta depende da sessão: nunca em cache compartilhado */
  const immutable = url.pathname.startsWith(root + '/_next/static/');
  out.set('cache-control', immutable ? 'private, max-age=31536000, immutable' : 'private, no-store');
  out.delete('cdn-cache-control'); out.delete('vercel-cdn-cache-control');
  out.set('x-robots-tag', ROBOTS);
  const noBody = request.method === 'HEAD' || r.status === 204 || r.status === 304;
  return new Response(noBody ? null : r.body, { status: r.status, statusText: r.statusText, headers: out });
}

/* Confere o que o banco devolveu antes de seguir qualquer destino. */
function validRoute(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  if (v.upstream == null) return {};
  if (typeof v.upstream !== 'string' || !UPSTREAM.test(v.upstream)) return null;
  if (v.bypass_env != null && (typeof v.bypass_env !== 'string' || !BYPASS_ENV.test(v.bypass_env))) return null;
  return { upstream: v.upstream, bypass_env: v.bypass_env || null };
}

export default async function middleware(request) {
  const slug = new URL(request.url).pathname.split('/')[2] || '';
  const token = cookie(request, 'cm_at');
  if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(slug) || token.split('.').length !== 3) return deny(request);

  const key = token.slice(-32) + '|' + slug;
  const hit = cache.get(key);
  let route;
  if (hit && hit.exp > Date.now()) {
    route = hit.route;
  } else {
    route = null;
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/amaralesilva_preview_route', {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_slug: slug }),
      });
      route = r.ok ? validRoute(await r.json()) : null;
    } catch (e) { route = null; }
    if (cache.size >= MAX_CACHE) cache.clear();
    cache.set(key, { route, exp: Date.now() + TTL_MS });
  }

  if (!route) return deny(request);
  if (!route.upstream) return proceed();
  return repassar(request, slug, route, (globalThis.process && process.env) || {});
}
