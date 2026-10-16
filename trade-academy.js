/* StoryLab Shanghai · Academia Interindustrial e Radar Setorial · v2.17
   Estudo aplicado; sem testes de conformidade automáticos ou dados comerciais simulados. */
window.StoryLabTradeAcademy=(()=>{
'use strict';
let api=null;
const state={chapter:null,sector:null};
const data=()=>window.STORYLAB_TRADE_ACADEMY||{chapters:[],sectors:[]};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const saved=()=>api?.getStore?.()||{};
const completed=()=>Array.isArray(saved().tradeAcademyDone)?saved().tradeAcademyDone:[];
const answers=()=>saved().tradeAcademyAnswers||{};
const answerFor=id=>answers()[id];
function button(action,label,id='',klass=''){
 return '<button type="button" class="trade-academy-button '+klass+'" data-trade-academy="'+action+'" data-id="'+esc(id)+'">'+label+'</button>';
}
function lesson(){
 const chapters=data().chapters;if(!chapters.length)return '<p>Academia não disponível.</p>';
 const ch=chapters.find(c=>c.id===state.chapter)||chapters[0];
 const done=completed().includes(ch.id),answer=answerFor(ch.id);
 const chosen=answer&&Number.isInteger(answer.selected)?answer.selected:null;
 const index=chapters.findIndex(c=>c.id===ch.id);
 return '<section class="trade-academy">'+
 '<div class="trade-learning-hero"><div><span class="trade-kicker">ACADEMIA INTERINDUSTRIAL / FUNDAMENTAÇÃO</span>'+
 '<h2>A ciência por trás de produtos e fornecedores</h2><p>Engenharia de produto, materiais, sistemas, operações, inovação, qualidade, energia e ética. Teoria para fundamentar observações e entrevistas técnicas.</p></div>'+
 '<div class="trade-learning-stats"><strong>'+completed().filter(id=>chapters.some(c=>c.id===id)).length+' / '+chapters.length+'</strong><span>capítulos estudados</span></div></div>'+
 '<div class="trade-learning-layout"><nav class="trade-learning-syllabus" aria-label="Capítulos da academia">'+chapters.map((c,i)=>button('chapter','<small>'+String(i+1).padStart(2,'0')+' · '+esc(c.area)+'</small><strong>'+esc(c.title)+'</strong><span>'+(completed().includes(c.id)?'✓ Estudado':'Explorar →')+'</span>',c.id,('trade-learning-chapter'+(ch.id===c.id?' is-active':'')))).join('')+'</nav>'+
 '<article class="trade-learning-article"><div class="trade-learning-heading"><span class="trade-kicker">DOSSIÊ ACADÊMICO '+String(index+1).padStart(2,'0')+' / '+chapters.length+' · '+esc(ch.area)+'</span><h3>'+esc(ch.title)+'</h3><p>'+esc(ch.subtitle)+'</p></div>'+
 '<div class="trade-learning-sections">'+ch.sections.map((s,i)=>'<section class="trade-learning-section"><span class="trade-learning-number">'+String(i+1).padStart(2,'0')+'</span><div><h4>'+esc(s[0])+'</h4><p>'+esc(s[1])+'</p><div class="trade-learning-example"><small>EXEMPLO TÉCNICO</small><p>'+esc(s[2])+'</p></div></div></section>').join('')+'</div>'+
 '<section class="trade-learning-vocabulary"><span class="trade-kicker">VOCABULÁRIO FUNDAMENTAL · PT / EN</span><div>'+ch.terms.map(t=>'<div><strong>'+esc(t[0])+'</strong><small lang="en">'+esc(t[1])+'</small></div>').join('')+'</div></section>'+
 '<section class="trade-learning-case"><div><span class="trade-kicker">ESTUDO DE CASO / LEITURA CRÍTICA</span><h4>Da afirmação à evidência</h4></div>'+
 [['SITUAÇÃO',ch.caseStudy[0]],['ALEGAÇÃO',ch.caseStudy[1]],['O QUE NÃO SE SABE',ch.caseStudy[2]],['CONDUTA TÉCNICA',ch.caseStudy[3]]].map((part,i)=>'<div class="trade-learning-case-row '+(i===3?'is-conclusion':'')+'"><span>'+part[0]+'</span><p>'+esc(part[1])+'</p></div>').join('')+'</section>'+
 '<section class="trade-learning-quiz"><span class="trade-kicker">CONFERÊNCIA DE CONCEITO</span><h4>'+esc(ch.quiz[0])+'</h4><div class="trade-learning-options">'+ch.quiz[1].map((t,i)=>button('answer',String.fromCharCode(65+i)+' · '+esc(t),ch.id+':'+i,'trade-learning-option'+(chosen===i?' is-selected':'')+(chosen!==null&&i===ch.quiz[2]?' is-correct':''))).join('')+'</div>'+
 (chosen!==null?'<p class="trade-learning-feedback" role="status"><strong>'+(chosen===ch.quiz[2]?'✓ Interpretação consistente':'Revise sua interpretação')+'</strong> '+esc(ch.quiz[3])+'</p>':'<p class="trade-learning-hint">Selecione uma resposta para confrontar a teoria com a situação.</p>')+'</section>'+
 '<section class="trade-learning-language"><span class="trade-kicker">APLICAÇÃO EM VISITA · PT / EN / 中文</span><p lang="pt-BR">'+esc(ch.prompt[0])+'</p><p lang="en">'+esc(ch.prompt[1])+'</p><p lang="zh-CN" class="trade-learning-chinese">'+esc(ch.prompt[2])+'<small>'+esc(ch.prompt[3])+'</small></p><div class="trade-learning-actions">'+button('speak','▶ English',ch.id+':en')+button('speak','▶ 中文',ch.id+':zh')+button('copy','Copiar pergunta',ch.id)+'</div></section>'+
 '<div class="trade-learning-footer"><span>Concluir registra estudo pessoal, não qualificação ou certificação técnica.</span>'+button('complete',done?'✓ Estudado · desfazer':'Marcar como estudado',ch.id,done?'is-done':'is-primary')+'</div>'+
 '</article></div></section>';
}
function radar(){
 const sectors=data().sectors;if(!sectors.length)return '<p>Radar setorial não disponível.</p>';
 const sector=sectors.find(s=>s.id===state.sector)||sectors[0];
 const chapter=data().chapters.find(c=>c.id===sector.theory);
 return '<section class="trade-radar"><div class="trade-learning-hero"><div><span class="trade-kicker">RADAR / INDÚSTRIAS E TECNOLOGIAS</span>'+
 '<h2>Nove setores, uma metodologia de investigação</h2><p>Compare produtos e fornecedores com perguntas específicas para cada indústria. Os critérios diferem por aplicação, estágio tecnológico e mercado de destino.</p></div>'+
 '<div class="trade-learning-stats"><strong>'+sectors.length+'</strong><span>especializações</span></div></div>'+
 '<div class="trade-radar-grid"><nav class="trade-radar-sectors" aria-label="Escolher especialização">'+sectors.map(s=>button('sector','<span>'+esc(s.tag)+'</span><strong>'+esc(s.name)+'</strong><small>'+esc(s.summary)+'</small>',s.id,'trade-radar-sector'+(sector.id===s.id?' is-active':''))).join('')+'</nav>'+
 '<article class="trade-radar-detail"><div class="trade-radar-heading"><span class="trade-kicker">'+esc(sector.tag.toUpperCase())+' / PERFIL SETORIAL</span><h3>'+esc(sector.name)+'</h3><p>'+esc(sector.summary)+'</p></div>'+
 '<div class="trade-radar-lenses"><span class="trade-kicker">CINCO LENTES DE ANÁLISE</span><div>'+sector.lenses.map((l,i)=>'<section><span>'+String(i+1).padStart(2,'0')+'</span><div><h4>'+esc(l[0])+'</h4><p>'+esc(l[1])+'</p></div></section>').join('')+'</div></div>'+
 '<div class="trade-radar-proof"><strong>Que tipo de evidência procurar?</strong><p>'+esc(sector.proof)+'</p></div>'+
 '<section class="trade-learning-language"><span class="trade-kicker">PERGUNTA DA INDÚSTRIA · PT / EN / 中文</span><p>'+esc(sector.question[0])+'</p><p lang="en">'+esc(sector.question[1])+'</p><p lang="zh-CN" class="trade-learning-chinese">'+esc(sector.question[2])+'<small>'+esc(sector.question[3])+'</small></p><div class="trade-learning-actions">'+button('speak-sector','▶ English',sector.id+':en')+button('speak-sector','▶ 中文',sector.id+':zh')+button('copy-sector','Copiar pergunta',sector.id)+'</div></section>'+
 '<div class="trade-radar-connected"><div><span class="trade-kicker">FUNDAMENTO RECOMENDADO</span><strong>'+esc(chapter?.title||'Academia técnica')+'</strong></div>'+button('open-chapter','Estudar teoria →',sector.theory)+'</div>'+
 '<div class="trade-radar-dossier"><span class="trade-kicker">APLICAÇÃO REAL / REGISTRO LOCAL</span><p>Crie um dossiê com as oito dimensões universais e associe esta especialização. Não registre como comprovado aquilo que foi apenas declarado.</p><div>'+button('start-dossier','+ Dossiê de produto',sector.id+':produto','is-primary')+button('start-dossier','+ Visita a fornecedor',sector.id+':fornecedor')+'</div></div>'+
 '</article></div></section>';
}
function init(context){
 api=context;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-trade-academy]');if(!b)return;
  e.preventDefault();const action=b.dataset.tradeAcademy,id=b.dataset.id||'';
  if(action==='chapter'){
   if(data().chapters.some(c=>c.id===id)){state.chapter=id;api.render()}return;
  }
  if(action==='sector'){
   if(data().sectors.some(s=>s.id===id)){state.sector=id;api.render()}return;
  }
  if(action==='answer'){
   const [c,i]=id.split(':'),ch=data().chapters.find(x=>x.id===c),chosen=Number(i);
   if(!ch||!Number.isInteger(chosen)||chosen<0||chosen>=ch.quiz[1].length)return;
   const s=saved();s.tradeAcademyAnswers=s.tradeAcademyAnswers||{};
   s.tradeAcademyAnswers[ch.id]={selected:chosen};api.save();api.render();return;
  }
  if(action==='complete'){
   if(!data().chapters.some(c=>c.id===id))return;
   const s=saved();s.tradeAcademyDone=Array.isArray(s.tradeAcademyDone)?s.tradeAcademyDone:[];
   if(s.tradeAcademyDone.includes(id))s.tradeAcademyDone=s.tradeAcademyDone.filter(v=>v!==id);
   else s.tradeAcademyDone.push(id);
   api.save();api.render();return;
  }
  if(action==='open-chapter'){
   if(!data().chapters.some(c=>c.id===id))return;
   state.chapter=id;window.StoryLabTrade?.openTab?.('academia');return;
  }
  if(action==='start-dossier'){
   const [sector,kind]=id.split(':');
   if(!data().sectors.some(s=>s.id===sector)||!['produto','fornecedor'].includes(kind))return;
   if(window.StoryLabTradeField?.startSector?.(kind,sector))window.StoryLabTrade?.openTab?.('dossies');
   return;
  }
  if(['speak','copy','speak-sector','copy-sector'].includes(action)){
   const [key,lang]=id.split(':'),chapter=data().chapters.find(c=>c.id===key),
    sector=data().sectors.find(s=>s.id===key),p=action.endsWith('sector')?sector?.question:chapter?.prompt;
   if(!p)return;
   if(action.startsWith('copy'))api.copy(p.join('\n'));
   if(action.startsWith('speak')&&lang==='en')api.say(p[1],'en-US');
   if(action.startsWith('speak')&&lang==='zh')api.say(p[2],'zh-CN');
  }
 });
}
return {init,academy:lesson,sectors:radar};
})();