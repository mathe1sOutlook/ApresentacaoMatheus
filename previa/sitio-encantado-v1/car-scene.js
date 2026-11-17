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
    const windshield = 'M498 245L927 260L881 501L316 474Z';
    const rearWindow = 'M1085 222L1169 217L1244 363L1144 416Z';
    let art = `<g data-car="family" data-car-view="front-three-quarter" data-road-direction="lower-left" transform="translate(130 240) scale(.43)" role="img" aria-label="O carro segue a curva da estrada em três quartos. Carlos dirige com as mãos no volante; Noeli vai ao lado e Maria Elisa está no assento infantil atrás.">`;
    art += `<defs><clipPath id="${front}"><path d="${windshield}"/></clipPath><clipPath id="${rear}"><path d="${rearWindow}"/></clipPath></defs>`;
    art += `<path d="M90 975Q440 1060 830 1090L1325 770Q1190 730 1050 705Z" fill="#4b4435" opacity=".23"/>`;
    art += `<image href="${source}" width="${atlas.width}" height="${atlas.height}"/>`;
    art += `<g clip-path="url(#${rear})" data-seat="child">${people.person('maria', { x: 1080, y: 220, scale: .65, pose: 'seated', view: 'profile' })}</g>`;
    art += `<g clip-path="url(#${front})">`;
    art += `<path data-part="dashboard" d="M316 465L889 486L881 501L316 474Z" fill="#53665c"/>`;
    art += people.person('noeli', { x: 475, y: 265, scale: .85, pose: 'seated', view: 'profile' });
    art += `<g data-part="steering-wheel" transform="translate(725 463) rotate(-12)"><ellipse rx="57" ry="35" fill="none" stroke="#35483e" stroke-width="9"/></g>`;
    art += people.person('carlos', { x: 685, y: 263, scale: .9, pose: 'driving', view: 'profile' });
    art += `<g transform="translate(725 463) rotate(-12)" fill="none" stroke="#35483e" stroke-width="5"><path d="M0 0L-48-16M0 0L48-16M0 0L0 30"/><circle r="8" fill="#708377"/></g>`;
    art += `<path d="${windshield}" fill="#e1eed8" opacity=".05"/>`;
    art += `</g><path d="M509 251L910 266" fill="none" stroke="#f9f2db" stroke-width="3" opacity=".45"/></g>`;
    return art;
  }
  window.BookCar = { render };
})();
