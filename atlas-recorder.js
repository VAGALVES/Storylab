/* StoryLab Shanghai · Gravador local para práticas do Atlas.
   Os bytes de áudio permanecem na memória desta aba até download explícito.
   Nunca armazena áudio em localStorage e não envia para servidores. */
window.StoryLabRecorder=(()=>{
'use strict';
let media=null,stream=null,url=null,kind='idle',error='',startedAt=0,seconds=0,context=null,mime='',timer=null,chunks=[],generation=0,change=()=>{};
function emit(){try{change()}catch{}}
function clock(){
 if(kind!=='recording')return;
 const elapsed=Math.max(0,Math.floor((Date.now()-startedAt)/1000));
 const node=document.getElementById('atlas12-record-time');
 if(node)node.textContent=format(elapsed);
}
function format(value){const n=Math.max(0,Math.floor(value));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function tracks(){if(stream){for(const track of stream.getTracks())track.stop();stream=null}}
function haltClock(){if(timer!==null){clearInterval(timer);timer=null}}
function discardUrl(){if(url){URL.revokeObjectURL(url);url=null}}
function close(silent=false){
 generation++;
 haltClock();
 if(media&&media.state!=='inactive'){
  media.ondataavailable=null;media.onstop=null;media.onerror=null;
  try{media.stop()}catch{}
 }
 media=null;tracks();discardUrl();chunks=[];kind='idle';error='';seconds=0;startedAt=0;context=null;mime='';
 if(!silent)emit();
}
function compatible(){
 return typeof navigator!=='undefined'&&!!navigator.mediaDevices?.getUserMedia&&typeof MediaRecorder!=='undefined'&&typeof URL!=='undefined'&&typeof URL.createObjectURL==='function';
}
async function start(key){
 close(true);
 const token=++generation;
 context=key;
 if(!compatible()){kind='error';error='Este navegador não oferece gravação de áudio. Use HTTPS e permita o microfone, ou tente outro navegador.';emit();return false}
 kind='requesting';emit();
 try{
  const acquired=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
  if(token!==generation){acquired.getTracks().forEach(t=>t.stop());return false}
  stream=acquired;
  const options=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg'].find(type=>MediaRecorder.isTypeSupported?.(type));
  media=options?new MediaRecorder(stream,{mimeType:options}):new MediaRecorder(stream);
  mime=media.mimeType||options||'audio/webm';
  chunks=[];
  media.ondataavailable=e=>{if(e.data&&e.data.size>0)chunks.push(e.data)};
  media.onerror=()=>{if(token!==generation)return;kind='error';error='A gravação foi interrompida pelo navegador.';haltClock();tracks();emit()};
  media.onstop=()=>{
   if(token!==generation)return;
   haltClock();tracks();
   if(!chunks.length){kind='error';error='O navegador não produziu um arquivo de áudio.';emit();return}
   const blob=new Blob(chunks,{type:mime});
   discardUrl();url=URL.createObjectURL(blob);
   chunks=[];kind='ready';emit();
  };
  media.start(250);
  startedAt=Date.now();seconds=0;kind='recording';
  timer=setInterval(clock,250);emit();clock();
  return true;
 }catch(e){
  if(token!==generation)return false;
  tracks();kind='error';
  error=e?.name==='NotAllowedError'?'A permissão do microfone foi negada. Autorize a gravação nas configurações do navegador.':
    e?.name==='NotFoundError'?'Nenhum microfone disponível foi encontrado.':
    'Não foi possível iniciar a gravação neste navegador.';
  emit();return false;
 }
}
function stop(){
 if(kind!=='recording'||!media)return;
 seconds=Math.max(1,Math.ceil((Date.now()-startedAt)/1000));
 kind='finishing';haltClock();emit();
 try{media.stop();tracks()}catch{tracks();kind='error';error='Falha ao finalizar a gravação.';emit()}
}
function state(){
 return {kind,error,url,seconds:kind==='recording'?Math.max(0,Math.floor((Date.now()-startedAt)/1000)):seconds,context,
  mime,extension:mime.includes('mp4')?'m4a':mime.includes('ogg')?'ogg':'webm',
  supported:compatible()};
}
function subscribe(callback){change=callback}
return {start,stop,close,state,subscribe,format};
})();