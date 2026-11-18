/* Carro em três quartos: o eixo da carroceria acompanha a estrada em profundidade. */
(function () {
  'use strict';
  const atlas = window.BookCarBodyAtlas;
  const source = new URL(atlas.file, document.currentScript.src).href;
  /** Projeta cada ocupante dentro do vidro correspondente, preservando a escolha individual. */
  function render(p, uid) {
    const people = window.BookCharacters;
    const front = `${uid}car-front`;
    const rear = `${uid}car-rear`;
    const windshield = 'M516 282L932 252L1107 482L582 521Z';
    const rearWindow = 'M284 243L382 261L325 455L169 392Z';
    let art = `<g data-car="family" data-car-view="front-three-quarter" data-road-direction="lower-right" data-visible-side="passenger" transform="translate(130 240) scale(.43)" role="img" aria-label="O carro segue a curva da estrada em três quartos. Papai dirige com as mãos no volante; Noeli vai ao lado e Maria Elisa está na cadeirinha atrás do banco do passageiro.">`;
    art += `<defs><clipPath id="${front}"><path d="${windshield}"/></clipPath><clipPath id="${rear}"><path d="${rearWindow}"/></clipPath></defs>`;
    art += `<path d="M110 790Q390 830 600 1095L1315 1015Q1120 850 940 795Z" fill="#4b4435" opacity=".23"/>`;
    art += `<image href="${source}" width="${atlas.width}" height="${atlas.height}"/>`;
    art += `<g clip-path="url(#${rear})" data-seat="child" data-behind="passenger">${people.person('maria', { x: 230, y: 247, scale: .64, pose: 'seated', view: 'profile', flip: true })}</g>`;
    art += `<g clip-path="url(#${front})">`;
    art += `<path data-part="dashboard" d="M578 495L1100 461L1107 482L582 521Z" fill="#53665c"/>`;
    art += people.person('noeli', { x: 552, y: 292, scale: .94, pose: 'seated', view: 'profile', flip: true });
    art += `<g data-part="steering-wheel" transform="translate(925 475) rotate(10)"><ellipse rx="50" ry="31" fill="none" stroke="#35483e" stroke-width="9"/></g>`;
    art += people.person('carlos', { x: 815, y: 285, scale: .85, pose: 'driving', view: 'profile', flip: true });
    art += `<g transform="translate(925 475) rotate(10)" fill="none" stroke="#35483e" stroke-width="5"><path d="M0 0L-43-14M0 0L43-14M0 0L0 27"/><circle r="8" fill="#708377"/></g>`;
    art += `<path d="${windshield}" fill="#e1eed8" opacity=".05"/>`;
    art += `</g><path d="M531 287L922 260" fill="none" stroke="#f9f2db" stroke-width="3" opacity=".45"/></g>`;
    return art;
  }
  window.BookCar = { render };
})();
