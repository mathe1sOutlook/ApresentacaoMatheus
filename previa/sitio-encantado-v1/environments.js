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
    ['investigacao-junto-ao-chao', 90, 180, 675, 540],
    ['plano-aberto-do-susto', 0, 0, 900, 720],
    ['olhar-para-a-copa', 70, 56, 800, 640],
    ['reverencia-na-clareira', 25, 140, 725, 580],
    ['conversa-na-grama', 80, 152, 710, 568],
    ['descoberta-entre-as-raizes', 110, 168, 690, 552],
    ['pedra-nas-maos', 125, 100, 725, 580],
    ['detalhe-das-estrelas', 200, 120, 700, 560],
    ['luz-no-caminho', 160, 120, 740, 592],
    ['terreiro-em-tres-quartos', 0, 0, 900, 720],
    ['roda-do-enigma', 70, 80, 800, 640],
    ['amizade-em-plano-proximo', 200, 200, 650, 520],
    ['salto-visto-de-baixo', 100, 0, 800, 640],
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
    const atlas = page === 1 ? window.BookOpeningAtlases.environment : window.BookEnvironmentAtlases[Math.floor(page / 6)];
    const frame = atlas.frames[page === 1 ? 0 : page % 6];
    const clip = uid + 'environment-frame';
    return `<g data-environment="page-${page}" data-setting="${settings[page]}"><svg width="900" height="720" viewBox="${frame.join(' ')}" preserveAspectRatio="xMidYMid slice"><defs><clipPath id="${clip}"><rect x="${frame[0]}" y="${frame[1]}" width="${frame[2]}" height="${frame[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${new URL(atlas.file, root).href}" width="${atlas.width}" height="${atlas.height}"/></svg></g>`;
  }
  window.BookEnvironments = {
    background, camera, settings,
    ready: Promise.all([...window.BookEnvironmentAtlases, window.BookOpeningAtlases.environment].map(atlas => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = () => reject(new Error('Não foi possível carregar um cenário'));
      image.src = new URL(atlas.file, root).href;
    })))
  };
})();
