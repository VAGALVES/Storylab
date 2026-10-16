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
  assert.match(app.diagramSvg(c,0),/<title id="ling-diagram-title">/,'Título SVG acessível');
  assert.match(app.diagramSvg(c,0),/<desc id="ling-diagram-desc">/,'Descrição SVG acessível');
  assert.match(app.diagramSvg(c,1),/STORYLAB/);
  assert.match(app.diagramSvg(c,2),/<\/svg>/);
}
// Curadoria pedagógica: o traçado dos três estados precisa mudar, não só a legenda.
const expectedStages={
 voice:[/Pulmões/,/PATO/,/Realização \[tʃ\]/],
 stress:[/A VITRINE/,/MUDOU/,/ONTEM/],
 syntax:[/SINTAGMA NOMINAL/,/ORAÇÃO RELATIVA/,/FRASE 2/],
 layers:[/AFIRMAÇÃO LITERAL/,/INFERÊNCIA/,/CHECAGEM/],
 camera:[/Olhando para o norte/,/Olhando para o sul/,/Olhando para leste/],
 chain:[/FACHADAS/,/Retomada lexical/,/NA SOMBRA/],
 act:[/FORMA INTERROGATIVA/,/Pedido indireto/,/REAÇÃO POSSÍVEL B/],
 turns:[/REPÓRTER/,/RESPOSTA PARCIAL/,/AUTORREPARO/]
};
for(const ch of chapters){
 const stages=[0,1,2].map(i=>app.diagramSvg(ch,i));
 const geometry=stages.map(s=>s.replace(/aria-label="[^"]*"/g,'').replace(/<text[^>]*>[^<]*<\/text>/g,''));
 assert.equal(new Set(geometry).size,3,ch.id+' deve ter três composições gráficas distintas');
 stages.forEach((svg,i)=>{
  assert.match(svg,expectedStages[ch.visual.kind][i],ch.id+' etapa '+(i+1));
  assert.match(svg,new RegExp('0'+(i+1)+' ·|Etapa '+(i+1)),ch.id+' precisa contextualizar a etapa');
 });
}

// Regressões encontradas em Android: três estados precisam ser visualmente distintos.
const syntaxChapter=chapters.find(x=>x.visual.kind==='syntax');
const deixisChapter=chapters.find(x=>x.visual.kind==='camera');
const syntaxStages=[0,1,2].map(i=>app.diagramSvg(syntaxChapter,i));
const deixisStages=[0,1,2].map(i=>app.diagramSvg(deixisChapter,i));
assert.equal(new Set(syntaxStages).size,3,'Sintaxe: as três etapas precisam redesenhar o mecanismo');
assert.equal(new Set(deixisStages).size,3,'Dêixis: etapas 01 e 03 não podem repetir o desenho');
assert.match(syntaxStages[0],/SINTAGMA NOMINAL/);
assert.match(syntaxStages[1],/ORAÇÃO RELATIVA/);
assert.match(syntaxStages[2],/FRASE 2/);
assert.match(deixisStages[0],/Olhando para o norte/);
assert.match(deixisStages[1],/Olhando para o sul/);
assert.match(deixisStages[2],/Olhando para leste/);
assert.match(deixisStages[0],/cx="380" cy="259"/);
assert.match(deixisStages[1],/cx="380" cy="68"/);
assert.match(deixisStages[2],/cx="51" cy="185"/);
assert.match(deixisStages[2],/<line x1="75" y1="185" x2="281" y2="185"/,
 'Dêixis 03: eixo leste deve atravessar a loja antes do edifício');

// A seleção muda também a descrição pedagógica e a acessibilidade.
event('chapter',{index:'2'});
assert.match(app.render(),/01 · Oração simples/);
event('diagram',{index:'1'});
assert.match(app.render(),/02 · Oração relativa/);
event('diagram',{index:'2'});
assert.match(app.render(),/03 · Reformulação/);
event('chapter',{index:'4'});
assert.match(app.render(),/01 · Câmera ao sul/);
event('diagram',{index:'1'});
assert.match(app.render(),/02 · Câmera ao norte/);
// Simulação de DOM real: a troca mantém o mesmo controle, o foco e a escuta.
const svgNode={outerHTML:''};
const noteNode={textContent:''};
const buttons=[0,1,2].map(()=>({
  pressed:null,active:false,
  classList:{toggle(name,enabled){assert.equal(name,'active');this.owner.active=enabled}},
  setAttribute(name,value){assert.equal(name,'aria-pressed');this.pressed=value}
}));
buttons.forEach(b=>b.classList.owner=b);
const figure={
  querySelector(selector){return selector==='.ling-diagram'?svgNode:selector==='figcaption strong'?noteNode:null},
  querySelectorAll(selector){return selector==='.ling-diagram-button'?buttons:[]}
};
const beforeLocalSwitch=renderCount;
const diagramButton={
  dataset:{lingAction:'diagram',index:'2'},
  closest(selector){return selector==='[data-ling-action]'?this:selector==='.ling-figure'?figure:null}
};
callbacks.click.find(h=>!h.capture).fn({target:diagramButton,preventDefault(){}});
assert.equal(renderCount,beforeLocalSwitch,'Troca local não redesenha toda a página');
assert.match(svgNode.outerHTML,/Olhando para leste/,'A geometria muda no DOM');
assert.match(noteNode.textContent,/Câmera a oeste/,'A descrição acompanha a geometria');
assert.deepEqual(buttons.map(b=>b.pressed),['false','false','true']);
assert.deepEqual(buttons.map(b=>b.active),[false,false,true]);
event('diagram',{index:'2'});
assert.match(app.render(),/03 · Câmera a oeste/);
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
