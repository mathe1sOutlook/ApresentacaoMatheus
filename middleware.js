// Barreira das prévias: /previa/<slug>/… só abre com sessão válida de quem
// pode ver aquela versão (o cliente dono do projeto ou a equipe).
//
// Como funciona: as páginas do portal gravam o access token do Supabase no
// cookie cm_at (Path=/previa). Aqui o token é entregue ao próprio banco, que o
// valida e responde amaralesilva_preview_access(slug). Nenhum segredo mora
// neste arquivo: a chave abaixo é a publicável, a mesma do HTML.
// Ver docs/plano-area-do-cliente.md e admin/previews-schema.sql.
//
// Routing Middleware da Vercel, sem framework nem dependência: devolver a
// resposta "x-middleware-next" deixa o pedido seguir para o arquivo estático.

export const config = { matcher: ['/previa/:path*'] };

const SUPABASE_URL = 'https://wsgjbzsdewzplsnpfvdf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uUuSrKXuJXalJ79WO0PxDg_QpIEOfvA';
const TTL_MS = 60 * 1000;           // vale por 1 min para não consultar a cada imagem
const MAX_CACHE = 500;

const cache = new Map();            // "<fim do token>|<slug>" -> { ok, exp }

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

export default async function middleware(request) {
  const slug = new URL(request.url).pathname.split('/')[2] || '';
  const token = cookie(request, 'cm_at');
  if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(slug) || token.split('.').length !== 3) return deny(request);

  const key = token.slice(-32) + '|' + slug;
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return hit.ok ? proceed() : deny(request);

  let ok = false;
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/amaralesilva_preview_access', {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_slug: slug }),
    });
    ok = r.ok && (await r.json()) === true;
  } catch (e) { ok = false; }

  if (cache.size >= MAX_CACHE) cache.clear();
  cache.set(key, { ok, exp: Date.now() + TTL_MS });
  return ok ? proceed() : deny(request);
}
