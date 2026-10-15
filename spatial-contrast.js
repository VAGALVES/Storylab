/* StoryLab · Oficina de contraste visual, independente do treino de regência.
 * Os ícones são alternativas visuais, não gabaritos: a justificativa surge após a escolha.
 */
window.StoryLabVerbContrast=(()=>{
'use strict';
const pairs=window.STORYLAB_VERB_CONTRAST_DATA||[];
const icons=window.StoryLabVerbIcons;
const items=pairs.flatMap((pair,index)=>pair.cases.map((c,position)=>({...c,pair,index,position})));
const itemById=new Map(items.map(x=>[x.id,x]));
let context=null,attached=false,session=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=s=>({'quick':'Essencial · 8 cenas','weak':'Reforço inteligente · 8 cenas','all':'Atlas completo · 64 cenas','pair':'Duelo de conceitos · 2 cenas'}[s]||'Contraste visual');
function record(){
 const st=context?.getStore?.()?.verbContrastStats;
 return st&&typeof st==='object'&&!Array.isArray(st)?st:{};
}
function priority(item,stats){
 const s=stats[item.id]||{},tries=Math.max(0,Number(s.attempts)||0),right=Math.max(0,Number(s.correct)||0);
 if(tries>0&&right<tries)return 0+(right/tries);
 if(!tries)return 2;
 return 3+(right/tries);
}
function takeBest(itemsToChoose,stats){
 return itemsToChoose.slice().sort((a,b)=>priority(a,stats)-priority(b,stats)||a.index-b.index||a.position-b.position);
}
const essentialIndices=[0,7,8,12,16,21,26,30];
function choose(scope,anchor){
 const stats=record();
 if(scope==='pair'){
  const pair=pairs.find(p=>p.a===anchor||p.b===anchor)||pairs[0];
  return pair?pair.cases.map(c=>itemById.get(c.id)):[];
 }
 if(scope==='all')return pairs.flatMap(p=>p.cases.map(c=>itemById.get(c.id)));
 if(scope==='weak')return takeBest(items,stats).slice(0,8);
 return essentialIndices.map(i=>{
  const p=pairs[i];return p?takeBest(p.cases.map(c=>itemById.get(c.id)),stats)[0]:null;
 }).filter(Boolean);
}
function start(scope='quick',anchor=null){
 if(!['quick','weak','all','pair'].includes(scope))scope='quick';
 const questions=choose(scope,anchor);
 if(!questions.length)return false;
 session={scope,anchor,ids:questions.map(q=>q.id),cursor:0,selected:null,correct:0,done:false};
 return true;
}
function activeItem(){return session&&!session.done?itemById.get(session.ids[session.cursor]):null}
function progressSummary(){
 const stats=record();
 const attempted=items.filter(i=>(Number(stats[i.id]?.attempts)||0)>0).length;
 const mastered=items.filter(i=>{const s=stats[i.id];return s&&(Number(s.correct)||0)>0}).length;
 return {attempted,mastered};
}
function visual(verb){
 const picture=icons?.render?.(verb,verb)||'';
 return '<span class="vc-art" aria-hidden="true">'+picture+'</span>';
}
function choice(verb,question,order){
 const answered=session.selected!==null,correct=verb===question.answer,picked=session.selected===verb;
 return '<button type="button" class="vc-choice'+(answered?(correct?' is-correct':picked?' is-incorrect':' is-muted'):'')+'" data-contrast-action="answer" data-choice="'+esc(verb)+'" '+(answered?'disabled':'')+' aria-label="Escolher o verbo '+esc(verb)+'" aria-pressed="'+picked+'">'+
 '<span class="vc-choice-number">'+String(order+1).padStart(2,'0')+'</span>'+visual(verb)+'<strong>'+esc(verb)+'</strong><span class="vc-choice-mark" aria-hidden="true">'+(answered&&correct?'✓':answered&&picked?'×':'↗')+'</span></button>';
}
function actions(){
 return '<div class="vc-actions"><button type="button" class="btn secondary sm" data-contrast-action="exit">Voltar ao laboratório</button>'+
 '<button type="button" class="btn secondary sm" data-contrast-action="restart">Recomeçar rodada</button></div>';
}
function render(){
 if(!session)return '<div class="notice info">Escolha um modo de contraste no laboratório de verbos.</div>';
 const summary=progressSummary(),total=session.ids.length,answered=session.selected!==null;
 let html='<div class="vc-root"><section class="panel panel-pad vc-top"><div class="vl-kicker">STORYLAB · PRECISÃO SEMÂNTICA</div><div class="vc-top-row"><div><h2>Duelo de verbos</h2><p>Leia a cena, compare os desenhos e escolha o verbo que descreve <strong>melhor a relação espacial</strong>.</p></div><div class="vc-totals" aria-label="'+summary.mastered+' de 64 cenas acertadas ao menos uma vez"><strong>'+summary.mastered+'<span>/64</span></strong><small>cenas com acerto</small></div></div>'+
 '<div class="vc-top-bottom"><span>'+esc(label(session.scope))+'</span><span>'+summary.attempted+' cenas praticadas</span></div>'+actions()+'</section>';
 if(session.done){
  const pct=Math.round(100*session.correct/total);
  html+='<section class="panel panel-pad vc-result" role="status"><div class="vl-kicker">RODADA FINALIZADA</div><div class="vc-score" style="--vc-score:'+pct+'"><strong>'+pct+'%</strong></div>'+
  '<h3>'+session.correct+' de '+total+' decisões precisas</h3><p>A precisão melhora quando você distingue orientação, contato, limite e movimento — não apenas reconhece palavras isoladas.</p>'+
  '<div class="vc-result-actions"><button type="button" class="btn accent" data-contrast-action="restart">Nova rodada</button><button type="button" class="btn secondary" data-contrast-action="start-weak">Reforçar diferenças</button><button type="button" class="btn secondary" data-contrast-action="exit">Voltar aos verbos</button></div></section>';
  return html+'</div>';
 }
 const q=activeItem(),pair=q.pair,options=(q.index%2===0)?[pair.a,pair.b]:[pair.b,pair.a];
 const value=session.cursor+(answered?1:0),percent=Math.round(100*value/total);
 html+='<section class="panel panel-pad vc-stage"><div class="vc-stage-meta"><span>QUESTÃO '+(session.cursor+1)+' / '+total+'</span><span>'+session.correct+' acertos na rodada</span></div>'+
  '<div class="vc-progress" role="progressbar" aria-label="Progresso da rodada" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+value+'"><span style="width:'+percent+'%"></span></div>'+
  '<p class="vl-kicker">OBSERVE A SITUAÇÃO</p><h3>Qual verbo é mais preciso?</h3><p class="vc-scene">'+esc(q.scene)+'</p>'+
  '<div class="vc-options" role="group" aria-label="Compare dois verbos e selecione um">'+options.map((x,i)=>choice(x,q,i)).join('')+'</div>';
 if(answered){
  const correct=session.selected===q.answer;
  const wrong=q.answer===pair.a?pair.b:pair.a;
  html+='<div class="vc-feedback '+(correct?'is-right':'is-wrong')+'" role="status" aria-live="polite">'+
   '<div class="vc-feedback-status"><span aria-hidden="true">'+(correct?'✓':'↗')+'</span><strong>'+(correct?'Excelente escolha.':'Observe esta diferença.')+'</strong></div>'+
   '<p class="vc-feedback-answer">O verbo mais preciso é <strong>'+esc(q.answer)+'</strong>.</p>'+
   '<p>'+esc(q.reason)+'</p><div class="vc-compare-note"><span class="vl-small">POR QUE NÃO '+esc(wrong).toUpperCase()+'?</span><p>'+esc(pair.dist)+'</p></div>'+
   '<div class="vc-english"><span class="vl-small">EXEMPLO NATURAL EM INGLÊS</span><p lang="en">'+esc(q.english)+'</p></div>'+
   '<div class="vc-next-row"><button type="button" class="btn secondary sm" data-contrast-action="inspect" data-verb="'+esc(q.answer)+'">Explorar a família lexical</button>'+
   '<button type="button" class="btn accent" data-contrast-action="next">'+(session.cursor===total-1?'Ver resultado':'Próxima cena')+'</button></div></div>';
 }
 html+='</section></div>';
 return html;
}
function onAnswer(answer){
 const q=activeItem();
 if(!q||session.selected!==null||![q.pair.a,q.pair.b].includes(answer))return false;
 session.selected=answer;
 if(answer===q.answer)session.correct++;
 const store=context?.getStore?.();
 if(store){
  if(!store.verbContrastStats||typeof store.verbContrastStats!=='object'||Array.isArray(store.verbContrastStats))store.verbContrastStats={};
  const prev=store.verbContrastStats[q.id]||{attempts:0,correct:0};
  store.verbContrastStats[q.id]={attempts:(Number(prev.attempts)||0)+1,correct:(Number(prev.correct)||0)+(answer===q.answer?1:0),last:Date.now()};
  context.save?.();
 }
 return true;
}
function next(){
 if(!session||session.done||session.selected===null)return false;
 if(session.cursor===session.ids.length-1)session.done=true;
 else {session.cursor++;session.selected=null}
 return true;
}
function bind(api){
 context=api;
 if(attached)return;
 attached=true;
 document.addEventListener('click',event=>{
  const button=event.target?.closest?.('[data-contrast-action]');
  if(!button)return;
  event.preventDefault();
  const action=button.dataset.contrastAction;
  if(action==='answer'){if(onAnswer(button.dataset.choice))context.render();return}
  if(action==='next'){if(next())context.render();return}
  if(action==='exit'){context.exit?.();return}
  if(action==='restart'){if(session&&start(session.scope,session.anchor))context.render();return}
  if(action==='start-weak'){if(start('weak'))context.render();return}
  if(action==='inspect'){const q=itemById.get(session?.ids[session?.cursor]);if(q&&session.selected!==null)context.inspect?.(q.answer);return}
 });
}
return {start,render,bind,summary:progressSummary,pairs:()=>pairs.length,count:()=>items.length,_test:{onAnswer,next,choose,session:()=>session,activeItem}};
})();