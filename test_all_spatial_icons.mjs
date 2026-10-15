import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const D=JSON.parse(read('content/storylab_data.json'));
const G=JSON.parse(read('content/atlas_guides.json'));
const original=D.atlas.map(g=>g.title);
const w={STORYLAB_DATA:D,STORYLAB_ATLAS_GUIDES:G};
const listeners={};
const doc={addEventListener(name,fn){(listeners[name]??=[]).push(fn)},getElementById(){return null}};
const ctx=vm.createContext({window:w,document:doc,console});
for(const f of ['urbanism-concepts.js','urbanism-lexicon.js','urbanism-atlas.js',
  'spatial-verbs-data.js','spatial-regency-data.js',
  'spatial-verb-icons.js','spatial-verb-icons-extra.js','spatial-verbs.js'])vm.runInContext(read(f),ctx,{filename:f});
const icons=w.StoryLabVerbIcons,lab=w.StoryLabVerbLab,entries=lab.entries();
assert.equal(icons.keys().length,64);
assert.equal(entries.length,64);
assert.equal(lab.groups(),8);
assert.equal(D.atlas.length,62);
assert.equal(G.length,62);
assert.equal(D.atlas.reduce((n,g)=>n+g.terms.length,0),712);
assert.equal(JSON.stringify(D.atlas.slice(0,31).map(x=>x.title)),JSON.stringify(original));
assert.equal(Object.keys(w.STORYLAB_SPATIAL_VERB_DATA).length,8);
const illustrations=new Set();
const labels=new Set();
for(const [index,item] of entries.entries()){
 assert.equal(item.iconKey,item.pt,'independent icon binding '+item.pt);
 assert.equal(icons.has(item.pt),true,'every term has an icon '+item.pt);
 assert.ok(!labels.has(item.pt));labels.add(item.pt);
 const description=icons.caption(item.pt);
 assert.ok(description.length>43,'helpful legend '+item.pt);
 assert.ok(/[.!?]$/.test(description));
 const large=icons.render(item.iconKey,item.pt);
 const small=icons.render(item.iconKey,item.pt,{mini:true});
 assert.match(large,/class="vl-diagram" role="img"/);
 assert.ok(large.includes('aria-label="Diagrama do verbo '+item.pt+'"'));
 assert.ok(large.includes('<desc>'+description+'</desc>'));
 assert.match(small,/class="vl-mini-diagram" aria-hidden="true"/);
 assert.ok(!small.includes('<desc>'));
 assert.ok(large.includes('viewBox="0 0 260 115"'));
 assert.ok(!/<(?:script|image|foreignObject)\b/i.test(large));
 const content=large.slice(large.indexOf('</desc>')+7,large.indexOf('</svg>'));
 assert.ok(content.length>90,'complete SVG '+item.pt);
 assert.ok(!illustrations.has(content),'unique pictogram geometry '+item.pt);
 illustrations.add(content);
 assert.equal(lab.focus(item.topic,item.pt),true);
 const html=lab.render();
 assert.ok(html.includes('Diagrama do verbo '+item.pt),'detail displays its own picture '+item.pt);
 assert.ok(html.includes('<figcaption class="vl-diagram-caption">'+description+'</figcaption>'),'detail explains icon '+item.pt);
 assert.equal((html.match(/class="vl-mini-diagram"/g)||[]).length,10,'8 words + 2 related comparisons '+item.pt);
}
assert.equal(illustrations.size,64);
const cmp=[
 ['ladear','flanquear'],['circundar','contornar'],['sobrepor','justapor'],
 ['bifurcar-se','convergir'],['alargar','estreitar'],['ocultar','revelar'],
 ['agrupar','dispersar'],['elevar','rebaixar']
];
for(const [a,b] of cmp){
 const first=entries.find(v=>v.pt===a),second=entries.find(v=>v.pt===b);
 assert.ok(first&&second);
 assert.notEqual(icons.render(a,a),icons.render(b,b));
 lab.focus(first.topic,a);const html=lab.render();
 assert.ok(html.includes('data-verb-id="'+second.index+'"'),'smart contrast '+a+' / '+b);
}
const css=read('style.css');
for(const selector of ['.vl-visual','.vl-diagram-caption','.vl-compare','.vl-mini-diagram'])
 assert.ok(css.includes(selector),'style: '+selector);
assert.match(css,/@media\(max-width:430px\)/);
const html=read('index.html');
assert.ok(html.indexOf('spatial-verb-icons.js')<html.indexOf('spatial-verb-icons-extra.js'));
assert.ok(html.indexOf('spatial-verb-icons-extra.js')<html.indexOf('spatial-verbs.js'));
let updates=0;
lab.bind({render(){updates++},copy(){},open(){}});
const origin=entries.find(v=>v.pt==='circundar');
const destination=entries.find(v=>v.pt==='contornar');
lab.focus(origin.topic,origin.pt);
for(const fn of listeners.click||[])fn({preventDefault(){},target:{closest(sel){
 if(sel==='[data-verb-action]')return {dataset:{verbAction:'jump',verbId:String(destination.index)}};
 return null;
}}});
assert.ok(updates>0);
assert.match(lab.render(),/FAMÍLIA LEXICAL · Lateralidade e vizinhança/);
assert.ok(lab.render().includes('Diagrama do verbo contornar'));
assert.equal(lab.regency('bifurcar-se').exercise.answer,'em');
console.log('Atlas visual: 64/64 pictogramas únicos, descrição, comparação, responsividade, regência e progresso — OK');