/* StoryLab v2.22 · Laboratório da observação à narração.
   Toda frase final é escrita pelo estudante. Não inferir especificações. */
window.StoryLabNarrative=(()=>{
 'use strict';
 let api=null;
 const data=()=>window.STORYLAB_NARRATIVE_DATA||{scenes:[],phases:[],rubric:[],sources:[]};
 const state={scene:'moto',phase:0,showExample:false};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const scene=()=>data().scenes.find(s=>s.id===state.scene)||data().scenes[0];
 const defaultRecord=()=>({responses:['','','','',''],sources:['impressao','impressao','impressao','impressao','impressao'],checks:[]});
 const registry=()=>{const s=api.getStore();if(!s.tradeNarrativeWork||typeof s.tradeNarrativeWork!=='object'||Array.isArray(s.tradeNarrativeWork))s.tradeNarrativeWork={};return s.tradeNarrativeWork};
 const record=()=>{const r=registry(),id=scene()?.id;if(!id)return defaultRecord();if(!r[id]||!Array.isArray(r[id].responses))r[id]=defaultRecord();return r[id]};
 const button=(act,label,id='',extra='')=>'<button type="button" class="nar-btn '+extra+'" data-nar="'+act+'" data-id="'+esc(id)+'"'+(extra.includes('disabled')?' disabled':'')+'>'+label+'</button>';
 const wordCount=s=>String(s||'').trim()?String(s).trim().split(/\s+/u).length:0;
 const sourceLabel=id=>data().sources.find(s=>s[0]===id)?.[1]||'Impressão / aparência';
 function vignette(type){
  const ink='#b8d5cb',light='#608e81',hi='#f1c789',dark='#183331';
  const car='<path d="M78 195 L106 164 L158 148 L216 122 H299 Q332 124 360 165 L410 176 L432 196 V225 H75 Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/><path d="M220 137 H303 L342 171 H185 Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/><circle cx="147" cy="220" r="29" fill="'+dark+'" stroke="'+hi+'" stroke-width="6"/><circle cx="362" cy="220" r="29" fill="'+dark+'" stroke="'+hi+'" stroke-width="6"/>';
  const moto='<circle cx="132" cy="216" r="45" fill="none" stroke="'+ink+'" stroke-width="10"/><circle cx="361" cy="216" r="45" fill="none" stroke="'+ink+'" stroke-width="10"/><path d="M130 216 L209 157 L276 216 L361 216 L301 143 L218 143 M221 143 L177 217 M361 216 L394 166 L379 120" fill="none" stroke="'+hi+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M189 132 H262 L281 146 H207 Z" fill="'+light+'"/><path d="M300 141 L279 115 H316" fill="none" stroke="'+ink+'" stroke-width="7"/>';
  const phone='<rect x="170" y="38" width="167" height="240" rx="25" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><rect x="182" y="59" width="143" height="197" rx="10" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/><rect x="223" y="46" width="60" height="6" rx="3" fill="'+hi+'"/><circle cx="253" cy="267" r="4" fill="'+hi+'"/>';
  const camera='<rect x="104" y="112" width="301" height="134" rx="23" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><path d="M153 111 L172 86 H271 L294 112" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><circle cx="268" cy="179" r="67" fill="'+dark+'" stroke="'+hi+'" stroke-width="9"/><circle cx="268" cy="179" r="44" fill="none" stroke="'+ink+'" stroke-width="4"/><circle cx="268" cy="179" r="16" fill="'+hi+'"/><rect x="127" y="131" width="42" height="12" rx="5" fill="'+ink+'"/>';
  const chair='<path d="M189 55 Q168 55 164 79 L152 174 Q163 189 291 188 L292 60 Z" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><path d="M147 202 L323 202 Q341 202 341 221 V229 H132 V218 Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/><path d="M246 231 V277 M182 277 H309 M246 277 L167 303 M246 277 L325 303 M245 277 L245 315" fill="none" stroke="'+ink+'" stroke-width="8" stroke-linecap="round"/><path d="M154 197 L116 182 M324 197 L364 182" stroke="'+hi+'" stroke-width="8"/>';
  const battery='<rect x="144" y="85" width="229" height="158" rx="28" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><rect x="168" y="111" width="179" height="111" rx="11" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/><rect x="227" y="152" width="58" height="30" rx="5" fill="none" stroke="'+hi+'" stroke-width="4"/><rect x="286" y="160" width="7" height="15" rx="2" fill="'+hi+'"/><path d="M263 151 L244 171 H259 L251 184" fill="none" stroke="'+hi+'" stroke-width="3"/>';
  const tool='<path d="M142 124 H319 L358 157 V186 H259 L234 276 H189 L178 185 H142 Q118 185 118 164 V148 Q118 124 142 124Z" fill="'+light+'" stroke="'+ink+'" stroke-width="4"/><rect x="356" y="151" width="65" height="27" rx="4" fill="'+hi+'"/><rect x="164" y="181" width="77" height="17" rx="6" fill="'+dark+'"/><path d="M194 241 H230 L219 287 H184 Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>';
  const showroom='<path d="M111 276 V116 L258 60 L406 116 V276" fill="'+dark+'" stroke="'+ink+'" stroke-width="5"/><path d="M138 136 H379 V274 H138 Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/><path d="M138 224 H379 M218 136 V274 M300 136 V274" stroke="'+ink+'" stroke-width="5"/><path d="M160 208 L180 177 L199 208 M242 208 L260 172 L278 208 M326 200 H358 V211 H326 Z" fill="none" stroke="'+hi+'" stroke-width="5" stroke-linejoin="round"/><path d="M95 280 H424" stroke="'+hi+'" stroke-width="5"/>';
  const chosen=({moto,carro:car,telefone:phone,camera,cadeira:chair,bateria:battery,ferramenta:tool,showroom})[type]||phone;
  return '<svg viewBox="0 0 510 338" role="img" aria-label="Esquema de estudo: '+esc(type)+'; não é um produto real" xmlns="http://www.w3.org/2000/svg"><rect width="510" height="338" rx="17" fill="#183532"/><path d="M38 292 H472" stroke="#3b665d" stroke-width="2" stroke-dasharray="5 9"/>'+chosen+'<text x="24" y="28" font-family="system-ui,sans-serif" font-size="12" fill="#c7d9d0" font-weight="750">ESTUDO DE OBSERVAÇÃO · SEM ESPECIFICAÇÕES</text></svg>';
 }
 function output(){
  const s=scene(),w=record(),written=data().phases.map((p,i)=>({p,text:String(w.responses[i]||'').trim(),source:w.sources[i]})).filter(x=>x.text);
  return written.length?['STORYLAB | EXERCÍCIO DE NARRAÇÃO AUTORAL','Situação: '+s.name+' (caso didático; características fornecidas pelo estudante)','',
   ...written.flatMap(x=>[x.p.kind+' — '+x.p.name,'Origem declarada: '+sourceLabel(x.source),x.text,'']),
   'Nota: as declarações de origem são autorrelatos; o aplicativo não verificou medições, materiais ou segurança.'].join('\n'):'';
 }
 function spoken(){const w=record();return data().phases.map((p,i)=>String(w.responses[i]||'').trim()).filter(Boolean).join('\n\n')}
 function example(){
  const s=scene();
  const p=data().phases[state.phase],txt=String(p.frame||'');
  return '<div class="nar-example"><span class="trade-kicker">ESTRUTURA-GUIA, NÃO UMA AFIRMAÇÃO</span><p>'+esc(txt)+'</p><small>Os campos entre colchetes são espaços de observação. Não substituem ensaio ou conhecimento do produto.</small></div>';
 }
 function render(){
  const s=scene(),w=record(),p=data().phases[state.phase];if(!s||!p)return '<p>Laboratório em preparação.</p>';
  const filled=w.responses.filter(x=>String(x||'').trim()).length,checks=data().rubric.filter(q=>w.checks.includes(q[0])).length;
  const narrative=spoken();
  const mins=narrative?Math.max(1,Math.ceil(wordCount(narrative)/130)):0;
  return '<section class="nar-root"><header class="nar-hero"><div><span class="trade-kicker">LABORATÓRIO DE NARRATIVA / DESCRIÇÃO AUTORAL</span><h2>Uma coisa. Cinco olhares. Uma história bem contada.</h2>'+
  '<p>Do plano geral ao argumento final, observe antes de falar. O roteiro é escrito por você; o aplicativo oferece estruturas, perguntas e revisão, nunca inventa características.</p></div>'+
  '<div class="nar-metric"><strong>'+filled+' / 5</strong><span>etapas com narração</span></div></header>'+
  '<section class="nar-pick"><div class="nar-section-top"><span class="trade-kicker">01 / ESCOLHA A SITUAÇÃO</span><p>Casos didáticos interindustriais, não avaliações de modelos comerciais específicos.</p></div>'+
  '<div class="nar-scene-grid" role="group" aria-label="Situações de observação">'+data().scenes.map(v=>button('scene','<small>'+esc(v.tag)+'</small><strong>'+esc(v.name)+'</strong>',v.id,'nar-scene'+(v.id===s.id?' active':''))).join('')+'</div></section>'+
  '<div class="nar-workspace"><div class="nar-figure"><div class="nar-figure-media">'+vignette(s.illustration)+'</div><div class="nar-figure-info"><span class="trade-kicker">'+esc(s.tag)+' / '+esc(s.name)+'</span><p>'+esc(s.intro)+'</p></div>'+
  '<div class="nar-vocab"><span class="trade-kicker">VOCABULÁRIO PARA INVESTIGAR</span>'+
  [['Substantivos',s.nouns],['Verbos',s.verbs],['Adjetivos',s.adjectives]].map(pair=>'<div><strong>'+pair[0]+'</strong><p>'+pair[1].map(esc).join(' · ')+'</p></div>').join('')+'</div>'+
  '<div class="nar-warning"><strong>Evite estas armadilhas</strong>'+s.pitfalls.map(x=>'<p>× '+esc(x)+'</p>').join('')+'</div></div>'+
  '<div class="nar-editor"><div class="nar-phase-list" role="group" aria-label="Sequência de cinco planos">'+data().phases.map((q,i)=>button('phase','<span>'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(q.name)+'</strong><small>'+(String(w.responses[i]||'').trim()?'●':'○')+'</small>',String(i),'nar-phase'+(i===state.phase?' active':''))).join('')+'</div>'+
  '<section class="nar-writing"><span class="trade-kicker">'+String(state.phase+1).padStart(2,'0')+' / 05 · '+esc(p.kind.toUpperCase())+'</span><h3>'+esc(p.name)+'</h3>'+
  '<p class="nar-focus">'+esc(p.focus)+'</p>'+
  '<div class="nar-instruction"><small><span aria-hidden="true">◉</span> DIREÇÃO DE CÂMERA</small><p>'+esc(p.camera)+'</p></div>'+
  '<div class="nar-instruction nar-instruction-alt"><small>PERGUNTA ESPECÍFICA DA CENA</small><p>'+esc(s.questions[state.phase])+'</p></div>'+
  '<div class="nar-guide-actions">'+button('example',state.showExample?'Ocultar estrutura-guia':'Ver uma estrutura de frase')+'</div>'+
  (state.showExample?example():'')+
  '<label class="nar-text-label">SUA NARRAÇÃO EM PORTUGUÊS<textarea data-nar-response data-model="narrativePhase'+state.phase+'" rows="5" maxlength="600" placeholder="Escreva apenas o que você pode observar, atribuir ou comprovar neste plano…">'+esc(w.responses[state.phase]||'')+'</textarea></label>'+
  '<label class="nar-source-label">ORIGEM DA INFORMAÇÃO<select data-nar-source>'+data().sources.map(x=>'<option value="'+x[0]+'"'+((w.sources[state.phase]||'impressao')===x[0]?' selected':'')+'>'+esc(x[1])+'</option>').join('')+'</select></label>'+
  '<div class="nar-caution"><small>VERIFICAÇÃO SEMÂNTICA</small><p>'+esc(p.guard)+'</p></div>'+
  '<div class="nar-stage-actions">'+button('prev','← Plano anterior')+button('next',state.phase===4?'Rever o primeiro plano ↻':'Próximo plano →')+'</div></section></div></div>'+
  '<div class="nar-bottom"><section class="nar-review"><div class="nar-section-top"><span class="trade-kicker">02 / REVISÃO EDITORIAL</span><h3>O olhar de águia: cinco perguntas antes de publicar.</h3><p>Marque somente o que você conferiu pessoalmente. Isto não é correção automática de conteúdo.</p></div>'+
  '<div class="nar-checks">'+data().rubric.map(q=>'<label class="nar-check"><input type="checkbox" data-nar-check="'+q[0]+'"'+(w.checks.includes(q[0])?' checked':'')+'><span>'+esc(q[1])+'</span></label>').join('')+'</div>'+
  '<div class="nar-check-total">'+checks+' / '+data().rubric.length+' verificações assinaladas</div></section>'+
  '<section class="nar-output"><div class="nar-section-top"><span class="trade-kicker">03 / RESULTADO</span><h3>Sua narração, sem frases inventadas.</h3><p>'+filled+' planos escritos · '+wordCount(narrative)+' palavras'+(narrative?' · cerca de '+mins+' min em leitura pausada':'')+'. Duração apenas aproximada.</p></div>'+
  (narrative?'<blockquote class="nar-preview">'+data().phases.map((q,i)=>w.responses[i]?.trim()?'<div><small>'+esc(q.kind)+' · '+esc(sourceLabel(w.sources[i]))+'</small><p>'+esc(w.responses[i])+'</p></div>':'').join('')+'</blockquote>':'<p class="nar-empty">Escreva sua primeira observação. O texto surgirá aqui sem conclusões automáticas.</p>')+
  '<div class="nar-export">'+button('copy','Copiar roteiro com fontes','',''+(!narrative?' disabled':''))+button('tele','Abrir no teleprompter','',''+(!narrative?' disabled':''))+button('studio','Abrir Estúdio de Descrição')+'</div>'+
  '<div class="nar-transfer"><p>O teleprompter recebe somente o texto que você escreveu, sem rótulos. O Estúdio continua disponível para estruturar sua apresentação e registrar medidas reais.</p>'+button('reset','Reiniciar apenas este exercício')+'</div></section></div></section>';
 }
 function init(ctx){
  api=ctx;
  document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-nar]');if(!b)return;
   e.preventDefault();const a=b.dataset.nar,id=b.dataset.id||'';
   if(a==='scene'&&data().scenes.some(s=>s.id===id)){state.scene=id;state.phase=0;state.showExample=false;api.render();return}
   if(a==='phase'){const n=Number(id);if(Number.isInteger(n)&&n>=0&&n<5){state.phase=n;state.showExample=false;api.render()}return}
   if(a==='prev'||a==='next'){state.phase=(state.phase+(a==='prev'?4:1))%5;state.showExample=false;api.render();return}
   if(a==='example'){state.showExample=!state.showExample;api.render();return}
   if(a==='copy'){const txt=output();if(txt)api.copy(txt);return}
   if(a==='tele'){const txt=spoken();if(txt&&typeof api.toTele==='function')api.toTele(txt);return}
   if(a==='studio'){window.StoryLabTrade?.openTab?.('roteiro');return}
   if(a==='reset'){
    if(typeof window.confirm==='function'&&!window.confirm('Apagar somente as respostas e a revisão desta situação?'))return;
    registry()[scene().id]=defaultRecord();state.phase=0;state.showExample=false;api.save();api.render();return;
   }
  });
  document.addEventListener('input',e=>{
   if(!e.target.matches?.('[data-nar-response]'))return;
   const r=record();r.responses[state.phase]=String(e.target.value||'').slice(0,600);api.save();api.render(true);
  });
  document.addEventListener('change',e=>{
   if(e.target.matches?.('[data-nar-source]')){
    if(!data().sources.some(x=>x[0]===e.target.value))return;
    record().sources[state.phase]=e.target.value;api.save();api.render();return;
   }
   const id=e.target.dataset?.narCheck;
   if(id&&data().rubric.some(x=>x[0]===id)){
    const r=record();
    r.checks=r.checks.filter(x=>x!==id);
    if(e.target.checked)r.checks.push(id);
    api.save();api.render();
   }
  });
 }
 return {init,render,output,spoken,vignette,wordCount};
})();