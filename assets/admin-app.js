/* CASA MARTECH — o painel como app: instalação e notificações.
   Depende de `sb`, `state` e `toast` do script principal do admin/index.html.

   - O service worker (/sw.js, escopo /admin) só recebe push e abre o painel
     no clique; não guarda nada em cache.
   - A inscrição de cada aparelho fica em amaralesilva_push_subscriptions, por
     e-mail do membro. Quem dispara é o banco (lead novo, parcela paga, tarefa
     atribuída) via Edge Function push-notify.
   - No iPhone, notificação só existe com o app instalado na Tela de Início
     (iOS 16.4+): fora dele o botão explica o caminho em vez de falhar. */
(function () {
  'use strict';
  const FN = 'push-notify';
  const SUBS = 'amaralesilva_push_subscriptions';
  const box = document.getElementById('app-controls');
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let installEvt = null;
  let reg = null;
  let busy = false;

  const say = (m) => (typeof toast === 'function' ? toast(m) : alert(m));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/admin' })
      .then((r) => { reg = r; paint(); })
      .catch(() => paint());
    /* clique numa notificação com o painel já aberto: o SW pede a rota */
    navigator.serviceWorker.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type === 'open' && typeof d.url === 'string') {
        const u = new URL(d.url, location.origin);
        if (u.pathname.startsWith('/admin') && u.hash) location.hash = u.hash;
      }
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; paint(); });
  window.addEventListener('appinstalled', () => { installEvt = null; paint(); say('App instalado.'); });

  function b64ToBytes(s) {
    const pad = '='.repeat((4 - (s.length % 4)) % 4);
    const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }
  const bytesToB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  async function currentSub() {
    if (!reg) return null;
    try { return await reg.pushManager.getSubscription(); } catch (e) { return null; }
  }

  async function invoke(body) {
    const { data, error } = await sb.functions.invoke(FN, { body });
    if (error) throw new Error(error.message || 'falha na função');
    return data;
  }

  async function enable() {
    if (isIOS && !standalone) {
      say('No iPhone, instale antes: Compartilhar → Adicionar à Tela de Início. Depois abra pelo ícone e ative aqui.');
      return;
    }
    if (!supported || !reg) { say('Este navegador não recebe notificações.'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      say(perm === 'denied'
        ? 'Notificações bloqueadas para o site. Libere nas configurações do navegador e tente de novo.'
        : 'Permissão não concedida.');
      return;
    }
    const { key } = await invoke({ action: 'key' });
    let sub = await currentSub();
    if (sub) {
      const cur = sub.options && sub.options.applicationServerKey;
      if (cur && bytesToB64(cur) !== key) { await sub.unsubscribe(); sub = null; }
    }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
    const j = sub.toJSON();
    const { error } = await sb.from(SUBS).upsert({
      member_email: state.me.email.toLowerCase(),
      endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth,
      user_agent: navigator.userAgent.slice(0, 300),
    }, { onConflict: 'endpoint' });
    if (error) throw error;
    say('Notificações ativas neste aparelho.');
  }

  async function disable() {
    const sub = await currentSub();
    if (sub) {
      await sb.from(SUBS).delete().eq('endpoint', sub.endpoint);
      await sub.unsubscribe();
    }
    say('Notificações desligadas neste aparelho.');
  }

  async function test() {
    const r = await invoke({ action: 'test' });
    say(r && r.sent ? 'Notificação de teste enviada.' : 'Nenhum aparelho seu inscrito — ative primeiro.');
  }

  async function run(fn) {
    if (busy) return;
    busy = true;
    try { await fn(); } catch (e) { say('Erro: ' + (e.message || e)); }
    busy = false;
    paint();
  }

  async function paint() {
    if (!box) return;
    const sub = await currentSub();
    const perm = 'Notification' in window ? Notification.permission : 'default';
    const on = !!sub && perm === 'granted';
    const parts = [];
    if (installEvt) parts.push('<button type="button" class="btn-link" data-app="install">Instalar como app</button>');
    else if (isIOS && !standalone) parts.push('<span class="label label--soft">Para instalar: Compartilhar → Adicionar à Tela de Início</span>');
    if (on) {
      parts.push('<span class="label label--soft">Notificações ativas neste aparelho</span>');
      parts.push('<button type="button" class="btn-link" data-app="test">Enviar notificação de teste</button>');
      parts.push('<button type="button" class="btn-link" data-app="off">Desligar notificações</button>');
    } else if (supported || isIOS) {
      parts.push('<button type="button" class="btn-link" data-app="on">Ativar notificações</button>');
    }
    box.innerHTML = parts.join('');
    box.hidden = !parts.length;
  }

  if (box) {
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-app]');
      if (!b) return;
      const a = b.dataset.app;
      if (a === 'install' && installEvt) {
        installEvt.prompt();
        installEvt.userChoice.finally(() => { installEvt = null; paint(); });
      }
      if (a === 'on') run(enable);
      if (a === 'off') run(disable);
      if (a === 'test') run(test);
    });
  }
  paint();
})();
