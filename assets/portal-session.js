/* Cookie das prévias. O middleware.js lê o access token daqui e o entrega ao
   Supabase para decidir quem abre /previa/<slug>/. Path=/previa: o cookie não
   viaja para nenhuma outra rota. Ver docs/plano-area-do-cliente.md. */
window.cmPreviewCookie = {
  set: function (session) {
    if (!session || !session.access_token) return;
    var age = Math.max(0, (session.expires_at || 0) - Math.floor(Date.now() / 1000));
    document.cookie = 'cm_at=' + encodeURIComponent(session.access_token) + '; Path=/previa; Max-Age=' + age +
      '; SameSite=Strict' + (location.protocol === 'https:' ? '; Secure' : '');
  },
  clear: function () {
    document.cookie = 'cm_at=; Path=/previa; Max-Age=0; SameSite=Strict';
  },
};
