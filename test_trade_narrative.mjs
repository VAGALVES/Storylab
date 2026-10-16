/* StoryLab v2.23 · Ensaio da narração autoral e escalas visuais. */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL(x,import.meta.url),'utf8');
let permitReset=false;
const doc={handlers:[],addEventListener(type,fn){this.handlers.push({type,fn})}};
const sandbox={document:doc,window:{confirm:()=>permitReset}};
for(const f of ['trade-data.js','trade-academy-data.js','trade-object-data.js',
 'trade-observation-data.js','trade-narrative-data.js','trade-narrative.js','trade-scale-diagrams.js',
 'trade-precision-data.js','trade-precision.js','trade-language-data.js','trade-tools.js',
 'trade-academy.js','trade-observation.js','trade-object.js','trade-field.js','trade-hub.js'])
 vm.runInNewContext(read('./'+f),sandbox,{filename:f,timeout:5000});
const D=sandbox.window.STORYLAB_NARRATIVE_DATA,N=sandbox.window.StoryLabNarrative,S=sandbox.window.StoryLabScaleDiagrams,P=sandbox.window.StoryLabPrecision,H=sandbox.window.StoryLabTrade;
assert.equal(D.scenes.length,8);
assert.equal(D.phases.length,5);
assert.equal(D.languageBridges.length,5);
assert.deepEqual(Array.from(D.languageBridges,x=>x.id),Array.from(D.phases,x=>x.id));
for(const b of D.languageBridges){
 for(const k of ['pt','en','zh','py','insight'])assert.ok(typeof b[k]==='string'&&b[k].length>=18,b.id+':'+k);
 assert.match(b.zh,/[一-鿿]/u);
}

assert.equal(D.rubric.length,5);
assert.equal(D.sources.length,4);
assert.equal(new Set(D.scenes.map(s=>s.id)).size,8);
assert.equal(new Set(D.phases.map(p=>p.id)).size,5);
for(const s of D.scenes){
 assert.equal(s.questions.length,5,s.id);
 assert.equal(s.nouns.length,5,s.id);
 assert.equal(s.verbs.length,5,s.id);
 assert.equal(s.adjectives.length,5,s.id);
 assert.ok(s.pitfalls.length>=2&&s.intro.length>=40,s.id);
 assert.match(N.vignette(s.illustration),/<svg/);
 assert.match(N.vignette(s.illustration),/ESQUEMA|ESTUDO DE OBSERVAÇÃO/);
}
const Ds=sandbox.window.STORYLAB_PRECISION_DATA;
for(const scale of Ds.scales){
 for(let i=0;i<5;i++){
  const svg=S.render(scale,i);
  assert.match(svg,/<svg/);
  assert.match(svg,/GRAU [1-5]/);
  assert.match(svg,/Esquema qualitativo/);
  assert.ok(svg.includes('grau '+(i+1)+' selecionado'),scale.id+' / '+i);
 }
}
assert.equal(Object.keys(S.summary).length,7);
const store={tradeSaved:[],tradeSeen:[],tradeFieldNotes:[],tradeAcademyDone:[],tradeAcademyAnswers:{},
 tradeObjectDraft:{subject:'',attributes:[]},tradeObservationAnswers:{},tradeNarrativeWork:{}};
let saves=0,renders=0;const copied=[],spoken=[],tele=[];
const api={getStore:()=>store,save:()=>saves++,render:()=>renders++,copy:t=>copied.push(t),say:(...p)=>spoken.push(p),
 toTele:txt=>tele.push(txt),header:(_t,t)=>'<h1>'+t+'</h1>'};
H.init(api);
function click(act,id=''){
 const e={preventDefault(){},target:{closest:selector=>selector==='[data-nar]'?{dataset:{nar:act,id}}:null}};
 for(const l of doc.handlers.filter(h=>h.type==='click'))l.fn(e);
}
function input(s){
 const el={value:s,matches:q=>q==='[data-nar-response]'};
 for(const l of doc.handlers.filter(h=>h.type==='input'))l.fn({target:el});
}
function changeSource(s){
 const el={value:s,matches:q=>q==='[data-nar-source]',dataset:{}};
 for(const l of doc.handlers.filter(h=>h.type==='change'))l.fn({target:el});
}
function check(id,checked){
 const el={checked,matches:()=>false,dataset:{narCheck:id}};
 for(const l of doc.handlers.filter(h=>h.type==='change'))l.fn({target:el});
}
assert.equal(H.openTab('pratica'),true);
let html=H.render();
assert.match(html,/Uma coisa\. Cinco olhares/);
assert.match(html,/Motocicleta/);
click('lang');
let bridgeHtml=H.render();
assert.match(bridgeHtml,/PONTE DE EXPRESSÃO/);
assert.match(bridgeHtml,/REFERÊNCIA EM PORTUGUÊS/);
assert.match(bridgeHtml,/在这个镜头中/);
click('speak-bridge','en');assert.equal(spoken.at(-1)[1],'en-US');
assert.equal(spoken.at(-1)[0],D.languageBridges[0].en);
click('speak-bridge','zh');assert.equal(spoken.at(-1)[1],'zh-CN');
assert.equal(spoken.at(-1)[0],D.languageBridges[0].zh);
click('copy-bridge');assert.match(copied.at(-1),/PINYIN:/);
assert.equal(N.spoken(),'');assert.equal(N.output(),'');
click('phase','2');assert.match(H.render(),/A superfície parece lisa/);
click('phase','0');click('lang');assert.doesNotMatch(H.render(),/PONTE DE EXPRESSÃO/);

assert.match(html,/disabled/);
assert.equal(N.spoken(),'');
assert.equal(N.output(),'');
click('tele');assert.equal(tele.length,0);
input('A silhueta da motocicleta parece angular nesta vista de perfil.');
assert.match(H.render(),/A silhueta da motocicleta/);
assert.match(N.output(),/Origem declarada: Impressão/);
changeSource('observado');
assert.match(N.output(),/Observação ou teste pessoal/);
click('next');
input('Os comandos ladeiam o painel na vista que examinei.');
click('next');
input('A carenagem tem reflexos discretos sob a luz da sala.');
click('next');
input('Não testei o funcionamento do equipamento.');
click('next');
input('A aparência chama atenção, mas faltam medições e ensaios.');
assert.match(N.spoken(),/faltam medições/);
assert.equal(store.tradeNarrativeWork.moto.responses.length,5);
assert.equal(store.tradeNarrativeWork.moto.sources[0],'observado');
assert.ok(!N.spoken().includes('Origem declarada'));
check('evidencia',true);
assert.deepEqual(JSON.parse(JSON.stringify(store.tradeNarrativeWork.moto.checks)),['evidencia']);
click('copy');assert.match(copied.at(-1),/Motocicleta/);
assert.match(copied.at(-1),/A silhueta/);
click('tele');assert.equal(tele.length,1);
assert.equal(tele[0],N.spoken());
click('scene','telefone');
assert.match(H.render(),/Smartphone/);
assert.equal(N.spoken(),'');
assert.equal(store.tradeNarrativeWork.moto.responses.filter(Boolean).length,5);
input('<img src=x onerror=alert(1)>');
assert.doesNotMatch(H.render(),/<img src=x onerror/);
assert.match(H.render(),/&lt;img/);
click('scene','moto');
assert.match(H.render(),/A silhueta da motocicleta/);
click('reset');
assert.ok(N.spoken().includes('A silhueta'));
permitReset=true;
click('reset');
assert.equal(N.spoken(),'');
assert.equal(store.tradeNarrativeWork.moto.checks.length,0);
assert.ok(saves>=9&&renders>=8);
assert.match(P.scales(),/precision-visual-scale/);
const app=read('./app.js'),idx=read('./index.html'),standalone=read('./build_standalone.py'),prec=read('./generate_service_worker.py'),ci=read('./.github/workflows/ci.yml');
assert.match(app,/tradeNarrativeWork:cleanTradeNarrativeWork\(x.tradeNarrativeWork\)/);
assert.match(app,/tradeNarrativeWork:cleanTradeNarrativeWork\(incoming.tradeNarrativeWork\)/);
assert.match(app,/StoryLabTrade\.init\(\{D,getStore:\(\)=>store,save,render,navigate,header,stat,esc,ico,say,copy,toast,toTele:/);
assert.ok(idx.indexOf('trade-narrative-data.js')<idx.indexOf('trade-narrative.js'));
assert.ok(idx.indexOf('trade-scale-diagrams.js')<idx.indexOf('trade-precision.js'));
assert.match(standalone,/trade_narrative_data=/);
assert.match(prec,/'trade-narrative-data.js', 'trade-narrative.js', 'trade-scale-diagrams.js'/);
assert.match(ci,/node test_trade_narrative.mjs/);
console.log('StoryLab v2.22: 8 cenas, 5 planos, rubrica, persistência, privacidade, teleprompter e 7 escalas ilustradas — OK');
