/* Casa Martech: divisao automatica; valores so sao persistidos ao salvar. */
(function(root) {
  'use strict';
  const groups = new Map();
  const money = n => n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  const number = value => {
    if (value == null || String(value).trim() === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };
  function percent(value) {
    const n = number(value);
    return n !== null && n >= 0 && n <= 100 && Math.abs(n * 100 - Math.round(n * 100)) < 1e-7
      ? Math.round(n * 100) / 100 : null;
  }
  const complement = p => (10000 - Math.round(p * 100)) / 100;
  function splitAmounts(total, pct) {
    const n = number(total), p = percent(pct);
    if (n === null || n < 0 || p === null) return null;
    const cents = Math.round(n * 100), bp = Math.round(p * 100);
    if (!Number.isSafeInteger(cents)) return null;
    const m = Math.floor(cents / 10000) * bp + Math.round((cents % 10000) * bp / 10000);
    return [m / 100, (cents - m) / 100];
  }
  function projectPercent(id) {
    const p = typeof projById === 'function' ? projById(id) : null;
    return percent(p && p.split_matheus) ?? (p && percent(p.split_bruno) !== null ? complement(percent(p.split_bruno)) : 50);
  }
  const byId = id => root.document.getElementById(id);
  const setError = (el, message) => { if(el) el.setCustomValidity(message || ''); };
  function setPreview(g, amounts, hint) {
    g.outM.textContent = amounts ? money(amounts[0]) : '—';
    g.outB.textContent = amounts ? money(amounts[1]) : '—';
    g.hint.textContent = hint;
  }
  function totalFor(g) {
    if (g.prefix === 'py') return {raw: byId('py-amount').value, label:'Valor da parcela'};
    if (g.prefix === 'pj') return {raw: byId('pj-price').value, label:'Preço proposto'};
    const final = byId('pf-pf'), proposed = byId('pf-pp');
    return final && final.value !== '' ? {raw:final.value,label:'Preço final'} : {raw:proposed.value,label:'Preço proposto'};
  }
  function sync(g, source) {
    if (!g || !g.sm.isConnected) return;
    const sm = g.sm, sb = g.sb;
    const am = g.prefix === 'py' ? byId('py-am') : null;
    const ab = g.prefix === 'py' ? byId('py-ab') : null;
    [sm, sb, am, ab].forEach(el => setError(el));
    if (source === sm || source === sb) {
      const pct = percent(source.value);
      if (pct === null && source.value !== '') {
        setError(source, 'Informe um percentual de 0 a 100, com até duas casas decimais.');
        setPreview(g, null, 'Corrija o percentual para ver os valores.');
        return;
      }
      const other = source === sm ? sb : sm;
      if (pct !== null) other.value = String(complement(pct));
      else if (g.prefix === 'py') other.value = '';
      if (am && ab) { am.value = ''; ab.value = ''; }
    } else if (source && (source === am || source === ab)) {
      (source === am ? ab : am).value = '';
    }
    const base = totalFor(g), total = number(base.raw);
    let p = percent(sm.value), q = percent(sb.value);
    const hasFixed = am && (am.value !== '' || ab.value !== '');
    if (hasFixed) {
      const m = number(am.value), b = number(ab.value);
      const totalCents = total === null ? null : Math.round(total * 100);
      const fixedInvalid = (am.value !== '' && (m === null || m < 0)) ||
        (ab.value !== '' && (b === null || b < 0));
      const mismatch = totalCents !== null && ((m !== null && Math.round(m * 100) > totalCents) ||
        (b !== null && Math.round(b * 100) > totalCents) ||
        (m !== null && b !== null && Math.round(m * 100) + Math.round(b * 100) !== totalCents));
      if (fixedInvalid || mismatch) {
        const msg = 'Partes fixas precisam ser positivas ou zero e somar o valor da parcela.';
        setError(am, msg); setError(ab, msg); setPreview(g, null, msg); return;
      }
      if (total === null || total <= 0) {
        setPreview(g, null, 'Informe o valor da parcela para calcular os repasses.'); return;
      }
      const mCents = m !== null ? Math.round(m * 100) : totalCents - Math.round(b * 100);
      p = Math.round(mCents / totalCents * 10000) / 100; q = complement(p);
      sm.value = String(p); sb.value = String(q);
      setPreview(g, [mCents / 100, (totalCents - mCents) / 100],
        'Valor fixo em R$: prevalece até um percentual ser editado.');
      return;
    }
    const inherited = g.prefix === 'py' && sm.value === '' && sb.value === '';
    if (inherited) {
      p = projectPercent(byId('py-project').value);
      q = complement(p);
      sm.placeholder = p + '% do projeto'; sb.placeholder = q + '% do projeto';
    } else if (g.prefix === 'py') {
      if (p !== null && sb.value === '') q = complement(p);
      if (q !== null && sm.value === '') p = complement(q);
    }
    if (p === null || q === null || Math.abs(p + q - 100) > 0.001) {
      const msg = 'Percentuais devem somar 100% e ter até duas casas decimais.';
      setError(sm, msg); setError(sb, msg); setPreview(g, null, msg); return;
    }
    const values = splitAmounts(total, p);
    setPreview(g, values, !values ? 'Informe um valor válido para calcular os repasses.' :
      (inherited ? 'Divisão herdada do projeto: ' + p + '% / ' + q + '%.' :
        base.label + ': ' + money(total) + '. Valores calculados antes de salvar.'));
  }
  function makeOutput(input, id, person) {
    const out = root.document.createElement('output');
    out.id=id; out.className='cm-split-value';
    out.setAttribute('for',input.id);
    out.setAttribute('aria-label','Valor de ' + person);
    out.setAttribute('aria-live','polite');
    input.parentElement.appendChild(out);
    return out;
  }
  function mount(prefix) {
    const sm = byId(prefix + '-sm');
    if (!sm || (groups.get(prefix) && groups.get(prefix).sm === sm)) return;
    let sb = byId(prefix + '-sb');
    if (!sb && prefix === 'pj') {
      const field = root.document.createElement('div'); field.className='field';
      const label = root.document.createElement('label');
      label.htmlFor='pj-sb'; label.textContent='Divisão Bruno (%)';
      sb=root.document.createElement('input');
      sb.id='pj-sb'; sb.name='split_bruno'; sb.type='number';
      sb.step='0.01'; sb.min='0'; sb.max='100';
      sb.value=String(complement(percent(sm.value) ?? 50));
      field.append(label,sb); sm.parentElement.after(field);
    }
    if (!sb) return;
    if (prefix !== 'py') { sm.required=true; sb.required=true; }
    if (sm.getAttribute('data-change') === 'splitM') sm.removeAttribute('data-change');
    const note=root.document.createElement('div'); note.className='field span2 cm-split-note';
    const hint=root.document.createElement('span');
    hint.className='field__hint'; hint.id=prefix + '-split-note'; note.appendChild(hint);
    sb.parentElement.after(note);
    const g={prefix,sm,sb,hint,
      outM:makeOutput(sm,prefix+'-share-m','Matheus'),
      outB:makeOutput(sb,prefix+'-share-b','Bruno')};
    groups.set(prefix,g);
    if(prefix==='py') {
      const reset=root.document.createElement('button');
      reset.type='button'; reset.className='btn-mini';
      reset.textContent='Usar divisão do projeto'; reset.id='py-inherit-split';
      reset.addEventListener('click', () => {
        sm.value=''; sb.value=''; byId('py-am').value=''; byId('py-ab').value='';
        sync(g);
      });
      note.appendChild(reset);
    }
    sync(g);
  }
  function refresh() { ['pf','pj','py'].forEach(mount); }
  function onInput(e) {
    const el=e.target, id=el && el.id;
    if(!id || !/^(pf-(sm|sb|pp|pf)|pj-(sm|sb|price)|py-(sm|sb|amount|am|ab|project))$/.test(id)) return;
    const prefix=id.slice(0,2); mount(prefix); sync(groups.get(prefix),el);
  }
  function boot() {
    const doc=root.document;
    const style=doc.createElement('style'); style.id='cm-financial-split-style';
    style.textContent='.cm-split-value{display:block;font-family:var(--mono);font-size:15px;color:var(--ink);font-variant-numeric:tabular-nums;margin-top:5px}.cm-split-note{gap:8px}.cm-split-note .btn-mini{align-self:flex-start;white-space:normal;text-align:left}';
    doc.head.appendChild(style);
    doc.addEventListener('input',onInput,true);
    doc.addEventListener('change',onInput,true);
    const observer=new root.MutationObserver(refresh);
    ['view','modal-body'].forEach(id => {
      const target=byId(id);
      if(target) observer.observe(target,{childList:true,subtree:true});
    });
    refresh();
  }
  root.CasaFinancialSplits={percent,complement,splitAmounts,sync,refresh};
  if(root.document) {
    if(root.document.readyState==='loading')
      root.document.addEventListener('DOMContentLoaded',boot,{once:true});
    else boot();
  }
})(typeof window === 'undefined' ? globalThis : window);
