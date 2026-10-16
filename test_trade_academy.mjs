/* QA Academia Interindustrial & Radar Setorial v2.17 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const get=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const document={listeners:[],addEventListener(type,fn){this.listeners.push({type,fn})}};
const sandbox={window:{},document};
vm.runInNewContext([
'./trade-data.js','./trade-academy-data.js','./trade-academy.js',
'./trade-field.js','./trade-hub.js'].map(get).join('\n'),sandbox,{timeout:3500});
const {STORYLAB_TRADE_ACADEMY:A,StoryLabTrade:trade,StoryLabTradeAcademy:academy,StoryLabTradeField:field}=sandbox.window;
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(A.chapters.length,9,'nove capítulos interdisciplinares');
assert.equal(A.sectors.length,9,'nove especializações setoriais');
assert.equal(new Set(A.chapters.map(c=>c.id)).size,9);
assert.equal(new Set(A.sectors.map(s=>s.id)).size,9);
for(const chapter of A.chapters){
 assert.equal(chapter.sections.length,3,chapter.id);
 assert.equal(chapter.terms.length,3,chapter.id);
 assert.equal(chapter.caseStudy.length,4,chapter.id);
 assert.equal(chapter.quiz.length,4,chapter.id);
 assert.equal(chapter.quiz[1].length,3,chapter.id);
 assert.ok(Number.isInteger(chapter.quiz[2])&&chapter.quiz[2]>=0&&chapter.quiz[2]<=2,chapter.id);
 assert.equal(chapter.prompt.length,4,chapter.id);
 assert.match(chapter.prompt[2],/[\u3400-\u9fff]/);
 assert.ok(chapter.sections.every(s=>s.length===3&&s.every(x=>x.length>60)),chapter.id);
 assert.ok(chapter.terms.every(t=>t.length===2));
}
for(const sector of A.sectors){
 assert.ok(A.chapters.some(c=>c.id===sector.theory),sector.id);
 assert.equal(sector.lenses.length,5,sector.id);
 assert.equal(sector.question.length,4,sector.id);
 assert.match(sector.question[2],/[\u3400-\u9fff]/,sector.id);
 assert.ok(sector.proof.length>45,sector.id);
}
assert.ok(A.sectors.some(s=>s.id==='automotivo'));
assert.ok(A.sectors.some(s=>s.id==='renovaveis'));
assert.ok(A.sectors.some(s=>s.id==='eletronicos'));
assert.ok(A.sectors.some(s=>s.id==='portateis'));
assert.ok(A.sectors.some(s=>s.id==='vestuario'));
const store={tradeSaved:[],tradeSeen:[],tradeFieldNotes:[],tradeAcademyDone:[],tradeAcademyAnswers:{}};
const heard=[],copied=[];let renders=0,saves=0;
const ctx={
 getStore:()=>store,save:()=>{saves++},render:()=>{renders++},
 say:(...args)=>heard.push(args),copy:(str)=>copied.push(str),
 header:(_a,b)=>'<h1>'+b+'</h1>'
};
trade.init(ctx);
function clickAcademy(action,id=''){
 for(const h of document.listeners.filter(x=>x.type==='click')){
  h.fn({preventDefault(){},target:{closest:sel=>sel==='[data-trade-academy]'?{dataset:{tradeAcademy:action,id}}:null}});
 }
}
let html=academy.academy();
assert.match(html,/ciência por trás de produtos e fornecedores/i);
assert.match(html,/ESTUDO DE CASO/);
assert.match(html,/CONFERÊNCIA DE CONCEITO/);
assert.match(html,/lang="zh-CN"/);
clickAcademy('chapter','qualidade-metrologia');
assert.match(academy.academy(),/Medição, ensaio, confiabilidade e aceitação/);
clickAcademy('answer','qualidade-metrologia:2');
assert.deepEqual(plain(store.tradeAcademyAnswers['qualidade-metrologia']),{selected:2});
assert.match(academy.academy(),/Interpretação consistente/);
clickAcademy('complete','qualidade-metrologia');
assert.deepEqual(plain(store.tradeAcademyDone),['qualidade-metrologia']);
assert.match(academy.academy(),/✓ Estudado/);
clickAcademy('complete','qualidade-metrologia');
assert.equal(store.tradeAcademyDone.length,0);
clickAcademy('speak','qualidade-metrologia:en');
assert.equal(heard.at(-1)[1],'en-US');
clickAcademy('speak','qualidade-metrologia:zh');
assert.equal(heard.at(-1)[1],'zh-CN');
clickAcademy('copy','qualidade-metrologia');
assert.match(copied.at(-1),/采用了什么测试方法/);
clickAcademy('sector','automotivo');
assert.match(academy.sectors(),/Automotiva & mobilidade elétrica/);
clickAcademy('sector','eletronicos');
assert.match(academy.sectors(),/firmware/i);
clickAcademy('speak-sector','eletronicos:zh');
assert.equal(heard.at(-1)[1],'zh-CN');
clickAcademy('copy-sector','eletronicos');
assert.match(copied.at(-1),/hardware and firmware/i);
clickAcademy('open-chapter','arquitetura-sistemas');
assert.match(trade.render(),/Arquitetura, componentes e interfaces/);
trade.openTab('setores');
clickAcademy('start-dossier','eletronicos:produto');
assert.equal(store.tradeFieldNotes.length,1);
assert.equal(store.tradeFieldNotes[0].sector,'eletronicos');
assert.equal(store.tradeFieldNotes[0].kind,'produto');
assert.match(trade.render(),/Dossiês de visitas e produtos/);
assert.match(trade.render(),/CRITÉRIO ESPECÍFICO/);
assert.match(field.copyText(store.tradeFieldNotes[0]),/Eletrônicos & computação/);
assert.ok(saves>=4&&renders>=4);
assert.match(get('./app.js'),/tradeAcademyDone:cleanTradeAcademyDone/);
assert.match(get('./app.js'),/tradeAcademyAnswers:cleanTradeAcademyAnswers/);
const htmlIndex=get('./index.html');
assert.ok(htmlIndex.indexOf('trade-data.js')<htmlIndex.indexOf('trade-academy-data.js'));
assert.ok(htmlIndex.indexOf('trade-academy-data.js')<htmlIndex.indexOf('trade-academy.js'));
assert.ok(htmlIndex.indexOf('trade-academy.js')<htmlIndex.indexOf('trade-field.js'));
assert.match(get('./generate_service_worker.py'),/'trade-academy-data.js'/);
assert.match(get('./build_standalone.py'),/trade_academy_data/);
console.log('Academia v2.17: nove capítulos, nove setores, teoria, casos, questões, perguntas trilíngues, fichas setoriais e progresso — OK');
