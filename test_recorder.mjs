import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const handlers={},released=[];
let captures=0,stopped=0,created=0;
const fakeStream={getTracks:()=>[{stop(){stopped++}}]};
class FakeMediaRecorder{
  static isTypeSupported(t){return t==='audio/webm'}
  constructor(){this.mimeType='audio/webm';this.state='inactive'}
  start(){this.state='recording'}
  stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['audio-local'],{type:'audio/webm'})});this.onstop?.()}
}
const document={
 addEventListener(type,fn,capture=false){(handlers[type]??=[]).push({fn,capture:!!capture})},
 getElementById(){return null}
};
const w={addEventListener(){}};
const env=vm.createContext({
 window:w,document,Blob,MediaRecorder:FakeMediaRecorder,
 navigator:{mediaDevices:{async getUserMedia(){captures++;return fakeStream}}},
 URL:{createObjectURL(){created++;return 'blob:test-'+created},revokeObjectURL(url){released.push(url)}},
 setInterval(){return 2},clearInterval(){},Date,console,queueMicrotask,
 confirm(){return true}
});
vm.runInContext(read('./atlas-recorder.js'),env);
const rec=w.StoryLabRecorder;
assert.equal(rec.state().kind,'idle');
assert.equal(rec.state().supported,true);
await rec.start('0:0');
assert.equal(rec.state().kind,'recording');
rec.stop();
assert.equal(rec.state().kind,'ready');
assert.equal(rec.state().url,'blob:test-1');
assert.equal(rec.state().extension,'webm');
rec.close();
assert.equal(rec.state().url,null);
assert.deepEqual(released,['blob:test-1']);
assert.ok(captures===1&&stopped>=1);
vm.runInContext(read('./atlas-engine.js'),env);
vm.runInContext(read('./atlas-audio-ui.js'),env);
const atlas=w.StoryLabAtlas;
const D=JSON.parse(read('./content/storylab_data.json'));
const G=JSON.parse(read('./content/atlas_guides.json'));
w.STORYLAB_ATLAS_GUIDES=G;
const store={atlasDrafts:{},atlasHistory:[]};
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let renderCount=0,saveCount=0;
atlas.init({
 D,getStore:()=>store,save:()=>{saveCount++},
 render:()=>{renderCount++},navigate(){},header:(_a,b)=>'<h1>'+b+'</h1>',
 stat:(a,b)=>'<p>'+a+':'+b+'</p>',esc:escape,norm,
 ico:name=>'['+name+']',say(){},copy(){},toast(){},toTele(){}
});
async function click(which,value={},name='atlasAction'){
 const attr=name==='atlasAction'?'[data-atlas-action]':'[data-atlas-audio]';
 const target={closest(sel){
   if(sel===attr)return {dataset:{[name]:which,...value}};
   return null;
 }};
 const event={target,preventDefault(){},stopPropagation(){},stopImmediatePropagation(){this.blocked=true}};
 const callbacks=(handlers.click||[]).sort((a,b)=>Number(b.capture)-Number(a.capture));
 for(const x of callbacks){if(event.blocked)break;x.fn(event)}
 await Promise.resolve();
}
await click('practice');
assert.match(atlas.render(),/ESTÚDIO DE VOZ/);
assert.match(atlas.render(),/Dicção/);
await click('start',{},'atlasAudio');
assert.equal(rec.state().kind,'recording');
await click('stop',{},'atlasAudio');
assert.equal(rec.state().kind,'ready');
assert.match(atlas.render(),/Baixar áudio/);
store.atlasDrafts['0:0']='A fachada apresenta linhas retilíneas e um pórtico. Vejo duas árvores próximas à entrada e comparo as formas de cada estrutura.';
await click('save');
assert.equal(store.atlasHistory.length,1);
assert.equal(store.atlasHistory[0].recorded,true);
assert.equal(store.atlasHistory[0].rubric.length,4);
assert.ok(saveCount>=1);
await click('level',{level:'1'});
assert.equal(rec.state().kind,'idle');
assert.equal(atlas.context().level,1);
assert.ok(released.includes('blob:test-2'));
assert.ok(renderCount>=3);
console.log('Gravador: permissão, take, áudio local, download, rubrica, histórico e descarte OK');
