/* Validação editorial e funcional dos repertórios de produtos e fornecedores. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const sandbox={window:{},document:{listeners:[],addEventListener(type,fn){this.listeners.push({type,fn})}}};
vm.runInNewContext(read('./trade-data.js')+'\n'+read('./trade-object-data.js')+'\n'+read('./trade-object.js')+'\n'+read('./trade-hub.js'),sandbox,{timeout:4500});
const {STORYLAB_TRADE_DATA:D,STORYLAB_TRADE_PHRASES:P,StoryLabTrade:hub}=sandbox.window;
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(D.groups.length,16);
assert.equal(D.terms.length,96);
assert.equal(D.terms.filter(t=>t.domain==='produto').length,48);
assert.equal(D.terms.filter(t=>t.domain==='fornecedor').length,48);
assert.equal(P.scenarios.length,9);
assert.equal(P.phrases.length,36);
assert.equal(new Set(D.terms.map(x=>x.id)).size,96);
assert.equal(new Set(P.phrases.map(x=>x.id)).size,36);
assert.equal(new Set(D.groups.map(x=>x[1])).size,16);
for(const term of D.terms){
 assert.ok(['produto','fornecedor'].includes(term.domain),term.id);
 assert.ok(D.groups.some(g=>g[0]===term.domain&&g[1]===term.group),term.id);
 assert.ok(term.pt.length>=4&&term.en.length>=4&&term.zh.length>=2&&term.py.length>=3,term.id);
 assert.ok(term.definition.length>=50,term.pt+' necessita definição interpretativa');
}
for(const phrase of P.phrases){
 assert.ok(P.scenarios.some(g=>g[0]===phrase.scenario),phrase.id);
 assert.ok(phrase.pt.length>=25&&phrase.en.length>=25&&phrase.zh.length>=12&&phrase.py.length>=12,phrase.id);
 assert.match(phrase.zh,/[一-龥]/,phrase.id+' deve conter chinês');
}
assert.ok(P.scenarios.every(s=>P.phrases.filter(p=>p.scenario===s[0]).length===4));
const store={tradeSaved:[],tradeSeen:[]},heard=[],copied=[];
let calls=0,focusPreserved=null;
hub.init({
 getStore(){return store},
 save(){calls++},
 render(preserve=false){focusPreserved=preserve},
 header(_topic,title,sub){return '<h1>'+title+'</h1><p>'+sub+'</p>'},
 say(...args){heard.push(args)},
 copy(...args){copied.push(args)}
});
const signal=(kind,el)=>sandbox.document.listeners.filter(x=>x.type===kind).forEach(x=>x.fn({target:el,preventDefault(){}}));
const click=(action,id='',value='')=>signal('click',{closest(){return {dataset:{trade:action,id,value}}}});
let html=hub.render();
assert.match(html,/Fornecedores & Produtos/);
assert.match(html,/Glossário técnico do produto/);
assert.match(html,/Atlas Universal do Objeto/);
assert.match(html,/O ATLAS DO OBJETO/);
hub.openTab('produto');
html=hub.render();
assert.match(html,/categoria de produto/);
assert.match(html,/role="group"/);
assert.equal(hub.filteredTerms().length,48);
click('tab','','fornecedor');
html=hub.render();
assert.match(html,/capacidade instalada/);
assert.equal(hub.filteredTerms().length,48);
click('term','t060');
assert.match(hub.render(),/capacidade instalada/);
click('save','t:t060');
assert.deepEqual(plain(store.tradeSaved),['t:t060']);
click('save','t:t060');
assert.deepEqual(plain(store.tradeSaved),[]);
const search={value:'rastreabilidade',matches:s=>s==='[data-trade-search]'};
signal('input',search);
assert.equal(focusPreserved,true,'a busca deve preservar o foco durante rerender');
assert.ok(hub.filteredTerms().length>=1);
click('tab','','frases');
html=hub.render();
assert.match(html,/Fraseoteca de campo/);
assert.match(html,/Qual é a especialidade da empresa/);
assert.equal(hub.filteredPhrases().length,36);
click('training');
assert.match(hub.render(),/Revelar EN \+ 中文/);
click('reveal','p001');
assert.match(hub.render(),/I would like to learn about/);
click('seen','p:p001');
assert.deepEqual(plain(store.tradeSeen),['p:p001']);
click('speak','p001:zh');
assert.equal(heard.at(-1)[1],'zh-CN');
assert.match(heard.at(-1)[0],/我想/);
click('speak','p001:en');
assert.equal(heard.at(-1)[1],'en-US');
click('copy','p001');
assert.match(copied.at(-1)[0],/Wǒ xiǎng/);
assert.ok(calls>=3);
const app=read('./app.js'),index=read('./index.html');
assert.match(app,/Fornecedores & Produtos/);
assert.match(app,/case 'trade'/);
assert.match(app,/tradeSaved:cleanTradeIds/);
assert.match(index,/<script src="trade-data.js"><\/script>/);
assert.match(index,/<script src="trade-hub.js"><\/script>/);
console.log('Fornecedores e Produtos: 96 verbetes, 36 frases, 16 dimensões, 9 situações, busca, estudo, áudio e progresso — OK');