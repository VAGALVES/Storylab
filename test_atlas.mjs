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
vm.runInNewContext(read('./illustrations.js'), { window: w });
const atlas = w.StoryLabAtlas;
const store = { atlasDrafts: {}, atlasHistory: [] };
let lastTele = '';
let clock = Date.UTC(2026, 9, 14, 12);
let seed = 7;
const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
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
  navigate: () => {}, toTele: text => {lastTele = text},
  now: () => clock, random
});
function click(action, extra = {}) {
  handlers.click({ preventDefault() {}, target: { closest() { return {dataset:{atlasAction:action,...extra}} } } });
}
const initial = atlas.render();
assert.match(initial, /465/);
assert.match(initial, /Verbetes aprofundados: 465/);
assert.match(initial, /Termos dominados: 0 \/ 465/);
assert.match(initial, /Troque a palavra genérica|TROQUE A PALAVRA GENÉRICA/);
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

// ── Detector de palavras vagas (determinístico, com flexões) ──
const found = atlas.analyze('A fachada é bonita e grande. Um lugar legal, com cores incríveis. Bom dia!');
const words = [...found.swaps.map(s => s.word)].sort();
assert.equal(JSON.stringify(words), JSON.stringify(['bonito', 'grande', 'incrível', 'legal']));
assert.ok(!words.includes('lugar') && !words.includes('bom'), 'palavras comuns não devem gerar alarme');
assert.ok(found.swaps.find(s => s.word === 'grande').swap.options.includes('monumental'));
assert.equal(atlas.analyze('A fachada retilínea alinha as janelas no térreo.').vague, 0);
// Mesma ocorrência coberta por dois campos ("bonito" em Formas, "bonita" em Pessoas): conta uma vez
click('word', {topic:'16', word:'estatura'});
const pessoa = atlas.analyze('A vendedora é bonita e simpática.');
assert.equal(pessoa.vague, 1);
assert.equal(pessoa.swaps.length, 1);
assert.equal(pessoa.swaps[0].topic, 16, 'prefere a troca do campo atual');
assert.match(atlas.render(), /estatura/);
assert.equal(atlas.analyze('Um cachorro fofo e um gato pintado.').swaps.length, 2);
assert.equal(atlas.analyze('Fiquei feliz e cansado no fim do dia.').vague, 0, 'emoções não geram alerta');

// ── Treino de precisão ──
const DAY = 86400000;
click('explore');
click('word', {topic:'2', word:'difusa'});
click('train-field');
let q = atlas.quiz();
assert.equal(q.items.length, 8);
for (const item of q.items) {
  assert.equal(item.topic, 2);
  assert.equal(new Set(item.options).size, 4);
  assert.ok(item.options.includes(item.term));
  assert.ok(item.options.every(o => D.atlas[2].terms.includes(o)), 'distratores do mesmo campo');
  if (item.type === 'gap' || item.type === 'scene') {
    assert.match(item.prompt, /_____/);
    assert.ok(!norm(item.prompt).includes(norm(item.term)), 'lacuna não pode entregar a resposta');
  }
}
assert.ok(q.items.some(i => i.type === 'scene') && q.items.some(i => i.type === 'def'));
assert.match(atlas.render(), /PERGUNTA 1 DE 8/);
click('quiz-next');
assert.equal(atlas.quiz().i, 0, 'não avança sem responder');

const first = q.items[0], wrongOpt = first.options.find(o => o !== first.term);
click('quiz-answer', {option: wrongOpt});
assert.equal(store.atlasMastery['2:' + first.term].level, 0);
assert.equal(store.atlasMastery['2:' + first.term].wrong, 1);
assert.match(atlas.render(), /A resposta é/);
click('quiz-answer', {option: first.term});
assert.equal(store.atlasMastery['2:' + first.term].wrong, 1, 'resposta única por pergunta');
for (let i = 0; i < 8; i++) {
  const item = atlas.quiz().items[atlas.quiz().i];
  if (item.picked === null) click('quiz-answer', {option: item.term});
  click('quiz-next');
}
assert.ok(atlas.quiz().done);
assert.match(atlas.render(), /7 de 8 corretas/);
const second = q.items[1].term;
assert.equal(store.atlasMastery['2:' + second].level, 1);
assert.equal(store.atlasMastery['2:' + second].next, clock + DAY);

// Erro deixa o termo pendente; revisões vencidas têm prioridade no treino misto
assert.match(atlas.render(), /Revisões pendentes: 1/);
click('quiz-start', {scope:'all'});
assert.ok(atlas.quiz().items.some(i => i.topic === 2 && i.term === first.term), 'revisão pendente entra primeiro');
click('quiz-exit');

// Três acertos espaçados → termo dominado
for (const days of [1, 3]) {
  clock += days * DAY;
  click('quiz-start', {scope:'field'});
  const item = atlas.quiz().items.find(i => i.term === second);
  assert.ok(item, 'termo vencido volta ao treino');
  while (atlas.quiz().items[atlas.quiz().i] !== item) { const cur = atlas.quiz().items[atlas.quiz().i]; click('quiz-answer', {option: cur.term}); click('quiz-next'); }
  click('quiz-answer', {option: second});
  click('quiz-exit');
}
assert.equal(store.atlasMastery['2:' + second].level, 3);
click('explore');
assert.match(atlas.render(), /Termos dominados: [1-9]/);
console.log('Atlas 1.4: trocas de precisão, detector de vagas, treino, domínio e revisão espaçada OK');
// Campos de conectores: só frases de cena escritas à mão (nunca lacuna automática) e definições
for (const topic of ['26', '27']) {
  click('word', {topic, word: D.atlas[Number(topic)].terms[0]});
  click('train-field');
  const items = atlas.quiz().items;
  assert.ok(items.every(i => (i.type === 'def' || i.type === 'scene') && i.topic === Number(topic)));
  for (const i of items.filter(i => i.type === 'scene')) assert.equal(i.prompt, G[i.topic].terms.find(t => t[0] === i.term)[4]);
  click('quiz-exit');
}
console.log('Atlas 1.7: campos de conectores com frases de cena e definições OK');

// ── Atlas 2.0: frases de cena, quase-sinônimos e novos campos ──
assert.equal(D.atlas.length, 31);
assert.deepEqual([...D.atlas.slice(28).map(f => f.title)], ['Interiores', 'Multidões e público', 'Sons da natureza']);
for (let n = 0; n < 40; n++) {
  click('quiz-start', {scope: 'all'});
  for (const item of atlas.quiz().items) {
    const near = (G[item.topic].near || []).filter(g => g.includes(item.term)).flat();
    assert.ok(item.options.filter(o => o !== item.term).every(o => !near.includes(o)), 'quase-sinônimos não disputam a mesma pergunta');
    if (item.type === 'scene') assert.ok(!norm(item.prompt).includes(norm(item.term)));
  }
  click('quiz-exit');
}
// Frase de cena completada aparece no retorno da resposta
click('word', {topic: '29', word: 'tumulto'});
click('train-field');
const sceneItem = atlas.quiz().items.find(i => i.type === 'scene');
while (atlas.quiz().items[atlas.quiz().i] !== sceneItem) { const cur = atlas.quiz().items[atlas.quiz().i]; click('quiz-answer', {option: cur.term}); click('quiz-next'); }
assert.match(atlas.render(), /Qual termo completa a cena com precisão/);
click('quiz-answer', {option: sceneItem.term});
assert.match(atlas.render(), new RegExp('<mark>' + sceneItem.term + '</mark>'));
click('quiz-exit');
// Detector: palavras vagas dos novos campos, sem alarme para “a gente”
assert.ok(atlas.analyze('O vagão estava lotado e havia muito barulho.').swaps.length === 2);
assert.equal(atlas.analyze('A gente chegou cedo à praça.').vague, 0);
// Baralho de cartões leva a frase de cena
assert.ok(atlas.termDeck(29, 50).fresh.every(t => t.scene && t.scene.includes('_____')));
console.log('Atlas 2.0: 465 frases de cena, quase-sinônimos, 3 novos campos e detector OK');

// ── Atlas 2.1: colocações no verbete, na prática e nos cartões ──
click('explore');
click('word', {topic: '27', word: 'incidir'});
const verbete = atlas.render();
assert.match(verbete, /COMBINAÇÕES USUAIS/);
const colloc = G[27].terms.find(t => t[0] === 'incidir')[5];
assert.ok(colloc.length >= 4 && colloc.every(c => verbete.includes(escape(c))));
store.atlasDrafts = {};
click('insert-colloc', {text: colloc[0]});
assert.match(atlas.render(), /Prática progressiva|PRÁTICA/i);
assert.ok(Object.values(store.atlasDrafts).some(d => d.includes(colloc[0])), 'colocação vai para o rascunho da prática');
assert.ok(atlas.termDeck(27, 50).fresh.every(t => t.collocations.length >= 4));
assert.ok(['refletir', 'ecoar', 'incidir', 'reverberar'].every(t => D.atlas[27].terms.includes(t)), 'núcleo do campo de incidência');
console.log('Atlas 2.1: colocações no verbete, na prática e nos cartões OK');

// ── Atlas 2.2: esquema do campo com destaque do termo selecionado ──
click('explore');
click('word', {topic: '7', word: 'frontão'});
let fieldPage = atlas.render();
assert.match(fieldPage, /atlas20-fig/);
assert.match(fieldPage, /Partes de uma fachada/);
assert.match(fieldPage, /fig-lead-on/, 'o termo selecionado fica em destaque no desenho');
click('word', {topic: '7', word: 'pórtico'});
assert.ok(!/fig-lead-on/.test(atlas.render()), 'termo sem peça no desenho não destaca nada');
click('word', {topic: '3', word: 'saturado'});
assert.ok(!/atlas20-fig/.test(atlas.render()), 'campo sem esquema não mostra figura');
console.log('Atlas 2.2: esquema do campo e destaque do termo selecionado OK');

// Escada narrativa recolhida na prática, com o nível atual em destaque
click('practice');
click('level', {level: '2'});
const prat = atlas.render();
assert.match(prat, /atlas20-ladder/);
assert.match(prat, /fig-step-on/);
console.log('Atlas 2.2: escada narrativa na prática OK');
