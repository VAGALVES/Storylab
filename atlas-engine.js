/* StoryLab Shanghai · Atlas Descritivo 1.2
   Módulo independente para aprendizado lexical e prática autoral.
   Não envia rascunhos para servidores. */
window.StoryLabAtlas=(()=>{
'use strict';
const LEVELS=[
 ['Observar','20 s','Diga o que a câmera mostra, sem adivinhar história, autoria ou intenção.'],
 ['Descrever','40 s','Acrescente dois detalhes concretos e a relação entre eles.'],
 ['Comparar','60 s','Compare duas partes da cena usando um critério perceptível.'],
 ['Interpretar','90 s','Conclua com uma interpretação pessoal claramente identificada como tal.']
];
const view={topic:0,tab:'explore',word:'',query:'',level:0,show:false,score:3,feedback:null};
let api=null;
function g(){return window.STORYLAB_ATLAS_GUIDES?.[view.topic]}
function key(){return view.topic+':'+view.level}
function draft(){return String(api.getStore().atlasDrafts?.[key()]||'')}
function model(){return g().model.slice(0,view.level+1).join(' ')}
function sayWords(t){return t.trim()?t.trim().split(/\s+/).length:0}
function analyze(t){
 const words=sayWords(t), terms=g().terms.filter(x=>api.norm(t).includes(api.norm(x[0]))).map(x=>x[0]);
 const vague=(api.norm(t).match(/\b(bonito|legal|incrivel|maravilhoso|superlegal)\b/g)||[]).length;
 const tips=[];
 if(words<25)tips.push('Inclua outro detalhe verificável para dar mais substância à descrição.');
 if(terms.length===0)tips.push('Experimente um termo do campo, somente se ele corresponder ao que observou.');
 if(vague)tips.push('Substitua elogios genéricos por forma, posição, textura, luz, som ou movimento.');
 if(view.level>1&&!/compar|enquanto|diferente|ao contr.rio|mais .* que|menos .* que|por outro lado/i.test(api.norm(t)))tips.push('Nesta etapa, torne explícito o critério da comparação.');
 if(view.level===3&&!/minha impress.o|na minha|para mim|eu penso|me parece|considero/i.test(api.norm(t)))tips.push('Identifique claramente a conclusão como sua interpretação.');
 return {words,terms,vague,tips};
}
function button(action,label,cls='',attr=''){return '<button type="button" class="'+cls+'" data-atlas-action="'+action+'" '+attr+'>'+label+'</button>'}
function currentCard(){
 const term=view.word&&api.D.atlas[view.topic].terms.includes(view.word)?view.word:g().terms[0][0];
 return {term,card:g().terms.find(x=>x[0]===term)};
}
function termButtons(){
 const {D,esc,norm}=api;
 if(view.query.trim()){
  const q=norm(view.query),matches=[];
  D.atlas.forEach((group,i)=>group.terms.forEach(term=>{
   const c=window.STORYLAB_ATLAS_GUIDES[i].terms.find(x=>x[0]===term);
   if(norm([group.title,term,...(c||[])].join(' ')).includes(q))matches.push({term,i});
  }));
  return '<div class="atlas12-list"><div class="eyebrow">'+matches.length+' RESULTADOS NO ATLAS</div><div class="atlas12-tags">'+matches.slice(0,70).map(x=>button('word',esc(x.term)+' <small>'+esc(D.atlas[x.i].title)+'</small>','atlas12-term','data-topic="'+x.i+'" data-word="'+esc(x.term)+'"')).join('')+'</div>'+(matches.length>70?'<p class="muted small">Refine sua busca para ver outros resultados.</p>':'')+'</div>';
 }
 const terms=D.atlas[view.topic].terms, selected=currentCard().term;
 return '<div class="atlas12-list"><div class="eyebrow">REPERTÓRIO DO CAMPO</div><div class="atlas12-tags">'+terms.map(term=>{
  const rich=g().terms.some(t=>t[0]===term);
  return button('word',esc(term)+(rich?' <span aria-label="Verbete aprofundado">●</span>':''),'atlas12-term '+(selected===term?'active':''),'data-topic="'+view.topic+'" data-word="'+esc(term)+'"');
 }).join('')+'</div><p class="muted small" style="margin:12px 0 0">● Verbete comentado. Os 160 termos originais continuam disponíveis; 64 têm explicação, exemplo e alerta editorial.</p></div>';
}
function dictionary(){
 const {esc,ico}=api,{term,card}=currentCard(),area=api.D.atlas[view.topic];
 let detail='<div class="panel panel-pad atlas12-detail"><div class="eyebrow">CONCEITO EM CONTEXTO · '+esc(area.title.toUpperCase())+'</div><h2>'+esc(term)+'</h2>';
 if(card)detail+='<p class="atlas12-definition">'+esc(card[1])+'</p><div class="atlas12-example"><div class="eyebrow">DIGA ASSIM</div><p>'+esc(card[2])+'</p></div><div class="atlas12-warning"><div class="eyebrow">PRECISÃO E CUIDADO</div><p>'+esc(card[3])+'</p></div>';
 else detail+='<p class="muted">Termo do repertório essencial. O verbete aprofundado ainda está em construção. Evite empregar uma palavra cujo significado ou aplicação não tenha confirmado.</p><div class="notice info">'+esc(area.prompt)+'</div>';
 detail+='<div class="form-row">'+button('copy',ico('copy',15)+' Copiar termo','btn secondary sm')+button('practice',ico('mic',15)+' Praticar este campo','btn accent sm')+'</div></div>';
 return '<div class="atlas12-columns"><div class="panel panel-pad"><div class="eyebrow">ENCONTRE A PALAVRA PRECISA</div><p class="muted small">'+esc(g().focus)+'</p>'+termButtons()+'</div>'+detail+'</div>';
}
function history(){
 const {esc}=api,st=api.getStore(),h=st.atlasHistory||[];
 return '<div class="panel panel-pad"><div class="eyebrow">CADERNO DE PRÁTICA</div><h3 style="margin:10px 0">'+h.length+' registro(s)</h3>'+(h.length?h.slice(-5).reverse().map(x=>{
  const idx=h.indexOf(x);
  return '<div class="atlas12-history"><strong>'+esc(api.D.atlas[x.topic]?.title||'Campo')+' · Nível '+(x.level+1)+'</strong><p class="muted small">'+esc(x.text.slice(0,105))+'</p><span class="muted small">Autoavaliação: '+x.score+'/5</span> '+button('restore','Reabrir','btn secondary sm','data-index="'+idx+'"')+'</div>';
 }).join(''):'<p class="muted small">Sua primeira descrição registrada aparecerá aqui.</p>')+'</div>';
}
function exercise(){
 const {esc,ico}=api,st=api.getStore(),text=draft(),feedback=view.feedback,level=LEVELS[view.level];
 let card='<div class="panel panel-pad atlas12-work"><div class="eyebrow">EXERCÍCIO GUIADO · CENA HIPOTÉTICA</div><h2>'+esc(g().scene)+'</h2><div class="atlas12-steps" role="group" aria-label="Etapas progressivas">'+LEVELS.map((l,i)=>button('level','0'+(i+1)+' · '+esc(l[0]),'atlas12-step '+(view.level===i?'active':''),'data-level="'+i+'"')).join('')+'</div><p class="muted"><strong>'+esc(level[1])+' sugeridos.</strong> '+esc(level[2])+'</p><div class="notice info">'+esc(g().focus)+'</div><label class="field-label" for="atlas12-writing" style="margin-top:22px">Sua narração</label><textarea id="atlas12-writing" class="field atlas12-writing" data-atlas-writing="1" rows="8" maxlength="3000" placeholder="Descreva somente o que de fato observou...">'+esc(text)+'</textarea><div class="row"><span class="small muted">Rascunho salvo automaticamente</span><span id="atlas12-count" class="small muted">'+sayWords(text)+' palavras</span></div><div class="form-row" style="margin-top:16px">'+button('review',ico('target',14)+' Analisar texto','btn accent')+button('model',ico('book',14)+(view.show?' Ocultar':' Ver')+' exemplo','btn secondary')+'</div>';
 if(feedback)card+='<div class="atlas12-feedback" role="status"><strong>Indicadores simples — não é correção por IA</strong><p>'+feedback.words+' palavras · '+feedback.terms.length+' termos do campo · '+feedback.vague+' elogios genéricos</p>'+(feedback.tips.length?'<ul>'+feedback.tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'<p>Releia em voz alta e confira a precisão de cada informação.</p>')+'</div>';
 if(view.show)card+='<div class="atlas12-example"><div class="eyebrow">EXEMPLO AUTORAL · SITUAÇÃO FICTÍCIA</div><p>'+esc(model())+'</p><div class="form-row">'+button('listen',ico('volume',14)+' Ouvir','btn secondary sm')+button('copy-model',ico('copy',14)+' Copiar modelo','btn secondary sm')+'</div></div>';
 card+='<div class="divider"></div><div class="form-row" style="align-items:end"><div><label class="field-label" for="atlas12-rating">Sua autoavaliação</label><select id="atlas12-rating" data-atlas-rating="1">'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(view.score===n?'selected':'')+'>'+n+' / 5</option>').join('')+'</select></div>'+button('save',ico('check',14)+' Registrar prática','btn accent')+button('tele',ico('film',14)+' Teleprompter','btn secondary')+'</div><p class="muted small">Nenhum resultado é tratado como prova de habilidade ou verificação factual automática.</p></div>';
 return '<div class="atlas12-columns"><div class="stack">'+card+'</div><aside class="stack"><div class="panel panel-pad"><div class="eyebrow">ESCADA NARRATIVA</div><p class="muted">01 Observar → 02 Detalhar → 03 Comparar → 04 Interpretar. Em cada nível, o exemplo incorpora os anteriores.</p><p class="muted">Pratique primeiro sem olhar o modelo. Grave sua voz no Estúdio da Voz quando quiser.</p>'+button('voice',ico('mic',14)+' Ir ao Estúdio da Voz','btn secondary sm')+'</div>'+history()+'</aside></div>';
}
function render(){
 if(!api)return '';
 const {D,esc,header,stat,ico}=api,terms=D.atlas.reduce((n,a)=>n+a.terms.length,0),rich=window.STORYLAB_ATLAS_GUIDES.reduce((n,a)=>n+a.terms.length,0),h=api.getStore().atlasHistory||[];
 return header('VOCABULÁRIO / CAMADAS DA COMUNICAÇÃO','Atlas Descritivo','Aprenda palavras pelo contexto, compare descrições e pratique quatro níveis de narração. Não confunda impressão pessoal com fato verificado.')+
 '<div class="grid grid-4" style="margin-bottom:20px">'+stat('Campos',D.atlas.length)+stat('Termos originais',terms)+stat('Verbetes aprofundados',rich)+stat('Práticas registradas',h.length)+'</div>'+
 '<div class="panel panel-pad atlas12-toolbar"><div><label class="field-label" for="atlas12-topic">Campo de observação</label><select id="atlas12-topic" data-atlas-topic="1">'+D.atlas.map((a,i)=>'<option value="'+i+'" '+(i===view.topic?'selected':'')+'>'+esc(a.title)+'</option>').join('')+'</select></div><div><label class="field-label" for="atlas12-search">Buscar em todo o Atlas</label><input id="atlas12-search" class="search" data-atlas-query="1" value="'+esc(view.query)+'" placeholder="Ex.: luz rasante, caimento, fachada..."></div></div>'+
 '<div class="filters" role="tablist" aria-label="Modos do Atlas">'+button('explore',ico('book',15)+' Vocabulário explicado','chip-button '+(view.tab==='explore'?'active':''))+button('practice',ico('mic',15)+' Prática progressiva','chip-button '+(view.tab==='practice'?'active':''))+'</div>'+
 (view.tab==='explore'?dictionary():exercise());
}
function refreshQuery(el){
 const begin=el.selectionStart,end=el.selectionEnd;
 api.render();
 const next=document.getElementById('atlas12-search');
 if(next){next.focus();try{next.setSelectionRange(begin,end)}catch{}}
}
function init(context){
 api=context;
 document.addEventListener('click',event=>{
  const b=event.target.closest('[data-atlas-action]');
  if(!b)return;
  event.preventDefault();
  const action=b.dataset.atlasAction,st=api.getStore();
  if(action==='explore'||action==='practice'){view.tab=action;view.feedback=null;view.show=false}
  else if(action==='word'){const i=Number(b.dataset.topic);if(!api.D.atlas[i]?.terms.includes(b.dataset.word))return;view.topic=i;view.word=b.dataset.word;view.query='';view.feedback=null}
  else if(action==='copy'){api.copy(currentCard().term);return}
  else if(action==='level'){const i=Number(b.dataset.level);if(i<0||i>3||!Number.isInteger(i))return;view.level=i;view.show=false;view.feedback=null}
  else if(action==='model')view.show=!view.show;
  else if(action==='review'){const text=draft();if(text.trim().length<20){api.toast('Escreva pelo menos 20 caracteres antes de analisar.');return}view.feedback=analyze(text)}
  else if(action==='listen'){api.say(model());return}
  else if(action==='copy-model'){api.copy(model());return}
  else if(action==='save'){const text=draft().trim();if(text.length<30){api.toast('Escreva ao menos 30 caracteres para registrar.');return}
   const feedback=analyze(text);st.atlasHistory.push({at:new Date().toISOString(),topic:view.topic,level:view.level,score:view.score,text:text.slice(0,3000),words:feedback.words,terms:feedback.terms});st.atlasHistory=st.atlasHistory.slice(-200);api.save();api.toast('Prática registrada no caderno.')}
  else if(action==='tele'){const text=draft().trim();if(text.length<20){api.toast('Escreva uma narração antes de abrir o teleprompter.');return}api.toTele(text);return}
  else if(action==='voice'){api.navigate('voice');return}
  else if(action==='restore'){const item=st.atlasHistory[Number(b.dataset.index)];if(!item||!api.D.atlas[item.topic])return;view.topic=item.topic;view.level=item.level;view.tab='practice';view.score=item.score;view.show=false;view.feedback=null;st.atlasDrafts[key()]=item.text;api.save()}
  api.render();
 });
 document.addEventListener('input',e=>{
  const t=e.target;
  if(t.matches('[data-atlas-query]')){view.query=t.value;refreshQuery(t)}
  if(t.matches('[data-atlas-writing]')){const st=api.getStore();st.atlasDrafts[key()]=t.value.slice(0,3000);view.feedback=null;api.save();const n=document.getElementById('atlas12-count');if(n)n.textContent=sayWords(t.value)+' palavras'}
 });
 document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-atlas-topic]')){view.topic=Number(t.value);view.word='';view.show=false;view.feedback=null;api.render()}
  if(t.matches('[data-atlas-rating]'))view.score=Number(t.value);
 });
}
return {init,render};
})();