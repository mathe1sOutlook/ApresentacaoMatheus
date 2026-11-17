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
      const expectedArt = page.pageNumber === 2 ? 'familia-no-carro' : page.pageNumber === 3 ? 'narrativa-embrace' : page.pageNumber === 20 ? 'maria-descanso' : page.pageNumber >= 18 ? 'narrativa-bedtime' : page.pageNumber <= 1 ? choice.id : 'narrativa-maria';
      assert(markup.includes('assets/' + expectedArt + '.png'), `${choice.id}/${model}/${page.id}`);
      assert(markup.includes(`data-camera="${context.window.BookEnvironments.camera(page.pageNumber).name}"`));
      if (page.pageNumber <= 17) assert(markup.includes(`data-environment="page-${page.pageNumber}"`), 'Cada acontecimento deve usar seu ambiente');
      if (page.pageNumber === 14) {
        assert.equal((markup.match(/data-animal-view="three-quarter"/g) || []).length, 5);
        assert(markup.includes('data-animal-pose="messenger"'));
        assert(markup.includes('assets/animais-perspectiva.png'));
        assert(markup.includes('data-depth-order="ground-plane"'));
      }
      for (const [name, pose] of Object.entries(context.window.BookScenePoses.pages[page.pageNumber] || {})) {
        if (pose === 'embrace') {
          assert(markup.includes('data-pose="embrace"'));
          continue;
        }
        const found = markup.match(new RegExp('data-character="' + name + '"[^>]*data-pose="([^"]+)"'));
        assert(found, `${page.id}/${name} deve estar presente na cena`);
        assert.equal(found[1], pose, `${page.id}/${name} deve acompanhar a ação do texto`);
      }
      if (page.scene === 'road') {
        assert(markup.includes('data-part="steering-wheel"'), 'Volante deve estar visível na cena do carro');
        assert(markup.includes('data-part="dashboard"'));
        assert(markup.includes('data-seat="child"'));
        assert.equal((markup.match(/data-pose="driving"/g) || []).length, 1);
        assert.equal((markup.match(/data-pose="seated"/g) || []).length, 2);
        assert.equal((markup.match(/data-variant="/g) || []).length, 3);
        assert.equal((markup.match(new RegExp('data-variant="' + choice.id + '"', 'g')) || []).length, 3);
      }
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
assert(fs.existsSync(root + context.window.BookCharacterCarAtlas.file));
assert.equal(context.window.BookCharacterCarAtlas.frames.length, 9);
for (const atlas of [context.window.BookCharacterCarAtlas, context.window.BookCharacterSleepAtlas]) {
  for (const [x, y, w, h] of atlas.frames) assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= atlas.width && y + h <= atlas.height);
}
variants.setSelection('carlos', 'guache-ludico');
variants.setSelection('noeli', 'guache-suave');
const mixedCar = context.window.BookCar.render({ coral: '#d88867', dark: '#405544' }, 'mixed-car-');
assert(mixedCar.includes('data-character="carlos" data-variant="guache-ludico"'));
assert(mixedCar.includes('data-character="noeli" data-variant="guache-suave"'));
assert(mixedCar.includes('data-character="maria" data-variant="guache"'));
assert(chars.person('maria', { pose: 'sleep' }).includes('assets/maria-descanso.png'));
for (const atlas of [...Object.values(context.window.BookNarrativeAtlases), context.window.BookEmbraceAtlas, context.window.BookBedtimeAtlas]) {
  assert(fs.existsSync(root + atlas.file));
  for (const [x, y, w, h] of atlas.frames) assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= atlas.width && y + h <= atlas.height);
}
assert.equal(context.window.BookNarrativeAtlases.pipoca.poses.length, 10);
assert(chars.pipoca({ view: 'front' }).includes('assets/narrativa-pipoca.png'));
variants.setSelection('maria', 'guache-suave');
variants.setSelection('vovo', 'guache-ludico');
const hug = chars.embrace();
assert(hug.includes('data-maria-variant="guache-suave"'));
assert(hug.includes('data-vovo-variant="guache-ludico"'));
for (const grandma of variants.choices) for (const girl of variants.choices) {
  variants.setSelection('vovo', grandma.id);
  variants.setSelection('maria', girl.id);
  const pair = chars.embrace();
  assert(pair.includes(`data-vovo-variant="${grandma.id}"`) && pair.includes(`data-maria-variant="${girl.id}"`));
  assert(!/NaN|undefined/.test(pair));
}
const surprise = context.window.BookScenes.render('sneeze', 'comic', 6);
assert.equal((surprise.match(/data-pose="startled"/g) || []).length, 2);
const riddle = context.window.BookScenes.render('riddle', 'comic', 15);
assert(riddle.includes('data-pose="read"') && riddle.includes('data-pose="think"'));
assert(html.includes('sitio-personagens-guache-v1'));
assert(!html.includes('sitio-personagens-v2'));
assert(html.includes('sel=window.BookVariants.getSelections()'));
assert.equal(new Set(context.window.BookEnvironments.settings).size, 18);
assert.equal(new Set(Array.from({ length: 21 }, (_, i) => context.window.BookEnvironments.camera(i).name)).size, 21);
for (let page = 0; page <= 20; page++) {
  const [x, y, width, height] = context.window.BookEnvironments.camera(page).viewBox;
  assert.equal(width / height, 1.25, 'A câmera deve preencher a ilustração sem faixas vazias');
  assert(x >= 0 && y >= 0 && x + width <= 900 && y + height <= 720);
}
for (const atlas of [...context.window.BookEnvironmentAtlases, context.window.BookAnimalAtlas]) {
  assert(fs.existsSync(root + atlas.file));
  for (const [x, y, width, height] of atlas.frames) assert(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= atlas.width && y + height <= atlas.height);
}
console.log(`OK: ${scripts} scripts, ${rendered} páginas renderizadas; texto, seleção, recortes e assets verificados.`);
