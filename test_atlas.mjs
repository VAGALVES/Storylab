import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const D = JSON.parse(read('./content/storylab_data.json'));
const G = JSON.parse(read('./content/atlas_guides.json'));
const handlers = {};
const w = { STORYLAB_ATLAS_GUIDES: G };
vm.runInNewContext(read('./atlas-engine.js'), {
  window: w,
  document: { addEventListener(type, handler) { handlers[type] = handler; } }
});
const atlas = w.StoryLabAtlas;
const store = { atlasDrafts: {}, atlasHistory: [] };
let lastTele = '';
let renders = 0;
const escape = x => String(x ?? '').replace(/[&<>"']/g, x => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[x]));
const norm = x => String(x ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
atlas.init({
  D, getStore: () => store, save: () => {}, render: () => {renders++},
  header: (_k, title) => '<h1>' + escape(title) + '</h1>',
  stat: (label, value) => '<p>' + escape(label) + ': ' + value + '</p>',
  esc: escape, norm, ico: name => '['+name+']',
  say: () => {}, copy: () => {}, toast: () => {},
  navigate: () => {}, toTele: text => {lastTele = text}
});
function click(action, extra = {}) {
  handlers.click({ preventDefault() {}, target: { closest() { return {dataset:{atlasAction:action,...extra}} } } });
}
const initial = atlas.render();
assert.match(initial, /160/);
assert.match(initial, /64/);
assert.match(initial, /retilíneo/);
click('word', {topic:'9', word:'caimento'});
assert.match(atlas.render(), /Modo como um tecido/);
click('practice');
click('level', {level:'3'});
assert.match(atlas.render(), /90 s/);
store.atlasDrafts['9:3'] = 'Na vitrine, a silhueta é reta e o caimento cria pregas suaves. Enquanto a peça superior mantém linhas marcadas, o tecido inferior é fluido. Para mim, esse contraste organiza o conjunto.';
click('review');
assert.match(atlas.render(), /Indicadores simples/);
click('save');
assert.equal(store.atlasHistory.length, 1);
assert.equal(store.atlasHistory[0].level, 3);
assert.equal(store.atlasHistory[0].topic, 9);
click('tele');
assert.match(lastTele, /Na vitrine/);
click('level', {level:'1'});
click('restore', {index:'0'});
assert.match(atlas.render(), /90 s/);
assert.ok(renders >= 6);
console.log('Atlas: navegação, verbete, níveis, indicadores, histórico e teleprompter OK');
