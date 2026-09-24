// Gera og.png e og-en.png (1200×630) — as imagens que aparecem quando alguém
// compartilha o site. São desenhadas com as fontes e os tokens do próprio
// index.html: mesma constelação de semente fixa, mesmo contorno de casa em
// linha de construção, mesma trilha ocre → azul.
//
// Uso (dev): node scripts/build-og.mjs   — precisa do Playwright (Chromium).
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => 'data:font/woff2;base64,' + readFileSync(resolve(root, 'fonts', f)).toString('base64');

const FONTS = {
  frauncesRoman: font('fraunces-normal-latin.woff2'),
  frauncesItalic: font('fraunces-italic-latin.woff2'),
  inter: font('inter-normal-latin.woff2'),
  mono: font('plex-mono-normal-latin.woff2'),
};

// O endereço do site. Se o domínio mudar, muda aqui.
const SITE = 'casamartech.com.br';

const CARDS = {
  'og.png': {
    lang: 'pt-BR',
    eyebrow: 'ESTRATÉGIA DE MARCA &nbsp;×&nbsp; ENGENHARIA DE SISTEMAS',
    l1: '<span class="mar">Mar</span>cas que se destacam.',
    l2: '<span class="tec">Tec</span>nologia que sustenta.',
    foot: 'Marca e tecnologia na mesma mesa, do zero',
  },
  'og-en.png': {
    lang: 'en',
    eyebrow: 'BRAND STRATEGY &nbsp;×&nbsp; SYSTEMS ENGINEERING',
    l1: 'Brands that stand out.',
    l2: 'Technology that holds them up.',
    foot: 'Brand and technology at the same table, from zero',
  },
};

const html = (c) => `<!DOCTYPE html><html lang="${c.lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';src:url('${FONTS.frauncesRoman}') format('woff2');font-weight:100 900;font-style:normal;font-display:block}
@font-face{font-family:'Fraunces';src:url('${FONTS.frauncesItalic}') format('woff2');font-weight:100 900;font-style:italic;font-display:block}
@font-face{font-family:'Inter';src:url('${FONTS.inter}') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'IBM Plex Mono';src:url('${FONTS.mono}') format('woff2');font-weight:400;font-display:block}
:root{--bg:#0B0D12;--ink:#F1EEE6;--ink-soft:#A6A39B;--ochre:#C9A24E;--blue:#7A93E6}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;position:relative;overflow:hidden}
canvas{position:absolute;inset:0;opacity:.6}
.wrap{position:relative;height:100%;padding:64px 72px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-weight:700;font-size:27px;letter-spacing:.11em}
.dots{display:flex;gap:7px}
.dots i{width:9px;height:9px;border-radius:50%;display:block}
.dots i:first-child{background:var(--ochre)}.dots i:last-child{background:var(--blue)}
.mid{margin-top:auto}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:16px;letter-spacing:.18em;color:var(--ink-soft)}
h1{font-family:'Fraunces',serif;font-weight:400;font-size:70px;line-height:1.07;letter-spacing:-.015em;margin-top:26px}
h1 .mar{color:var(--ochre)}h1 .tec{color:var(--blue)}
.foot{margin-top:38px;display:flex;justify-content:space-between;align-items:flex-end;font-family:'IBM Plex Mono',monospace;font-size:17px;color:var(--ink-soft)}
.rail{position:absolute;left:72px;right:72px;bottom:118px;height:2px;background:linear-gradient(90deg,var(--ochre) 0%,#B4A283 50%,var(--blue) 100%);opacity:.5}
</style></head><body>
<canvas id="net" width="1200" height="630"></canvas>
<div class="wrap">
  <div class="brand"><span class="dots"><i></i><i></i></span><span>CASA MARTECH</span></div>
  <div class="mid"><p class="eyebrow">${c.eyebrow}</p><h1>${c.l1}<br>${c.l2}</h1></div>
  <div class="rail"></div>
  <div class="foot"><span>${c.foot}</span><span>${SITE}</span></div>
</div>
<script>
var cv=document.getElementById('net'),ctx=cv.getContext('2d'),W=1200,H=630;
function seeded(s){return function(){s=(s*1664525+1013904223)%4294967296;return s/4294967296}}
var rnd=seeded(20260904),pts=[],reach=Math.min(W,H)*0.32;
for(var i=0;i<24;i++){var x=rnd()*W,y=rnd()*H;pts.push({x:x,y:y,tone:x<W*0.45?'#C9A24E':'#7A93E6',r:rnd()<0.35?4:2.5})}
/* hTop e não top: no escopo global, top é window.top e não aceita atribuição */
var w=Math.min(W*0.26,340),wall=w*0.62,roof=w*0.34,cx=W*0.79,hTop=64,
    L=cx-w/2,R=cx+w/2,eave=hTop+roof,base=eave+wall,
    H5=[{x:cx,y:hTop},{x:R,y:eave},{x:R,y:base},{x:L,y:base},{x:L,y:eave}];
H5.forEach(function(a){pts.push({x:a.x,y:a.y,tone:a.x<W*0.45?'#C9A24E':'#7A93E6',r:2,anchor:1})});
ctx.lineWidth=1;
for(var a=0;a<pts.length;a++)for(var b=a+1;b<pts.length;b++){
  var dx=pts[a].x-pts[b].x,dy=pts[a].y-pts[b].y,d=Math.sqrt(dx*dx+dy*dy);
  if(d>=reach)continue;ctx.globalAlpha=0.1+0.45*(1-d/reach);
  ctx.strokeStyle=pts[a].tone===pts[b].tone?pts[a].tone:'#7A93E6';
  ctx.beginPath();ctx.moveTo(pts[a].x,pts[a].y);ctx.lineTo(pts[b].x,pts[b].y);ctx.stroke();}
var base0=pts.length-5,E=[[0,1],[1,2],[2,3],[3,4],[4,0],[4,1]];
E.forEach(function(e,k){var p1=pts[base0+e[0]],p2=pts[base0+e[1]],last=k===E.length-1;
  ctx.setLineDash(last?[2,7]:[7,6]);ctx.globalAlpha=last?0.24:0.42;
  ctx.strokeStyle=(e[0]===0||e[1]===0)?'#C9A24E':'#7A93E6';   /* telhado ocre, resto azul */
  ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();});
ctx.setLineDash([]);ctx.globalAlpha=0.6;
for(var c2=0;c2<5;c2++){var v=pts[base0+c2];ctx.strokeStyle=v.tone;ctx.beginPath();
  ctx.moveTo(v.x-5,v.y);ctx.lineTo(v.x+5,v.y);ctx.moveTo(v.x,v.y-5);ctx.lineTo(v.x,v.y+5);ctx.stroke();}
ctx.globalAlpha=1;
pts.forEach(function(p){ctx.fillStyle=p.tone;ctx.globalAlpha=p.anchor?0.55:1;
  ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
<\/script></body></html>`;

const browser = await chromium.launch();
for (const [file, card] of Object.entries(CARDS)) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html(card), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, file) });
  console.log(file, 'gerado');
  await page.close();
}
await browser.close();
