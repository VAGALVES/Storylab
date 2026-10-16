import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const phrases=JSON.parse(read('./content/storylab_data.json')).phrases;
const corpus=JSON.parse(read('./content/phrase_encaixes.json'));
const documentCallbacks={};
const previewNode={textContent:''};
const document={
 addEventListener(type,fn){(documentCallbacks[type]??=[]).push(fn)},
 querySelector(){return previewNode}
};
const window={STORYLAB_ENCAIXES:corpus};
vm.runInNewContext(read('./encaixes-engine.js'),{window,document});
const engine=window.StoryLabEncaixes;
assert.ok(engine);
const covered=phrases.filter(p=>engine.eligible(p));
assert.equal(covered.length,208);
assert.equal(corpus.schema,1);
for(const p of covered){
 const options=corpus.optionsByPhrase[p.id];
 assert.equal(options.length,2,p.id);
 assert.equal(engine.countSlots(p.pt),options[0].slots.length,p.id);
 for(const x of options){
  const result=engine.compose(p.pt,x.slots);
  assert.ok(result.length>=p.pt.length-3,p.id);
  assert.ok(!result.includes('...')&&!result.includes('_____')&&!result.includes('…'),p.id);
  assert.match(result,/[.!?]$/,p.id);
 }
 assert.notEqual(engine.compose(p.pt,options[0].slots),engine.compose(p.pt,options[1].slots),p.id);
}
assert.equal(engine.eligible(phrases.find(p=>p.id==='abertura-01')),false);
assert.equal(engine.compose('Sobre...',['a rua']),'Sobre a rua.');
assert.equal(engine.compose('Mais... do que...',['claro','escuro']),'Mais claro do que escuro.');
assert.equal(engine.compose('O destaque é..., certo?',['o portão']),'O destaque é o portão, certo?');

const store={phraseEncaixes:{}},calls={save:0,render:0,copy:[],say:[],tele:[],toast:[]};
engine.init({D:{phrases},getStore:()=>store,
 save(){calls.save++},render(){calls.render++},
 copy(text){calls.copy.push(text)},say(text,lang){calls.say.push([text,lang])},
 toTele(text){calls.tele.push(text)},toast(text){calls.toast.push(text)}
});
const phrase=phrases.find(p=>p.id==='comparacao-10');
const button=(action,attributes={})=>({dataset:{encaixeAction:action,phraseId:phrase.id,...attributes}});
function click(action,attrs={}){
 const event={preventDefault(){},target:{closest(selector){return selector==='[data-encaixe-action]'?button(action,attrs):null}}};
 for(const fn of documentCallbacks.click||[])fn(event);
}
const start=engine.card(phrase,'pt');
assert.match(start,/Explorar encaixes/);
assert.equal(engine.card(phrase,'en'),'');
click('toggle');
assert.match(engine.card(phrase,'pt'),/Uma estrutura, diferentes sentidos/);
assert.match(engine.card(phrase,'pt'),/data-option="custom"/);
click('select',{option:'1'});
assert.equal(store.phraseEncaixes[phrase.id].selected,1);
click('copy');
const expected=engine.compose(phrase.pt,corpus.optionsByPhrase[phrase.id][1].slots);
assert.equal(calls.copy.at(-1),expected);
click('listen');assert.deepEqual(calls.say.at(-1),[expected,'pt-BR']);
click('tele');assert.equal(calls.tele.at(-1),expected);
click('select',{option:'custom'});
const custom=engine.card(phrase,'pt');
assert.match(custom,/Complemento 1 de 2/);
assert.match(custom,/Complemento 2 de 2/);
const input=(index,value)=>({matches(query){return query==='[data-encaixe-slot]'},dataset:{phraseId:phrase.id,encaixeSlot:String(index)},value});
for(const [i,value] of ['um corredor longo','uma galeria curta'].entries()){
 for(const fn of documentCallbacks.input||[])fn({target:input(i,value)});
}
assert.match(previewNode.textContent,/um corredor longo, enquanto o segundo uma galeria curta/);
click('copy');assert.match(calls.copy.at(-1),/um corredor longo/);
assert.deepEqual(store.phraseEncaixes[phrase.id].slots,['um corredor longo','uma galeria curta']);
assert.ok(calls.save>=4&&calls.render>=3);
assert.equal(calls.toast.length,0);
console.log('Encaixes: 208 estruturas, 416 opções, múltiplas lacunas, cópia, voz, teleprompter e personalização — OK');
