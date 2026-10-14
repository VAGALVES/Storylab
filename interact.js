/* StoryLab Shanghai · Interatividade 1.8
   Busca universal, cartões de estudo, jogo "Monte a frase", sequência e meta
   diária e atalhos de teclado. Módulo independente: recebe uma API explícita
   do app (init) e desenha suas janelas numa camada própria (#ix-root), que não
   é apagada quando o app redesenha a página. Nada é enviado para servidores. */
window.StoryLabInteract=(()=>{
'use strict';

const DAY=86400000;
const INTERVALS=[0,1,3,7,14,30];      // mesmo esquema de revisão da Fraseoteca
const GOAL_OPTIONS=[5,10,20];
const DECK_SIZE=12;
const ACTIVITY_DAYS=400;              // histórico guardado no aparelho

let api=null,root=null,lastFocus=null,celebratedOn='';
const state={overlay:null,search:{q:'',sel:0,results:[]},cards:null,tiles:null};
let index=null;

/* ── Utilidades puras (testáveis) ────────────────────────────────── */
function iso(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function shiftDay(day,delta){const [y,m,d]=day.split('-').map(Number);return iso(new Date(y,m-1,d+delta))}
function shuffle(list,rand=Math.random){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// Dias seguidos com estudo. A sequência continua viva até o fim do dia seguinte:
// quem estudou ontem e ainda não estudou hoje não perde os dias acumulados.
function streak(activity,today=iso()){
 let day=activity?.[today]>0?today:shiftDay(today,-1),n=0;
 while(activity?.[day]>0){n++;day=shiftDay(day,-1)}
 return n;
}
function lastDays(activity,n=7,today=iso()){return Array.from({length:n},(_,i)=>{const day=shiftDay(today,i-n+1);return {day,count:activity?.[day]||0}})}

// Revisão espaçada de frases: "lembrei" sobe um nível; "de novo" volta ao início
// e mantém a frase pendente para a próxima rodada.
function gradeReview(before,remembered,now=Date.now()){
 const b=before||{level:0,count:0};
 const level=remembered?Math.min(INTERVALS.length-1,(b.level||0)+1):0;
 return {level,count:(b.count||0)+1,last:now,next:now+INTERVALS[level]*DAY};
}

// Índice único de busca: páginas, disciplinas, aulas, termos do Atlas, frases e missões
const PAGES=[['home','Painel principal'],['academy','Academia'],['journey','Trilha de 12 semanas'],['phrases','Fraseoteca'],['voice','Estúdio da Voz'],['clinic','Oficina da Fala'],['studio','Estúdio Narrativo'],['atlas','Atlas Descritivo'],['field','Campo Shanghai'],['progress','Minha Evolução']];
const TYPE={page:'Página',course:'Disciplina',lesson:'Aula',term:'Atlas',phrase:'Frase',mission:'Missão'};
const WEIGHT={page:6,course:5,lesson:4,term:4,mission:3,phrase:2};
function buildIndex(D,guides,norm){
 const items=[],add=(type,label,sub,body,go)=>items.push({type,label,sub,go,nl:norm(label),text:norm([label,sub,body].join(' '))});
 PAGES.forEach(([id,label])=>add('page',label,'Seção do app','',{page:id}));
 D.courses.forEach(c=>{
  const school=D.schools.find(s=>s.id===c.school);
  add('course',c.title,school?.name||'',c.description,{course:c.id});
  c.modules.forEach((m,i)=>{const deep=D.deepLessons[c.id+':'+i];add('lesson',deep?deep.title:m.title,c.title+' · Unidade '+(i+1),[m.title,deep?.intro||''].join(' '),{lesson:[c.id,i]})});
 });
 D.atlas.forEach((field,topic)=>field.terms.forEach(term=>{const card=(guides?.[topic]?.terms||[]).find(t=>t[0]===term);add('term',term,field.title,card?card[1]:'',{term:[topic,term]})}));
 const fam=Object.fromEntries(D.families.map(f=>[f.id,f.title]));
 D.phrases.forEach(p=>add('phrase',p.pt,fam[p.family]||'',[p.use,p.note||''].join(' '),{phrase:p.id}));
 D.missions.forEach(m=>add('mission',m.title,'Missão de campo',m.brief,{mission:m.id}));
 return items;
}
function search(items,query,norm,limit=30){
 const q=norm(query).trim();
 if(!q)return [];
 const tokens=q.split(/\s+/);
 const scored=[];
 for(const it of items){
  if(!tokens.every(t=>it.text.includes(t)))continue;
  let score=WEIGHT[it.type];
  if(it.nl===q)score+=200;
  else if(it.nl.startsWith(q))score+=120;
  else if(it.nl.includes(q))score+=60;
  tokens.forEach(t=>{if(new RegExp('(^|[^a-z0-9])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(it.nl))score+=12;else if(it.nl.includes(t))score+=6});
  scored.push([score,it]);
 }
 scored.sort((a,b)=>b[0]-a[0]||a[1].label.length-b[1].label.length);
 return scored.slice(0,limit).map(x=>x[1]);
}

// "Monte a frase": palavras embaralhadas, nunca na ordem original
function makeTiles(text,rand=Math.random){
 const tokens=text.split(/\s+/).filter(Boolean);
 let order=tokens.map((_,i)=>i);
 for(let tries=0;tries<10&&order.every((v,i)=>v===i);tries++)order=shuffle(order,rand);
 if(order.every((v,i)=>v===i)&&order.length>1)order.push(order.shift());
 return {tokens,pool:order,placed:[]};
}
// Compara pelas palavras, não pelos índices: palavras repetidas podem trocar de lugar
function checkTiles(t){return t.placed.length===t.tokens.length&&t.placed.map(i=>t.tokens[i]).join(' ')===t.tokens.join(' ')}

/* ── Atividade, sequência e meta diária ─────────────────────────── */
function st(){return api.getStore()}
function activity(){const s=st();if(!s.activity||typeof s.activity!=='object'||Array.isArray(s.activity))s.activity={};return s.activity}
function goal(){const g=Number(st().dailyGoal);return GOAL_OPTIONS.includes(g)?g:10}
function today(){return activity()[iso()]||0}
function bump(n=1){
 const a=activity(),t=iso(),before=a[t]||0;
 a[t]=before+n;
 const keys=Object.keys(a).sort();
 if(keys.length>ACTIVITY_DAYS)keys.slice(0,keys.length-ACTIVITY_DAYS).forEach(k=>delete a[k]);
 api.save();
 if(before<goal()&&before+n>=goal()&&celebratedOn!==t){celebratedOn=t;celebrate()}
 refreshChips();
}
function refreshChips(){
 const chip=document.getElementById('ix-streak');
 if(chip){const n=streak(activity());chip.textContent='🔥 '+n;chip.title=n+' dia(s) seguidos de estudo · hoje: '+today()+'/'+goal()}
}
function celebrate(){
 api.toast('Meta do dia cumprida! Sequência: '+streak(activity())+' dia(s).');
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const burst=document.createElement('div');burst.className='ix-burst';burst.setAttribute('aria-hidden','true');
 burst.innerHTML=Array.from({length:18},(_,i)=>'<i style="--a:'+(i*20)+'deg;--d:'+(60+(i%3)*25)+'px"></i>').join('');
 document.body.appendChild(burst);setTimeout(()=>burst.remove(),1100);
}

// Ações de estudo do app que contam para a meta (contadas antes do app processá-las)
const APP_STUDY={'study-phrase':1,'save-practice':1,'clinic-save':1,'clinic-mark':1};
const ATLAS_STUDY={'save':1};
function trackStudy(e){
 const b=e.target.closest?.('[data-action],[data-atlas-action]');
 if(!b||b.disabled)return;
 const s=st(),a=b.dataset.action,aa=b.dataset.atlasAction,id=b.dataset.id;
 if(a&&APP_STUDY[a])bump();
 else if(a==='complete-lesson'&&!s.completed.includes(id))bump();
 else if(a==='finish-mission'&&!s.missions.includes(id))bump();
 else if(aa&&ATLAS_STUDY[aa])bump();
 else if(aa==='quiz-answer'){const q=window.StoryLabAtlas?.quiz?.();const item=q&&q.items[q.i];if(item&&item.picked===null)bump()}
}

/* ── Trechos de interface injetados nas páginas do app ──────────── */
function topbar(){
 const n=streak(activity());
 return '<span class="chip ix-streak" id="ix-streak" title="'+n+' dia(s) seguidos de estudo · hoje: '+today()+'/'+goal()+'">🔥 '+n+'</span>';
}
function ring(value,max){
 const r=34,c=2*Math.PI*r,p=Math.min(1,value/max);
 return '<svg class="ix-ring" viewBox="0 0 80 80" role="img" aria-label="'+value+' de '+max+' atividades hoje"><circle cx="40" cy="40" r="'+r+'" class="ix-ring-bg"/><circle cx="40" cy="40" r="'+r+'" class="ix-ring-fg" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-p)).toFixed(1)+'"/><text x="40" y="45" text-anchor="middle">'+value+'/'+max+'</text></svg>';
}
function home(){
 const {esc}=api,a=activity(),n=streak(a),days=lastDays(a),max=Math.max(goal(),...days.map(d=>d.count)),g=goal(),t=today();
 const week=new Intl.DateTimeFormat('pt-BR',{weekday:'short'});
 return '<section class="panel panel-pad ix-daily"><div class="ix-daily-ring">'+ring(t,g)+'</div><div class="ix-daily-body"><div class="eyebrow">META DO DIA · SEQUÊNCIA DE ESTUDO</div><h2>'+(t>=g?'Meta cumprida hoje.':'Faltam '+(g-t)+' atividade(s) para a meta de hoje.')+'</h2><p class="muted">🔥 '+n+' dia(s) seguidos. Contam: aulas concluídas, frases estudadas, cartões, “Monte a frase”, treino e prática do Atlas, missões e práticas de voz.</p>'+
  '<div class="ix-week" aria-label="Atividades nos últimos 7 dias">'+days.map(d=>{const [y,m,dd]=d.day.split('-').map(Number);return '<div class="ix-week-col" title="'+d.count+' atividade(s)"><span style="height:'+Math.max(4,Math.round(d.count/max*44))+'px" class="'+(d.count>=g?'full':d.count?'some':'')+'"></span><small>'+esc(week.format(new Date(y,m-1,dd)).replace('.',''))+'</small></div>'}).join('')+'</div>'+
  '<div class="form-row ix-daily-actions"><button class="btn accent sm" data-ix="cards">Cartões de frases</button><button class="btn secondary sm" data-ix="tiles">Monte a frase</button><button class="btn secondary sm" data-ix="search">Buscar · Ctrl K</button><label class="ix-goal">Meta diária <select data-ix-goal="1">'+GOAL_OPTIONS.map(o=>'<option value="'+o+'"'+(o===g?' selected':'')+'>'+o+'</option>').join('')+'</select></label></div></div></section>';
}
function phraseActions(){return '<div class="form-row ix-phrase-actions"><button class="btn accent sm" data-ix="cards">'+api.ico('spark',14)+' Estudar em cartões</button><button class="btn secondary sm" data-ix="tiles">'+api.ico('shuffle',14)+' Monte a frase</button></div>'}

/* ── Camada de janelas ──────────────────────────────────────────── */
function ensureRoot(){
 if(root&&root.isConnected)return root;
 root=document.createElement('div');root.id='ix-root';document.body.appendChild(root);
 return root;
}
function open(kind){
 if(!state.overlay)lastFocus=document.activeElement;
 state.overlay=kind;draw();
}
function close(){
 state.overlay=null;state.cards=null;state.tiles=null;
 if(root)root.innerHTML='';
 document.documentElement.classList.remove('ix-locked');
 api.render();
 refreshChips();
 lastFocus?.focus?.();
}
function frame(title,body,label){
 return '<div class="ix-backdrop" data-ix="close"></div><div class="ix-dialog ix-'+state.overlay+'" role="dialog" aria-modal="true" aria-label="'+label+'"><div class="ix-dialog-head"><strong>'+title+'</strong><button class="icon-btn" data-ix="close" aria-label="Fechar (Esc)">'+api.ico('close',16)+'</button></div>'+body+'</div>';
}
function draw(){
 const r=ensureRoot();
 document.documentElement.classList.add('ix-locked');
 if(state.overlay==='search')r.innerHTML=frame('Buscar em todo o StoryLab',searchBody(),'Busca universal');
 else if(state.overlay==='cards')r.innerHTML=frame('Cartões de estudo',cardsBody(),'Cartões de estudo');
 else if(state.overlay==='tiles')r.innerHTML=frame('Monte a frase',tilesBody(),'Jogo Monte a frase');
 else if(state.overlay==='help')r.innerHTML=frame('Atalhos de teclado',helpBody(),'Atalhos de teclado');
 const focus=r.querySelector('[data-ix-autofocus]');
 if(focus)focus.focus();
}

/* ── Busca universal ────────────────────────────────────────────── */
function openSearch(){
 if(!index)index=buildIndex(api.D,window.STORYLAB_ATLAS_GUIDES,api.norm);
 state.search={q:'',sel:0,results:[]};open('search');
}
function searchBody(){return '<div class="ix-search"><input class="search" type="search" data-ix-search="1" data-ix-autofocus placeholder="Aulas, termos do Atlas, frases, missões..." value="'+api.esc(state.search.q)+'" aria-label="Buscar" autocomplete="off"><div class="ix-results" id="ix-results" role="listbox">'+resultsHtml()+'</div><p class="muted small ix-hint">↑ ↓ para navegar · Enter para abrir · Esc para fechar</p></div>'}
function resultsHtml(){
 const {esc}=api,s=state.search;
 if(!s.q.trim())return '<p class="muted ix-empty">Comece a digitar. Experimente: <em>incidir</em>, <em>lead de cena</em>, <em>penumbra</em>, <em>entrevista</em>.</p>';
 if(!s.results.length)return '<p class="muted ix-empty">Nada encontrado para “'+esc(s.q)+'”.</p>';
 return s.results.map((it,i)=>'<button type="button" class="ix-result'+(i===s.sel?' active':'')+'" role="option" aria-selected="'+(i===s.sel)+'" data-ix="go" data-index="'+i+'"><span class="ix-type ix-type-'+it.type+'">'+TYPE[it.type]+'</span><span class="ix-result-text"><strong>'+esc(it.label)+'</strong><small>'+esc(it.sub)+'</small></span></button>').join('');
}
function updateResults(){
 const box=document.getElementById('ix-results');if(!box)return;
 box.innerHTML=resultsHtml();
 box.querySelector('.ix-result.active')?.scrollIntoView?.({block:'nearest'});
}
function go(it){
 const g=it.go,s=st();
 state.overlay=null;if(root)root.innerHTML='';document.documentElement.classList.remove('ix-locked');
 if(g.page)api.navigate(g.page);
 else if(g.course)api.navigate('course',{courseId:g.course});
 else if(g.lesson){s.lastLesson=g.lesson[0]+':'+g.lesson[1];api.save();api.navigate('lesson',{courseId:g.lesson[0],module:g.lesson[1]})}
 else if(g.term)window.StoryLabAtlas?.open?.(g.term[0],g.term[1]);
 else if(g.mission)api.navigate('mission',{missionId:g.mission});
 else if(g.phrase){
  const p=api.D.phrases.find(x=>x.id===g.phrase);
  api.navigate('phrases',{phraseFamily:p.family,phraseQuery:'',phraseView:'all',phraseLang:'pt',expandedPhrase:p.id,phraseLimit:300});
  requestAnimationFrame(()=>{const card=document.querySelector('[data-action="expand-phrase"][data-id="'+p.id+'"]')?.closest('.phrase-card');if(card){card.scrollIntoView({block:'center'});card.classList.add('ix-flash')}});
 }
}

/* ── Cartões de estudo (Fraseoteca) ─────────────────────────────── */
function buildDeck(){
 const s=st(),ui=api.ui,now=Date.now();
 let pool=api.D.phrases.filter(p=>(ui.phraseFamily==='all'||p.family===ui.phraseFamily)&&(ui.phraseView!=='favorites'||s.favorites.includes(p.id)));
 if(!pool.length)pool=api.D.phrases;
 const dueP=pool.filter(p=>s.reviews[p.id]&&s.reviews[p.id].next<=now);
 const fresh=pool.filter(p=>!s.reviews[p.id]);
 const rest=pool.filter(p=>s.reviews[p.id]&&s.reviews[p.id].next>now);
 return [...shuffle(dueP),...shuffle(fresh),...shuffle(rest)].slice(0,DECK_SIZE).map(p=>p.id);
}
function openCards(){state.cards={deck:buildDeck(),i:0,flipped:false,right:0,again:0};open('cards')}
function cardsBody(){
 const {esc,D}=api,c=state.cards;
 if(!c.deck.length)return '<p class="muted">Não há frases para estudar com o filtro atual.</p>';
 if(c.i>=c.deck.length)return '<div class="ix-done"><h3>Rodada concluída</h3><p class="muted">'+c.right+' lembrada(s) · '+c.again+' para rever. Frases marcadas “de novo” voltam na próxima rodada.</p><div class="form-row"><button class="btn accent" data-ix="cards">Nova rodada</button><button class="btn secondary" data-ix="close">Fechar</button></div></div>';
 const p=D.phrases.find(x=>x.id===c.deck[c.i]),fam=D.families.find(f=>f.id===p.family);
 const progress='<div class="ix-progress"><span style="width:'+Math.round(c.i/c.deck.length*100)+'%"></span></div><p class="muted small">Cartão '+(c.i+1)+' de '+c.deck.length+'</p>';
 const front='<div class="ix-face ix-front"><span class="chip">'+esc(fam?.title||'')+'</span><p class="ix-intent">'+esc(p.use)+'</p><p class="muted">Como você formularia esta intenção? Pense ou diga em voz alta, depois vire o cartão.</p><span class="ix-tap">Toque ou pressione Espaço para virar</span></div>';
 const back='<div class="ix-face ix-back"><span class="chip">'+esc(fam?.title||'')+'</span><p class="ix-phrase">'+esc(p.pt)+'</p>'+(p.note?'<p class="ix-note"><strong>Nota de uso:</strong> '+esc(p.note)+'</p>':'')+'</div>';
 const actions=c.flipped?'<div class="form-row ix-grade"><button class="btn secondary" data-ix="again">↺ De novo <kbd>1</kbd></button><button class="btn accent" data-ix="right">✓ Lembrei <kbd>2</kbd></button><button class="btn secondary sm" data-ix="speak" aria-label="Ouvir a frase">'+api.ico('volume',14)+'</button></div><p class="muted small ix-hint">No celular, arraste o cartão: → lembrei · ← de novo</p>':'<div class="form-row ix-grade"><button class="btn accent" data-ix="flip" data-ix-autofocus>Virar cartão <kbd>Espaço</kbd></button></div>';
 return progress+'<div class="ix-card'+(c.flipped?' flipped':'')+'" data-ix="flip" id="ix-card" tabindex="0"><div class="ix-card-inner">'+front+back+'</div></div>'+actions;
}
function gradeCard(remembered){
 const c=state.cards;if(!c||!c.flipped||c.i>=c.deck.length)return;
 const s=st(),id=c.deck[c.i];
 s.reviews[id]=gradeReview(s.reviews[id],remembered);
 api.save();bump();
 remembered?c.right++:c.again++;
 c.i++;c.flipped=false;draw();
}
// Gesto de arrastar no celular: só avalia depois de o cartão estar virado
let drag=null,swipedAt=0;
function onPointerDown(e){const card=e.target.closest?.('#ix-card');if(!card||!state.cards?.flipped)return;drag={x:e.clientX,card}}
function onPointerMove(e){if(!drag)return;const dx=e.clientX-drag.x;drag.card.style.transform='translateX('+dx+'px) rotate('+(dx/20)+'deg)';drag.dx=dx}
function onPointerUp(){if(!drag)return;const {dx=0,card}=drag;drag=null;card.style.transform='';if(Math.abs(dx)>80){swipedAt=Date.now();gradeCard(dx>0);return true}return false}

/* ── Monte a frase ──────────────────────────────────────────────── */
function tilePool(){
 const ui=api.ui,D=api.D;
 let pool=D.phrases.filter(p=>p.note);
 if(ui.page==='phrases'&&ui.phraseFamily!=='all'){const fam=D.phrases.filter(p=>p.family===ui.phraseFamily);if(fam.length)pool=fam}
 const sized=pool.filter(p=>{const n=p.pt.split(/\s+/).length;return n>=4&&n<=16&&!p.pt.includes('…')&&!p.pt.includes('...')});
 return sized.length?sized:pool;
}
function openTiles(){
 const pool=tilePool(),prev=state.tiles?.id;
 const choices=pool.filter(p=>p.id!==prev);
 const p=(choices.length?choices:pool)[Math.floor(Math.random()*(choices.length||pool.length))];
 state.tiles={id:p.id,...makeTiles(p.pt),result:null};
 open('tiles');
}
function tilesBody(){
 const {esc,D}=api,t=state.tiles,p=D.phrases.find(x=>x.id===t.id),fam=D.families.find(f=>f.id===p.family);
 const tile=(i,where)=>'<button type="button" class="ix-tile" data-ix="'+where+'" data-i="'+i+'"'+(t.result?' disabled':'')+'>'+esc(t.tokens[i])+'</button>';
 let html='<p class="muted">Toque nas palavras na ordem certa para reconstruir a frase.</p><p class="ix-hint-line"><span class="chip">'+esc(fam?.title||'')+'</span> <strong>Intenção:</strong> '+esc(p.use)+'</p>'+
  '<div class="ix-answer" aria-label="Sua frase">'+(t.placed.length?t.placed.map(i=>tile(i,'unplace')).join(''):'<span class="muted small">Sua frase aparece aqui.</span>')+'</div>'+
  '<div class="ix-pool" aria-label="Palavras disponíveis">'+t.pool.map(i=>tile(i,'place')).join('')+'</div>';
 if(t.result===null)html+='<div class="form-row"><button class="btn accent" data-ix="check"'+(t.placed.length<t.tokens.length?' disabled':'')+'>Verificar</button><button class="btn secondary" data-ix="tiles-reset">Recomeçar</button><button class="btn secondary" data-ix="tiles">Outra frase</button></div>';
 else html+='<div class="ix-result-box '+(t.result?'ok':'no')+'" role="status"><strong>'+(t.result?'Exato!':'Quase. A frase original é:')+'</strong>'+(t.result?'':'<p class="ix-phrase">'+esc(p.pt)+'</p>')+(p.note?'<p class="small"><strong>Nota de uso:</strong> '+esc(p.note)+'</p>':'')+'</div><div class="form-row"><button class="btn accent" data-ix="tiles" data-ix-autofocus>Próxima frase</button><button class="btn secondary" data-ix="close">Fechar</button></div>';
 return html;
}

/* ── Atalhos ────────────────────────────────────────────────────── */
function helpBody(){
 const rows=[['Ctrl K  ou  /','Abrir a busca universal'],['?','Mostrar estes atalhos'],['Esc','Fechar janelas e menus'],['↑ ↓  ·  Enter','Navegar e abrir resultados da busca'],['Espaço','Virar o cartão de estudo'],['1  ·  2','Cartão: “de novo” · “lembrei”'],['Arrastar ← →','Avaliar o cartão no celular']];
 return '<table class="ix-keys">'+rows.map(([k,d])=>'<tr><td><kbd>'+api.esc(k)+'</kbd></td><td>'+api.esc(d)+'</td></tr>').join('')+'</table>';
}

/* ── Eventos ────────────────────────────────────────────────────── */
function typing(el){return el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable)}
function onKey(e){
 const k=e.key,mod=e.ctrlKey||e.metaKey;
 if(mod&&k.toLowerCase()==='k'){e.preventDefault();state.overlay==='search'?close():openSearch();return}
 if(state.overlay){
  if(k==='Escape'){e.preventDefault();close();return}
  if(state.overlay==='search'){
   const s=state.search;
   if(k==='ArrowDown'||k==='ArrowUp'){e.preventDefault();if(s.results.length){s.sel=(s.sel+(k==='ArrowDown'?1:-1)+s.results.length)%s.results.length;updateResults()}}
   else if(k==='Enter'&&s.results[s.sel]){e.preventDefault();go(s.results[s.sel])}
   return;
  }
  if(state.overlay==='cards'&&!typing(e.target)){
   const c=state.cards;
   if((k===' '||k==='Enter')&&c&&c.i<c.deck.length&&!c.flipped){e.preventDefault();c.flipped=true;draw()}
   else if(k==='1'||k==='ArrowLeft'){e.preventDefault();gradeCard(false)}
   else if(k==='2'||k==='ArrowRight'){e.preventDefault();gradeCard(true)}
  }
  return;
 }
 if(typing(e.target))return;
 if(k==='/'){e.preventDefault();openSearch()}
 else if(k==='?'){e.preventDefault();open('help')}
}
function onClick(e){
 const b=e.target.closest?.('[data-ix]');
 if(!b)return;
 const a=b.dataset.ix;
 if(a==='flip'&&state.cards){if(drag||Date.now()-swipedAt<400)return;if(!state.cards.flipped){state.cards.flipped=true;draw()}return}
 e.preventDefault();
 if(a==='close')close();
 else if(a==='search')openSearch();
 else if(a==='help')open('help');
 else if(a==='cards')openCards();
 else if(a==='tiles')openTiles();
 else if(a==='go'){const it=state.search.results[Number(b.dataset.index)];if(it)go(it)}
 else if(a==='again')gradeCard(false);
 else if(a==='right')gradeCard(true);
 else if(a==='speak'){const id=state.cards?.deck[state.cards.i];const p=api.D.phrases.find(x=>x.id===id);if(p)api.say(p.pt)}
 else if(state.tiles&&(a==='place'||a==='unplace')){
  const t=state.tiles,i=Number(b.dataset.i);
  if(a==='place'){t.pool=t.pool.filter(x=>x!==i);t.placed.push(i)}else{t.placed=t.placed.filter(x=>x!==i);t.pool.push(i)}
  draw();
 }
 else if(a==='tiles-reset'&&state.tiles){const t=state.tiles;t.pool=[...t.pool,...t.placed];t.placed=[];draw()}
 else if(a==='check'&&state.tiles){const t=state.tiles;t.result=checkTiles(t);if(t.result)bump();draw()}
}
function onInput(e){
 if(e.target.matches?.('[data-ix-search]')){const s=state.search;s.q=e.target.value;s.results=search(index,s.q,api.norm);s.sel=0;updateResults()}
}
function onChange(e){
 if(e.target.matches?.('[data-ix-goal]')){st().dailyGoal=Number(e.target.value);api.save();api.render()}
}

function init(context){
 api=context;
 document.addEventListener('click',trackStudy,true);   // fase de captura: antes do app mudar o estado
 document.addEventListener('click',onClick);
 document.addEventListener('keydown',onKey);
 document.addEventListener('input',onInput);
 document.addEventListener('change',onChange);
 document.addEventListener('pointerdown',onPointerDown);
 document.addEventListener('pointermove',onPointerMove);
 document.addEventListener('pointerup',e=>{if(onPointerUp())e.preventDefault()});
}

return {init,topbar,home,phraseActions,openSearch,bump,
 // Funções puras expostas para os testes automatizados
 _test:{iso,shiftDay,streak,lastDays,gradeReview,buildIndex,search,makeTiles,checkTiles}};
})();
