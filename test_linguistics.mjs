import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name,import.meta.url),'utf8');
const chapters = JSON.parse(read('./content/linguistics_chapters.json'));
const main = JSON.parse(read('./content/storylab_data.json'));
const known = new Set(main.courses.map(x => x.id));
assert.equal(chapters.length,8,'A trilha inicial possui 8 dossiês integrais');
assert.equal(new Set(chapters.map(c=>c.id)).size,8);
assert.equal(chapters.reduce((n,c)=>n+c.sections.length,0),32);
assert.equal(chapters.reduce((n,c)=>n+c.terms.length,0),24);
for(const c of chapters){
  assert.equal(c.sections.length,4,c.id+' contém quatro explicações');
  assert.equal(c.terms.length,3,c.id+' possui glossário');
  assert.equal(c.quiz.options.length,3,c.id+' possui checagem de compreensão');
  assert.ok(c.quiz.correct >= 0 && c.quiz.correct < 3);
  assert.ok(c.sections.every(s=>s.body.length>220 && s.example.length>55));
  assert.ok(c.sections.every(s=>s.title && s.body && s.example));
  assert.ok(c.related.length>=3);
  assert.ok(c.related.every(id=>known.has(id)));
  assert.ok(c.readings.every(r=>r.url.startsWith('https://')));
  assert.ok(c.exercise.steps.length===3);
  assert.ok(c.visual.before && c.visual.after && c.visual.why && c.visual.caption);
}
const svgKinds = new Set(chapters.map(x=>x.visual.kind));
assert.equal(svgKinds.size,8,'Um desenho específico para cada fenômeno');
const parsed = read('./linguistics-data.js').trim()
  .replace(/^window\.STORYLAB_LINGUISTICS\s*=\s*/,'').replace(/;$/,'');
assert.deepEqual(JSON.parse(parsed),chapters);

const callbacks={};
const win={STORYLAB_LINGUISTICS:chapters};
const doc={addEventListener(type,fn,capture=false){(callbacks[type]??=[]).push({fn,capture})}};
vm.runInNewContext(read('./linguistics-lab.js'),{window:win,document:doc});
const app=win.StoryLabLinguistics;
assert.ok(app);
const store={linguisticsDone:[],linguisticsAnswers:{},linguisticsNotes:{}};
let renderCount=0,lastNavigation=null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
app.init({D:main,getStore:()=>store,save(){},render(){renderCount++},
  navigate(...args){lastNavigation=args;},esc,ico:x=>x,
  header:(_a,t)=>'<h1>'+t+'</h1>',
  stat:(label,n)=>'<p>'+label+':'+n+'</p>'});
function event(action,attrs={}){
  const button={dataset:{lingAction:action,...attrs}};
  const evt={preventDefault(){},stopPropagation(){},
    target:{closest(selector){return selector==='[data-ling-action]'||selector==='[data-ling-action="jump"]'&&action==='jump'?button:null}}};
  for(const cb of (callbacks.click||[]).filter(x=>x.capture))cb.fn(evt);
  for(const cb of (callbacks.click||[]).filter(x=>!x.capture))cb.fn(evt);
}
let html=app.render();
assert.match(html,/Academia|Linguística Aplicada/);
assert.match(html,/ESQUEMA VISUAL EXPLICADO/);
assert.match(html,/CAMADA TEÓRICA/);
assert.match(html,/Fonética e fonologia/);
for(const c of chapters){
  assert.match(app.diagramSvg(c,0),/<svg[^>]+role="img"/);
  assert.match(app.diagramSvg(c,1),/STORYLAB/);
  assert.match(app.diagramSvg(c,2),/<\/svg>/);
}
event('chapter',{index:'3'});
html=app.render();
assert.match(html,/Pragmática/);
assert.match(html,/Dito ≠ inferido/);
event('diagram',{index:'2'});
html=app.render();
assert.match(html,/aria-pressed="true"/);
event('tab',{tab:'practice'});
html=app.render();
assert.match(html,/CHECAGEM DE COMPREENSÃO/);
event('answer',{index:'2'});
assert.equal(store.linguisticsAnswers['pragmatica-implicatura'].selected,2);
event('complete');
assert.ok(store.linguisticsDone.includes('pragmatica-implicatura'));
event('complete');
assert.equal(store.linguisticsDone.length,0);
const lesson=app.relatedTo('linguagem-descritiva');
assert.match(lesson,/Abrir linguística/);
event('related',{course:'comunicacao-verbal'});
assert.deepEqual(JSON.parse(JSON.stringify(lastNavigation)),['course',{courseId:'comunicacao-verbal'}]);
assert.ok(renderCount>=6);
assert.match(read('./style.css'),/\.ling-diagram/);
console.log('Academia da Linguagem: 8 diagramas, 32 explicações, teste de compreensão, vínculos e progresso OK');
