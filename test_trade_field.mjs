/* StoryLab · fluxo de visita e integridade do Dossiê de Campo (v2.16). */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
let authorized=false;
const document={listeners:[],addEventListener(type,fn){this.listeners.push({type,fn})}};
const sandbox={window:{confirm:()=>authorized},document};
vm.runInNewContext(read('./trade-data.js')+'\n'+read('./trade-field.js')+'\n'+read('./trade-hub.js'),sandbox,{timeout:2500});
const {StoryLabTradeField:field,StoryLabTrade:hub}=sandbox.window;
assert.equal(Object.keys(field.prompts).length,16,'oito perguntas por tipo de dossiê');
assert.equal(field.status.length,5);
const groups=sandbox.window.STORYLAB_TRADE_DATA.groups;
assert.equal(new Set(groups.map(g=>g[1])).size,16);
assert.ok(groups.every(g=>field.prompts[g[1]]?.length===4));
assert.ok(Object.values(field.prompts).every(p=>p.every(x=>x.length>10)&&/[\u3400-\u9fff]/.test(p[2])));
const store={tradeSaved:[],tradeSeen:[],tradeFieldNotes:[]};
const copied=[],spoken=[];
let saves=0,renders=0;
const api={
 getStore:()=>store,save(){saves++},render(){renders++},
 copy:t=>copied.push(t),say:(t,lang)=>spoken.push([t,lang]),
 header:(_k,title)=>'<h1>'+title+'</h1>'
};
hub.init(api);
function emit(kind,target){
 for(const h of document.listeners.filter(x=>x.type===kind))
  h.fn({target,preventDefault(){}});
}
function click(a,id){
 emit('click',{dataset:{tradeField:a,id},closest:s=>s==='[data-trade-field]'?{dataset:{tradeField:a,id}}:null});
}
function edit(fieldName,value){
 emit('input',{value,dataset:{fieldInput:fieldName},matches:s=>s==='[data-field-input]'});
}
function basis(value){
 emit('change',{value,matches:s=>s==='[data-field-basis]'});
}
assert.match(field.render(),/Nenhum dossiê ainda/);
click('new','produto');
assert.equal(store.tradeFieldNotes.length,1);
const product=store.tradeFieldNotes[0];
assert.equal(product.kind,'produto');
assert.match(product.id,/^f-[a-z0-9]{7,20}-[a-z0-9]{4,8}$/);
assert.match(field.render(),/DIMENSÃO 1 \/ 8/);
assert.match(field.render(),/这个产品属于什么类别/);
edit('title','Jaqueta impermeável');
edit('partner','Fornecedor de tecido A');
edit('text','Composição alegada de 96% poliéster e 4% elastano.');
basis('declarado');
edit('evidence','Informado pelo representante, sem laudo');
assert.equal(product.title,'Jaqueta impermeável');
assert.equal(product.entries.identidade.basis,'declarado');
assert.match(field.copyText(product),/Declaração do fornecedor/);
assert.match(field.copyText(product),/sem laudo/);
click('group','materiais');
edit('text','Peça apresentou textura acetinada.');
basis('observado');
click('speak','materiais:en');
assert.equal(spoken.at(-1)[1],'en-US');
click('speak','materiais:zh');
assert.equal(spoken.at(-1)[1],'zh-CN');
click('copy-question','materiais');
assert.match(copied.at(-1),/材料成分/);
click('copy',product.id);
assert.match(copied.at(-1),/Jaqueta impermeável/);
assert.match(copied.at(-1),/Peça apresentou textura acetinada/);
assert.match(field.render(),/2 de 8 dimensões/);
assert.doesNotMatch(field.render(),/onerror="alert/);
edit('followUp','Pedir ficha técnica e confirmar composição em laboratório.');
assert.match(field.copyText(product),/laboratório/);
click('new','fornecedor');
assert.equal(store.tradeFieldNotes.length,2);
const supplier=store.tradeFieldNotes[0];
assert.equal(supplier.kind,'fornecedor');
assert.match(field.render(),/A empresa fabrica diretamente/);
edit('title','Fábrica em Xangai');
click('group','capacidade');
edit('text','Informou capacidade de 15 mil peças por mês; sem registro de produção.');
basis('declarado');
click('copy',supplier.id);
assert.match(copied.at(-1),/Capacidade produtiva/);
assert.match(copied.at(-1),/15 mil peças/);
click('delete',supplier.id);
assert.equal(store.tradeFieldNotes.length,2,'sem confirmação não se exclui um dossiê');
authorized=true;
click('delete',supplier.id);
assert.equal(store.tradeFieldNotes.length,1);
assert.equal(store.tradeFieldNotes[0].id,product.id);
assert.ok(saves>5&&renders>=5);
const html=hub.render();
assert.match(html,/Dossiês de campo/);
assert.match(read('./app.js'),/tradeFieldNotes:cleanTradeFieldNotes/);
assert.match(read('./index.html'),/<script src="trade-field\.js"><\/script>/);
assert.match(read('./generate_service_worker.py'),/'trade-field\.js'/);
assert.match(read('./build_standalone.py'),/trade_field/);
assert.match(read('./style.css'),/\.trade-field-prompt/);
console.log('Dossiê de Campo: produto e fornecedor, 16 perguntas trilíngues, persistência, evidências, áudio, cópia e exclusão segura — OK');