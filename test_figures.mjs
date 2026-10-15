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
  assert.ok(Array.isArray(figs) && figs.length >= 1 && figs.length <= 3, key);
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
// Escalas: a maioria das aulas ilustra a gradação do conceito com uma escala
const withScale = keys.filter(k => D.figures[k].some(f => ['spectrum', 'stairs', 'bars'].includes(f.type))).length;
// A quantidade de escalas é descritiva, não meta: a forma só é válida quando o conteúdo sustenta a ordenação.
console.log(`Esquemas: ${total} figuras em ${keys.length} aulas (${withScale} com escala), ${Object.keys(types).length} tipos — OK`);

// ── Esquemas do Atlas: cada rótulo é um termo real do campo ──
const A = D.atlasFigures;
assert.ok(A && Object.keys(A).length >= 12, 'esquemas do Atlas');
const ANAT = ['facade', 'vessel', 'jacket', 'bird', 'terrain', 'perspective', 'light', 'plan', 'face', 'street', 'room', 'wheel'];
const PANELS = ['faces', 'poses', 'density'];
const flat = Object.values(A).flat();
for (const [k, figs] of Object.entries(A)) {
  const field = D.atlas[Number(k)];
  assert.ok(field && figs.length >= 1 && figs.length <= 3, 'campo ' + k);
  for (const f of figs) {
    assert.ok(F.TYPES.includes(f.type), k);
    const names = F.names(f);
    assert.ok(names.length >= (f.type === 'thirds' ? 1 : 3), 'campo ' + k + ': termos no esquema');
    for (const n of names) assert.ok(field.terms.includes(n), `${field.title}: “${n}” não é termo do campo`);
    const svg = F.svg(f, { active: names[0] });
    assert.ok(!/NaN|undefined|Infinity/.test(svg), 'campo ' + k);
    if (f.type === 'anatomy') {
      assert.ok(ANAT.includes(f.shape), f.shape);
      assert.ok(f.labels.length >= 3, 'ao menos 3 peças rotuladas');
      assert.match(svg, /fig-lead/, 'linhas de chamada');
      assert.match(F.svg(f, { active: f.labels[0].t }), /fig-lead-on/, 'destaque do termo ativo');
    }
    if (f.type === 'spectrum') {
      // Escala legível: marcas em ordem, sem sobreposição, e legenda que explica o eixo
      const at = f.marks.map(m => m.at);
      assert.ok(at.every((v, i) => v >= 0.04 && v <= 0.96 && (i === 0 || v - at[i - 1] >= 0.16 - 1e-9)), `${field.title}: marcas da escala`);
      assert.ok(f.from.length <= 18 && f.to.length <= 18, 'polos da escala');
      assert.ok(f.caption.length >= 60, 'legenda da escala');
    }
  }
}
// Escalas: onde há gradação, o Atlas ilustra com escala
const scaleFields = Object.entries(A).filter(([, v]) => v.some(f => f.type === 'spectrum')).map(([k]) => Number(k));
assert.ok(scaleFields.length >= 22, 'campos com escala: ' + scaleFields.length);
assert.ok(ANAT.every(sh => flat.some(v => v.shape === sh)), 'todas as formas usadas');
assert.ok(PANELS.every(t => flat.some(v => v.type === t)), 'todos os painéis usados');
// Leitor de tela: o rótulo do SVG lista os termos do esquema
const fa = A['7'][0];
assert.match(F.svg(fa), /aria-label="Partes de uma fachada\. Termos no esquema: frontão, /);
assert.match(F.render(fa), /data-fig-zoom/, 'botão Ampliar');
// Densidade cresce de painel para painel; expressões e posturas têm o mesmo número de termos que figuras
const dens = A['29'].find(f => f.type === 'density').panels.map(p => p.n);
assert.deepEqual(dens, [...dens].sort((a, b) => a - b));
assert.equal(A['17'].find(f => f.faces).faces.length, 6); assert.equal(A['18'].find(f => f.poses).poses.length, 6);
console.log(`Esquemas do Atlas: ${Object.keys(A).length} campos, ${flat.length} figuras, ${scaleFields.length} com escala, rótulos = termos — OK`);

// ── Fraseoteca: escala das famílias ──
const pf = D.phrasesFigures;
assert.ok(Array.isArray(pf) && pf.length === 1 && pf[0].type === 'spectrum');
const at = pf[0].marks.map(m => m.at);
assert.ok(at.every((v, i) => i === 0 || v - at[i - 1] >= 0.16 - 1e-9), 'marcas da escala das famílias');
assert.ok(!/NaN|undefined/.test(F.svg(pf[0])));
console.log('Fraseoteca: escala das famílias OK');
