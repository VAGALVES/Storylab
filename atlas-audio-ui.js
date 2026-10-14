/* StoryLab Shanghai · integração não invasiva do gravador ao Atlas (v1.3).
   Autoavaliação registrada, áudio disponível somente nesta aba até download. */
(()=>{
'use strict';
const atlas=window.StoryLabAtlas,rec=window.StoryLabRecorder;
if(!atlas||!rec)return;
const scores=['Dicção','Fluidez','Pausas','Expressividade'];
const hints=[
 'Articule sílabas e terminações com clareza.',
 'Conecte ideias sem perder o raciocínio.',
 'Use pausas que organizem o pensamento.',
 'Varie entonação e ênfase conforme a ideia.'
];
let ctx=null,rubric=[3,3,3,3];
const own=atlas.render;
const originalInit=atlas.init;
function context(){return atlas.context?.()||{topic:0,level:0}}
function currentKey(){const c=context();return c.topic+':'+c.level}
function clear(){rec.close(true)}
function discard(){
 const s=rec.state();
 if(['recording','requesting','finishing','ready'].includes(s.kind)&&!confirm('Seu áudio será descartado ao sair deste exercício. Deseja continuar sem baixar o arquivo?'))return false;
 clear();return true;
}
function playUI(){
 const s=rec.state(),key=currentKey(),{esc,ico}=ctx;
 const busy=['requesting','finishing'].includes(s.kind);
 let html='<section class="atlas13-audio" aria-label="Prática oral gravada"><div class="eyebrow">ESTÚDIO DE VOZ · TAKE INDIVIDUAL</div><h3>Fale, escute e refine</h3><p class="muted small">Grave uma versão desta narração e ouça antes de avaliar. O áudio fica apenas nesta aba: use <strong>Baixar áudio</strong> para preservá-lo. Seu backup salva apenas o texto, a nota e o registro da prática.</p><div class="form-row atlas13-rec-controls">';
 if(s.kind==='recording')html+='<button class="btn secondary" data-atlas-audio="stop">'+ico('pause',14)+' Parar gravação</button>';
 else html+='<button class="btn accent" data-atlas-audio="start" '+(busy||!s.supported?'disabled':'')+'>'+ico('mic',14)+' '+(s.kind==='requesting'?'Solicitando permissão':s.kind==='finishing'?'Finalizando':'Gravar minha voz')+'</button>';
 html+='<span class="chip" id="atlas12-record-time">'+rec.format(s.seconds)+'</span></div>';
 if(s.kind==='recording')html+='<p class="muted small" role="status">Microfone ativo. O tempo sugerido do exercício não limita sua gravação.</p>';
 if(s.url&&s.context===key){
  const c=context(),fname='storylab-atlas-campo-'+(c.topic+1)+'-nivel-'+(c.level+1)+'.'+s.extension;
  html+='<audio class="atlas13-player" controls preload="metadata" src="'+esc(s.url)+'" aria-label="Reproduzir meu take de voz"></audio><div class="form-row"><a class="btn secondary sm" href="'+esc(s.url)+'" download="'+esc(fname)+'">'+ico('download',14)+' Baixar áudio</a><button class="btn secondary sm" data-atlas-audio="discard">Descartar take</button></div>';
 }
 if(s.error)html+='<p class="atlas13-error" role="alert">'+esc(s.error)+'</p>';
 if(!s.supported)html+='<p class="muted small">Gravação não disponível. Em geral, é preciso usar HTTPS, um navegador compatível e permitir o microfone. O exercício escrito continua funcionando.</p>';
 html+='<div class="divider"></div><div class="eyebrow">RUBRICA DE AUTOAVALIAÇÃO · 1 A 5</div><p class="muted small">1 = precisa melhorar, 5 = consistente. As notas são atribuídas por você, não por IA.</p><div class="atlas13-rubric">';
 html+=scores.map((label,i)=>'<div class="atlas13-metric"><label for="atlas13-rubric-'+i+'">'+label+'</label><select id="atlas13-rubric-'+i+'" data-atlas-rubric="'+i+'">'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(rubric[i]===n?'selected':'')+'>'+n+' / 5</option>').join('')+'</select><p class="muted small">'+hints[i]+'</p></div>').join('');
 html+='</div></section>';
 return html;
}
atlas.render=()=>{
 const html=own();
 if(!ctx||!html.includes('id="atlas12-writing"'))return html;
 const mark='<div class="divider"></div><div class="form-row" style="align-items:end">';
 if(!html.includes(mark))return html;
 return html.replace(mark,playUI()+mark);
};
atlas.init=(api)=>{
 ctx=api;
 rec.subscribe(()=>{if(ctx)ctx.render()});
 originalInit(api);
};
document.addEventListener('click',event=>{
 const audioBtn=event.target.closest('[data-atlas-audio]');
 if(audioBtn){
  event.preventDefault();event.stopPropagation();
  const a=audioBtn.dataset.atlasAudio;
  if(a==='start'){
   if(rec.state().kind==='ready'&&!confirm('Descartar o take atual e começar outra gravação?'))return;
   void rec.start(currentKey());
  }else if(a==='stop')rec.stop();
  else if(a==='discard')rec.close();
  return;
 }
 const a=event.target.closest('[data-atlas-action]');
 if(a){
  const action=a.dataset.atlasAction,c=context();
  const changed=action==='level'&&Number(a.dataset.level)!==c.level ||
    action==='word'&&Number(a.dataset.topic)!==c.topic ||
    action==='explore' || action==='restore' || action==='voice';
  if(changed){
   if(!discard()){event.preventDefault();event.stopImmediatePropagation();return}
   rubric=[3,3,3,3];
   if(action==='restore'){
    const saved=ctx?.getStore().atlasHistory[Number(a.dataset.index)];
    if(saved&&Array.isArray(saved.rubric)&&saved.rubric.length===4)rubric=saved.rubric.map(n=>Math.min(5,Math.max(1,Number(n)||3)));
   }
  }
  if(action==='save'&&ctx){
   const st=ctx.getStore(),before=st.atlasHistory[st.atlasHistory.length-1],take=rec.state();
   const values=[...rubric],isRecorded=take.kind==='ready'&&take.context===currentKey(),duration=isRecorded?take.seconds:0;
   queueMicrotask(()=>{
    const now=st.atlasHistory[st.atlasHistory.length-1];
    if(!now||now===before)return;
    now.rubric=values;now.recorded=isRecorded;now.takeSeconds=duration;ctx.save();
   });
  }
 }
 const nav=event.target.closest('[data-action="navigate"]');
 if(nav&&nav.dataset.page&&nav.dataset.page!=='atlas'&&document.getElementById('atlas12-writing')){
  if(!discard()){event.preventDefault();event.stopImmediatePropagation()}
 }
},true);
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.matches('[data-atlas-rubric]')){const idx=Number(el.dataset.atlasRubric);if(idx>=0&&idx<4)rubric[idx]=Math.min(5,Math.max(1,Number(el.value)||3))}
 if(el.matches('[data-atlas-topic]')&&Number(el.value)!==context().topic){
  if(!discard()){event.stopImmediatePropagation();ctx?.render();return}rubric=[3,3,3,3];
 }
},true);
window.addEventListener?.('pagehide',()=>clear());
window.StoryLabAtlasAudio={rubric:()=>[...rubric],clear};
})();
