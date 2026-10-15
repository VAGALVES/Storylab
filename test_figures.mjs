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
