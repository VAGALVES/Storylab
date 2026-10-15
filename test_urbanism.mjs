import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const D=JSON.parse(read('./content/storylab_data.json'));
const G=JSON.parse(read('./content/atlas_guides.json'));
const before=D.atlas.map(x=>x.title),base=before.length;
const w={STORYLAB_DATA:D,STORYLAB_ATLAS_GUIDES:G};
const env={window:w,document:{addEventListener(){}},console};
for(const file of ['urbanism-concepts.js','urbanism-lexicon.js','urbanism-atlas.js'])vm.runInNewContext(read('./'+file),env,{filename:file});
assert.equal(w.STORYLAB_URBANISM.installed,true);
assert.equal(w.STORYLAB_URBANISM.base,31);
assert.equal(w.STORYLAB_URBANISM.count,23);
assert.equal(w.STORYLAB_URBANISM.terms,188);
assert.equal(D.atlas.length,54);
assert.equal(G.length,54);
assert.deepEqual(D.atlas.slice(0,base).map(x=>x.title),before);
for(let i=base;i<G.length;i++){
 const group=G[i],item=D.atlas[i],seen=new Set();
 assert.equal(group.terms.length,item.terms.length);
 assert.ok(group.terms.length>=8);
 assert.equal(group.model.length,4);
 for(const [j,term] of group.terms.entries()){
  const [pt,definition,example,caution,scene]=term;
  assert.equal(item.terms[j],pt);
  assert.ok(definition.length>=25&&example.length>=25&&caution.length>=20);
  assert.ok(scene.includes('_____'));
  assert.ok(!scene.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(pt.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
  assert.ok(!seen.has(pt));seen.add(pt);
  assert.ok(w.STORYLAB_URBANISM.byField[i][pt].en);
 }
}
assert.equal(D.atlas[31].title,'Mobilidade e movimentos pendulares');
assert.ok(G[31].terms.some(x=>x[0]==='movimento pendular'&&x[1].includes('commuting')));
assert.ok(D.atlas.some(x=>x.title==='Distinções entre conceitos próximos'));
assert.ok(D.atlas.some(x=>x.title==='Expressões e combinações urbanas'));
assert.ok(w.STORYLAB_URBANISM.byField[31]['movimento pendular'].relations.length>=3);
assert.match(w.STORYLAB_URBANISM.byField[31]['movimento pendular'].englishSentence,/daily commute/);
// Idempotência: a extensão não pode duplicar campos ao carregar uma segunda vez.
vm.runInNewContext(read('./urbanism-atlas.js'),env);
assert.equal(D.atlas.length,54);
// Exercitar o Atlas nativo com dados enriquecidos.
const handlers={};
const atlasEnv={window:w,document:{addEventListener(name,fn){handlers[name]=fn;}},console};
vm.runInNewContext(read('./atlas-engine.js'),atlasEnv);
const atlas=w.StoryLabAtlas,store={atlasDrafts:{},atlasHistory:[]};
const esc=x=>String(x??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let copied='';
atlas.init({D,getStore:()=>store,save(){},render(){},header:()=>'',stat:()=>'',esc,norm,ico:()=>'',say(){},copy:s=>copied=s,toast(){},navigate(){},toTele(){},now:()=>Date.now(),random:()=>.31});
handlers.click({preventDefault(){},target:{closest(){return{dataset:{atlasAction:'word',topic:'31',word:'movimento pendular'}};}}});
const output=atlas.render();
assert.match(output,/commuting/i);
assert.match(output,/ENGLISH · EQUIVALENTE/);
assert.match(output,/REDE SEMÂNTICA/);
assert.match(output,/My daily commute/);
handlers.click({preventDefault(){},target:{closest(){return{dataset:{atlasAction:'copy-en'}};}}});
assert.equal(copied,'commuting');
console.log('Urbanismo: 23 campos, 188 verbetes, inglês, conexões e progresso preservado — OK');
