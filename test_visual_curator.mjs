/** Curadoria automatizada dos diagramas: forma, legibilidade semântica,
 *  integridade de SVG, cores do aprendizado e assertivas editoriais.
 *  Não substitui inspeção visual em navegador e revisão de especialista.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name,import.meta.url),'utf8');
const D = JSON.parse(read('./content/storylab_data.json'));
const W = {};
vm.runInNewContext(read('./illustrations.js'),{window:W});
const F=W.StoryLabFigures;
const all=[
 ...Object.values(D.figures).flat(),
 ...Object.values(D.atlasFigures).flat(),
 ...(D.phrasesFigures||[])
];
assert.equal(all.length,351,'cobertura da coleção vigente de diagramas');
assert.equal(Object.keys(D.figures).length,172,'uma coleção por unidade integral');

const types=new Set(),markers=new Set();
let spectra=0;
for(const [i,f] of all.entries()){
 types.add(f.type);
 const svg=F.svg(f);
 assert.match(svg,/^<svg class="fig-svg" viewBox="0 0 480 \d+"/,f.title);
 assert.match(svg,/<title id="fig-title-\d+">/,f.title+' possui título acessível');
 assert.match(svg,/<desc id="fig-desc-\d+">/,f.title+' possui descrição');
 assert.ok(!/NaN|undefined|Infinity/.test(svg),f.title+' sem coordenadas inválidas');
 const id=svg.match(/<marker id="([^"]+)"/)?.[1];
 assert.ok(id && !markers.has(id),f.title+' possui ID SVG único');
 markers.add(id);
 const rendered=F.render(f);
 assert.match(rendered,/<figcaption>/);
 assert.ok(!rendered.includes('<script'));
 if(f.type==='spectrum'){
  spectra++;
  assert.ok(f.marks.length>=3&&f.marks.length<=6);
  assert.ok(f.marks.every(m=>typeof m.t==='string'&&m.t.length>0&&!Object.hasOwn(m,'at')),
    f.title+' não usa percentuais inventados para a posição das marcas');
  assert.match(svg,/PROGRESSÃO QUALITATIVA/,f.title);
  assert.ok(!svg.includes('fig-grad'),f.title+' não representa dados não medidos como gradiente');
 }
}
assert.ok(types.size>=17);
assert.equal(spectra,148);

const investig=D.figures['jornalismo-investigativo:3'].find(f=>f.type==='spectrum');
assert.deepEqual(investig.marks.map(m=>m.t),
 ['Não confirmou','Pode sugerir','Indica','Sustenta com evidências']);
assert.ok(!/inequívoc[ao]/i.test(D.figures['teorias-comunicacao:0'].find(f=>f.type==='spectrum').to));
const video=D.figures['historia-jornalismo:1'].find(f=>f.type==='spectrum');
assert.ok(!/imagem como prova/i.test(JSON.stringify(video)));
const camera=D.figures['linguagem-cinematografica:1'].find(f=>f.type==='spectrum');
assert.match(camera.caption,/não existe relação automática/i);
const license=D.figures['legislacao-direitos:2'].find(f=>f.type==='spectrum');
assert.match(license.caption,/exceções podem existir/i);
const wheel=D.atlasFigures['3'].find(f=>f.shape==='wheel');
assert.match(wheel.caption,/luminosidade mais alta e saturação menor/i);
const lightSource=read('./illustrations.js');
assert.match(lightSource,/M80 35L100 210/,'o raio rasante deve acompanhar tangencialmente a superfície');

const css=read('./style.css');
assert.match(css,/--study-active:#24594d/);
assert.match(css,/--study-active:#b4dac9/);
assert.match(css,/\.ling-figure-controls \.ling-diagram-button\.active/);
assert.match(css,/\.ling-diagram-button:focus-visible/);
assert.match(css,/\.fig-stage-active/);
function luminance(hex){
 const n=hex.replace('#','');
 return [0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255)
  .map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4)
  .reduce((total,v,i)=>total+v*[.2126,.7152,.0722][i],0);
}
function contrast(a,b){
 const x=luminance(a),y=luminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
assert.ok(contrast('#24594d','#fffefa')>=4.5,'seleção clara com contraste AA');
assert.ok(contrast('#b4dac9','#172d27')>=4.5,'seleção escura com contraste AA');

const chapters=JSON.parse(read('./content/linguistics_chapters.json'));
const WL={STORYLAB_LINGUISTICS:chapters};
vm.runInNewContext(read('./linguistics-lab.js'),{window:WL,document:{addEventListener(){}}});
for(const ch of chapters){
 const steps=[0,1,2].map(i=>WL.StoryLabLinguistics.diagramSvg(ch,i));
 assert.equal(new Set(steps).size,3,ch.id+' tem três perspectivas distintas');
}
assert.match(WL.StoryLabLinguistics.diagramSvg(chapters.find(c=>c.visual.kind==='stress'),1),
 /não representa uma medição acústica/);
assert.match(WL.StoryLabLinguistics.diagramSvg(chapters.find(c=>c.visual.kind==='act'),2),
 /REAÇÃO POSSÍVEL/);
console.log('Curadoria visual: 351 SVGs, 148 progressões sem falsa precisão, 8 diagramas de 3 estados, contraste AA — OK');
