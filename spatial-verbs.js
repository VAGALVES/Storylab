/* StoryLab · Laboratório dos Verbos Descritivos.
 * Extensão de dados append-only + interface independente, sem dependências ou chamadas de rede.
 */
window.StoryLabVerbLab=(()=>{
'use strict';
const source=window.STORYLAB_SPATIAL_VERB_DATA||[];
const D=window.STORYLAB_DATA,G=window.STORYLAB_ATLAS_GUIDES;
const state={family:0,term:'ladear',query:''};
const all=[];
let context=null,linked=false,base=null;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const diagrams={
side:'<rect x="92" y="20" width="76" height="72" rx="9" class="vl-core"/><rect x="39" y="26" width="24" height="60" rx="6" class="vl-focus"/><rect x="197" y="26" width="24" height="60" rx="6" class="vl-focus"/><path d="M70 56H86M174 56H190" class="vl-edge"/>',
surround:'<circle cx="130" cy="56" r="42" class="vl-outline"/><circle cx="130" cy="56" r="20" class="vl-core"/><path d="M130 8V17M130 95V104M82 56H90M170 56H179" class="vl-edge"/>',
overlap:'<rect x="74" y="18" width="91" height="63" rx="10" class="vl-core"/><rect x="113" y="38" width="91" height="63" rx="10" class="vl-focus"/><path d="M113 38H165V81H113Z" class="vl-overlap"/>',
cross:'<path d="M38 56H222" class="vl-outline"/><path d="M130 9V103" class="vl-edge"/><path d="M215 50L225 56L215 62M124 96L130 106L136 96" class="vl-stroke"/>',
axis:'<path d="M50 91L204 24" class="vl-edge"/><path d="M191 19L208 22L199 38" class="vl-stroke"/><path d="M50 24V94H121" class="vl-outline"/><circle cx="50" cy="94" r="5" class="vl-focus"/>',
cluster:'<circle cx="98" cy="40" r="15" class="vl-focus"/><circle cx="130" cy="35" r="15" class="vl-focus"/><circle cx="162" cy="43" r="15" class="vl-focus"/><circle cx="104" cy="75" r="15" class="vl-core"/><circle cx="141" cy="77" r="15" class="vl-core"/><circle cx="177" cy="77" r="15" class="vl-core"/>',
expand:'<rect x="100" y="32" width="60" height="49" rx="8" class="vl-core"/><rect x="74" y="10" width="112" height="95" rx="12" class="vl-outline"/><path d="M100 56H81M160 56H179M130 32V17M130 81V99" class="vl-edge"/>',
light:'<path d="M51 90L130 27L210 90" class="vl-outline"/><path d="M130 10V24M82 25L95 38M179 25L166 38" class="vl-edge"/><circle cx="130" cy="54" r="20" class="vl-focus"/>'
};
function diagram(kind,label){
 return '<svg class="vl-diagram" viewBox="0 0 260 115" role="img" aria-label="'+escape('Esquema simplificado: '+label)+'" xmlns="http://www.w3.org/2000/svg">'+(diagrams[kind]||diagrams.side)+'</svg>';
}
if(D&&G&&Array.isArray(D.atlas)&&Array.isArray(G)&&D.atlas.length===G.length&&source.length===8){
 base=D.atlas.length;
 source.forEach((group,i)=>{
  const topic=base+i;
  const terms=group.verbs.map(v=>{
   const normalized=fold(v.pt);
   if(!v.pt||!v.en||!v.noun||!v.adj||!v.grammar||!v.examplePT||!v.exampleEN)throw Error('Família verbal incompleta: '+v.pt);
   const definition=v.definition+' Substantivo '+(v.nounType==='relacionado'?'semanticamente relacionado':'derivado')+': '+v.noun+'. Forma '+v.adjType+': '+v.adj+'. Inglês: '+v.en+'.';
   const caution=v.contrast+' Regência: '+v.grammar+'.';
   const hint=v.definition.replace(/[.!]$/,'').toLowerCase();
   let scene='Para descrever com precisão a relação espacial apresentada, o verbo adequado é _____: '+hint+'. Observe a disposição real dos elementos antes de afirmar essa relação.';
   if(scene.length>220)scene=scene.slice(0,210).replace(/\s+\S*$/,'')+'.';
   if(fold(scene).includes(normalized))throw Error('Frase-lacuna revela resposta: '+v.pt);
   return [v.pt,definition,v.examplePT,caution,scene];
  });
  D.atlas.push({title:'Verbos · '+group.name,terms:group.verbs.map(v=>v.pt),prompt:'Descreva relações espaciais usando três verbos com regência correta, e explique como cada substantivo ou adjetivo amplia a descrição.'});
  G.push({scene:'Exercício de campo hipotético: '+group.name.toLowerCase()+' nas ruas de Xangai.',focus:'Observe formas e trajetórias e use verbos precisos; não confunda aproximação visual com contato físico.',terms,model:[
    'Primeiro observo a posição dos elementos antes de lhes atribuir um significado.',
    'A descrição ganha precisão quando utilizo '+group.verbs[0].pt+' e '+group.verbs[1].pt+' para esclarecer relações entre objetos.',
    'Em seguida, comparo os eixos, as superfícies e a escala dos espaços sem misturar observação e inferência.',
    'Concluo com uma hipótese identificada como tal, reconhecendo que a imagem sozinha não comprova causas, intenções ou dados quantitativos.'
  ],swaps:[]});
  group.verbs.forEach((verb,j)=>all.push({...verb,topic,index:all.length,group:i}));
 });
}
function lookup(topic,term){return all.find(v=>v.topic===topic&&v.pt===term)||null}
function filtered(){
 const q=fold(state.query.trim());
 return all.filter(v=>(state.family===-1||v.group===state.family)&&(!q||fold([v.pt,v.en,v.noun,v.adj,v.grammar,v.definition,v.examplePT,v.exampleEN].join(' ')).includes(q)));
}
function familyCell(label,word,type){
 return '<div class="vl-family-cell"><span class="vl-small">'+escape(label)+'</span><strong>'+escape(word)+'</strong><span class="vl-type">'+escape(type==='relacionado'?'Relacionado por sentido':type==='particípio'?'Particípio com uso adjetival':type==='adjetivo'?'Adjetivo': 'Formação derivada')+'</span></div>';
}
function details(v){
 const g=source[v.group];
 const near=all.filter(item=>item.group===v.group&&item.pt!==v.pt).slice(0,3);
 const note=v.pt==='ladear'?'“Lado” é correlato, não substantivo formado diretamente de “ladear”; “ladeamento” existe, mas é pouco frequente.':
  v.pt==='circundar'?'“Circundante” caracteriza o entorno; “circundado” descreve aquilo que foi rodeado. “Entorno” é relacionado, não derivado.':
  v.pt==='sobrepor'?'A forma “sobreposto” é particípio irregular de sobrepor; “sobreposição” é substantivo derivado.':
  v.pt==='sobressair'?'“Saliência” e “saliente” compartilham a ideia de destaque, mas não são derivações diretas de “sobressair”.':'';
 return '<section class="vl-detail panel panel-pad" aria-label="Família lexical de '+escape(v.pt)+'">'+
  '<div class="vl-kicker">FAMÍLIA LEXICAL · '+escape(g.name)+'</div><div class="vl-head"><div><h2>'+escape(v.pt)+'</h2><p class="vl-en" lang="en">'+escape(v.en)+'</p></div>'+diagram(g.diagram,g.name)+'</div>'+
  '<p class="vl-definition">'+escape(v.definition)+'</p>'+
  '<div class="vl-derivation">'+familyCell('SUBSTANTIVO',v.noun,v.nounType)+familyCell('ADJETIVO / PARTICÍPIO',v.adj,v.adjType)+'</div>'+
  '<p class="vl-note"><strong>Regência:</strong> '+escape(v.grammar)+'</p>'+
  (note?'<div class="notice info">'+escape(note)+'</div>':'')+
  '<div class="vl-examples"><div><div class="vl-small">DESCRIÇÃO EM PORTUGUÊS</div><p>'+escape(v.examplePT)+'</p></div>'+
  '<div><div class="vl-small">ENGLISH · CONTEXTO</div><p lang="en">'+escape(v.exampleEN)+'</p></div></div>'+
  '<div class="vl-warning"><strong>Não confunda:</strong> '+escape(v.contrast)+'</div>'+
  '<div class="vl-actions"><button type="button" class="btn secondary sm" data-verb-action="copy-pt" data-verb-id="'+v.index+'">Copiar frase PT</button>'+
  '<button type="button" class="btn secondary sm" data-verb-action="copy-en" data-verb-id="'+v.index+'">Copiar frase EN</button>'+
  '<button type="button" class="btn accent sm" data-verb-action="open" data-verb-id="'+v.index+'">Estudar e treinar no Atlas</button></div>'+
  '<div class="vl-related"><div class="vl-small">VERBOS DO MESMO CAMPO</div><div class="vl-tags">'+near.map(o=>'<button type="button" class="vl-chip" data-verb-action="jump" data-verb-id="'+o.index+'">'+escape(o.pt)+'</button>').join('')+'</div></div></section>';
}
function render(){
 if(!all.length)return '<div class="notice info">Corpus verbal indisponível.</div>';
 const list=filtered();
 const current=list.find(v=>v.pt===state.term)||list[0];
 return '<div class="vl-root">'+
  '<div class="panel panel-pad vl-intro"><div class="vl-kicker">ATLAS · LABORATÓRIO DE PRECISÃO ESPACIAL</div>'+
  '<h2>Verbos que desenham a cena</h2><p>Descreva relações entre objetos, percursos, superfícies e mudanças. Explore o verbo, sua família lexical, regência e equivalentes em inglês — distinguindo derivação real de parentesco semântico.</p>'+
  '<div class="vl-metrics"><span><strong>'+all.length+'</strong> verbos</span><span><strong>'+source.length+'</strong> campos</span><span><strong>PT + EN</strong> exemplos</span></div></div>'+
  '<div class="vl-tools panel panel-pad"><label class="field-label" for="vl-search">Buscar verbo, substantivo, adjetivo ou inglês</label>'+
  '<input id="vl-search" class="search" data-verb-search="1" value="'+escape(state.query)+'" placeholder="Ex.: ladear, sobreposição, circundante, overlap">'+
  '<div class="vl-tags vl-group-filter"><button type="button" class="vl-chip '+(state.family===-1?'active':'')+'" data-verb-action="family" data-family="-1" aria-pressed="'+(state.family===-1)+'">Todas</button>'+
  source.map((g,i)=>'<button type="button" class="vl-chip '+(state.family===i?'active':'')+'" data-verb-action="family" data-family="'+i+'" aria-pressed="'+(state.family===i)+'">'+escape(g.name)+'</button>').join('')+'</div></div>'+
  '<div class="vl-layout"><aside class="panel panel-pad vl-list"><div class="vl-kicker">'+list.length+' RESULTADOS</div>'+
  (list.length?list.map(v=>'<button type="button" class="vl-item '+(v.index===current?.index?'selected':'')+'" data-verb-action="select" data-verb-id="'+v.index+'" aria-current="'+(v.index===current?.index?'true':'false')+'"><strong>'+escape(v.pt)+'</strong><span>'+escape(v.en)+'</span></button>').join(''):'<p class="muted">Nenhum resultado. Selecione “Todas” ou tente outra expressão.</p>')+
  '</aside>'+(current?details(current):'<div class="panel panel-pad">Nenhum verbo encontrado.</div>')+'</div></div>';
}
function bind(api){
 context=api;
 if(linked)return;
 linked=true;
 document.addEventListener('click',event=>{
  const b=event.target?.closest?.('[data-verb-action]');
  if(!b)return;
  event.preventDefault();
  const action=b.dataset.verbAction,id=Number(b.dataset.verbId),v=all[id];
  if(action==='family'){const index=Number(b.dataset.family);if(index>=-1&&index<source.length){state.family=index;state.query='';state.term='';context.render()}return}
  if(action==='select'||action==='jump'){if(!v)return;state.family=v.group;state.term=v.pt;state.query='';context.render();return}
  if(!v)return;
  if(action==='copy-pt')context.copy(v.examplePT);
  if(action==='copy-en')context.copy(v.exampleEN);
  if(action==='open')context.open(v.topic,v.pt);
 });
 document.addEventListener('input',event=>{
  const t=event.target;
  if(!t?.matches?.('[data-verb-search]'))return;
  state.query=t.value;
  state.family=-1;
  const caret=t.selectionStart??t.value.length;
  context.render();
  const next=document.getElementById('vl-search');
  if(next){next.focus();next.setSelectionRange?.(caret,caret)}
 });
}
function focus(topic,term){const v=lookup(topic,term);if(!v)return false;state.family=v.group;state.term=v.pt;state.query='';return true}
return {render,bind,lookup,focus,entries:()=>all.slice(),base:()=>base,groups:()=>source.length,_test:{filtered,selectFamily:i=>{state.family=i;state.query=''},search:q=>{state.query=q;state.family=-1}}};
})();
