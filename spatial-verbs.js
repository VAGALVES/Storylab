/* StoryLab · Laboratório dos Verbos Descritivos.
 * Extensão de dados append-only + interface independente, sem dependências ou chamadas de rede.
 */
window.StoryLabVerbLab=(()=>{
'use strict';
const source=window.STORYLAB_SPATIAL_VERB_DATA||[];
const regencyGroups=window.STORYLAB_SPATIAL_REGENCY_DATA||[];
const regency=new Map();
regencyGroups.forEach((group,i)=>group.records.forEach((entry,j)=>{if(source[i]?.verbs[j]?.pt!==entry.verb)throw Error('Regência fora de ordem: '+entry.verb);regency.set(entry.verb,entry)}));
const D=window.STORYLAB_DATA,G=window.STORYLAB_ATLAS_GUIDES;
const state={family:0,term:'ladear',query:'',mode:'explore',quiz:null};
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
  group.verbs.forEach((verb,j)=>all.push({...verb,topic,index:all.length,group:i,regency:regency.get(verb.pt)||null}));
 });
}
function lookup(topic,term){return all.find(v=>v.topic===topic&&v.pt===term)||null}
function filtered(){
 const q=fold(state.query.trim());
 return all.filter(v=>(state.family===-1||v.group===state.family)&&(!q||fold([v.pt,v.en,v.noun,v.adj,v.grammar,v.definition,v.examplePT,v.exampleEN,...(v.regency?.patterns||[]).flatMap(p=>[p.structure,p.pt,p.en])].join(' ')).includes(q)));
}
function familyCell(label,word,type){
 return '<div class="vl-family-cell"><span class="vl-small">'+escape(label)+'</span><strong>'+escape(word)+'</strong><span class="vl-type">'+escape(type==='relacionado'?'Relacionado por sentido':type==='particípio'?'Particípio com uso adjetival':type==='adjetivo'?'Adjetivo': 'Formação derivada')+'</span></div>';
}

function regencyPanel(v){
 const entry=v.regency;
 if(!entry)return '';
 const patterns=entry.patterns.map((p,i)=>'<div class="vr-pattern"><div class="vr-pattern-top"><span class="vl-small">'+escape(p.label)+'</span><button type="button" class="vr-copy" data-verb-action="copy-pattern" data-verb-id="'+v.index+'" data-pattern="'+i+'" aria-label="Copiar exemplo da construção '+(i+1)+'">Copiar</button></div>'+
  '<strong class="vr-structure">'+escape(p.structure)+'</strong><p>'+escape(p.pt)+'</p><p class="vr-english" lang="en">'+escape(p.en)+'</p></div>').join('');
 return '<section class="vr-regency" aria-label="Regência e construções de '+escape(v.pt)+'"><div class="vr-section-heading"><div><div class="vl-kicker">SINTAXE APLICADA</div><h3>Regência e construções</h3></div><button type="button" class="btn accent sm" data-verb-action="practice" data-scope="verb" data-verb-id="'+v.index+'">Praticar regência</button></div>'+
 '<p class="vr-context">Acompanhe a posição dos complementos e das preposições. Algumas expressões indicam localização ou circunstância: não são necessariamente exigidas pelo verbo.</p>'+
 '<div class="vr-pattern-grid">'+patterns+'</div><p class="vr-grammar-note"><strong>Critério de precisão:</strong> '+escape(entry.note)+'</p></section>';
}
const PREPOSITIONS=['por','de','com','a','à','ao','em','no','na','entre','para','até','sobre','sem','da','pelo','após','ao longo da','ao longo do','à beira de','nas proximidades de','em direção à','em direção ao','na direção da','para fora da','em relação à','em relação ao','junto à','perto da','às'];
function optionsFor(item){
 const ans=item.regency.exercise.answer, pool=PREPOSITIONS.filter(x=>x!==ans);
 const start=(item.index*7+3)%pool.length;
 const others=[pool[start],pool[(start+9)%pool.length],pool[(start+18)%pool.length]];
 const values=[ans,...others];const step=item.index%4;
 return values.slice(step).concat(values.slice(0,step));
}
function beginPractice(scope,item){
 let items=[];
 if(scope==='verb'&&item)items=[item.index];
 else if(scope==='all')items=source.flatMap((_,i)=>all.filter(v=>v.group===i).slice(0,2).map(v=>v.index));
 else items=all.filter(v=>v.group===state.family).map(v=>v.index);
 if(!items.length)return;
 state.mode='practice';state.quiz={items,cursor:0,picked:null,correct:0,done:false,scope};
}
function practiceView(){
 const q=state.quiz;
 if(!q)return '<div class="panel panel-pad">Nenhum exercício ativo.</div>';
 const total=q.items.length,store=context?.getStore?.()||{},records=store.verbRegencyStats||{};
 const answered=Object.values(records).filter(v=>v&&v.attempts>0).length;
 const right=Object.values(records).filter(v=>v&&v.correct>0).length;
 let html='<div class="vl-root"><div class="panel panel-pad vr-intro"><div class="vl-kicker">OFICINA DE REGÊNCIA · RECUPERAÇÃO ATIVA</div><h2>Construa relações com precisão</h2><p>Escolha a preposição ou locução usada no modelo editorial. Algumas alternativas poderiam formar outras frases; aqui importa a relação específica ensinada.</p><div class="vl-metrics"><span><strong>'+answered+' / 64</strong> estruturas tentadas</span><span><strong>'+right+'</strong> com acerto registrado</span></div>'+
 '<button type="button" class="btn secondary sm" data-verb-action="practice-exit">Voltar aos verbos</button></div>';
 if(q.done){
  html+='<section class="panel panel-pad vr-quiz" role="status"><div class="vl-kicker">RODADA CONCLUÍDA</div><h3>'+q.correct+' de '+total+' respostas corretas</h3><p>As respostas incorretas podem ser praticadas novamente. O histórico de tentativas fica salvo no seu aparelho.</p><div class="vl-actions"><button class="btn accent" data-verb-action="practice-restart">Refazer rodada</button><button class="btn secondary" data-verb-action="practice-exit">Explorar verbos</button></div></section>';
  return html+'</div>';
 }
 const item=all[q.items[q.cursor]],ex=item.regency.exercise,picked=q.picked,correct=picked===ex.answer;
 html+='<section class="panel panel-pad vr-quiz"><div class="vl-kicker">'+escape(source[item.group].name)+' · '+escape(item.pt)+'</div><div class="vr-progress-label">QUESTÃO '+(q.cursor+1)+' DE '+total+'</div><div class="vr-progress" role="progressbar" aria-label="Progresso do treino" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+(q.cursor+(picked!==null?1:0))+'"><span style="width:'+Math.round((q.cursor+(picked!==null?1:0))*100/total)+'%"></span></div>'+
 '<h3>Qual expressão completa a descrição?</h3><p class="vr-prompt">'+escape(ex.prompt)+'</p><div class="vr-options" role="group" aria-label="Escolha uma resposta">'+optionsFor(item).map(opt=>{
 let cls='vr-option';if(picked!==null&&opt===ex.answer)cls+=' correct';else if(picked!==null&&opt===picked)cls+=' wrong';
 return '<button type="button" class="'+cls+'" data-verb-action="practice-answer" data-answer="'+escape(opt)+'" '+(picked!==null?'disabled':'')+'>'+escape(opt)+'</button>';
 }).join('')+'</div>';
 if(picked!==null){
  const p=item.regency.patterns.find(p=>p.pt.includes(ex.answer))||item.regency.patterns[1];
  html+='<div class="vr-feedback '+(correct?'ok':'wrong')+'" role="status"><strong>'+(correct?'Correto.':'A construção de referência utiliza: '+escape(ex.answer)+'.')+'</strong><p>'+escape(p.pt)+'</p><p lang="en">'+escape(p.en)+'</p><p>'+escape(ex.explanation)+'</p></div>'+
  '<button type="button" class="btn accent" data-verb-action="practice-next">'+(q.cursor===total-1?'Ver resultado':'Próxima questão')+'</button>';
 }
 html+='</section></div>';
 return html;
}

/* Relações escolhidas editorialmente: preferir contrastes didáticos a vizinhos aleatórios. */
const semanticPairs={"ladear":["flanquear","contornar"],"flanquear":["ladear","circundar"],"margear":["beirar","contornar"],"beirar":["margear","avizinhar-se"],"alinhar":["justapor","intercalar"],"justapor":["sobrepor","intercalar"],"avizinhar-se":["justapor","ladear"],"contornar":["circundar","rodear"],"circundar":["contornar","rodear"],"cercar":["delimitar","circundar"],"rodear":["circundar","envolver"],"envolver":["cercar","recobrir"],"delimitar":["demarcar","cercar"],"demarcar":["delimitar","emoldurar"],"emoldurar":["envolver","ocultar"],"isolar":["interligar","fragmentar"],"sobrepor":["justapor","superpor"],"superpor":["sobrepor","revestir"],"interpor":["intercalar","sobrepor"],"intercalar":["interpor","distribuir"],"encaixar":["embutir","justapor"],"embutir":["encaixar","revestir"],"revestir":["recobrir","embutir"],"recobrir":["revestir","sombrear"],"atravessar":["cruzar","transpor"],"cruzar":["atravessar","convergir"],"transpor":["atravessar","desviar"],"percorrer":["serpentear","prolongar"],"desviar":["contornar","percorrer"],"serpentear":["ondular","percorrer"],"bifurcar-se":["convergir","interligar"],"convergir":["bifurcar-se","agrupar"],"orientar":["direcionar","apontar"],"direcionar":["apontar","orientar"],"apontar":["direcionar","projetar"],"inclinar":["rebaixar","elevar"],"elevar":["rebaixar","sobressair"],"rebaixar":["elevar","nivelar"],"projetar":["avançar","recuar"],"prolongar":["expandir","percorrer"],"agrupar":["concentrar","distribuir"],"dispersar":["concentrar","distribuir"],"concentrar":["dispersar","agrupar"],"distribuir":["agrupar","intercalar"],"adensar":["verticalizar","agrupar"],"fragmentar":["interligar","isolar"],"ocupar":["concentrar","distribuir"],"interligar":["fragmentar","isolar"],"expandir":["alargar","prolongar"],"alargar":["estreitar","expandir"],"estreitar":["alargar","recuar"],"verticalizar":["adensar","sobressair"],"nivelar":["escalonar","rebaixar"],"escalonar":["nivelar","verticalizar"],"recuar":["avançar","projetar"],"avançar":["recuar","projetar"],"refletir":["iluminar","sombrear"],"sombrear":["iluminar","ocultar"],"iluminar":["sombrear","revelar"],"ocultar":["revelar","emoldurar"],"revelar":["ocultar","emoldurar"],"ondular":["serpentear","inclinar"],"sobressair":["verticalizar","contrastar"],"contrastar":["sobressair","alinhar"]};
function relatedVerbs(v){return (semanticPairs[v.pt]||[]).map(name=>all.find(item=>item.pt===name)).filter(Boolean)}
function diagramCaption(v){return window.StoryLabVerbIcons?.caption?.(v.iconKey||v.pt)||''}
function miniDiagram(v){return window.StoryLabVerbIcons?.render?.(v.iconKey||v.pt,v.pt,{mini:true})||''}
function specificDiagram(v){return window.StoryLabVerbIcons?.render?.(v.iconKey||v.pt,v.pt)||diagram(source[v.group].diagram,source[v.group].name)}
function details(v){
 const g=source[v.group];
 const near=relatedVerbs(v);
 const note=v.pt==='ladear'?'“Lado” é correlato, não substantivo formado diretamente de “ladear”; “ladeamento” existe, mas é pouco frequente.':
  v.pt==='circundar'?'“Circundante” caracteriza o entorno; “circundado” descreve aquilo que foi rodeado. “Entorno” é relacionado, não derivado.':
  v.pt==='sobrepor'?'A forma “sobreposto” é particípio irregular de sobrepor; “sobreposição” é substantivo derivado.':
  v.pt==='sobressair'?'“Saliência” e “saliente” compartilham a ideia de destaque, mas não são derivações diretas de “sobressair”.':'';
 return '<section class="vl-detail panel panel-pad" aria-label="Família lexical de '+escape(v.pt)+'">'+
  '<div class="vl-kicker">FAMÍLIA LEXICAL · '+escape(g.name)+'</div><div class="vl-head"><div><h2>'+escape(v.pt)+'</h2><p class="vl-en" lang="en">'+escape(v.en)+'</p></div><figure class="vl-visual">'+specificDiagram(v)+'<figcaption class="vl-diagram-caption">'+escape(diagramCaption(v))+'</figcaption></figure></div>'+
  '<p class="vl-definition">'+escape(v.definition)+'</p>'+
  '<div class="vl-derivation">'+familyCell('SUBSTANTIVO',v.noun,v.nounType)+familyCell('ADJETIVO / PARTICÍPIO',v.adj,v.adjType)+'</div>'+
  '<p class="vl-note"><strong>Regência básica:</strong> '+escape(v.grammar)+'</p>'+
  (note?'<div class="notice info">'+escape(note)+'</div>':'')+
  regencyPanel(v)+
  '<div class="vl-examples"><div><div class="vl-small">DESCRIÇÃO EM PORTUGUÊS</div><p>'+escape(v.examplePT)+'</p></div>'+
  '<div><div class="vl-small">ENGLISH · CONTEXTO</div><p lang="en">'+escape(v.exampleEN)+'</p></div></div>'+
  '<div class="vl-warning"><strong>Não confunda:</strong> '+escape(v.contrast)+'</div>'+
  '<div class="vl-actions"><button type="button" class="btn secondary sm" data-verb-action="copy-pt" data-verb-id="'+v.index+'">Copiar frase PT</button>'+
  '<button type="button" class="btn secondary sm" data-verb-action="copy-en" data-verb-id="'+v.index+'">Copiar frase EN</button>'+
  '<button type="button" class="btn accent sm" data-verb-action="open" data-verb-id="'+v.index+'">Estudar e treinar no Atlas</button>'+
  '<button type="button" class="btn secondary sm" data-verb-action="contrast-start" data-scope="pair" data-verb-id="'+v.index+'">Duelo visual deste verbo</button></div>'+
  '<div class="vl-related"><div class="vl-small">COMPARE AS RELAÇÕES</div><div class="vl-tags">'+near.map(o=>'<button type="button" class="vl-chip vl-compare" data-verb-action="jump" data-verb-id="'+o.index+'">'+miniDiagram(o)+'<span>'+escape(o.pt)+'</span></button>').join('')+'</div></div></section>';
}
function render(){
 if(state.mode==='contrast')return window.StoryLabVerbContrast?.render?.()||'<div class="notice info">Treino de contraste indisponível.</div>';
 if(state.mode==='practice')return practiceView();
 if(!all.length)return '<div class="notice info">Corpus verbal indisponível.</div>';
 const list=filtered();
 const current=list.find(v=>v.pt===state.term)||list[0];
 return '<div class="vl-root">'+
  '<div class="panel panel-pad vl-intro"><div class="vl-kicker">ATLAS · LABORATÓRIO DE PRECISÃO ESPACIAL</div>'+
  '<h2>Verbos que desenham a cena</h2><p>Descreva relações entre objetos, percursos, superfícies e mudanças. Explore o verbo, sua família lexical, regência e equivalentes em inglês — distinguindo derivação real de parentesco semântico.</p>'+
  '<div class="vl-metrics"><span><strong>'+all.length+'</strong> verbos</span><span><strong>'+source.length+'</strong> campos</span><span><strong>128</strong> construções bilíngues</span></div>'+
  '<div class="vc-entry"><div><div class="vl-kicker">NOVO · OFICINA VISUAL</div><strong>Qual verbo descreve melhor a cena?</strong><p>Dois desenhos, uma situação e uma decisão. Receba explicações em português e inglês e reforce as diferenças que ainda confundem.</p></div><div class="vc-entry-actions"><button type="button" class="btn accent sm" data-verb-action="contrast-start" data-scope="quick">Começar · 8 cenas</button><button type="button" class="btn secondary sm" data-verb-action="contrast-start" data-scope="weak">Reforçar dificuldades</button><button type="button" class="btn secondary sm" data-verb-action="contrast-start" data-scope="all">Todas as 64 cenas</button></div></div>'+
  '<div class="vl-actions"><button type="button" class="btn secondary sm" data-verb-action="practice" data-scope="field">Praticar regência deste campo</button><button type="button" class="btn secondary sm" data-verb-action="practice" data-scope="all">Treino misto de regência</button></div></div>'+
  '<div class="vl-tools panel panel-pad"><label class="field-label" for="vl-search">Buscar verbo, substantivo, adjetivo ou inglês</label>'+
  '<input id="vl-search" class="search" data-verb-search="1" value="'+escape(state.query)+'" placeholder="Ex.: ladear, sobreposição, circundante, overlap">'+
  '<div class="vl-tags vl-group-filter"><button type="button" class="vl-chip '+(state.family===-1?'active':'')+'" data-verb-action="family" data-family="-1" aria-pressed="'+(state.family===-1)+'">Todas</button>'+
  source.map((g,i)=>'<button type="button" class="vl-chip '+(state.family===i?'active':'')+'" data-verb-action="family" data-family="'+i+'" aria-pressed="'+(state.family===i)+'">'+escape(g.name)+'</button>').join('')+'</div></div>'+
  '<div class="vl-layout"><aside class="panel panel-pad vl-list"><div class="vl-kicker">'+list.length+' RESULTADOS</div>'+
  (list.length?list.map(v=>{const mini=miniDiagram(v);return '<button type="button" class="vl-item '+(mini?'vl-item-illustrated ':'')+(v.index===current?.index?'selected':'')+'" data-verb-action="select" data-verb-id="'+v.index+'" aria-current="'+(v.index===current?.index?'true':'false')+'">'+(mini?'<span class="vl-item-icon">'+mini+'</span>':'')+'<span class="vl-item-words"><strong>'+escape(v.pt)+'</strong><span class="vl-item-en">'+escape(v.en)+'</span></span></button>'}).join(''):'<p class="muted">Nenhum resultado. Selecione “Todas” ou tente outra expressão.</p>')+
  '</aside>'+(current?details(current):'<div class="panel panel-pad">Nenhum verbo encontrado.</div>')+'</div></div>';
}
function bind(api){
 context=api;
 window.StoryLabVerbContrast?.bind?.({render:()=>context.render(),getStore:()=>context.getStore?.(),save:()=>context.save?.(),exit:()=>{state.mode='explore';context.render()},inspect:verb=>{const item=all.find(v=>v.pt===verb);if(item){state.mode='explore';state.family=item.group;state.term=verb;state.query='';context.render()}}});
 if(linked)return;
 linked=true;
 document.addEventListener('click',event=>{
  const b=event.target?.closest?.('[data-verb-action]');
  if(!b)return;
  event.preventDefault();
  const action=b.dataset.verbAction,id=Number(b.dataset.verbId),v=all[id];
  if(action==='contrast-start'){const scope=b.dataset.scope||'quick';if(window.StoryLabVerbContrast?.start?.(scope,v?.pt)){state.mode='contrast';context.render()}return}
  if(action==='practice'){beginPractice(b.dataset.scope||'field',v);context.render();return}
  if(action==='practice-exit'){state.mode='explore';state.quiz=null;context.render();return}
  if(action==='practice-restart'){beginPractice(state.quiz?.scope||'field',all[state.quiz?.items?.[0]]);context.render();return}
  if(action==='practice-answer'){
   const q=state.quiz;if(!q||q.done||q.picked!==null)return;
   const item=all[q.items[q.cursor]],answer=b.dataset.answer;
   if(!optionsFor(item).includes(answer))return;
   q.picked=answer;
   const st=context?.getStore?.();
   if(st){if(!st.verbRegencyStats||typeof st.verbRegencyStats!=='object'||Array.isArray(st.verbRegencyStats))st.verbRegencyStats={};
    const prev=st.verbRegencyStats[item.pt]||{attempts:0,correct:0};
    st.verbRegencyStats[item.pt]={attempts:(Number(prev.attempts)||0)+1,correct:(Number(prev.correct)||0)+(answer===item.regency.exercise.answer?1:0),last:Date.now()};
    context.save?.();
   }
   if(answer===item.regency.exercise.answer)q.correct++;
   context.render();return;
  }
  if(action==='practice-next'){
   const q=state.quiz;if(!q||q.picked===null||q.done)return;
   if(q.cursor>=q.items.length-1)q.done=true;else{q.cursor++;q.picked=null}
   context.render();return;
  }
  if(action==='copy-pattern'){if(!v)return;const i=Number(b.dataset.pattern),p=v.regency?.patterns[i];if(p)context.copy(p.pt+'\n'+p.en);return}
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
return {render,bind,lookup,focus,regency:term=>regency.get(term)||null,entries:()=>all.slice(),base:()=>base,groups:()=>source.length,_test:{filtered,selectFamily:i=>{state.family=i;state.query=''},search:q=>{state.query=q;state.family=-1}}};
})();
