/* Verifica texto preservado, escolhas e ilustrações em todos os modelos/páginas. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const root = 'previa/sitio-encantado-v1/';
const html = fs.readFileSync(root + 'index.html', 'utf8');
const getRawData = source => source.match(/<script id="story-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const getData = source => JSON.parse(getRawData(source));
assert.equal(createHash('sha256').update(getRawData(html)).digest('hex'), '5c2a60d3ddcc5e1a4829f38dd4b0a280de03840b3c78f448ebe64137c6af78a2', 'Texto aprovado com papai e paginação devem permanecer intactos');
const previousText = getData(html);
previousText[1].paragraphs[2] = previousText[1].paragraphs[2].replace('o papai e a mamãe', 'o papai Carlos Eduardo e a mamãe');
previousText[1].wordCount += 2;
assert.equal(createHash('sha256').update(JSON.stringify(previousText)).digest('hex'), '3ce699510f8bbc5205c0c167ffd12d2c3be9da2b4fa5db30d7c522434985e6c2', 'A troca do nome e a contagem de palavras são as únicas mudanças no texto do capítulo');
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
      const expectedArt = page.pageNumber === 2 ? 'familia-carro-perspectiva' : page.pageNumber === 3 ? 'abraco-vovo-oculos' : page.pageNumber === 13 ? 'maos-unidas-oculos' : page.pageNumber === 12 ? 'maria-acoes-pedra' : [11, 17].includes(page.pageNumber) ? 'olhares-maria' : page.pageNumber === 20 ? 'maria-descanso' : page.pageNumber >= 18 ? 'narrativa-bedtime' : page.pageNumber <= 1 ? choice.id : 'narrativa-maria';
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
        if (['embrace', 'handhold'].includes(pose)) {
          assert(markup.includes('data-pose="' + pose + '"'));
          continue;
        }
        const found = markup.match(new RegExp('data-character="' + name + '"[^>]*data-pose="([^"]+)"'));
        assert(found, `${page.id}/${name} deve estar presente na cena`);
        assert.equal(found[1], pose, `${page.id}/${name} deve acompanhar a ação do texto`);
      }
      if (page.scene === 'road') {
        assert(markup.includes('data-car-view="front-three-quarter"'));
        assert(markup.includes('data-road-direction="lower-right"'));
        assert(markup.includes('data-visible-side="passenger"') && markup.includes('data-behind="passenger"'));
        assert(markup.includes('assets/voyage-branco.png') && markup.includes('assets/estrada-perspectiva.png'));
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
assert(chars.person('carlos', { view: 'action' }).includes('assets/carlos-mais-jovem-v3.png'));
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
for (const [name, variant] of [['carlos', 'guache-ludico'], ['noeli', 'guache-suave'], ['maria', 'guache']]) {
  assert(new RegExp('data-character="' + name + '"[^>]*data-variant="' + variant + '"').test(mixedCar));
}
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
assert(surprise.includes('data-pose="startled"') && surprise.includes('data-pose="box-startled"'));
const riddle = context.window.BookScenes.render('riddle', 'comic', 15);
assert(riddle.includes('data-pose="read-scroll"') && riddle.includes('data-pose="think"'));
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
for (const atlas of [...context.window.BookEnvironmentAtlases, context.window.BookAnimalAtlas, ...Object.values(context.window.BookOpeningAtlases), ...Object.values(context.window.BookGazeAtlases), ...Object.values(context.window.BookGazeEnvironments), ...Object.values(context.window.BookActionAtlases), context.window.BookCarBodyAtlas, context.window.BookRoadAtlas, context.window.BookHandholdAtlas, context.window.BookCarlosCarAtlas]) {
  assert(fs.existsSync(root + atlas.file));
  for (const [x, y, width, height] of atlas.frames) assert(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= atlas.width && y + height <= atlas.height);
}

for (const atlas of Object.values(context.window.BookParentAtlases)) {
  assert(fs.existsSync(root + atlas.file));
  assert.equal(atlas.frames.length, 9);
  for (const [x,y,w,h] of atlas.frames) assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x+w <= atlas.width && y+h <= atlas.height);
}
const scale = context.window.BookSceneScale;
const nearCow = scale.parade.find(item => item.kind === 'cow');
const girl = scale.parade.find(item => item.kind === 'maria');
assert(scale.animals.cow.height * nearCow.scale >= scale.adultHeight * girl.scale, 'Vaca próxima não pode parecer miniatura ao lado da menina');
assert(scale.animals.pig.height >= scale.adultHeight * .4);
assert(scale.animals.pig.height < scale.animals.cow.height);
assert(scale.props.closedChest[2] * 99 < scale.adultHeight / 3);
assert(scale.props.bedsideStone.scale <= .38, 'Pedra no criado-mudo deve manter a escala da pedra nas mãos');

assert.equal(scale.props.emergingStone[2], scale.props.bedsideStone.scale, 'Pedra deve manter sua escala nas cenas comuns');

assert.equal(context.window.BookOpeningAtlases.noeli.frames.length, 3);
assert.equal(context.window.BookOpeningAtlases.environment.frames.length, 1);
const opening = context.window.BookScenes.render('departure', 'comic', 1);
assert(opening.includes(context.window.BookOpeningAtlases.environment.file));
assert(opening.includes(context.window.BookOpeningAtlases.noeli.file));
assert(opening.includes('data-pose="departure-listen"'), 'Noeli deve usar a pose de atenção à filha na abertura');
assert(!opening.includes('assets/cenarios-a-v2.png'), 'Abertura deve usar a nova casa em escala corrigida');

for (const choice of variants.choices) {
  const getDimension = (name, attr) => Number(chars.person(name, {variant: choice.id, view: 'front', y: 100, scale: 1.2}).match(new RegExp(attr + '="([^"]+)"'))[1]);
  const carlosHeight = getDimension('carlos', 'data-world-height');
  const noeliHeight = getDimension('noeli', 'data-world-height');
  assert(Math.abs(carlosHeight / noeliHeight - 175 / 170) < 1e-9, 'Carlos deve ser apenas cerca de 5 cm mais alto na referência de estatura');
  assert.equal(getDimension('carlos', 'data-ground-y'), getDimension('noeli', 'data-ground-y'), 'Diferença de altura deve preservar o apoio dos pés');
}
for (const atlas of Object.values(context.window.BookGazeAtlases)) assert.equal(atlas.frames.length, atlas.poses.length * 3);
for (const atlas of Object.values(context.window.BookActionAtlases)) assert.equal(atlas.frames.length, atlas.poses.length * 3);
assert.equal(new Set([11, 12, 13].map(page => context.window.BookScenePoses.pages[page].maria)).size, 3, 'As três cenas da pedra devem ter ações diferentes para Maria Elisa');
for (const [scene, page] of [['unicorn', 7]]) {
  const markup = context.window.BookScenes.render(scene, 'comic', page);
  const ground = name => Number(markup.match(new RegExp('data-character="' + name + '"[^>]*data-ground-y="([^"]+)"'))[1]);
  assert(Math.abs(ground('vovo') - ground('maria')) <= 1, 'Avó e menina devem apoiar os pés no mesmo chão nessa cena');
}
assert.equal(context.window.BookHandholdAtlas.frames.length, 9);
for (const grandma of variants.choices) for (const girl of variants.choices) {
  variants.setSelection('vovo', grandma.id);
  variants.setSelection('maria', girl.id);
  const pair = chars.handhold({ x: 150, y: 283.5 });
  assert(pair.includes('data-maria-variant="' + girl.id + '"'));
  assert(pair.includes('data-vovo-variant="' + grandma.id + '"'));
  assert(pair.includes('data-contact="joined-hands-between-bodies"'));
  assert(pair.includes('data-ground-y="658.5"'));
  assert(!/NaN|undefined/.test(pair));
}
assert.equal(context.window.BookCarlosCarAtlas.frames.length, 3);
for (const choice of variants.choices) {
  assert(chars.person('carlos', { pose: 'driving', variant: choice.id }).includes('assets/familia-carlos-jovem-v3.png'));
  for (const name of ['noeli', 'maria']) assert(chars.person(name, { pose: 'seated', variant: choice.id }).includes('assets/familia-carro-perspectiva.png'));
}
assert(!getRawData(html).includes('Carlos'));
assert(getData(html)[1].paragraphs.some(text => text.includes('o papai e a mamãe Noeli')));
assert(!html.includes('house(628,318,.3,true)'), 'Janela do quarto não deve mostrar casa vizinha');
for (const choice of variants.choices) {
  assert(chars.person('vovo', { view: 'front', variant: choice.id }).includes('assets/vovo-selecao-oculos.png'));
  assert(chars.person('vovo', { narrativePose: 'crouch', variant: choice.id }).includes('assets/narrativa-vovo-oculos.png'));
  assert(chars.person('vovo', { narrativePose: 'listen-down', variant: choice.id }).includes('assets/olhares-vovo-oculos.png'));
}
for (const model of Object.values(context.window.BookPages.layouts)) {
  const item = model['1'].items.find(item => item.text.includes('o papai e a mamãe'));
  assert(item && item.lines.join(' ') === item.text, 'Texto diagramado deve acompanhar a alteração para papai');
  assert(model['1'].items.every(item => !item.text.includes('Carlos')));
}
console.log(`OK: ${scripts} scripts, ${rendered} páginas renderizadas; texto, seleção, recortes e assets verificados.`);
