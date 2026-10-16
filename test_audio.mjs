/** StoryLab: regressão de leitura transversal em português, inglês e mandarim.
 * Mock de DOM e síntese do navegador, sem rede ou pacotes npm.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const listeners={};
const attrName=attribute=>attribute.replace(/-([a-z])/g,(_,a)=>a.toUpperCase());
class Element{
 constructor(tag='div',text=''){this.tagName=tag.toLowerCase();this._text=String(text);this.children=[];this.parentElement=null;this.dataset={};this.attributes={};this.hidden=false;this.style={};this.className='';this.value='';this.handlers={};this.classes=new Set();this.classList={add:name=>this.classes.add(name),toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name),contains:name=>this.classes.has(name)};}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 set textContent(t){this._text=String(t);this.replaceChildren()}
 set innerHTML(t){this._html=String(t);this._text='';this.replaceChildren()}
 get innerHTML(){return this._html||''}
 getAttribute(key){return this.attributes[key]||null}
 setAttribute(key,value){this.attributes[key]=String(value)}
 append(...items){for(const item of items){item.parentElement=this;this.children.push(item)}}
 replaceChildren(...items){this.children.forEach(i=>{i.parentElement=null});this.children=[];this.append(...items)}
 remove(){if(this.parentElement){this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null}}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn)}
 dispatch(type,target){for(const fn of this.handlers[type]||[])fn({target,preventDefault(){},stopPropagation(){}})}
 matches(selector){
  if(selector==='button,audio,video,script,style,.sl-audio-trigger,.sl-audio-controls,[aria-hidden="true"]')return ['button','audio','video','script','style'].includes(this.tagName)||this.className.includes('sl-audio-trigger')||this.getAttribute('aria-hidden')==='true';
  if(selector==='button,a,[contenteditable="true"],.sl-audio-dock')return ['button','a'].includes(this.tagName);
  if(selector==='[lang]')return !!this.getAttribute('lang');
  if(selector==='#sl-audio-dock')return this.id==='sl-audio-dock';
  if(selector==='.page-head')return this.className.includes('page-head');
  const m=selector.match(/^\[data-([a-z-]+)(?:="([^"]*)")?\]$/);
  if(m){const v=this.dataset[attrName(m[1])];return v!==undefined&&(m[2]===undefined||v===m[2])}
  if(selector==='[data-sl-audio-voice]'||selector==='[data-sl-audio-speed]')return this.dataset[attrName(selector.slice(6,-1))]!==undefined;
  return false;
 }
 closest(selector){let p=this;while(p){if(p.matches(selector))return p;p=p.parentElement}return null}
 all(){return this.children.flatMap(c=>[c,...c.all()])}
 querySelectorAll(query){
  if(this.targets&&query.startsWith('.page-head .subtitle'))return this.targets;
  const terms=query.split(',').map(t=>t.trim());
  return this.all().filter(node=>terms.some(t=>node.matches(t)));
 }
 querySelector(query){
  if(query==='.page-head'&&this.page)return this.page;
  if(query==='[lang]')return this.all().find(n=>n.getAttribute('lang'))||null;
  if(query==='h2,h3')return this.all().find(n=>['h2','h3'].includes(n.tagName))||null;
  return this.querySelectorAll(query)[0]||null;
 }
 cloneNode(deep){const e=new Element(this.tagName,this._text);e.className=this.className;e.attributes={...this.attributes};e.dataset={...this.dataset};if(deep)this.children.forEach(x=>e.append(x.cloneNode(true)));return e}
}
const doc={
 body:new Element('body'),
 createElement:tag=>new Element(tag),
 addEventListener:(type,fn)=>{(listeners[type]??=[]).push(fn)}
};
const speech={
 paused:false,calls:[],cancels:0,
 getVoices(){return [
  {name:'Português brasileiro',lang:'pt-BR',voiceURI:'pt-local'},
  {name:'English local',lang:'en-US',voiceURI:'en-local'},
  {name:'中文本地',lang:'zh-CN',voiceURI:'zh-local'}
 ]},
 speak(u){this.calls.push(u)},
 cancel(){this.cancels++;this.paused=false},
 pause(){this.paused=true},
 resume(){this.paused=false},
 addEventListener(){}
};
class Utter{constructor(text){this.text=text}}
const storage={map:{},getItem(k){return this.map[k]||null},setItem(k,v){this.map[k]=String(v)}};
const win={speechSynthesis:speech,SpeechSynthesisUtterance:Utter,addEventListener(){}};
vm.runInNewContext(read('./audio-speech.js'),{window:win,document:doc,localStorage:storage,console});
const audio=win.StoryLabAudio;
assert.ok(audio&&audio.supported());
const sample='Uma frase clara precisa preservar as relações entre conceitos, mesmo quando há muitas informações sobre o contexto. '.repeat(12);
const parts=audio.chunks(sample);
assert.ok(parts.length>4&&parts.every(x=>x.length<=175));
assert.equal(parts.join(' ').replace(/\s+/g,' '),sample.trim());
const english=new Element('p','This sentence describes a city.');english.setAttribute('lang','en');
const mandarin=new Element('p','上海的街道有不同的建筑和声音。');mandarin.setAttribute('lang','zh-CN');
const nested=new Element('p');nested.append(new Element('strong','English text'));nested.children[0].setAttribute('lang','en');
const pt=new Element('p','A sintaxe ajuda a organizar as relações e os constituintes de uma oração.');
const body=new Element('div');const header=new Element('div');header.className='page-head';body.append(header,pt,english,mandarin);body.page=header;body.targets=[pt,english,mandarin];
assert.equal(audio.language(english),'en-US');
assert.equal(audio.language(mandarin),'zh-CN');
assert.equal(audio.language(nested),'en-US');
assert.equal(audio.language(pt),'pt-BR');
audio.enhance(body);
assert.equal(pt.querySelectorAll('[data-sl-audio-action="read"]').length,1);
assert.equal(english.querySelectorAll('[data-sl-audio-action="read"]').length,1);
assert.equal(mandarin.querySelectorAll('[data-sl-audio-action="read"]').length,1);
assert.equal(header.querySelectorAll('[data-sl-audio-action="page"]').length,1);
audio.enhance(body);
assert.equal(pt.querySelectorAll('[data-sl-audio-action="read"]').length,1,'enhance não deve duplicar botões');
function click(target){
 const event={target,preventDefault(){},stopPropagation(){}};
 for(const fn of listeners.click||[])fn(event);
}
click(english.querySelector('[data-sl-audio-action="read"]'));
assert.equal(speech.calls.at(-1).lang,'en-US');
assert.equal(speech.calls.at(-1).voice.voiceURI,'en-local');
assert.match(speech.calls.at(-1).text,/This sentence/);
click(mandarin.querySelector('[data-sl-audio-action="read"]'));
assert.equal(speech.calls.at(-1).lang,'zh-CN');
assert.equal(speech.calls.at(-1).voice.voiceURI,'zh-local');
click(pt.querySelector('[data-sl-audio-action="read"]'));
assert.equal(speech.calls.at(-1).lang,'pt-BR');
assert.equal(speech.calls.at(-1).voice.voiceURI,'pt-local');
assert.ok(doc.body.children.length,'painel de áudio renderizado');
audio.togglePause();assert.equal(speech.paused,true);
audio.togglePause();assert.equal(speech.paused,false);
speech.calls.at(-1).onend();
audio.stop();assert.ok(speech.cancels>=3);
click(header.querySelector('[data-sl-audio-action="page"]'));
assert.equal(speech.calls.at(-1).lang,'pt-BR');
assert.ok(!speech.calls.at(-1).text.includes('上海'));
audio.stop();
// A fala de um texto extenso é segmentada; o avanço depende do onend.
audio.speak(sample,'pt-BR','Ensaio de narração');
let current=speech.calls.at(-1);
assert.ok(current.text.length<=175);
current.onend();
assert.ok(speech.calls.at(-1)!==current);
assert.ok(speech.calls.at(-1).text.length<=175);
audio.stop();
assert.match(read('./app.js'),/StoryLabAudio\?\.enhance/);
assert.match(read('./app.js'),/StoryLabAudio\.speak/);
assert.match(read('./index.html'),/<script src="audio-speech\.js"><\/script>/);
assert.match(read('./style.css'),/\.sl-audio-trigger/);
assert.match(read('./generate_service_worker.py'),/'audio-speech\.js'/);
assert.match(read('./build_standalone.py'),/audio_speech/);
assert.match(read('./audio-speech.js'),/speechSynthesis/);
console.log('Escuta: botões sem duplicação, pt/en/zh, seleção de voz, paginação, pausa, parada e leitura da página — OK');