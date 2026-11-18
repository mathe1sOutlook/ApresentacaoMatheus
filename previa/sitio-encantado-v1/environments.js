/* Direção de arte: um ambiente por acontecimento e uma câmera por página. */
(function () {
  'use strict';
  const root = new URL('./', document.currentScript.src);
  const cameras = [
    ['vista-geral', 0, 0, 900, 720],
    ['saida-na-varanda', 0, 0, 900, 720],
    ['estrada-em-profundidade', 0, 0, 900, 720],
    ['abraco-perto-da-varanda', 200, 190, 650, 520],
    ['olhar-na-altura-da-borboleta', 180, 144, 720, 576],
    ['investigacao-junto-ao-chao', 70, 80, 800, 640],
    ['plano-aberto-do-susto', 0, 0, 900, 720],
    ['olhar-para-a-copa', 70, 56, 800, 640],
    ['reverencia-na-clareira', 25, 140, 725, 580],
    ['conversa-na-grama', 40, 80, 800, 640],
    ['descoberta-entre-as-raizes', 110, 168, 690, 552],
    ['pedra-nas-maos', 45, 60, 825, 660],
    ['conversa-sobre-as-estrelas', 180, 240, 600, 480],
    ['luz-no-caminho', 100, 80, 800, 640],
    ['terreiro-em-tres-quartos', 0, 0, 900, 720],
    ['roda-do-enigma', 70, 80, 800, 640],
    ['amizade-em-plano-proximo', 200, 200, 650, 520],
    ['salto-visto-de-baixo', 0, 0, 900, 720],
    ['quarto-ao-anoitecer', 0, 0, 900, 720],
    ['conversa-a-beira-da-cama', 130, 160, 700, 560],
    ['segredo-na-mesa-de-cabeceira', 410, 220, 490, 392]
  ];
  const settings = ['sitio', 'varanda-de-saida', 'estrada-rural', 'varanda-da-vovo', 'canteiro', 'recanto-das-raizes', 'recanto-visto-do-outro-lado', 'copa-da-clareira', 'borda-do-campo', 'pomar-sombreado', 'flor-entre-raizes', 'pomar-iluminado', 'reflexos-da-magia', 'caminho-iluminado', 'terreiro', 'recanto-do-enigma', 'campo-de-margaridas', 'ceu-da-celebracao'];
  const camera = page => {
    const [name, ...viewBox] = cameras[page] || cameras[0];
    return { name, viewBox };
  };
  function background(page, uid) {
    const atlas = (page === 2 ? window.BookRoadAtlas : undefined) || window.BookGazeEnvironments[page] || (page === 1 ? window.BookOpeningAtlases.environment : window.BookEnvironmentAtlases[Math.floor(page / 6)]);
    let frame = atlas.frames[page === 1 || page === 2 || window.BookGazeEnvironments[page] ? 0 : page % 6];
    // Na promessa, o chão livre à direita substitui as samambaias sob os pés da avó.
    if (page === 13) {
      const [x, y, width, height] = frame;
      frame = [x + width / 3, y + height / 3, width * 2 / 3, height * 2 / 3];
    }
    const clip = uid + 'environment-frame';
    const art = `<g data-environment="page-${page}" data-setting="${settings[page]}"><svg width="900" height="720" viewBox="${frame.join(' ')}" preserveAspectRatio="xMidYMid slice"><defs><clipPath id="${clip}"><rect x="${frame[0]}" y="${frame[1]}" width="${frame[2]}" height="${frame[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${new URL(atlas.file, root).href}" width="${atlas.width}" height="${atlas.height}"/></svg></g>`;
    return page === 2 ? `<g transform="translate(900 0) scale(-1 1)" data-road-flow="lower-right">${art}</g>` : art;
  }
  window.BookEnvironments = {
    background, camera, settings,
    ready: Promise.all([...window.BookEnvironmentAtlases, window.BookOpeningAtlases.environment, ...Object.values(window.BookGazeEnvironments), window.BookRoadAtlas].map(atlas => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = () => reject(new Error('Não foi possível carregar um cenário'));
      image.src = new URL(atlas.file, root).href;
    })))
  };
})();
