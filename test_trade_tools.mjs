/* StoryLab · suíte de regressão do repertório industrial v2.18. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=x=>readFileSync(new URL(x,import.meta.url),'utf8');
const sandbox={
 window:{},
 document:{listeners:[],addEventListener(type,fn){this.listeners.push({type,fn})}}
};
for(const file of ['./trade-data.js','./trade-academy-data.js','./trade-language-data.js','./trade-tools.js','./trade-academy.js','./trade-field.js','./trade-hub.js']){
 vm.runInNewContext(read(file),sandbox,{filename:file,timeout:4500});
}
const {StoryLabTrade:hub,StoryLabTradeTools:tools,StoryLabTradeField:field,
 StoryLabTradeAcademy:academia,STORYLAB_TRADE_LANGUAGE:L,STORYLAB_TRADE_ACADEMY:A}=sandbox.window;
const normal=x=>JSON.parse(JSON.stringify(x));
assert.equal(L.groups.length,5);
assert.equal(L.patterns.length,20);
assert.equal(new Set(L.patterns.map(x=>x.id)).size,20);
for(const p of L.patterns){
 assert.ok(L.groups.some(g=>g[0]===p.group),p.id);
 assert.ok(p.pt.length>=20&&p.en.length>=20&&p.zh.length>=5&&p.py.length>=12,p.id);
 assert.match(p.zh,/[\u3400-\u9fff]/,p.id);
 assert.equal(p.frame.length,3,p.id);
 assert.ok(p.frame.every(x=>x.length>=4));
 assert.ok(p.rule.length>=65&&p.trap.length>=40,p.id);
}
const store={
 tradeSaved:[],tradeSeen:[],tradeFieldNotes:[],tradeAcademyDone:[],tradeAcademyAnswers:{},
 tradeLanguageReview:{},tradeVisitProgress:{}
};
let saves=0,renders=0,spoken=[],copied=[];
const api={
 getStore:()=>store,save(){saves++},render(){renders++},
 header(_label,title){return '<h1>'+title+'</h1>'},
 say(...v){spoken.push(v)},copy(v){copied.push(v)}
};
hub.init(api);
function fire(type,target){
 const event={target,preventDefault(){}};
 for(const l of sandbox.document.listeners.filter(x=>x.type===type))l.fn(event);
}
function click(action,id=''){
 fire('click',{closest:s=>s==='[data-tt]'?{dataset:{tt:action,id}}:null});
}
function change(selector,value,extra={}){
 fire('change',{value,checked:!!extra.checked,dataset:{ttCheck:extra.check||''},matches:s=>s===selector});
}
assert.match(hub.render(),/APRENDER/);
assert.match(hub.render(),/COMUNICAR/);
assert.match(hub.render(),/INVESTIGAR/);
assert.equal(hub.openTab('linguagem'),true);
assert.match(hub.render(),/Laboratório de Linguagem Técnica/);
assert.match(hub.render(),/Consist of/);
assert.match(hub.render(),/REFERENTE/);
click('training');
assert.match(hub.render(),/Revelar resposta EN \+ 中文/);
click('reveal');
assert.match(hub.render(),/The assembly consists of/);
click('speak','l01:en');
assert.equal(spoken.at(-1)[1],'en-US');
click('speak','l01:zh');
assert.equal(spoken.at(-1)[1],'zh-CN');
click('copy','l01');
assert.match(copied.at(-1),/Gāi zǔjiàn/);
click('grade','l01:good');
assert.equal(store.tradeLanguageReview.l01.level,1);
assert.ok(store.tradeLanguageReview.l01.next>Date.now()+80000000);
click('reveal');
click('grade','l01:again');
assert.equal(store.tradeLanguageReview.l01.level,0);
click('due');
assert.match(hub.render(),/Apenas revisões/);
click('training');
click('pattern','l20');
assert.match(hub.render(),/Result in/);
assert.equal(tools.phases.length,4);
assert.equal(tools.phases.flatMap(p=>p.steps).length,16);
assert.equal(new Set(tools.phases.flatMap(p=>p.steps.map(s=>s[0]))).size,16);
hub.openTab('comparar');
assert.match(hub.render(),/Precisamos de dois registros/);
assert.equal(field.startSector('produto','eletronicos'),true);
assert.equal(field.startSector('produto','renovaveis'),true);
const [solar,chip]=store.tradeFieldNotes;
solar.title='<script>alert("oops")</script>';
chip.title='Sensor digital';
solar.entries.desempenho={basis:'declarado',text:'Eficiência de 85% segundo o vendedor; sem ensaio.',evidence:''};
chip.entries.desempenho={basis:'medido',text:'Consumo medido em 5 W durante um ensaio.',evidence:'Caderno de testes interno'};
hub.openTab('comparar');
let html=hub.render();
assert.match(html,/especializações são diferentes/);
assert.match(html,/Declaração do fornecedor/);
assert.match(html,/Medição registrada/);
assert.match(html,/Não apurado neste dossiê/);
assert.match(html,/Caderno de testes interno/);
assert.doesNotMatch(html,/<script>alert/,'nomes de usuário sempre escapados');
assert.match(html,/&lt;script&gt;/);
click('copy-compare');
assert.match(copied.at(-1),/STORYLAB \| COMPARAÇÃO/);
assert.match(copied.at(-1),/Eficiência de 85% segundo o vendedor/);
assert.match(copied.at(-1),/Medição registrada/);
hub.openTab('visita');
html=hub.render();
assert.match(html,/Modo Visita Profissional/);
assert.match(html,/0 \/ 16/);
change('[data-tt-check]',undefined,{checked:true,check:'objetivo'});
assert.deepEqual(normal(store.tradeVisitProgress[solar.id]),['objetivo']);
assert.match(hub.render(),/1 \/ 16/);
click('phase','demonstracao');
assert.match(hub.render(),/condições e unidade/);
change('[data-tt-check]',undefined,{checked:true,check:'versao'});
assert.deepEqual(normal(store.tradeVisitProgress[solar.id]),['objetivo','versao']);
change('[data-tt-check]',undefined,{checked:false,check:'objetivo'});
assert.deepEqual(normal(store.tradeVisitProgress[solar.id]),['versao']);
click('open-dossiers');
assert.match(hub.render(),/Dossiês de visitas e produtos/);
let aHtml=academia.academy();
assert.match(aHtml,/trade-concept-map/);
assert.match(aHtml,/Problema e contexto de uso/);
aHtml=academia.sectors();
assert.match(aHtml,/trade-concept-map/);
assert.match(aHtml,/Armazenamento/);
assert.ok(saves>=5&&renders>=10);
const app=read('./app.js'),index=read('./index.html'),css=read('./style.css');
for(const name of ['tradeLanguageReview:cleanTradeLanguageReview','tradeVisitProgress:cleanTradeVisitProgress',
 'tradeSaved:cleanTradeIds(incoming.tradeSaved)','tradeAcademyDone:cleanTradeAcademyDone(incoming.tradeAcademyDone)',
 'tradeFieldNotes:cleanTradeFieldNotes(incoming.tradeFieldNotes)'])assert.ok(app.includes(name),name+' no backup');
assert.ok(index.indexOf('trade-language-data.js')<index.indexOf('trade-tools.js'));
assert.ok(index.indexOf('trade-tools.js')<index.indexOf('trade-hub.js'));
assert.match(css,/\.tt-syntax-node/);
assert.match(css,/\.trade-concept-map/);
const preCache=read('./generate_service_worker.py');
assert.ok(preCache.includes("'trade-language-data.js', 'trade-tools.js'"));
assert.ok(read('./build_standalone.py').includes('trade_tools'));
console.log('StoryLab v2.18: 20 padrões trilíngues; regência; prática, fala e revisão; comparador de evidências; 16 checks em 4 fases; diagramas acadêmicos; export/import e PWA — OK');
