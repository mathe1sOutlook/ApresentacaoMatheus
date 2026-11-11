/* Casa Martech — divisão Matheus/Bruno no painel.
   Percentual e valor em R$ ficam ligados nos dois sentidos: o que se digita
   num campo atualiza os outros três. Nada é gravado aqui; o salvar continua
   no index.html. Valores impossíveis marcam o campo com setCustomValidity,
   o que também impede o envio do formulário. */
(function (root) {
  'use strict';
  const doc = root.document;
  const byId = (id) => doc.getElementById(id);
  const val = (id) => { const el = byId(id); return el ? el.value.trim() : ''; };

  /* pf = formulário do projeto, pj = novo projeto, py = parcela.
     Na parcela os campos em R$ são as colunas amount_* (parte fixa); nos
     projetos eles não têm name — servem só para chegar ao percentual. */
  const GROUPS = {
    pf: { total: () => (val('pf-pf') !== '' ? ['pf-pf', 'o preço final'] : ['pf-pp', 'o preço proposto']),
          pm: 'pf-sm', pb: 'pf-sb', vm: 'pf-vm', vb: 'pf-vb', note: 'pf-split-note' },
    pj: { total: () => ['pj-price', 'o preço proposto'],
          pm: 'pj-sm', pb: 'pj-sb', vm: 'pj-vm', vb: 'pj-vb', note: 'pj-split-note' },
    py: { total: () => ['py-amount', 'o valor da parcela'],
          pm: 'py-sm', pb: 'py-sb', vm: 'py-am', vb: 'py-ab', note: 'py-split-note', inherit: true },
  };
  const TRIGGERS = { 'pf-pp': 'pf', 'pf-pf': 'pf', 'pj-price': 'pj', 'py-amount': 'py', 'py-project': 'py' };
  for (const [key, g] of Object.entries(GROUPS)) for (const r of ['pm', 'pb', 'vm', 'vb']) TRIGGERS[g[r]] = key;

  const money = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtC = (c) => (c / 100).toFixed(2);
  const num = (v) => {
    if (v == null || String(v).trim() === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const twoDecimals = (n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-7;
  /* percentual válido: 0 a 100, até duas casas */
  function percent(v) {
    const n = num(v);
    return n !== null && n >= 0 && n <= 100 && twoDecimals(n) ? Math.round(n * 100) / 100 : null;
  }
  const complement = (p) => (10000 - Math.round(p * 100)) / 100;
  /* reparte em centavos inteiros: a soma das partes é sempre o total exato */
  function splitCents(totalCents, pct) {
    const m = Math.round(totalCents * Math.round(pct * 100) / 10000);
    return [m, totalCents - m];
  }
  function splitAmounts(total, pct) {
    const n = num(total), p = percent(pct);
    if (n === null || n < 0 || p === null) return null;
    return splitCents(Math.round(n * 100), p).map((c) => c / 100);
  }
  function projectPercent(id) {
    const p = typeof projById === 'function' ? projById(id) : null;
    if (p && percent(p.split_matheus) !== null) return percent(p.split_matheus);
    if (p && percent(p.split_bruno) !== null) return complement(percent(p.split_bruno));
    return 50;
  }

  function els(key) {
    const c = GROUPS[key];
    const g = { key, cfg: c };
    for (const r of ['pm', 'pb', 'vm', 'vb', 'note']) { g[r] = byId(c[r]); if (!g[r]) return null; }
    g.form = g.pm.form;
    return g;
  }

  function setNote(g, msg, isError) {
    g.note.textContent = msg || '';
    g.note.classList.toggle('is-error', !!isError);
    g.note.setAttribute('role', isError ? 'alert' : 'status');
  }
  function fail(g, fields, msg) {
    for (const el of fields) { el.setCustomValidity(msg); el.setAttribute('aria-invalid', 'true'); }
    setNote(g, msg, true);
  }
  function clearErrors(g) {
    for (const r of ['pm', 'pb', 'vm', 'vb']) { g[r].setCustomValidity(''); g[r].removeAttribute('aria-invalid'); }
  }

  /* Total de referência: número em centavos, ou null se ausente/inválido. */
  function totalOf(g) {
    const [id, label] = g.cfg.total();
    const T = num(val(id));
    return { cents: T !== null && T > 0 ? Math.round(T * 100) : null, label };
  }

  /* Lê um valor em R$ digitado e devolve centavos ou uma mensagem de erro. */
  function readAmount(el, tot) {
    const v = num(el.value);
    if (v === null) return { err: 'Valor em R$ inválido.' };
    if (v < 0) return { err: 'O valor em R$ não pode ser negativo.' };
    if (!twoDecimals(v)) return { err: 'Use no máximo duas casas decimais (centavos).' };
    if (tot.cents === null) return { err: 'Preencha ' + tot.label + ' antes de dividir em R$.' };
    const c = Math.round(v * 100);
    if (c > tot.cents) return { err: 'A parte não pode passar de ' + money(tot.cents) + ' (' + tot.label + ').' };
    return { cents: c };
  }

  /* Percentuais → R$. Na parcela sem % próprio, mostra o herdado do projeto. */
  function fillFromPercent(g, tot) {
    const inherited = g.cfg.inherit && g.pm.value === '' && g.pb.value === '';
    let p;
    if (inherited) {
      p = projectPercent(val('py-project'));
      g.pm.placeholder = p + '% (do projeto)';
      g.pb.placeholder = complement(p) + '% (do projeto)';
    } else {
      p = percent(g.pm.value);
      const q = percent(g.pb.value);
      if (g.pm.value === '' || g.pb.value === '') return fail(g, [g.pm, g.pb], 'Informe a divisão dos dois lados.');
      if (p === null) return fail(g, [g.pm], 'Percentual entre 0 e 100, com até duas casas.');
      if (q === null) return fail(g, [g.pb], 'Percentual entre 0 e 100, com até duas casas.');
      if (Math.abs(p + q - 100) > 0.001) return fail(g, [g.pm, g.pb], 'Matheus + Bruno precisa somar 100%.');
    }
    if (tot.cents === null) {
      g.vm.value = ''; g.vb.value = '';
      g.vm.placeholder = g.vb.placeholder = 'preencha ' + tot.label;
      return setNote(g, 'Os valores em R$ aparecem quando houver ' + tot.label + '.');
    }
    const [m, b] = splitCents(tot.cents, p);
    if (inherited) {
      g.vm.value = ''; g.vb.value = '';
      g.vm.placeholder = fmtC(m) + ' (herdado)';
      g.vb.placeholder = fmtC(b) + ' (herdado)';
      return setNote(g, 'Divisão herdada do projeto: ' + p + '% / ' + complement(p) + '%. Digite % ou R$ para mudar só esta parcela.');
    }
    g.vm.value = fmtC(m); g.vb.value = fmtC(b);
    g.vm.placeholder = g.vb.placeholder = '';
    setNote(g, 'Sobre ' + tot.label + ' (' + money(tot.cents) + ').');
  }

  /* R$ de um lado (fixo) → R$ do outro e percentuais. */
  function fillFromAmount(g, tot, side) {
    const src = side === 'm' ? g.vm : g.vb, other = side === 'm' ? g.vb : g.vm;
    const r = readAmount(src, tot);
    if (r.err) return fail(g, [src], r.err);
    const mC = side === 'm' ? r.cents : tot.cents - r.cents;
    other.value = fmtC(tot.cents - r.cents);
    const p = Math.round(mC * 10000 / tot.cents) / 100;
    g.pm.value = String(p); g.pb.value = String(complement(p));
    /* nos projetos o que se grava é o %: avisa quando o arredondamento mexe nos centavos */
    const [mBack] = splitCents(tot.cents, p);
    const exact = g.cfg.inherit || mBack === mC;
    setNote(g, g.cfg.inherit
      ? 'Valor fixo em R$: vale para esta parcela até um percentual ser editado.'
      : 'Sobre ' + tot.label + ' (' + money(tot.cents) + ').' + (exact ? '' : ' O percentual é arredondado em duas casas, então o valor salvo pode variar alguns centavos.'));
  }

  /* role: 'pm' | 'pb' | 'vm' | 'vb' | null (total mudou / montagem). */
  function sync(key, role, committed) {
    const g = els(key);
    if (!g) return;
    clearErrors(g);
    const tot = totalOf(g);
    const ds = g.form ? g.form.dataset : {};

    if (role === 'pm' || role === 'pb') {
      ds.splitMode = 'pct';
      const src = g[role], other = role === 'pm' ? g.pb : g.pm;
      if (src.value === '') {
        if (g.cfg.inherit) other.value = '';
        else if (!committed) return setNote(g, '');
      } else {
        const p = percent(src.value);
        if (p === null) return fail(g, [src], 'Percentual entre 0 e 100, com até duas casas.');
        other.value = String(complement(p));
      }
      return fillFromPercent(g, tot);
    }

    if (role === 'vm' || role === 'vb') {
      const src = g[role], other = role === 'vm' ? g.vb : g.vm;
      if (src.value === '') {
        if (!committed) { other.value = ''; return setNote(g, ''); }
        ds.splitMode = 'pct';
        return fillFromPercent(g, tot);
      }
      ds.splitMode = 'amt';
      ds.splitFixed = role === 'vm' ? 'm' : 'b';
      return fillFromAmount(g, tot, ds.splitFixed);
    }

    /* total mudou: na parcela com parte fixa, o fixo fica e o resto se ajusta;
       em todo o resto, o percentual fica e os R$ se recalculam. */
    if (g.cfg.inherit && ds.splitMode === 'amt') {
      if (tot.cents === null) return fail(g, [g.vm, g.vb], 'Preencha ' + tot.label + ' antes de dividir em R$.');
      return fillFromAmount(g, tot, ds.splitFixed || 'm');
    }
    fillFromPercent(g, tot);
  }

  const mounted = new WeakSet();
  function mount(key) {
    const g = els(key);
    if (!g || mounted.has(g.pm)) return;
    mounted.add(g.pm);
    if (g.form) {
      /* parcela gravada com parte fixa abre no modo R$, do lado que estava fixo */
      const am = g.cfg.inherit && g.vm.value !== '', ab = g.cfg.inherit && g.vb.value !== '';
      g.form.dataset.splitMode = am || ab ? 'amt' : 'pct';
      g.form.dataset.splitFixed = am ? 'm' : 'b';
    }
    sync(key, null);
  }
  function refresh() { Object.keys(GROUPS).forEach(mount); }

  function roleOf(key, id) {
    const c = GROUPS[key];
    for (const r of ['pm', 'pb', 'vm', 'vb']) if (c[r] === id) return r;
    return null;
  }
  function handler(committed) {
    return (e) => {
      const id = e.target && e.target.id, key = id && TRIGGERS[id];
      if (!key) return;
      mount(key);
      const role = roleOf(key, id);
      /* no change só reage quem foi esvaziado (tela volta a ficar coerente) ou um select */
      if (committed && role && e.target.value !== '') return;
      sync(key, role, committed);
    };
  }

  function boot() {
    doc.addEventListener('input', handler(false), true);
    doc.addEventListener('change', handler(true), true);
    const observer = new root.MutationObserver(refresh);
    ['view', 'modal-body'].forEach((id) => {
      const t = byId(id);
      if (t) observer.observe(t, { childList: true, subtree: true });
    });
    refresh();
  }

  root.CasaFinancialSplits = { percent, complement, splitAmounts, sync, refresh };
  if (doc) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }
})(typeof window === 'undefined' ? globalThis : window);
