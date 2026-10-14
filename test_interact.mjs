import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const D = JSON.parse(read('./content/storylab_data.json'));
const G = JSON.parse(read('./content/atlas_guides.json'));
const w = {};
vm.runInNewContext(read('./interact.js'), { window: w, document: { addEventListener() {} } });
const T = w.StoryLabInteract._test;
const norm = x => String(x ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ── Sequência de estudo ──
assert.equal(T.streak({}, '2026-10-14'), 0);
assert.equal(T.streak({ '2026-10-14': 2, '2026-10-13': 1, '2026-10-12': 5 }, '2026-10-14'), 3);
assert.equal(T.streak({ '2026-10-13': 1, '2026-10-12': 1 }, '2026-10-14'), 2, 'sequência continua viva até o fim do dia seguinte');
assert.equal(T.streak({ '2026-10-12': 1 }, '2026-10-14'), 0, 'um dia sem estudo zera a sequência');
assert.equal(T.streak({ '2026-03-01': 1, '2026-02-28': 1 }, '2026-03-01'), 2, 'atravessa a virada do mês');
assert.equal(T.lastDays({ '2026-10-14': 3 }, 7, '2026-10-14').length, 7);
assert.equal(T.lastDays({ '2026-10-14': 3 }, 7, '2026-10-14')[6].count, 3);

// ── Revisão espaçada dos cartões ──
const now = Date.UTC(2026, 9, 14);
let r = T.gradeReview(undefined, true, now);
assert.equal(r.level, 1); assert.equal(r.next, now + 86400000); assert.equal(r.count, 1);
r = T.gradeReview(r, true, now); assert.equal(r.level, 2);
r = T.gradeReview(r, false, now); assert.equal(r.level, 0); assert.equal(r.next, now, '“de novo” mantém a frase pendente');
r = T.gradeReview({ level: 5, count: 9 }, true, now); assert.equal(r.level, 5, 'nível máximo é 5 (30 dias)');

// ── Busca universal ──
const index = T.buildIndex(D, G, norm);
const terms = D.atlas.reduce((n, f) => n + f.terms.length, 0);
const lessons = D.courses.reduce((n, c) => n + c.modules.length, 0);
assert.equal(index.length, 10 + D.courses.length + lessons + terms + D.phrases.length + D.missions.length);
const top = q => T.search(index, q, norm)[0];
assert.equal(top('incidir').type, 'term'); assert.equal(top('incidir').label, 'incidir');
assert.equal(top('penumbra').label, 'penumbra');
assert.equal(top('teorias da comunicacao').type, 'course');
assert.equal(top('atlas descritivo').type, 'page');
assert.ok(T.search(index, 'lead de cena', norm).some(it => it.type === 'phrase' && it.go.phrase === 'leads-02'));
assert.ok(T.search(index, 'subjuntivo', norm).length >= 5, 'busca também no conteúdo das notas');
assert.equal(T.search(index, '   ', norm).length, 0);
assert.ok(T.search(index, 'a', norm).length <= 30, 'resultados limitados');
assert.ok(T.search(index, 'xyzxyz inexistente', norm).length === 0);

// ── Monte a frase ──
let seed = 3; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (const p of D.phrases.filter(p => p.note).slice(0, 60)) {
  const t = T.makeTiles(p.pt, rand);
  assert.equal(t.pool.length, t.tokens.length);
  if (t.tokens.length > 1) assert.ok(!t.pool.every((v, i) => v === i), 'nunca começa na ordem original');
  assert.equal(T.checkTiles({ ...t, placed: [...t.pool] }), t.pool.every((v, i) => t.tokens[v] === t.tokens[i]));
  assert.equal(T.checkTiles({ ...t, placed: t.tokens.map((_, i) => i) }), true);
}
// Palavras repetidas podem trocar de lugar sem errar a resposta
const dup = { tokens: ['a', 'casa', 'e', 'a', 'rua'], pool: [], placed: [3, 1, 2, 0, 4] };
assert.equal(T.checkTiles(dup), true);
assert.equal(T.checkTiles({ ...dup, placed: [1, 3, 2, 0, 4] }), false);
assert.equal(T.checkTiles({ ...dup, placed: [0, 1] }), false, 'frase incompleta não vale');

console.log('Interatividade: sequência, revisão, busca universal e Monte a frase OK');
