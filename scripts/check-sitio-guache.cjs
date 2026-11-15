/* Verifica texto preservado, escolhas e ilustrações em todos os modelos/páginas. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const root = 'previa/sitio-encantado-v1/';
const html = fs.readFileSync(root + 'index.html', 'utf8');
const getRawData = source => source.match(/<script id="story-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const getData = source => JSON.parse(getRawData(source));
assert.equal(createHash('sha256').update(getRawData(html)).digest('hex'), '3ce699510f8bbc5205c0c167ffd12d2c3be9da2b4fa5db30d7c522434985e6c2', 'Texto e paginação devem permanecer intactos');
let scripts = 0;
const context = vm.createContext({
  window: {}, URL, console,
  Image: class { set src(value) { this.onload(); } },
  document: { currentScript: { src: 'https://www.casamartech.com.br/' + root + 'guache-characters.js' } }
});
for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (match[1].includes('application/json')) continue;
  const external = match[1].match(/src="([^"?]+)/);
  const source = external ? fs.readFileSync(root + external[1], 'utf8') : match[2];
  // Os dois últimos scripts são controladores da interface e do envio autenticado.
  new vm.Script(source);
  if (source.startsWith('(() => {') || source.includes('Manda as escolhas de desenho')) continue;
  vm.runInContext(source, context);
  scripts++;
}
const { BookVariants: variants, BookCharacters: chars, BookPages: pages } = context.window;
assert.equal(variants.choices.length, 3);
assert.equal(variants.getSelections().carlos, 'guache');
assert.throws(() => variants.setSelection('carlos', 'original'));
assert.throws(() => variants.setSelection('intruso', 'guache'));
let rendered = 0;
for (const choice of variants.choices) {
  for (const name of Object.keys(variants.getSelections())) variants.setSelection(name, choice.id);
  for (const model of ['soft', 'paper', 'botanical', 'comic', 'dream']) {
    for (const page of getData(html)) {
      const markup = pages.render(model, page);
      assert(markup.includes('assets/' + choice.id + '.png'), `${choice.id}/${model}/${page.id}`);
      assert(!/NaN|undefined/.test(markup));
      assert(!markup.includes('data-variant="original"'));
      const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length, 'IDs de recorte únicos por página');
      rendered++;
    }
  }
}
variants.setSelection('maria', 'guache-suave');
variants.setSelection('carlos', 'guache-ludico');
assert(chars.person('maria', { view: 'profile' }).includes('data-view="profile"'));
assert(chars.person('carlos', { view: 'action' }).includes('assets/guache-ludico.png'));
assert(chars.person('maria', { view: 'front' }).includes('clip-path="url(#guache-frame-'));
variants.reset();
assert(Object.values(variants.getSelections()).every(value => value === 'guache'));
for (const atlas of Object.values(context.window.BookCharacterAtlases)) {
  assert(fs.existsSync(root + atlas.file));
  assert.equal(atlas.frames.length, 15);
  for (const [x, y, w, h] of atlas.frames) assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= atlas.width && y + h <= atlas.height);
}
assert(fs.existsSync(root + context.window.BookCharacterSleepAtlas.file));
assert.equal(context.window.BookCharacterSleepAtlas.frames.length, 3);
assert(chars.person('maria', { pose: 'sleep' }).includes('assets/maria-descanso.png'));
assert(html.includes('sitio-personagens-guache-v1'));
assert(!html.includes('sitio-personagens-v2'));
assert(html.includes('sel=window.BookVariants.getSelections()'));
console.log(`OK: ${scripts} scripts, ${rendered} páginas renderizadas; texto, seleção, recortes e assets verificados.`);
