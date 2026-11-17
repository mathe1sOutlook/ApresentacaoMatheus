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
    const view = options.view || (options.pose === 'stand' || options.pose === 'sleep' ? 'profile' : 'action');
    const storyPose = options.narrativePose || (name === 'pipoca' ? { front: 'front', profile: 'profile', action: 'hop' }[view] : undefined);
    const sleeping = name === 'maria' && (storyPose === 'sleep' || options.pose === 'sleep' && !storyPose);
    const bedtime = name === 'maria' && ['bed-ask', 'bed-wave'].includes(storyPose);
    const carColumn = ['noeli', 'maria', 'carlos'].indexOf(name);
    const inCar = carColumn >= 0 && ['seated', 'driving'].includes(options.pose);
    const departure = name === 'noeli' && storyPose === 'departure-listen';
    const parentAtlas = window.BookParentAtlases[name];
    const storyAtlas = window.BookNarrativeAtlases[name];
    const narrative = !inCar && !sleeping && !bedtime && storyAtlas?.poses.includes(storyPose);
    const atlas = departure ? window.BookOpeningAtlases.noeli : inCar ? window.BookCharacterCarAtlas : sleeping ? window.BookCharacterSleepAtlas : bedtime ? window.BookBedtimeAtlas : narrative ? storyAtlas : parentAtlas || atlases[variant];
    const row = { front: 0, profile: 1, action: 2 }[view] ?? 2;
    const styleIndex = choices.findIndex(choice => choice.id === variant);
    const frame = departure ? styleIndex : inCar ? styleIndex * 3 + carColumn : sleeping ? styleIndex : bedtime ? (storyPose === 'bed-wave' ? 3 : 0) + styleIndex : narrative ? styleIndex * storyAtlas.poses.length + storyAtlas.poses.indexOf(storyPose) : parentAtlas ? styleIndex * 3 + row : row * 5 + cast.indexOf(name);
    const crop = atlas.frames[frame];
    const width = name === 'pipoca' ? 240 : 200;
    const height = inCar ? 245 : sleeping || bedtime ? 200 : narrative ? window.BookScenePoses.height(name, storyPose) : name === 'pipoca' ? 270 : 350;
    const floorOffset = narrative ? (name === 'pipoca' ? 270 : 350) - height : 0;
    const x = Number(options.x) || 0;
    const y = Number(options.y) || 0;
    const scale = options.scale == null ? 1 : Number(options.scale);
    const clip = 'guache-frame-' + (++serial);
    const renderWidth = crop[2] / crop[3] * height;
    let sprite = `<svg x="${(width - renderWidth) / 2}" y="${floorOffset}" width="${renderWidth}" height="${height}" viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}"><rect x="${crop[0]}" y="${crop[1]}" width="${crop[2]}" height="${crop[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${new URL(atlas.file, root).href}" width="${atlas.width}" height="${atlas.height}"/></svg>`;
    if (name === 'maria' && narrative && storyPose === 'cradle') {
      sprite += window.BookCharacters.stone({ x: 119, y: 110, scale: .38, lit: 0, style: options.style });
    }
    if (options.flip) sprite = `<g transform="translate(${width} 0) scale(-1 1)">${sprite}</g>`;
    if (options.pose === 'tumble' && !narrative) sprite = `<g transform="rotate(180 ${width / 2} ${height / 2})">${sprite}</g>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})" data-character="${name}" data-variant="${variant}" data-view="${view}" data-pose="${inCar ? options.pose : sleeping ? 'sleep' : departure || narrative || bedtime ? storyPose : view}">${sprite}</g>`;
  }

  window.BookCharacters.person = figure;
  window.BookCharacters.pipoca = options => figure('pipoca', options);
  /** O abraço usa a combinação dos traços escolhidos para a avó e para a menina. */
  window.BookCharacters.embrace = (options = {}) => {
    const atlas = window.BookEmbraceAtlas;
    const crop = atlas.frames[choices.findIndex(c => c.id === selection.vovo) * 3 + choices.findIndex(c => c.id === selection.maria)];
    const clip = 'guache-frame-' + (++serial);
    const width = crop[2] / crop[3] * 385;
    return `<g transform="translate(${options.x || 0} ${options.y || 0}) scale(${options.scale || 1})" data-pose="embrace" data-maria-variant="${selection.maria}" data-vovo-variant="${selection.vovo}"><svg width="${width}" height="385" viewBox="${crop.join(' ')}"><defs><clipPath id="${clip}"><rect x="${crop[0]}" y="${crop[1]}" width="${crop[2]}" height="${crop[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${new URL(atlas.file, root).href}" width="${atlas.width}" height="${atlas.height}"/></svg></g>`;
  };
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
    /** Pré-carrega as artes para troca de estilo e impressão sem imagens pendentes. */
    ready: Promise.all([...choices.map(({ id }) => assetURL(id)), ...[window.BookCharacterSleepAtlas, window.BookCharacterCarAtlas, window.BookBedtimeAtlas, window.BookEmbraceAtlas, ...Object.values(window.BookNarrativeAtlases), ...Object.values(window.BookParentAtlases), window.BookOpeningAtlases.noeli].map(atlas => new URL(atlas.file, root).href)].map(url => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = () => reject(new Error('Não foi possível carregar uma ilustração'));
      img.src = url;
    })).concat([window.BookEnvironments.ready, window.BookAnimals.ready]))
  };
})();
