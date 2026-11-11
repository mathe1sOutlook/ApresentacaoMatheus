// Gera os ícones do app e as telas de abertura (splash) do iOS em img/app/.
// O desenho é o do favicon.svg — telhado ocre, paredes azuis — com os dois
// pontos da marca no lugar da porta, sobre o fundo #0B0D12 do site. É o mesmo
// que está no canvas de design "CASA MARTECH — ícone e splash".
//
// Uso (dev): node scripts/build-app-icons.mjs   — precisa do Playwright (Chromium).
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'img/app');
mkdirSync(out, { recursive: true });
const font = (f) => 'data:font/woff2;base64,' + readFileSync(resolve(root, 'fonts', f)).toString('base64');

const BG = '#0B0D12', OCHRE = '#C9A24E', BLUE = '#7A93E6', INK = '#F1EEE6', SOFT = '#A6A39B';

/* A casa em viewBox 32. `dots` some nos tamanhos pequenos, onde vale o favicon. */
const mark = ({ dots = true, stroke = 2.4, mono = null } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
  <g fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 15.6 V25 H25 V15.6" stroke="${mono || BLUE}"/>
    <path d="M5.4 16.6 L16 7.4 L26.6 16.6" stroke="${mono || OCHRE}"/>
  </g>
  ${dots ? `<circle cx="14.2" cy="20.4" r="1.15" fill="${mono || OCHRE}"/><circle cx="17.8" cy="20.4" r="1.15" fill="${mono || BLUE}"/>` : ''}
</svg>`;

/* Tile do ícone desenhado em S px. radius em fração do lado (0 = quadrado). */
function iconHTML(S, { radius = 0, glow = true, dots = true, stroke = 2.4 } = {}) {
  const k = S / 1024;
  return `<!doctype html><html><head><style>
  html,body{margin:0;background:transparent}
  .t{width:${S}px;height:${S}px;position:relative;overflow:hidden;background:${BG};border-radius:${radius * S}px}
  .g{position:absolute;border-radius:50%;filter:blur(${140 * k}px)}
  .m{position:absolute;left:${192 * k}px;top:${180 * k}px;width:${640 * k}px;height:${640 * k}px}
  </style></head><body><div class="t">
  ${glow ? `<div class="g" style="left:${212 * k}px;top:${150 * k}px;width:${600 * k}px;height:${520 * k}px;background:${OCHRE};opacity:.16"></div>
  <div class="g" style="left:${262 * k}px;top:${470 * k}px;width:${500 * k}px;height:${400 * k}px;background:${BLUE};opacity:.14"></div>` : ''}
  <div class="m">${mark({ dots, stroke })}</div></div></body></html>`;
}

/* Selo monocromático para a barra de notificações do Android: só a silhueta. */
function badgeHTML(S) {
  return `<!doctype html><html><head><style>html,body{margin:0;background:transparent}
  .m{width:${S}px;height:${S}px}</style></head><body><div class="m">${mark({ dots: false, stroke: 3, mono: '#FFFFFF' })}</div></body></html>`;
}

function splashHTML(w, h) {
  return `<!doctype html><html lang="pt-BR"><head><style>
  @font-face{font-family:F;font-weight:600;src:url(${font('fraunces-normal-latin.woff2')}) format('woff2')}
  @font-face{font-family:M;src:url(${font('plex-mono-normal-latin.woff2')}) format('woff2')}
  html,body{margin:0}
  .s{width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${BG};color:${INK}}
  .g{position:absolute;border-radius:50%;width:420px;height:360px;filter:blur(110px)}
  .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
  .m{width:132px;height:132px}
  h1{margin:0;font:600 34px/1 F,Georgia,serif;letter-spacing:.005em}
  p{margin:0;font:11.5px/1.6 M,monospace;letter-spacing:.12em;text-transform:uppercase;color:${SOFT};text-align:center}
  .u{position:absolute;left:0;right:0;bottom:56px;font-size:11px;letter-spacing:.06em;text-transform:none}
  </style></head><body><div class="s">
  <div class="g" style="left:-120px;top:${h * 0.17}px;background:${OCHRE};opacity:.13"></div>
  <div class="g" style="right:-140px;top:${h * 0.5}px;background:${BLUE};opacity:.12"></div>
  <div class="c"><div class="m">${mark({ stroke: 2.2 })}</div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:14px">
  <h1>CASA MARTECH</h1><p>Estratégia de marca<br>&amp; engenharia de sistemas</p></div></div>
  <p class="u">casamartech.com.br</p></div></body></html>`;
}

/* Tamanhos de tela do iPhone (pontos CSS × densidade). O iOS só usa a tela de
   abertura cujo media query bate exatamente com o aparelho. */
export const SPLASHES = [
  [440, 956, 3], [430, 932, 3], [428, 926, 3], [414, 896, 3], [414, 896, 2],
  [402, 874, 3], [393, 852, 3], [390, 844, 3], [375, 812, 3], [375, 667, 2],
];

const browser = await chromium.launch();
async function shot(html, w, h, dpr, file, transparent = true) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(out, file), omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log('img/app/' + file);
}

// Arquivo-mestre (lojas) e maskable: quadrado cheio, a máscara é do sistema.
await shot(iconHTML(1024), 1024, 1024, 1, 'icon-1024.png', false);
await shot(iconHTML(512), 512, 512, 1, 'icon-maskable-512.png', false);
await shot(iconHTML(192), 192, 192, 1, 'icon-maskable-192.png', false);
// "any": cantos arredondados, para onde o sistema não recorta (desktop).
await shot(iconHTML(512, { radius: 0.22 }), 512, 512, 1, 'icon-512.png');
await shot(iconHTML(192, { radius: 0.22 }), 192, 192, 1, 'icon-192.png');
// iOS recorta sozinho e não aceita transparência.
await shot(iconHTML(180), 180, 180, 1, 'apple-touch-icon.png', false);
// Pequenos: o desenho do favicon, sem pontos e com traço mais grosso.
await shot(iconHTML(48, { radius: 0.19, glow: false, dots: false, stroke: 2.8 }), 48, 48, 1, 'favicon-48.png');
await shot(iconHTML(32, { radius: 0.19, glow: false, dots: false, stroke: 3 }), 32, 32, 1, 'favicon-32.png');
await shot(badgeHTML(96), 96, 96, 1, 'badge-96.png');

for (const [w, h, d] of SPLASHES) {
  await shot(splashHTML(w, h), w, h, d, `splash-${w * d}x${h * d}.png`, false);
}
await browser.close();
