/* StoryLab Shanghai · Laboratório de Escuta v2.14
   Síntese de voz nativa, sem servidor. Compatibilidade depende das vozes instaladas.
   O som gerado pelo navegador NÃO é um arquivo e não entra no backup. */
window.StoryLabAudio=(()=>{
'use strict';
const KEY='storylab-voice-preferences-v1';
const MAX_CHUNK=175,MAX_PAGE=16000;
const LANGS={'pt-BR':'Português','en-US':'English','zh-CN':'中文'};
const SELECTORS=[
 '.page-head .subtitle',
 '.lesson-body .step > p','.lesson-body .step .example > div',
 '.lesson-body .panel-pad > p',
 '.ling-section > p','.ling-example p','.ling-curiosity p',
 '.ling-terms-grid p','.ling-comparison p','.ling-reason',
 '.ling-figure figcaption','.ling-practice li','.ling-quiz h3',
 '.ling-explanation p','.ling-references > p',
 '.atlas12-definition','.atlas12-example > p','.atlas12-warning > p',
 '.atlas12-work > p','.atlas12-feedback > p',
 '.vl-root .vl-intro > p','.vl-root .vl-detail p',
 '.vl-root .vl-examples p','.vl-root .vl-example p',
 '.vr-regency p','.vl-root .vl-warning',
 '.vc-entry p','.vl-root .vl-description',
 '.panel.panel-pad > p:not(.small):not(.muted)',
 '.mission-detail p','.lesson-body .notice.info',
 '.two-col .panel.panel-pad > .example',
 '.hero-copy > p',
 '.layer-card > p','.layer-card .example',
 '.record-stage > p','.record-stage > h2',
 '.journey-view .panel p','.panel.panel-pad > .example',
 '.clinic-card > p','.clinic-card .example',
 // A Fraseoteca já oferece seu próprio botão Ouvir para pt/en/zh.
].join(',');
let config={speed:0.9,voices:{}};
try{
 const value=JSON.parse(localStorage.getItem(KEY)||'{}');
 if([0.75,0.9,1,1.15].includes(Number(value.speed)))config.speed=Number(value.speed);
 if(value.voices && typeof value.voices==='object'&&!Array.isArray(value.voices))
  for(const lang of Object.keys(LANGS))if(typeof value.voices[lang]==='string')config.voices[lang]=value.voices[lang].slice(0,150);
}catch{}
let root=null,dock=null,reading=null,token=0,queue=[],offset=0,utterance=null;
const supported=()=>typeof window!=='undefined'&&!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance==='function';
function save(){
 try{localStorage.setItem(KEY,JSON.stringify(config))}catch{}
}
function language(node){
 if(!node)return 'pt-BR';
 let tag=node.getAttribute?.('lang');
 if(!tag&&node.querySelector)tag=node.querySelector('[lang]')?.getAttribute('lang');
 if(!tag)tag=node.closest?.('[lang]')?.getAttribute('lang');
 tag=String(tag||'pt').toLowerCase();
 return tag.startsWith('zh')?'zh-CN':tag.startsWith('en')?'en-US':'pt-BR';
}
function chunks(input,limit=MAX_CHUNK){
 const text=String(input||'').replace(/\s+/g,' ').trim();
 if(!text)return [];
 const sentences=text.match(/[^.!?。！？;；]+[.!?。！？;；]*(?:\s+|$)/g)||[text];
 const parts=[],push=s=>{s=s.trim();if(s)parts.push(s)};
 for(const sent of sentences){
  let rest=sent.trim();
  while(rest.length>limit){
   let pos=rest.lastIndexOf(' ',limit);
   if(pos<Math.round(limit*0.45))pos=limit;
   push(rest.slice(0,pos));
   rest=rest.slice(pos).trim();
  }
  push(rest);
 }
 return parts;
}
const icon='<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 5a10 10 0 0 1 0 14"/></svg>';
function control(label,action,cls){
 const b=document.createElement('button');
 b.type='button';b.className=cls||'sl-audio-control';b.dataset.slAudioAction=action;b.textContent=label;
 return b;
}
function labelCurrent(){return reading?.label||'Escuta em andamento'}
function status(msg,kind='info'){
 if(!dock)return;
 const state=dock.querySelector('[data-sl-audio-status]');
 if(state){state.textContent=msg;state.dataset.state=kind}
}
function refreshVoices(){
 if(!dock)return;
 const sel=dock.querySelector('[data-sl-audio-voice]');
 if(!sel)return;
 const all=typeof window.speechSynthesis?.getVoices==='function'?window.speechSynthesis.getVoices():[];
 const voices=all.filter(v=>String(v.lang||'').toLowerCase().startsWith((reading?.lang||'pt-BR').slice(0,2).toLowerCase()));
 sel.replaceChildren();
 const auto=document.createElement('option');auto.value='';auto.textContent='Voz automática';sel.append(auto);
 for(const v of voices){
  const opt=document.createElement('option');opt.value=v.voiceURI;opt.textContent=v.name+' · '+v.lang;sel.append(opt);
 }
 sel.value=voices.some(v=>v.voiceURI===config.voices[reading?.lang])?config.voices[reading.lang]:'';
 sel.hidden=voices.length<1;sel.disabled=voices.length<1;
 const hint=dock.querySelector('[data-sl-audio-voice-hint]');
 if(hint)hint.textContent=all.length&&!voices.length?'Voz '+(reading?.lang||'')+' não instalada; o sistema pode usar outra pronúncia.':'';
}
function ensureDock(){
 if(dock||typeof document==='undefined')return;
 dock=document.createElement('section');dock.id='sl-audio-dock';dock.className='sl-audio-dock';dock.hidden=true;
 dock.setAttribute('aria-label','Controles de leitura em voz alta');
 const details=document.createElement('div');details.className='sl-audio-dock-heading';
 const title=document.createElement('strong');title.dataset.slAudioTitle='';title.textContent='Leitura em voz alta';
 const statusText=document.createElement('span');statusText.dataset.slAudioStatus='';statusText.setAttribute('role','status');
 details.append(title,statusText);
 const controls=document.createElement('div');controls.className='sl-audio-dock-controls';
 controls.append(control('Pausar','pause'),control('Parar','stop'));
 const speed=document.createElement('label');speed.className='sl-audio-select-label';speed.textContent='Ritmo';
 const speeds=document.createElement('select');speeds.dataset.slAudioSpeed='';speeds.setAttribute('aria-label','Velocidade da narração');
 for(const v of [0.75,0.9,1,1.15]){
  const op=document.createElement('option');op.value=String(v);op.textContent=String(v).replace('.',',')+'×';speeds.append(op);
 }
 speeds.value=String(config.speed);speed.append(speeds);
 const voiceLabel=document.createElement('label');voiceLabel.className='sl-audio-select-label';voiceLabel.textContent='Voz';
 const voiceSelect=document.createElement('select');voiceSelect.dataset.slAudioVoice='';voiceSelect.setAttribute('aria-label','Voz do idioma selecionado');
 voiceLabel.append(voiceSelect);
 controls.append(speed,voiceLabel);
 const hint=document.createElement('p');hint.className='sl-audio-voice-hint';hint.dataset.slAudioVoiceHint='';
 dock.append(details,controls,hint);
 document.body.append(dock);
 dock.addEventListener('click',event=>{
  const b=event.target.closest?.('[data-sl-audio-action]');if(!b)return;
  if(b.dataset.slAudioAction==='pause')togglePause();
  if(b.dataset.slAudioAction==='stop')stop();
 });
 dock.addEventListener('change',event=>{
  const field=event.target;
  if(field.matches('[data-sl-audio-speed]')){
   config.speed=Number(field.value);save();
   if(reading)restart();
  }
  if(field.matches('[data-sl-audio-voice]')){
   config.voices[reading?.lang||'pt-BR']=field.value;save();
   if(reading)restart();
  }
 });
 if(window.speechSynthesis?.addEventListener)window.speechSynthesis.addEventListener('voiceschanged',refreshVoices);
}
function markButton(pressed){
 if(!root)return;
 root.querySelectorAll('[data-sl-audio-action="read"]').forEach(b=>{
  const active=pressed&&reading?.trigger===b;
  b.classList.toggle('is-reading',!!active);
  b.setAttribute('aria-pressed',active?'true':'false');
  b.title=active?'Pausar ou retomar a leitura':'Ouvir este trecho';
 });
}
function update(){
 ensureDock();
 if(!dock)return;
 dock.hidden=!reading;
 markButton(!!reading);
 if(!reading)return;
 const label=dock.querySelector('[data-sl-audio-title]');if(label)label.textContent=labelCurrent();
 const pause=dock.querySelector('[data-sl-audio-action="pause"]');
 if(pause)pause.textContent=window.speechSynthesis?.paused?'Retomar':'Pausar';
 status(LANGS[reading.lang]+' · '+(offset+1)+' de '+queue.length+' trechos');
 refreshVoices();
}
function stop(){
 token++;queue=[];offset=0;utterance=null;
 try{window.speechSynthesis?.cancel()}catch{}
 reading=null;update();
}
function chooseVoice(lang){
 const vs=window.speechSynthesis?.getVoices?.()||[];
 const fits=vs.filter(v=>String(v.lang).toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
 const selected=fits.find(v=>v.voiceURI===config.voices[lang]);
 return selected||fits.find(v=>String(v.lang).toLowerCase()===lang.toLowerCase())||fits[0]||null;
}
function next(id){
 if(id!==token||!reading)return;
 if(offset>=queue.length){reading=null;queue=[];utterance=null;update();return}
 const Utter=window.SpeechSynthesisUtterance;
 const u=new Utter(queue[offset]);
 utterance=u;u.lang=reading.lang;u.rate=config.speed;u.pitch=1;
 const voice=chooseVoice(reading.lang);if(voice)u.voice=voice;
 u.onend=()=>{
  if(id!==token)return;
  offset++;if(offset<queue.length){next(id)}else{reading=null;utterance=null;queue=[];update()}
 };
 u.onerror=e=>{
  if(id!==token)return;
  if(e?.error==='interrupted'||e?.error==='canceled')return;
  const problem=e?.error||'desconhecido';stop();ensureDock();dock.hidden=false;
  status('A leitura foi interrompida pelo navegador ('+problem+'). Confira as vozes do aparelho.','error');
 };
 try{window.speechSynthesis.speak(u);update()}catch{
  stop();ensureDock();dock.hidden=false;status('Não foi possível reproduzir este trecho neste dispositivo.','error');
 }
}
function speak(text,lang='pt-BR',label='Trecho para estudo',trigger=null){
 if(!supported()){ensureDock();dock.hidden=false;status('O navegador não oferece síntese de voz neste dispositivo.','error');return false}
 const clean=String(text||'').replace(/\s+/g,' ').trim();
 if(!clean)return false;
 const normalized=LANGS[lang]?lang:lang?.startsWith('en')?'en-US':lang?.startsWith('zh')?'zh-CN':'pt-BR';
 if(reading && clean===reading.text && normalized===reading.lang){togglePause();return true}
 stop();reading={text:clean,lang:normalized,label:String(label||'Trecho para estudo').slice(0,130),trigger};
 queue=chunks(clean);offset=0;const id=++token;next(id);
 return true;
}
function restart(){
 if(!reading)return;
 const {text,lang,label,trigger}=reading;
 stop();speak(text,lang,label,trigger);
}
function togglePause(){
 if(!reading)return;
 try{
  if(window.speechSynthesis.paused)window.speechSynthesis.resume();
  else window.speechSynthesis.pause();
  update();
 }catch{}
}
function getText(node){
 if(!node)return '';
 const clone=node.cloneNode(true);
 clone.querySelectorAll?.('button,audio,video,script,style,.sl-audio-trigger,.sl-audio-controls,[aria-hidden="true"]').forEach(el=>el.remove());
 return String(clone.textContent||'').replace(/\s+/g,' ').trim();
}
function addInline(node){
 if(node.dataset.slAudioAdded==='1'||node.closest('button,a,[contenteditable="true"],.sl-audio-dock'))return;
 const value=getText(node);
 if(value.length<20||value.length>4400)return;
 const lang=language(node);
 node.dataset.slAudioAdded='1';
 node.classList.add('sl-audio-target');
 const button=document.createElement('button');
 button.type='button';button.className='sl-audio-trigger';
 button.dataset.slAudioAction='read';button.title='Ouvir este trecho';
 button.setAttribute('aria-label','Ouvir trecho em '+LANGS[lang]+': '+value.slice(0,78));
 button.setAttribute('aria-pressed','false');
 button.innerHTML=icon+'<span>Ouvir</span>';
 node.append(button);
}
function enhance(container){
 if(!container||!container.querySelectorAll)return;
 root=container;
 const page=container.querySelector('.page-head');
 if(page&&!page.querySelector('[data-sl-audio-action="page"]')){
  const b=document.createElement('button');
  b.type='button';b.className='sl-audio-page';
  b.dataset.slAudioAction='page';b.innerHTML=icon+'<span>Ouvir esta página</span>';
  b.title='Ouvir os conteúdos textuais desta página';
  page.append(b);
 }
 const nodes=container.querySelectorAll(SELECTORS);
 for(const n of nodes)addInline(n);
 markButton(!!reading);
}
function click(event){
 const button=event.target.closest?.('[data-sl-audio-action]');
 if(!button||button.closest?.('#sl-audio-dock'))return;
 const action=button.dataset.slAudioAction;
 if(action==='read'){
  const node=button.parentElement;
  if(!node)return;
  event.preventDefault();event.stopPropagation();
  const text=getText(node),title=node.closest('.panel,.ling-article,.atlas12-detail')?.querySelector('h2,h3')?.textContent?.trim()||'Trecho para estudo';
  speak(text,language(node),title,button);
 }
 if(action==='page'){
  event.preventDefault();event.stopPropagation();
  const nodes=Array.from(root?.querySelectorAll('.sl-audio-target')||[]);
  const selected=nodes.map(n=>getText(n)).filter(Boolean);
  const text=selected.join('. ').slice(0,MAX_PAGE);
  if(!text){ensureDock();dock.hidden=false;status('Esta seção não possui um texto de leitura contínua. Use os botões Ouvir junto ao conteúdo.');return}
  // Não concatene conteúdo em outros idiomas: uma página pode conter cartões trilingues.
  const rootLang=nodes[0]?language(nodes[0]):'pt-BR';
  const same=nodes.filter(n=>language(n)===rootLang).map(n=>getText(n)).join('. ').slice(0,MAX_PAGE);
  speak(same,rootLang,'Leitura da página',button);
 }
}
if(typeof document!=='undefined')document.addEventListener('click',click,true);
if(typeof window!=='undefined')window.addEventListener?.('pagehide',stop);
return {enhance,speak,stop,togglePause,language,chunks,supported,selectable:SELECTORS,version:'2.14'};
})();