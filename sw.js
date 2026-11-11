/* CASA MARTECH — service worker do painel (/admin).
   Só notificações: recebe o push, mostra, e no clique abre o painel na rota
   certa. Não há cache — o painel é sempre lido da rede. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'CASA MARTECH', {
    body: d.body || '',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    lang: 'pt-BR',
    icon: '/img/app/icon-192.png',
    badge: '/img/app/badge-96.png',
    data: { url: d.url || '/admin#/dashboard' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/admin', self.location.origin).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (new URL(w.url).pathname.startsWith('/admin')) {
        w.postMessage({ type: 'open', url });
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
