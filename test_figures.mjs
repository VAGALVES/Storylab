import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const D = JSON.parse(read('./content/storylab_data.json'));
const w = {};
vm.runInNewContext(read('./illustrations.js'), { window: w });
const F = w.StoryLabFigures;

// Toda aula integral tem 1 ou 2 esquemas, e cada esquema desenha um SVG válido
const keys = Object.keys(D.deepLessons);
assert.deepEqual([...Object.keys(D.figures)].sort(), [...keys].sort(), 'um conjunto de esquemas por aula');
let total = 0;
const types = {};
for (const key of keys) {
  const figs = D.figures[key];
  assert.ok(Array.isArray(figs) && figs.length >= 1 && figs.length <= 2, key);
  for (const f of figs) {
    total++;
    types[f.type] = (types[f.type] || 0) + 1;
    assert.ok(F.TYPES.includes(f.type), key + ': tipo ' + f.type);
    assert.ok(f.title && f.title.length <= 70, key + ': título');
    assert.ok(f.caption && f.caption.length >= 40, key + ': legenda');
    const svg = F.svg(f);
    assert.match(svg, /^<svg class="fig-svg" viewBox="0 0 480 \d+"/, key);
    assert.ok(!/NaN|undefined|Infinity/.test(svg), key + ': coordenadas inválidas');
    const html = F.render(f);
    assert.match(html, /<figure class="fig">/);
    assert.ok(!html.includes('<script'), 'sem código embutido');
  }
}
// Texto é escapado
assert.ok(!F.render({ type: 'hub', title: '<b>', caption: 'x'.repeat(50), center: '<i>', nodes: [{ t: '&' }, { t: 'a' }, { t: 'b' }] }).includes('<b>'));
assert.deepEqual([...F.wrap('uma frase curta para quebrar em linhas', 12)], ['uma frase', 'curta para', 'quebrar em', 'linhas']);
assert.ok(Object.keys(types).length >= 8, 'variedade de tipos');
console.log(`Esquemas: ${total} figuras em ${keys.length} aulas, ${Object.keys(types).length} tipos — OK`);

// ── Esquemas do Atlas: cada rótulo é um termo real do campo ──
const A = D.atlasFigures;
assert.ok(A && Object.keys(A).length >= 12, 'esquemas do Atlas');
const ANAT = ['facade', 'vessel', 'jacket', 'bird', 'terrain', 'perspective', 'light', 'plan'];
for (const [k, figs] of Object.entries(A)) {
  const field = D.atlas[Number(k)];
  assert.ok(field && figs.length === 1, 'campo ' + k);
  const f = figs[0];
  assert.ok(F.TYPES.includes(f.type), k);
  const names = [...(f.labels || []).map(l => l.t), ...(f.marks || []).map(m => m.t)];
  for (const n of names) assert.ok(field.terms.includes(n), `${field.title}: “${n}” não é termo do campo`);
  const svg = F.svg(f, { active: names[0] });
  assert.ok(!/NaN|undefined|Infinity/.test(svg), 'campo ' + k);
  if (f.type === 'anatomy') {
    assert.ok(ANAT.includes(f.shape), f.shape);
    assert.ok(f.labels.length >= 3, 'ao menos 3 peças rotuladas');
    assert.match(svg, /fig-lead/, 'linhas de chamada');
    assert.match(F.svg(f, { active: f.labels[0].t }), /fig-lead-on/, 'destaque do termo ativo');
  }
}
assert.ok(ANAT.every(sh => Object.values(A).some(v => v[0].shape === sh)), 'todas as formas usadas');
console.log(`Esquemas do Atlas: ${Object.keys(A).length} campos, ${ANAT.length} anatomias, rótulos = termos — OK`);
