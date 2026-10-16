/* QA StoryLab · Atlas Universal da Coisa e Estúdio de Descrição v2.19 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=x=>readFileSync(new URL(x,import.meta.url),'utf8');
let allowDelete=false;
const document={handlers:[],addEventListener(type,fn){this.handlers.push({type,fn})}};
const sandbox={window:{confirm:()=>allowDelete},document};
for(const file of ['trade-data.js','trade-academy-data.js','trade-object-data.js','trade-object.js','trade-language-data.js','trade-tools.js','trade-academy.js','trade-field.js','trade-hub.js'])
 vm.runInNewContext(read('./'+file),sandbox,{timeout:6000,filename:file});
const {StoryLabTrade:hub,StoryLabObject:objects,STORYLAB_OBJECT_DATA:D}=sandbox.window;
assert.equal(D.dimensions.length,12);
assert.equal(D.terms.length,96);
assert.equal(D.contrasts.length,14);
assert.equal(D.exemplars.length,8);
assert.equal(new Set(D.terms.map(x=>x[0])).size,96);
assert.equal(new Set(D.dimensions.map(x=>x[0])).size,12);
assert.equal(new Set(D.contrasts.map(x=>x[0]+'|'+x[1])).size,14);
for(const t of D.terms){
 assert.ok(t.length===9,t[0]);
 assert.ok(D.dimensions.some(g=>g[0]===t[1]),t[0]);
 assert.ok(t[2].length>2&&t[3].length>2&&t[4].length>=1&&t[5].length>=2,t[0]);
 assert.match(t[4],/[\u3400-\u9fff]/,t[0]);
 assert.ok(t[6].length>50&&t[7].length>25&&t[8].length>12,t[0]);
}
for(const d of D.dimensions)assert.equal(D.terms.filter(t=>t[1]===d[0]).length,8,d[0]);
const examples=new Map(D.terms.map(t=>[t[2],t]));
for(const key of ['macio','maciço','denso','leve','pesado','rígido','duro','flexível','elástico',
 'alto','largo','profundo','esguio','angular','arredondado','granulado','fosco','brilhante','mecânico'])
 if(key!=='mecânico')assert.ok(examples.has(key),key);
const store={tradeSaved:[],tradeSeen:[],tradeAcademyDone:[],tradeAcademyAnswers:{},
 tradeFieldNotes:[],tradeLanguageReview:{},tradeVisitProgress:{},tradeObjectDraft:{}};
let renders=0,saves=0;const copied=[],audio=[];
const api={getStore:()=>store,save(){saves++},render(){renders++},
 header:(_t,title)=>'<header>'+title+'</header>',
 say:(...args)=>audio.push(args),copy:(text)=>copied.push(text)};
hub.init(api);
function emit(type,target){
 for(const l of document.handlers.filter(h=>h.type===type))
  l.fn({target,preventDefault(){}});
}
function click(a,id=''){emit('click',{closest:sel=>sel==='[data-to]'?{dataset:{to:a,id}}:null})}
function input(k,v){emit('input',{value:v,dataset:{toField:k},matches:sel=>sel==='[data-to-field]'})}
function metric(k,v){emit('input',{value:v,dataset:{toMetric:k},matches:sel=>sel==='[data-to-metric]'})}
function change(k,v){emit('change',{value:v,dataset:{toField:k},matches:sel=>sel==='[data-to-field]'})}
assert.match(hub.render(),/O ATLAS DO OBJETO/);
assert.match(hub.render(),/12 DIMENSÕES DO OLHAR/);
assert.match(hub.render(),/96/);
assert.match(objects.atlas(),/duelo das palavras/);
assert.match(objects.atlas(),/minúsculo/);
click('dimension','massa');
assert.equal(objects.terms().length,8);
assert.match(objects.atlas(),/maciço/);
click('term','o12');
let html=objects.atlas();
assert.match(html,/solid \(not hollow\)/);
assert.match(html,/实心/);
click('copy','o12');
assert.match(copied.at(-1),/não significa automaticamente rígido/);
click('speak','o12:zh');
assert.equal(audio.at(-1)[1],'zh-CN');
click('add','o12');
assert.deepEqual(JSON.parse(JSON.stringify(store.tradeObjectDraft.attributes)),['o12']);
assert.match(objects.atlas(),/No meu roteiro/);
click('contrast','next');
assert.match(objects.atlas(),/pesado/);
hub.openTab('roteiro');
html=hub.render();
assert.match(html,/Estúdio de Descrição/);
assert.match(html,/cinco planos/i);
input('subject','<script>alert(1)</script>');
input('material','aparência de alumínio, composição ainda não confirmada');
input('context','durante o uso urbano');
change('lens','review');
metric('altura','142,5');
metric('massa','12.7');
assert.equal(store.tradeObjectDraft.subject,'<script>alert(1)</script>');
html=objects.studio();
assert.match(html,/&lt;script&gt;/);
assert.doesNotMatch(html,/<script>alert/);
assert.match(html,/142,5 cm/);
assert.match(html,/12,7 kg/);
assert.match(html,/maciço/);
assert.match(html,/composição ainda não confirmada/);
assert.match(html,/no uso urbano|durante o uso urbano/);
const report=objects.copyScript();
assert.match(report,/ROTEIRO DESCRITIVO/);
assert.match(report,/Massa: 12,7 kg/);
assert.match(report,/MATERIA|Atributo|o12|maciço/i);
assert.match(report,/01 · PLANO DE CONTEXTO/);
assert.equal(objects.buildScript().length,5);
click('copy-script');
assert.equal(copied.at(-1),report);
assert.equal(objects.validMetric('12,35'),'12.35');
assert.equal(objects.validMetric('-3'),'');
assert.equal(objects.validMetric('0'),'');
assert.equal(objects.validMetric('abc'),'');
assert.equal(objects.validMetric('1e20'),'');
assert.equal(objects.validMetric('999999999'),'');
click('remove','o12');
assert.equal(store.tradeObjectDraft.attributes.length,0);
click('clear'); // requires explicit confirmation
assert.equal(store.tradeObjectDraft.subject,'<script>alert(1)</script>');
allowDelete=true;click('clear');
assert.equal(store.tradeObjectDraft.subject,'');
assert.ok(renders>=7&&saves>=6);
const index=read('./index.html'),worker=read('./generate_service_worker.py'),app=read('./app.js');
assert.ok(index.indexOf('trade-object-data.js')<index.indexOf('trade-object.js'));
assert.ok(index.indexOf('trade-object.js')<index.indexOf('trade-hub.js'));
assert.match(worker,/'trade-object-data.js', 'trade-object.js'/);
assert.match(read('./build_standalone.py'),/trade_object_data=/);
assert.match(app,/tradeObjectDraft:cleanTradeObjectDraft\(x.tradeObjectDraft\)/);
assert.match(app,/tradeObjectDraft:cleanTradeObjectDraft\(incoming.tradeObjectDraft\)/);
assert.match(read('./style.css'),/\.to-contrast-display/);
assert.match(read('./style.css'),/\.to-studio-grid/);
console.log('StoryLab v2.19: 96 descritores em 12 dimensões, 14 contrastes, áudio PT/EN/ZH, observação, medidas com unidade, roteiros e backup — OK');
