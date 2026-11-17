/* Animais pintados em três quartos, ancorados pelas patas no plano do chão. */
(function () {
  'use strict';
  const atlas = window.BookAnimalAtlas;
  const source = new URL(atlas.file, document.currentScript.src).href;
  const poses = ['graze', 'sing', 'walk-away', 'messenger', 'curious', 'skip', 'listen-back', 'sit', 'sniff'];
  let serial = 0;
  function render(kind, { x, y, scale = 1, pose, flip = false }) {
    const frame = atlas.frames[poses.indexOf(pose)];
    const size = window.BookSceneScale.animals[kind];
    const height = size.height;
    const width = frame[2] / frame[3] * height;
    const bottom = size.foot;
    const clip = 'animal-frame-' + (++serial);
    const animal = `<svg x="${-width / 2}" y="${bottom - height}" width="${width}" height="${height}" viewBox="${frame.join(' ')}"><defs><clipPath id="${clip}"><rect x="${frame[0]}" y="${frame[1]}" width="${frame[2]}" height="${frame[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${source}" width="${atlas.width}" height="${atlas.height}"/></svg>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})" data-animal="${kind}" data-animal-view="three-quarter" data-animal-pose="${pose}" data-world-height="${height * scale}"><ellipse cy="${bottom - 1}" rx="${size.shadow}" ry="${kind === 'cow' ? 17 : 10}" fill="#354d34" opacity=".19"/>${flip ? `<g transform="scale(-1 1)">${animal}</g>` : animal}</g>`;
  }
  window.BookAnimals = {
    render,
    ready: new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = () => reject(new Error('Não foi possível carregar os animais'));
      image.src = source;
    })
  };
})();
