/* CASA MARTECH — login do painel pelo botão do próprio Google.
   Com o redirecionamento OAuth do Supabase, a tela do Google dizia
   "continuar para wsgjbzsdewzplsnpfvdf.supabase.co". Aqui o Google autentica
   direto no casamartech.com.br (Google Identity Services) e o Supabase só
   recebe o ID token (signInWithIdToken). A tela passa a mostrar o nome do app
   e o domínio do site.

   Pré-requisito no Google Cloud Console, no Client ID abaixo: as origens do
   painel em "Origens JavaScript autorizadas". Enquanto não estiverem, o botão
   do Google falha e o "Entrar com Google" antigo (redirecionamento) continua
   logo abaixo, como alternativa. Depende de `sb`, `enter` e `toast` do
   script principal. */
(function () {
  'use strict';
  /* O mesmo Client ID configurado no provedor Google do Supabase: o token
     precisa ter esse "aud" para o Supabase aceitar. Não é segredo. */
  const CLIENT_ID = '874081383632-dktraoefi4mrg4hh4rmb9ekts9b5n5k0.apps.googleusercontent.com';
  const box = document.getElementById('g-signin');
  const fallback = document.getElementById('g-fallback');
  if (!box || typeof sb === 'undefined' || !sb) return;

  let rawNonce = '';

  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function onCredential(resp) {
    try {
      const { data, error } = await sb.auth.signInWithIdToken({ provider: 'google', token: resp.credential, nonce: rawNonce });
      if (error) throw error;
      await enter(data.session);
    } catch (e) {
      toast('Erro no login: ' + (e.message || e));
      init(); /* nonce é de uso único: prepara outro para a próxima tentativa */
    }
  }

  async function init() {
    if (!window.google || !google.accounts || !google.accounts.id) return;
    rawNonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: onCredential,
      nonce: await sha256Hex(rawNonce),
      ux_mode: 'popup',
      context: 'signin',
      itp_support: true,
      use_fedcm_for_button: true,
      auto_select: false,
    });
    box.hidden = false;
    google.accounts.id.renderButton(box, {
      type: 'standard', theme: 'outline', size: 'large', text: 'signin_with',
      shape: 'rectangular', logo_alignment: 'left', locale: 'pt-BR', width: 280,
    });
    /* o botão antigo vira alternativa discreta */
    if (fallback) {
      fallback.className = 'btn-link';
      fallback.textContent = 'Não funcionou? Entrar de outro jeito';
    }
  }

  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client';
  s.async = true;
  s.onload = init;
  document.head.appendChild(s);
})();
