/* Experiências locais: cena por rolagem e formulário demonstrativo de avaliação. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scroll-scene]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = 0;

  function updateScene() {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    const rect = scene.getBoundingClientRect();
    const sticky = scene.querySelector('.scene-sticky');
    const offset = parseFloat(getComputedStyle(sticky).top) || 0;
    const travel = Math.max(1, rect.height - sticky.offsetHeight);
    const progress = Math.max(0, Math.min(1, (offset - rect.top) / travel));
    scene.style.setProperty('--fall-y', `${-240 + progress * 450}px`);
    scene.style.setProperty('--fall-x', `${-55 + progress * 95}px`);
    scene.style.setProperty('--fall-rz', `${-34 + progress * 66}deg`);
    scene.style.setProperty('--fall-rx', `${16 - progress * 27}deg`);
    scene.style.setProperty('--fall-ry', `${-24 + progress * 43}deg`);
    scene.style.setProperty('--detail-y', `${progress * 130}px`);
    scene.style.setProperty('--detail-rotate', `${-12 + progress * 32}deg`);
    scene.style.setProperty('--orb-y', `${progress * 210}px`);
    scene.dataset.progress = progress.toFixed(3);
  }
  function requestUpdate() {
    if (!frame && visible && !reducedMotion.matches) frame = requestAnimationFrame(updateScene);
  }
  function configureMotion() {
    scene.classList.toggle('motion-ready', !reducedMotion.matches);
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      scene.removeAttribute('style');
      delete scene.dataset.progress;
    } else requestUpdate();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      requestUpdate();
    }, { rootMargin: '100px' });
    observer.observe(scene);
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate, { passive: true });
    reducedMotion.addEventListener('change', configureMotion);
    configureMotion();
  }

  const form = document.querySelector('#review-form');
  const photo = document.querySelector('#review-photo');
  const preview = document.querySelector('[data-photo-preview]');
  const status = document.querySelector('[data-review-status]');
  let photoURL;
  function releasePhoto() {
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = undefined;
    preview.removeAttribute('src');
    preview.hidden = true;
  }
  photo.addEventListener('change', () => {
    releasePhoto();
    photo.setCustomValidity('');
    const file = photo.files[0];
    if (!file) {
      status.textContent = 'Nenhuma foto selecionada. Você pode preparar a avaliação com nota e comentário.';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      photo.setCustomValidity('Escolha uma imagem JPEG, PNG ou WebP de até 5 MB.');
      photo.reportValidity();
      status.textContent = 'Foto não aceita. Escolha uma imagem JPEG, PNG ou WebP de até 5 MB.';
      return;
    }
    photoURL = URL.createObjectURL(file);
    preview.src = photoURL;
    preview.hidden = false;
    preview.onerror = () => {
      releasePhoto();
      photo.setCustomValidity('Não foi possível abrir esta imagem. Escolha outra foto.');
      status.textContent = 'Não foi possível abrir a foto. Escolha outra imagem.';
    };
    status.textContent = 'Foto carregada apenas neste navegador. Nenhum arquivo foi enviado.';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = document.querySelector('#review-name').value.trim();
    const comment = document.querySelector('#review-comment').value.trim();
    if (!name || !comment) {
      status.textContent = 'Informe seu nome e um comentário para preparar a avaliação.';
      return;
    }
    const rating = Number(form.querySelector('input[name="rating"]:checked').value);
    document.querySelector('[data-pending-author]').textContent = `${name} · ${rating} de 5 estrelas`;
    document.querySelector('[data-pending-comment]').textContent = comment;
    document.querySelector('[data-pending-review]').hidden = false;
    status.textContent = 'Avaliação preparada para demonstrar a moderação. Nada foi enviado ou publicado.';
  });
  addEventListener('pagehide', releasePhoto);
})();
