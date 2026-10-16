/* StoryLab v2.21: curadoria da Anatomia Universal e percepção. */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL(x,import.meta.url),'utf8');
const doc={handlers:[],addEventListener(type,fn){this.handlers.push({type,fn})}};
const sandbox={window:{},document:doc};
for(const n of ['trade-data.js','trade-object-data.js','trade-observation-data.js','trade-observation.js',
 'trade-precision-data.js','trade-precision.js','trade-academy-data.js','trade-academy.js',
 'trade-language-data.js','trade-tools.js','trade-object.js','trade-field.js','trade-hub.js'])
 vm.runInNewContext(read('./'+n),sandbox,{filename:n,timeout:5000});
const d=sandbox.window.STORYLAB_OBSERVATION_DATA,obs=sandbox.window.StoryLabObservation,hub=sandbox.window.StoryLabTrade;
const norm=x=>JSON.parse(JSON.stringify(x));
assert.equal(d.parts.length,4);
assert.equal(d.parts.flatMap(g=>g[2]).length,20);
assert.equal(d.relations.length,10);
assert.equal(d.senses.flatMap(g=>g[3]).length,15);
assert.equal(d.challenges.length,6);
assert.equal(new Set(d.relations.map(x=>x.id)).size,10);
assert.equal(new Set(d.relations.map(x=>x.geometry)).size,10,'desenho diferente para cada relação');
for(const group of d.parts){assert.equal(group[2].length,5);for(const p of group[2]){
 assert.equal(p.length,7);assert.ok(p[0]&&p[1]&&p[2]&&p[3]&&p[4].length>=30);
 assert.match(p[2],/[\u3400-\u9fff]/);
}}
for(const r of d.relations){assert.equal(r.frame.length,3);assert.ok(r.meaning.length>=38);assert.ok(r.question.length>=12);assert.match(obs.relationSVG(r),/<svg/)}
for(const g of d.senses){assert.equal(g[3].length,5);for(const p of g[3]){assert.equal(p.length,7);assert.ok(p[5].length>=38);assert.match(p[3],/[\u3400-\u9fff]/)}}
for(const q of d.challenges){assert.equal(q.options.length,3);assert.ok(q.correct>=0&&q.correct<3);}
const store={tradeSaved:[],tradeSeen:[],tradeObjectDraft:{subject:'Câmera',note:'Já observado.',attributes:[]},tradeObservationAnswers:{}};
let saves=0,renders=0;const copied=[],spoken=[];
const api={getStore:()=>store,save(){saves++},render(){renders++},copy(v){copied.push(v)},say(...v){spoken.push(v)},
 header:(_t,t)=>'<h1>'+t+'</h1>'};
hub.init(api);
function click(a,id=''){
 const e={preventDefault(){},target:{closest:selector=>selector==='[data-obs]'?{dataset:{obs:a,id}}:null}};
 for(const h of doc.handlers.filter(h=>h.type==='click'))h.fn(e);
}
assert.equal(hub.openTab('partes'),true);
let html=hub.render();
assert.match(html,/Nomeie a parte antes de julgar o objeto/);
assert.match(html,/base/);
assert.match(html,/circunda/);
assert.match(html,/role="img"/);
assert.match(html,/REGÊNCIA/);
click('group','juncao');click('part','0');
html=hub.render();
assert.match(html,/dobradiça/);
click('copy-part');assert.match(copied.at(-1),/hinge/);
click('speak-part','zh');assert.equal(spoken.at(-1)[1],'zh-CN');
click('relation','flank');
html=hub.render();assert.match(html,/ladeiam/);
assert.match(html,/Ladeia/i);
assert.notEqual(obs.relationSVG(d.relations[0]),obs.relationSVG(d.relations[1]));
click('copy-relation');assert.match(copied.at(-1),/flanks/);
click('studio-question','O batente foi medido?');
assert.match(store.tradeObjectDraft.note,/Já observado/);
assert.match(store.tradeObjectDraft.note,/O batente foi medido/);
assert.match(hub.render(),/Roteiro em cinco planos/);
assert.equal(hub.openTab('sentidos'),true);
html=hub.render();
assert.match(html,/Cor, luz e som/);
assert.match(html,/matiz/);
assert.match(html,/Desafio do olhar/i);
assert.doesNotMatch(html,/Distinção correta/);
click('sense','som');click('sense-term','1');
html=hub.render();
assert.match(html,/altura tonal/);
assert.match(html,/agudo não significa necessariamente alto volume/);
click('speak-sense','en');assert.equal(spoken.at(-1)[1],'en-US');
click('copy-sense');assert.match(copied.at(-1),/pitch/);
click('answer','c1:0');
assert.equal(store.tradeObservationAnswers.c1,0);
assert.match(hub.render(),/Revise a propriedade observada/);
click('answer','c1:1'); // primeira resposta preservada; sem alterar progresso retroativamente
assert.equal(store.tradeObservationAnswers.c1,0);
click('challenge','next');click('answer','c2:0');
assert.equal(store.tradeObservationAnswers.c2,0);
assert.match(hub.render(),/Distinção correta/);
assert.ok(saves>=3&&renders>=10);
const app=read('./app.js'),htmlIndex=read('./index.html'),build=read('./build_standalone.py'),cache=read('./generate_service_worker.py');
for(const s of ['tradeObservationAnswers:cleanTradeObservationAnswers(x.tradeObservationAnswers)',
 'tradeObservationAnswers:cleanTradeObservationAnswers(incoming.tradeObservationAnswers)'])assert.ok(app.includes(s),s);
assert.ok(htmlIndex.indexOf('trade-observation-data.js')<htmlIndex.indexOf('trade-observation.js'));
assert.ok(htmlIndex.indexOf('trade-observation.js')<htmlIndex.indexOf('trade-hub.js'));
assert.match(build,/trade_observation_data=/);
assert.match(cache,/'trade-observation-data.js', 'trade-observation.js'/);
console.log('StoryLab v2.21: anatomia, 10 ilustrações relacionais, cor/luz/som, desafios e Estúdio/backup — OK');
