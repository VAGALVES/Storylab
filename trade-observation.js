/* StoryLab v2.21 — Anatomia, relações, percepção e prova descritiva.
   Dados pedagógicos locais; observação não certifica especificações. */
window.StoryLabObservation=(()=>{
'use strict';
let api;
const state={category:'estrutura',part:0,relation:'circunda',sense:'cor',senseItem:0,challenge:0};
const data=()=>window.STORYLAB_OBSERVATION_DATA||{parts:[],relations:[],senses:[],challenges:[]};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(action,text,id='',css='')=>'<button type="button" class="obs-btn '+css+'" data-obs="'+action+'" data-id="'+esc(id)+'">'+text+'</button>';
const group=()=>data().parts.find(p=>p[0]===state.category)||data().parts[0];
const rel=()=>data().relations.find(r=>r.id===state.relation)||data().relations[0];
const sensory=()=>data().senses.find(s=>s[0]===state.sense)||data().senses[0];
const label=(small,title,desc)=>'<header class="obs-hero"><span class="trade-kicker">'+small+'</span><h2>'+title+'</h2><p>'+desc+'</p></header>';
const draft=()=>{const s=api?.getStore?.()||{};if(!s.tradeObjectDraft||typeof s.tradeObjectDraft!=='object'||Array.isArray(s.tradeObjectDraft))s.tradeObjectDraft={};return s.tradeObjectDraft};
function relationSVG(r){
 const f='#a9ded0',b='#f0ca8b',dim='#85aeaa';
 const square=(x,y,w,h,fill,stroke=f)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
 const circle=(x,y,r,fill,stroke=f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
 const line=(x,y,x2,y2,stroke=f,dash='')=>'<path d="M'+x+' '+y+' L'+x2+' '+y2+'" fill="none" stroke="'+stroke+'" stroke-width="3" stroke-dasharray="'+dash+'"/>';
 let graphic='';
 switch(r.geometry){
  case 'surround':graphic=square(101,45,230,156,'#3d6a62',b)+square(127,70,178,107,'#142d32');break;
  case 'flank':graphic=square(151,59,128,132,'#2e625f')+square(76,104,48,49,'#a3b7ad',b)+square(305,104,48,49,'#a3b7ad',b);break;
  case 'overlap':graphic=square(101,61,169,123,'#387d72')+square(179,100,167,119,'#b3925a',b);break;
  case 'insert':graphic=square(247,75,112,107,'#366963')+square(257,103,56,48,'#142d32',b)+square(97,110,126,34,'#d9b87a',b)+line(229,128,246,128,b);break;
  case 'rest':graphic=square(93,176,247,25,'#a3b7ad')+square(146,68,138,107,'#336762')+line(152,174,278,174,b);break;
  case 'cross':graphic=circle(222,125,71,'#336762')+square(77,109,286,30,'#bd9566',b);break;
  case 'hinge':graphic=square(89,141,181,42,'#3d6b63')+circle(266,140,18,'#d1ad70',b)+'<path d="M267 140 L349 59 L369 80 L284 158 Z" fill="#5a8d81" stroke="'+f+'" stroke-width="3"/>';break;
  case 'recess':graphic=square(102,47,244,168,'#2b5e5a')+square(169,85,106,89,'#10282d',b)+'<path d="M147 85 L170 85 M147 174 L170 174" stroke="'+b+'" stroke-width="3"/>';break;
  case 'protrude':graphic=square(106,64,204,147,'#386b63')+square(269,110,105,52,'#d2ad70',b);break;
  case 'align':graphic=square(119,66,86,105,'#356a61')+square(238,66,86,105,'#356a61')+line(221,33,221,219,b,'6 7');break;
 }
 return '<svg viewBox="0 0 445 260" role="img" aria-label="Esquema específico da relação '+esc(r.pt)+' entre duas partes, não em escala" xmlns="http://www.w3.org/2000/svg">'+
 '<rect x="1" y="1" width="443" height="258" rx="14" fill="#142f2f" stroke="#50796c" stroke-width="2"/>'+
 graphic+'<text x="18" y="241" fill="'+dim+'" font-family="system-ui,sans-serif" font-size="12">RELAÇÃO ESPACIAL · ESQUEMA NÃO EM ESCALA</text></svg>';
}
function parts(){
 const g=group(),p=g?.[2][state.part]||g?.[2][0],r=rel();if(!p||!r)return '';
 return '<section class="obs-root">'+label('ANATOMIA UNIVERSAL · SUBSTANTIVOS','Nomeie a parte antes de julgar o objeto.',
 'Uma moto, um micro-ondas e uma câmera têm estruturas, revestimentos, interfaces e comandos. Aprenda a distinguir a função da peça do nome comercial.')+
 '<div class="obs-nav" role="group" aria-label="Famílias de componentes">'+data().parts.map(v=>btn('group',esc(v[1]),v[0],g[0]===v[0]?'active':'')).join('')+'</div>'+
 '<div class="obs-grid"><nav class="obs-list" aria-label="Partes do objeto">'+g[2].map((x,i)=>btn('part','<strong>'+esc(x[0])+'</strong><small>'+esc(x[1])+'</small>',String(i),'obs-list-item'+(i===state.part?' active':''))).join('')+'</nav>'+
 '<article class="obs-detail"><span class="trade-kicker">'+esc(g[1])+' / SUBSTANTIVO</span><h3>'+esc(p[0])+'</h3>'+
 '<div class="obs-translation"><div><small>INGLÊS · APOIO</small><strong lang="en">'+esc(p[1])+'</strong>'+btn('speak-part','▶ Ouvir','en')+'</div><div><small>中文 · APOIO</small><strong lang="zh-CN">'+esc(p[2])+'</strong><em>'+esc(p[3])+'</em>'+btn('speak-part','▶ Ouvir','zh')+'</div></div>'+
 '<section><small>O QUE A PALAVRA NOMEIA</small><p>'+esc(p[4])+'</p></section><section><small>DESCRIÇÃO EM PORTUGUÊS</small><p>'+esc(p[5])+'</p></section>'+
 '<section class="obs-question"><small>PERGUNTA DE OBSERVAÇÃO</small><p>'+esc(p[6])+'</p></section>'+
 '<div class="obs-actions">'+btn('copy-part','Copiar verbete')+btn('studio-question','Levar pergunta ao Estúdio',p[6])+'</div></article></div>'+
 '<div class="obs-relations"><div class="obs-section-head"><span class="trade-kicker">RELAÇÕES ENTRE AS PARTES · VERBOS E PREPOSIÇÕES</span><h3>Onde está uma peça em relação à outra?</h3><p>Compare relações precisas, com diagramas diferentes. Circundar, ladear, encaixar e sobrepor não são substituíveis.</p></div>'+
 '<div class="obs-rel-nav" role="group" aria-label="Relações espaciais">'+data().relations.map(x=>btn('relation',esc(x.pt),x.id,x.id===r.id?'active':'')).join('')+'</div>'+
 '<div class="obs-relation-card"><div>'+relationSVG(r)+'</div><div class="obs-relation-explain"><span class="trade-kicker">RELAÇÃO / '+esc(r.id.toUpperCase())+'</span><h4>'+esc(r.frame.join(' '))+'</h4><p>'+esc(r.meaning)+'</p><div class="obs-rel-syntax">'+r.frame.map((x,i)=>'<div><small>'+['REFERENTE','AÇÃO E REGÊNCIA','REFERÊNCIA'][i]+'</small><strong>'+esc(x)+'</strong></div>').join('')+'</div>'+
 '<div class="obs-rel-lang"><span lang="en">EN · '+esc(r.en)+'</span><span lang="zh-CN">中文 · '+esc(r.zh)+' · '+esc(r.py)+'</span></div>'+
 '<section class="obs-question"><small>VERIFICAÇÃO</small><p>'+esc(r.question)+'</p></section>'+
 '<div class="obs-actions">'+btn('copy-relation','Copiar relação')+btn('studio-question','Levar pergunta ao Estúdio',r.question)+'</div></div></div></div></section>';
}
function senses(){
 const s=sensory(),it=s?.[3][state.senseItem]||s?.[3][0];if(!it)return '';
 return '<section class="obs-root">'+label('QUALIDADES SENSORIAIS · DESCRIÇÃO RESPONSÁVEL','Cor, luz e som: três maneiras de perceber.',
 'Observe sem misturar propriedades. O tom da cor não é a saturação; o reflexo não é a transparência; o som agudo não precisa ser alto em volume.')+
 '<div class="obs-nav" role="group" aria-label="Sentidos observados">'+data().senses.map(g=>btn('sense',esc(g[1]),g[0],s[0]===g[0]?'active':'')).join('')+'</div>'+
 '<div class="obs-grid"><nav class="obs-list" aria-label="Propriedades sensoriais">'+s[3].map((x,i)=>btn('sense-term','<strong>'+esc(x[0])+'</strong><small>'+esc(x[1])+'</small>',String(i),'obs-list-item'+(i===state.senseItem?' active':''))).join('')+'</nav>'+
 '<article class="obs-detail"><span class="trade-kicker">'+esc(s[1])+'</span><h3>'+esc(it[0])+'</h3>'+
 '<p class="obs-subtitle">'+esc(it[1])+'</p><div class="obs-translation"><div><small>INGLÊS · APOIO</small><strong lang="en">'+esc(it[2])+'</strong>'+btn('speak-sense','▶ Ouvir','en')+'</div>'+
 '<div><small>中文 · APOIO</small><strong lang="zh-CN">'+esc(it[3])+'</strong><em>'+esc(it[4])+'</em>'+btn('speak-sense','▶ Ouvir','zh')+'</div></div>'+
 '<section><small>DEFINIÇÃO EM PORTUGUÊS</small><p>'+esc(it[5])+'</p></section>'+
 '<section class="obs-question"><small>PERGUNTA DE PRECISÃO</small><p>'+esc(it[6])+'</p></section>'+
 '<div class="obs-actions">'+btn('copy-sense','Copiar verbete')+btn('studio-question','Levar pergunta ao Estúdio',it[6])+'</div></article></div>'+
 '<div class="obs-perception-chart"><div><span class="trade-kicker">LEITURA DAS PROPRIEDADES</span><h3>Não use a escala errada.</h3></div>'+
 '<div class="obs-perception-axes">'+data().senses.map(g=>'<div><strong>'+esc(g[1])+'</strong><span>'+esc(g[2])+'</span></div>').join('')+'</div></div>'+practice()+'</section>';
}
function practice(){
 const qs=data().challenges,q=qs[state.challenge]||qs[0],answers=api?.getStore?.().tradeObservationAnswers||{},selected=Number.isInteger(answers[q.id])?answers[q.id]:null;
 const complete=qs.filter(x=>Number.isInteger(answers[x.id])).length;
 return '<section class="obs-practice" aria-label="Laboratório de discernimento"><header><div><span class="trade-kicker">DESAFIO DO OLHAR · '+(state.challenge+1)+' / '+qs.length+'</span><h3>Observe a frase. Escolha a distinção correta.</h3><p>Não é uma prova de idioma: é treino de precisão descritiva em português.</p></div><span>'+complete+' / '+qs.length+' respondidos</span></header>'+
 '<div class="obs-challenge"><p class="obs-situation">'+esc(q.situation)+'</p><h4>'+esc(q.ask)+'</h4><div class="obs-options">'+q.options.map((option,i)=>btn('answer',String.fromCharCode(65+i)+' · '+esc(option),q.id+':'+i,'obs-option'+(selected===i?' selected':'')+(selected!==null&&i===q.correct?' correct':''))).join('')+'</div>'+
 (selected!==null?'<div class="obs-explanation" role="status"><strong>'+(selected===q.correct?'✓ Distinção correta':'Revise a propriedade observada')+'</strong><p>'+esc(q.reason)+'</p></div>':'<p class="obs-hint">Selecione uma resposta para revelar a explicação.</p>')+'</div>'+
 '<div class="obs-practice-nav">'+btn('challenge','← Anterior','prev')+btn('challenge','Próximo desafio →','next')+'</div></section>';
}
function saveQuestion(question){
 const d=draft();const prefix='Pergunta para verificar: ';
 const phrase=prefix+question;
 const current=String(d.note||'').slice(0,550);
 if(!current.includes(phrase)){
  const extra=(current?'\n':'')+phrase;
  if(current.length+extra.length>550)return false;
  d.note=current+extra;
 }
 api.save();window.StoryLabTrade?.openTab?.('roteiro');return true;
}
function init(ctx){
 api=ctx;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-obs]');if(!b)return;
  e.preventDefault();const a=b.dataset.obs,id=b.dataset.id||'';
  if(a==='group'&&data().parts.some(g=>g[0]===id)){state.category=id;state.part=0;api.render();return}
  if(a==='part'){const n=Number(id);if(Number.isInteger(n)&&n>=0&&n<(group()?.[2].length||0)){state.part=n;api.render()}return}
  if(a==='relation'&&data().relations.some(r=>r.id===id)){state.relation=id;api.render();return}
  if(a==='sense'&&data().senses.some(g=>g[0]===id)){state.sense=id;state.senseItem=0;api.render();return}
  if(a==='sense-term'){const n=Number(id);if(Number.isInteger(n)&&n>=0&&n<(sensory()?.[3].length||0)){state.senseItem=n;api.render()}return}
  if(a==='challenge'){state.challenge=(state.challenge+(id==='prev'?-1:1)+data().challenges.length)%data().challenges.length;api.render();return}
  if(a==='answer'){
   const [key,num]=id.split(':'),q=data().challenges.find(c=>c.id===key),n=Number(num);
   if(!q||!Number.isInteger(n)||n<0||n>=q.options.length)return;
   const s=api.getStore();s.tradeObservationAnswers=s.tradeObservationAnswers||{};
   if(!Number.isInteger(s.tradeObservationAnswers[key])){s.tradeObservationAnswers[key]=n;api.save()}
   api.render();return;
  }
  if(a==='studio-question'){saveQuestion(id);return}
  if(a==='copy-part'||a==='speak-part'){const t=group()?.[2][state.part];if(!t)return;
   if(a==='copy-part')api.copy([t[0],t[4],t[5],t[6],t[1],t[2],t[3]].join('\n'));
   else api.say(t[id==='en'?1:2],id==='en'?'en-US':'zh-CN');return}
  if(a==='copy-sense'||a==='speak-sense'){const t=sensory()?.[3][state.senseItem];if(!t)return;
   if(a==='copy-sense')api.copy([t[0],t[5],t[6],t[2],t[3],t[4]].join('\n'));
   else api.say(t[id==='en'?2:3],id==='en'?'en-US':'zh-CN');return}
  if(a==='copy-relation'){const r=rel();if(r)api.copy([r.frame.join(' '),r.meaning,r.question,r.en,r.zh,r.py].join('\n'))}
 });
}
return {init,parts,senses,practice,relationSVG,saveQuestion};
})();