/* Cena do carro: ocupantes sentados, duas filas de bancos e comandos visíveis. */
(function () {
  'use strict';

  /** Monta o carro em camadas para manter os passageiros atrás da carroceria. */
  function render(p, uid) {
    const people = window.BookCharacters;
    const ink = '#4c4840';
    const trim = '#b85743';
    const body = p.coral;
    const cabin = `M101 185L139 83Q145 68 163 68H429Q449 69 466 89L539 185Z`;
    const seat = (x, y, width, height, color) => `<g fill="${color}" stroke="${ink}" stroke-width="2"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="15"/><rect x="${x + 4}" y="${y - 22}" width="${width - 8}" height="27" rx="9"/></g>`;
    let art = `<g data-car="family" role="img" aria-label="Carlos dirige com as mãos no volante; Noeli está no banco dianteiro e Maria Elisa viaja no assento infantil atrás.">`;
    art += `<defs><clipPath id="${uid}car-cabin"><path d="${cabin}"/></clipPath><linearGradient id="${uid}car-paint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${body}"/><stop offset="1" stop-color="${trim}"/></linearGradient></defs>`;
    art += `<ellipse cx="337" cy="345" rx="329" ry="25" fill="${p.dark}" opacity=".18"/>`;
    // A carroceria recebe vãos arredondados nas caixas de roda.
    art += `<path d="M30 214L78 184L124 71Q142 33 193 31H426Q470 31 502 75L575 181L633 201Q665 212 668 247V289Q668 315 642 317H617Q612 252 553 252Q490 252 486 317H202Q199 252 138 252Q76 252 72 317H30Q9 315 9 292V247Q9 224 30 214Z" fill="url(#${uid}car-paint)" stroke="${ink}" stroke-width="3"/>`;
    art += `<path d="${cabin}" fill="#dce8dd" stroke="${ink}" stroke-width="3"/>`;
    art += `<g clip-path="url(#${uid}car-cabin)">`;
    art += `<path d="M93 128Q264 99 538 132V203H93Z" fill="#c8d8c5"/><path d="M93 184H543V210H93Z" fill="#7b8172"/>`;
    // O banco distante vem antes dos ocupantes; o banco do motorista fica no primeiro plano.
    art += seat(321, 116, 43, 91, '#aeb2a0');
    art += people.person('noeli', { x: 304, y: 73, scale: .48, pose: 'seated', view: 'profile' });
    art += `<g data-seat="child" fill="#5e746d" stroke="${ink}" stroke-width="2.5"><path d="M174 133Q164 113 180 100H217Q231 112 224 133L235 194H162Z"/><path d="M175 149Q157 145 159 165L164 198H185M219 149Q237 145 235 165L230 198H212"/><rect x="180" y="105" width="32" height="32" rx="12" fill="#899d8c"/></g>`;
    art += people.person('maria', { x: 153, y: 90, scale: .42, pose: 'seated', view: 'profile' });
    art += seat(382, 120, 45, 91, '#75877b');
    art += `<path data-part="dashboard" d="M478 167Q513 158 535 173L549 201H476Z" fill="#4e5b53"/><path d="M489 171L510 168" stroke="#aab8a5" stroke-width="3" stroke-linecap="round"/>`;
    // O aro é desenhado antes das mãos; o cubo e os raios aparecem no primeiro plano.
    art += `<g data-part="steering-wheel" transform="translate(490 156) rotate(-20)"><path d="M3 10L20 43" stroke="#4b554c" stroke-width="7"/><ellipse rx="12" ry="23" fill="none" stroke="#323e36" stroke-width="6"/></g>`;
    art += people.person('carlos', { x: 377, y: 71, scale: .53, pose: 'driving', view: 'profile' });
    art += `<g transform="translate(490 156) rotate(-20)" fill="none" stroke="#323e36" stroke-width="3"><path d="M0 0L-10-9M0 0L10-9M0 0V21"/><circle r="4" fill="#687a69"/></g>`;
    art += `</g>`;
    // Colunas, frisos e reflexos reforçam a profundidade sem esconder os rostos.
    art += `<path d="M326 68V187" stroke="${body}" stroke-width="14"/><path d="M326 70V184" stroke="${ink}" stroke-width="1.5" opacity=".35"/><path d="M112 190H553" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M148 77H301M350 77H420" stroke="#fff9e6" stroke-width="3" stroke-linecap="round" opacity=".65"/>`;
    art += `<path d="M84 208Q324 197 576 209L640 225H35Z" fill="#ffdebd" opacity=".17"/><path d="M321 204V306M488 207L491 255M96 218L92 257" fill="none" stroke="${trim}" stroke-width="2.5"/>`;
    art += `<path d="M211 310H477" stroke="${ink}" stroke-width="5" stroke-linecap="round" opacity=".65"/><path d="M215 302H472" stroke="#ffd1ae" stroke-width="2" opacity=".55"/>`;
    art += `<g fill="#fff1d7" stroke="${trim}" stroke-width="2"><rect x="272" y="211" width="34" height="9" rx="4.5"/><rect x="440" y="211" width="34" height="9" rx="4.5"/></g>`;
    art += `<g data-part="side-mirror"><path d="M521 180L540 167" stroke="${ink}" stroke-width="5"/><path d="M534 157Q553 154 558 166Q554 176 535 173Z" fill="${body}" stroke="${ink}" stroke-width="2.5"/></g>`;
    art += `<path d="M616 226H650Q656 227 656 236V248H617Z" fill="#f9df9a" stroke="${trim}" stroke-width="2"/><path d="M620 231H648" stroke="#fff8d8" stroke-width="3"/><rect x="15" y="230" width="13" height="31" rx="5" fill="#9f3d3b"/><rect x="17" y="234" width="8" height="12" rx="3" fill="#e9a17c"/>`;
    art += `<path d="M20 288H62M621 286H658" stroke="#f5dfbb" stroke-width="7" stroke-linecap="round"/><path d="M641 262H663" stroke="${ink}" stroke-width="3"/>`;
    for (const x of [138, 553]) {
      art += `<g data-part="wheel" transform="translate(${x} 308)"><circle r="56" fill="#3e4941" stroke="${ink}" stroke-width="2"/><circle r="35" fill="#d4d3b9"/><circle r="25" fill="#f7edce" stroke="#a4ad98" stroke-width="2"/><circle r="8" fill="#748477"/><path d="M0-13V-23M12 4L22 8M-12 4L-22 8" stroke="#9aa58e" stroke-width="4" stroke-linecap="round"/></g>`;
    }
    return art + '</g>';
  }
  window.BookCar = { render };
})();
