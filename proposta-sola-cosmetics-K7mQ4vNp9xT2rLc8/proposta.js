/* Protótipo local: não envia dados, não realiza compras. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const dialog = $('#cart-dialog');
  const form = $('#rule-form');
  const defaults = { minimum: 4, discount: 8, kind: 'discount' };
  let rule = { ...defaults }, selected = 1, quantity = 0, activeSlide = 0, cartTrigger, toastTimer;
  const units = (n) => `${n} ${n === 1 ? 'unidade' : 'unidades'}`;
  const validQuantity = (value, minimum = 0) => {
    const n = Number(value);
    return value !== '' && Number.isSafeInteger(n) && n >= minimum ? n : null;
  };
  const incentive = () => rule.kind === 'discount' ? `${rule.discount}% de economia` : rule.kind === 'gift' ? 'Um presente na compra' : 'Benefício de frete';
  const campaign = () => `${incentive()} a partir de ${units(rule.minimum)}.`;
  const earned = () => quantity >= rule.minimum;

  function showSlide(index, announce = true) {
    const panels = [...$$('[data-slide-panel]')];
    activeSlide = (index + panels.length) % panels.length;
    panels.forEach((panel, i) => { panel.hidden = i !== activeSlide; });
    $$('[data-slide]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeSlide)));
    if (announce) $('[data-slide-status]').textContent = panels[activeSlide].getAttribute('aria-label');
  }

  function render() {
    $('#product-quantity').value = selected;
    $('#inline-quantity').value = quantity;
    $('[data-cart-quantity]').value = Math.max(1, quantity);
    $('[data-selection-summary]').textContent = `${units(selected)} ${selected === 1 ? 'selecionada' : 'selecionadas'}.`;
    $('[data-product-offer]').textContent = campaign();
    $('[data-campaign-preview]').textContent = campaign();
    $$('[data-cart-count]').forEach((el) => { el.textContent = quantity; });
    $$('[data-open-cart]').forEach((el) => el.setAttribute('aria-label', `Abrir sacola, ${units(quantity)}`));
    $('[data-cart-empty]').hidden = quantity > 0;
    $('[data-cart-filled]').hidden = quantity === 0;
    $('[data-cart-total-units]').textContent = units(quantity);
    $('[data-cart-minus]').disabled = quantity <= 1;
    $('[data-product-minus]').disabled = selected <= 1;
    const benefit = quantity === 0 ? 'Nenhuma unidade adicionada.' : earned() ? `${units(quantity)} · ${incentive().toLowerCase()}.` : `${units(quantity)} para o seu cuidado.`;
    $('[data-cart-benefit]').textContent = benefit;
    $('[data-inline-benefit]').textContent = benefit;
    $('[data-cart-discount]').textContent = earned() ? incentive() : 'Condição ainda não atingida';
    $('[data-cart-shipping]').textContent = earned() && rule.kind === 'shipping' ? 'Benefício ilustrativo liberado' : 'A calcular na loja final';
    const remaining = Math.max(0, rule.minimum - quantity);
    const nudge = earned() ? 'Condição da campanha liberada neste exemplo.' : `Adicione mais ${units(remaining)} para liberar a condição.`;
    $('[data-inline-nudge]').textContent = nudge;
    $('[data-cart-progress-copy]').textContent = nudge;
    ['[data-inline-progress]', '[data-cart-progress]'].forEach((selector) => {
      $(selector).max = rule.minimum;
      $(selector).value = Math.min(quantity, rule.minimum);
    });
    $('[data-checkout-status]').textContent = '';
  }

  function notify(message) {
    clearTimeout(toastTimer);
    $('[data-toast]').textContent = message;
    $('[data-toast]').classList.add('visible');
    toastTimer = setTimeout(() => $('[data-toast]').classList.remove('visible'), 3500);
  }
  function setQuantity(next) {
    if (!Number.isSafeInteger(next) || next < 0) return;
    quantity = next;
    render();
  }
  function openCart(trigger) {
    cartTrigger = trigger;
    $('[data-checkout-status]').textContent = '';
    if (!dialog.open) dialog.showModal();
  }
  function bindQuantity(input, minimum, apply) {
    input.addEventListener('input', () => {
      input.setCustomValidity(validQuantity(input.value, minimum) === null ? `Informe um número inteiro a partir de ${minimum}.` : '');
    });
    input.addEventListener('change', () => {
      const n = validQuantity(input.value, minimum);
      if (n === null) { input.reportValidity(); return; }
      input.setCustomValidity('');
      apply(n);
    });
  }

  $$('[data-slide]').forEach((button) => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
  $('[data-slide-prev]').addEventListener('click', () => showSlide(activeSlide - 1));
  $('[data-slide-next]').addEventListener('click', () => showSlide(activeSlide + 1));
  $('.carousel-toolbar').addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    showSlide(event.key === 'Home' ? 0 : event.key === 'End' ? $$('[data-slide-panel]').length - 1 : activeSlide + (event.key === 'ArrowRight' ? 1 : -1));
    $('[data-slide="' + activeSlide + '"]').focus({ preventScroll: true });
  });
  bindQuantity($('#product-quantity'), 1, (n) => { selected = n; render(); });
  bindQuantity($('#inline-quantity'), 0, setQuantity);
  bindQuantity($('[data-cart-quantity]'), 1, setQuantity);
  $('[data-product-minus]').addEventListener('click', () => { selected = Math.max(1, selected - 1); render(); });
  $('[data-product-plus]').addEventListener('click', () => {
    if (!Number.isSafeInteger(selected + 1)) return;
    selected += 1;
    render();
  });
  $('[data-add-cart]').addEventListener('click', (event) => {
    const current = validQuantity($('#product-quantity').value, 1);
    if (current === null || !Number.isSafeInteger(quantity + current)) { $('#product-quantity').reportValidity(); return; }
    selected = current;
    setQuantity(quantity + selected);
    openCart(event.currentTarget);
  });
  $('[data-add-one]').addEventListener('click', () => setQuantity(quantity + 1));
  $('[data-cart-minus]').addEventListener('click', () => setQuantity(Math.max(1, quantity - 1)));
  $('[data-cart-plus]').addEventListener('click', () => setQuantity(quantity + 1));
  $$('[data-open-cart]').forEach((button) => button.addEventListener('click', () => openCart(button)));
  $$('[data-close-cart]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => cartTrigger?.focus({ preventScroll: true }));
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  $('[data-cart-remove]').addEventListener('click', () => { setQuantity(0); $('[data-cart-empty] button').focus(); });
  $('[data-demo-checkout]').addEventListener('click', () => {
    $('[data-checkout-status]').textContent = 'Aqui começaria o checkout com valores, entrega e pagamento. A demonstração termina antes de qualquer transação.';
  });
  $('#rule-kind').addEventListener('change', () => {
    const discount = $('#rule-kind').value === 'discount';
    $('[data-discount-field]').hidden = !discount;
    $('#rule-discount').disabled = !discount;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const minimum = validQuantity($('#rule-min').value, 2);
    const discount = Number($('#rule-discount').value);
    const kind = $('#rule-kind').value;
    if (minimum === null || !Number.isInteger(discount) || discount < 0 || discount > 70 || !['discount', 'gift', 'shipping'].includes(kind)) return;
    rule = { minimum, discount, kind };
    render();
    $('[data-rule-status]').textContent = `Campanha aplicada: ${campaign()}`;
    notify('Campanha atualizada na vitrine e na sacola.');
  });
  $('[data-go-cart]').addEventListener('click', () => { showSlide(1); $('[data-slide="1"]').focus({ preventScroll: true }); });
  $('[data-reorder]').addEventListener('click', () => {
    setQuantity(quantity + 4);
    showSlide(1);
    notify('4 unidades adicionadas para demonstrar a recompra.');
    $('[data-slide="1"]').focus({ preventScroll: true });
  });
  $('[data-move-lead]').addEventListener('click', () => {
    $('[data-talking-list]').append($('[data-demo-lead]'));
    $('[data-new-count]').textContent = '0';
    $('[data-talking-count]').textContent = '2';
    $('[data-move-lead]').hidden = true;
    $('[data-crm-status]').textContent = 'Marina movida para Em conversa. Exemplo local, sem contato real.';
    $('[data-slide="4"]').focus({ preventScroll: true });
  });
  $('[data-reset-demo]').addEventListener('click', () => {
    form.reset();
    rule = { ...defaults };
    selected = 1;
    quantity = 0;
    $('#rule-discount').disabled = false;
    $('[data-discount-field]').hidden = false;
    [$('#product-quantity'), $('#inline-quantity'), $('[data-cart-quantity]')].forEach((input) => input.setCustomValidity(''));
    $('[data-rule-status]').textContent = 'Regra ilustrativa: 8% a partir de 4 unidades.';
    render();
    notify('Campanha e sacola restauradas.');
  });
  $$('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));
  render();
  showSlide(0, false);
  document.documentElement.classList.add('has-js');
})();

