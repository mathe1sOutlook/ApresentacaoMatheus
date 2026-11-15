/* Guache aprovado e duas interpretações infantis. As artes ficam nesta prévia privada. */
(function () {
  'use strict';
  const cast = ['carlos', 'noeli', 'maria', 'vovo', 'pipoca'];
  const choices = [
    { id: 'guache', name: 'Guache e contorno', description: 'O traço escolhido: contorno marcado, cores quentes e rostos próximos das fotos.' },
    { id: 'guache-suave', name: 'Guache suave', description: 'Formas mais arredondadas, olhar doce e proporções um pouco mais infantis.' },
    { id: 'guache-ludico', name: 'Guache brincante', description: 'Cabeças um pouco maiores, gestos vivos e expressões de um livro de aventuras.' }
  ];
  const ids = new Set(choices.map(choice => choice.id));
  const selection = Object.fromEntries(cast.map(name => [name, 'guache']));
  const atlases = window.BookCharacterAtlases;
  const root = new URL('./', document.currentScript.src);
  const assetURL = id => new URL(atlases[id].file, root).href;
  let serial = 0;

  /** Renderiza um recorte da arte sem alterar ou esticar a ilustração original. */
  function figure(name, options = {}) {
    if (!cast.includes(name)) throw new Error('Personagem desconhecido: ' + name);
    const variant = ids.has(options.variant) ? options.variant : selection[name];
    const sleeping = name === 'maria' && options.pose === 'sleep';
    const atlas = sleeping ? window.BookCharacterSleepAtlas : atlases[variant];
    const view = options.view || (options.pose === 'stand' || options.pose === 'sleep' ? 'profile' : 'action');
    const row = { front: 0, profile: 1, action: 2 }[view] ?? 2;
    const crop = atlas.frames[sleeping ? choices.findIndex(choice => choice.id === variant) : row * 5 + cast.indexOf(name)];
    const width = name === 'pipoca' ? 240 : 200;
    const height = sleeping ? 200 : name === 'pipoca' ? 270 : 350;
    const x = Number(options.x) || 0;
    const y = Number(options.y) || 0;
    const scale = options.scale == null ? 1 : Number(options.scale);
    const clip = 'guache-frame-' + (++serial);
    const renderWidth = crop[2] / crop[3] * height;
    let sprite = `<svg x="${(width - renderWidth) / 2}" width="${renderWidth}" height="${height}" viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}"><rect x="${crop[0]}" y="${crop[1]}" width="${crop[2]}" height="${crop[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${new URL(atlas.file, root).href}" width="${atlas.width}" height="${atlas.height}"/></svg>`;
    if (options.flip) sprite = `<g transform="translate(${width} 0) scale(-1 1)">${sprite}</g>`;
    if (options.pose === 'tumble') sprite = `<g transform="rotate(180 ${width / 2} ${height / 2})">${sprite}</g>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})" data-character="${name}" data-variant="${variant}" data-view="${view}">${sprite}</g>`;
  }

  window.BookCharacters.person = figure;
  window.BookCharacters.pipoca = options => figure('pipoca', options);
  window.BookVariants = {
    choices,
    setSelection(name, id) {
      if (!cast.includes(name) || !ids.has(id)) throw new Error('Escolha de personagem inválida');
      selection[name] = id;
      return { ...selection };
    },
    getSelections: () => ({ ...selection }),
    reset() {
      cast.forEach(name => { selection[name] = 'guache'; });
      return { ...selection };
    },
    /** Pré-carrega as três artes para troca de estilo e impressão sem imagens pendentes. */
    ready: Promise.all([...choices.map(({ id }) => assetURL(id)), new URL(window.BookCharacterSleepAtlas.file, root).href].map(url => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = () => reject(new Error('Não foi possível carregar uma ilustração'));
      img.src = url;
    })))
  };
})();
