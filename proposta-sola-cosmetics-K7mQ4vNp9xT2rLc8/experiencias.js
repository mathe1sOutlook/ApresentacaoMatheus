/* Formulário demonstrativo de avaliação: nada é enviado nem publicado. */
(() => {
  'use strict';
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
