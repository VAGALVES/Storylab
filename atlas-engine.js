/* StoryLab Shanghai · Atlas Descritivo 1.4
   Ciclo lexical: entender (verbetes) → discriminar (treino de precisão)
   → produzir (prática progressiva) → revisar (repetição espaçada).
   Módulo independente; não envia rascunhos nem respostas para servidores.
   Todos os indicadores são determinísticos: não há correção por IA. */
window.StoryLabAtlas=(()=>{
'use strict';

const LEVELS=[
 ['Observar','20 s','Diga o que a câmera mostra, sem adivinhar história, autoria ou intenção.'],
 ['Descrever','40 s','Acrescente dois detalhes concretos e a relação entre eles.'],
 ['Comparar','60 s','Compare duas partes da cena usando um critério perceptível.'],
 ['Interpretar','90 s','Conclua com uma interpretação pessoal claramente identificada como tal.']
];

// Repetição espaçada: mesmo esquema da Fraseoteca (dias até a próxima revisão)
const INTERVALS=[0,1,3,7,14,30];
const MASTERED=3;       // a partir deste nível (revisão em 7+ dias) o termo conta como dominado
const QUIZ_SIZE=8;
const DAY=86400000;

// Palavras vagas detectadas mesmo sem troca específica no Atlas
const EXTRA_VAGUE=['lindo','maravilhoso','superlegal','interessante','perfeito','top','show','fantastico','espetacular'];

const view={topic:0,tab:'explore',word:'',query:'',level:0,show:false,score:3,feedback:null,quiz:null};

let api=null;

function g(){return window.STORYLAB_ATLAS_GUIDES?.[view.topic]}
function guides(){return window.STORYLAB_ATLAS_GUIDES||[]}
function key(){return view.topic+':'+view.level}
function draft(){return String(api.getStore().atlasDrafts?.[key()]||'')}
function model(){return g().model.slice(0,view.level+1).join(' ')}
function sayWords(t){return t.trim()?t.trim().split(/\s+/).length:0}
function now(){return api.now?api.now():Date.now()}
function rand(){return api.random?api.random():Math.random()}
function shuffle(list){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function card(topic,term){return guides()[topic]?.terms.find(x=>x[0]===term)}

/* ── Domínio por termo ─────────────────────────────────────────────
   Chave "campo:termo", pois alguns termos existem em mais de um campo
   com sentidos distintos (ex.: "silhueta" em Moda e em Fotografia). */
function mastery(){
 const st=api.getStore();
 if(!st.atlasMastery||typeof st.atlasMastery!=='object'||Array.isArray(st.atlasMastery))st.atlasMastery={};
 return st.atlasMastery;
}
function mkey(topic,term){return topic+':'+term}
function record(topic,term){const r=mastery()[mkey(topic,term)];return r&&typeof r==='object'?r:null}
function status(topic,term){
 const r=record(topic,term);
 if(!r)return 'new';
 if(Number(r.next)<=now())return 'due';
 return Number(r.level)>=MASTERED?'mastered':'learning';
}
function grade(topic,term,correct){
 const before=record(topic,term)||{level:0,right:0,wrong:0};
 // Acerto sobe um nível; erro volta ao início e o termo reaparece no próximo treino
 const level=correct?Math.min(INTERVALS.length-1,(Number(before.level)||0)+1):0;
 mastery()[mkey(topic,term)]={level,right:(Number(before.right)||0)+(correct?1:0),wrong:(Number(before.wrong)||0)+(correct?0:1),last:now(),next:now()+INTERVALS[level]*DAY};
 api.save();
}
function fieldProgress(topic){
 const terms=api.D.atlas[topic].terms;
 return {mastered:terms.filter(t=>status(topic,t)==='mastered').length,due:terms.filter(t=>status(topic,t)==='due').length,total:terms.length};
}
function totals(){
 let mastered=0,due=0,total=0;
 api.D.atlas.forEach((_,i)=>{const p=fieldProgress(i);mastered+=p.mastered;due+=p.due;total+=p.total});
 return {mastered,due,total};
}

/* ── Palavras vagas → termos precisos ──────────────────────────────
   Gera flexões simples (gênero e número) para detectar "bonita",
   "grandes", "incríveis" etc. sem depender de análise semântica. */
function variants(word){
 const w=api.norm(word),out=new Set([w]);
 if(w.includes(' '))return [...out];
 if(/vel$/.test(w))out.add(w.replace(/vel$/,'veis'));
 else if(/o$/.test(w)){const b=w.slice(0,-1);['a','os','as'].forEach(s=>out.add(b+s))}
 else if(/e$/.test(w))out.add(w+'s');
 else if(/[rz]$/.test(w))out.add(w+'es');
 else if(!/s$/.test(w))out.add(w+'s');
 return [...out];
}
function vagueIndex(){
 const index=[];
 guides().forEach((field,topic)=>(field.swaps||[]).forEach(s=>{if(s.flag)index.push({word:s.vague,forms:variants(s.vague),topic,swap:s})}));
 EXTRA_VAGUE.forEach(word=>index.push({word,forms:variants(word),topic:null,swap:null}));
 return index;
}
function findVague(text){
 const t=' '+api.norm(text).replace(/[^a-z0-9\s-]/g,' ')+' ',found=new Map();
 vagueIndex().forEach(v=>{
  const matched=v.forms.filter(f=>new RegExp('\\s'+escRe(f)+'(?=\\s)').test(t));
  if(!matched.length)return;
  const hits=matched.reduce((n,f)=>n+(t.match(new RegExp('\\s'+escRe(f)+'(?=\\s)','g'))||[]).length,0);
  // Agrupa pelas formas encontradas no texto: "bonita" pode vir de "bonito" (Formas)
  // ou de "bonita" (Pessoas) — é a mesma ocorrência e deve ser contada uma vez.
  // Entre trocas equivalentes, prefere a do campo atual.
  const k=matched.sort().join('|'),prev=found.get(k);
  if(!prev||(v.topic===view.topic&&prev.topic!==view.topic))found.set(k,{...v,hits});
 });
 return [...found.values()];
}
function analyze(t){
 const words=sayWords(t), terms=g().terms.filter(x=>api.norm(t).includes(api.norm(x[0]))).map(x=>x[0]);
 const swaps=findVague(t), vague=swaps.reduce((n,s)=>n+s.hits,0);
 const tips=[];
 if(words<25)tips.push('Inclua outro detalhe verificável para dar mais substância à descrição.');
 if(terms.length===0)tips.push('Experimente um termo do campo, somente se ele corresponder ao que observou.');
 if(vague)tips.push('Substitua palavras genéricas por forma, posição, textura, luz, som ou movimento — veja as trocas sugeridas abaixo.');
 if(view.level>1&&!/compar|enquanto|diferente|ao contr.rio|mais .* que|menos .* que|por outro lado/i.test(api.norm(t)))tips.push('Nesta etapa, torne explícito o critério da comparação.');
 if(view.level===3&&!/minha impress.o|na minha|para mim|eu penso|me parece|considero/i.test(api.norm(t)))tips.push('Identifique claramente a conclusão como sua interpretação.');
 return {words,terms,vague,swaps,tips};
}

/* ── Treino de precisão ────────────────────────────────────────────
   Dois formatos de recuperação ativa, gerados dos próprios verbetes:
   definição → termo e frase com lacuna → termo. As alternativas vêm
   do MESMO campo, obrigando a distinguir vizinhos (difusa × suave). */
function gapSentence(term,example){
 const n=api.norm(term);
 if(n.includes(' '))return null;
 // Tolera flexão: "retilíneo" → "retilíneas", "liso" → "lisa"
 const stem=/[oae]$/.test(n)&&n.length>3?n.slice(0,-1):n;
 const parts=example.split(/(\s+)/);
 const hit=parts.findIndex(w=>{const nw=api.norm(w).replace(/[^a-z-]/g,'');return nw.startsWith(stem)&&nw.length-stem.length<=3});
 if(hit<0)return null;
 const trail=(parts[hit].match(/[.,;:!?”"')]+$/)||[''])[0];
 parts[hit]='_____'+trail;
 return parts.join('');
}
// Frase de cena escrita para o treino (5º item do verbete): o contexto isola o termo entre todos os do campo
function sceneSentence(c){return typeof c[4]==='string'&&c[4].split('_____').length===2?c[4]:null}
function buildQuestion(topic,term,pos){
 const c=card(topic,term);
 // Quase-sinônimos do mesmo grupo (campo "near") nunca disputam a mesma pergunta
 const near=new Set((guides()[topic]?.near||[]).filter(g=>g.includes(term)).flat());
 const others=shuffle(api.D.atlas[topic].terms.filter(t=>t!==term&&!near.has(t))).slice(0,3);
 const scene=sceneSentence(c);
 // Sem frase de cena, a lacuna automática vem do exemplo — exceto nos campos de conectores,
 // em que vários termos caberiam numa lacuna isolada
 const gap=!scene&&guides()[topic]?.quiz!=='definition'?gapSentence(term,c[2]):null;
 const type=pos%2!==0?'def':scene?'scene':gap?'gap':'def';
 return {topic,term,type,prompt:type==='scene'?scene:type==='gap'?gap:c[1],options:shuffle([term,...others]),picked:null};
}
function startQuiz(scope){
 const t=now(),topics=scope==='all'?api.D.atlas.map((_,i)=>i):[view.topic],pool=[];
 topics.forEach(topic=>api.D.atlas[topic].terms.forEach(term=>{
  if(!card(topic,term))return;
  const r=record(topic,term);
  // Prioridade: revisões vencidas → termos novos → em aprendizagem → dominados
  const rank={due:0,new:1,learning:2,mastered:3}[status(topic,term)];
  pool.push({topic,term,rank,next:r?Number(r.next)||t:t,tie:rand()});
 }));
 pool.sort((a,b)=>a.rank-b.rank||a.next-b.next||a.tie-b.tie);
 view.quiz={scope,items:shuffle(pool.slice(0,QUIZ_SIZE)).map((x,i)=>buildQuestion(x.topic,x.term,i)),i:0,done:false};
}
function answer(option){
 const q=view.quiz,item=q&&q.items[q.i];
 if(!item||item.picked!==null||!item.options.includes(option))return;
 item.picked=option;
 grade(item.topic,item.term,option===item.term);
}
function nextQuestion(){
 const q=view.quiz;
 if(!q||q.items[q.i].picked===null)return;
 if(q.i<q.items.length-1)q.i++;
 else q.done=true;
}

/* ── Interface ─────────────────────────────────────────────────────── */
function button(action,label,cls='',attr=''){return '<button type="button" class="'+cls+'" data-atlas-action="'+action+'" '+attr+'>'+label+'</button>'}
const MARK={new:'',learning:'<span class="atlas14-mark learning" aria-label="Em aprendizagem">●</span>',mastered:'<span class="atlas14-mark mastered" aria-label="Dominado">✓</span>',due:'<span class="atlas14-mark due" aria-label="Revisão pendente">↻</span>'};
const LABEL={new:'Ainda não treinado',learning:'Em aprendizagem',mastered:'Dominado',due:'Revisão pendente'};
function currentCard(){
 const term=view.word&&api.D.atlas[view.topic].terms.includes(view.word)?view.word:g().terms[0][0];
 return {term,card:card(view.topic,term)};
}
function bar(value,total,label){return '<div class="atlas14-bar" role="progressbar" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+value+'"><span style="width:'+(total?Math.round(value/total*100):0)+'%"></span></div>'}
function termButtons(){
 const {D,esc,norm}=api;
 if(view.query.trim()){
  const q=norm(view.query),matches=[];
  D.atlas.forEach((group,i)=>group.terms.forEach(term=>{
   if(norm([group.title,term,...(card(i,term)||[])].join(' ')).includes(q))matches.push({term,i});
  }));
  return '<div class="atlas12-list"><div class="eyebrow">'+matches.length+' RESULTADOS NO ATLAS</div><div class="atlas12-tags">'+matches.slice(0,70).map(x=>button('word',esc(x.term)+' <small>'+esc(D.atlas[x.i].title)+'</small>','atlas12-term','data-topic="'+x.i+'" data-word="'+esc(x.term)+'"')).join('')+'</div>'+(matches.length>70?'<p class="muted small">Refine sua busca para ver outros resultados.</p>':'')+'</div>';
 }
 const terms=D.atlas[view.topic].terms, selected=currentCard().term, p=fieldProgress(view.topic);
 return '<div class="atlas12-list"><div class="row" style="align-items:baseline"><div class="eyebrow">REPERTÓRIO DO CAMPO</div><span class="muted small">'+p.mastered+'/'+p.total+' dominados</span></div>'+bar(p.mastered,p.total,'Domínio do campo')+
  '<div class="atlas12-tags">'+terms.map(term=>button('word',esc(term)+MARK[status(view.topic,term)],'atlas12-term '+(selected===term?'active':''),'data-topic="'+view.topic+'" data-word="'+esc(term)+'"')).join('')+'</div>'+
  '<p class="muted small" style="margin:12px 0 0">✓ dominado · ● em aprendizagem · ↻ revisão pendente. O domínio é medido no Treino de precisão.</p></div>';
}
function swapsPanel(){
 const {esc}=api,list=g().swaps||[];
 if(!list.length)return '';
 return '<div class="panel panel-pad"><div class="eyebrow">TROQUE A PALAVRA GENÉRICA</div><p class="muted small">Palavras vagas pedem que o público confie; termos precisos mostram. Use a troca só se ela corresponder ao que você observou.</p>'+
  list.map(s=>'<div class="atlas14-swap"><div class="atlas14-swap-head"><s>'+esc(s.vague)+'</s><span aria-hidden="true">→</span>'+s.options.map(o=>button('word',esc(o),'atlas14-chip','data-topic="'+view.topic+'" data-word="'+esc(o)+'"')).join('')+'</div><p class="atlas14-weak"><span class="sr-only">Versão vaga: </span>'+esc(s.weak)+'</p><p class="atlas14-strong"><span class="sr-only">Versão precisa: </span>'+esc(s.strong)+'</p></div>').join('')+'</div>';
}
function dictionary(){
 const {esc,ico}=api,{term,card:c}=currentCard(),area=api.D.atlas[view.topic],st=status(view.topic,term),r=record(view.topic,term);
 let detail='<div class="panel panel-pad atlas12-detail"><div class="eyebrow">CONCEITO EM CONTEXTO · '+esc(area.title.toUpperCase())+'</div><h2>'+esc(term)+'</h2>';
 if(c)detail+='<p class="atlas12-definition">'+esc(c[1])+'</p><div class="atlas12-example"><div class="eyebrow">DIGA ASSIM</div><p>'+esc(c[2])+'</p></div><div class="atlas12-warning"><div class="eyebrow">PRECISÃO E CUIDADO</div><p>'+esc(c[3])+'</p></div>';
 else detail+='<p class="muted">Termo do repertório essencial. O verbete aprofundado ainda está em construção. Evite empregar uma palavra cujo significado ou aplicação não tenha confirmado.</p><div class="notice info">'+esc(area.prompt)+'</div>';
 const bilingual=window.STORYLAB_URBANISM?.byField?.[view.topic]?.[term];
 if(bilingual){
  detail+='<div class="atlas12-example"><div class="eyebrow">ENGLISH · EQUIVALENTE</div><p><strong lang="en">'+esc(bilingual.en)+'</strong></p>'+
   (bilingual.englishSentence?'<p lang="en">'+esc(bilingual.englishSentence)+'</p>':'')+
   '<div class="form-row">'+button('copy-en',ico('copy',14)+' Copiar inglês','btn secondary sm')+'</div></div>';
  if(bilingual.relations?.length)detail+='<div class="atlas12-example"><div class="eyebrow">REDE SEMÂNTICA · CONCEITOS RELACIONADOS</div><p class="muted small">Toque para explorar a relação em outro campo:</p><div class="atlas12-tags">'+
   bilingual.relations.map(x=>button('word',esc(x.term),'atlas14-chip','data-topic="'+x.topic+'" data-word="'+esc(x.term)+'"')).join('')+'</div></div>';
 }
 const family=window.StoryLabVerbLab?.lookup?.(view.topic,term);
 if(family)detail+='<div class="atlas12-example"><div class="eyebrow">FAMÍLIA VERBAL</div><p><strong>'+esc(family.noun)+'</strong> · substantivo '+(family.nounType==='derivado'?'derivado':'relacionado')+'; <strong>'+esc(family.adj)+'</strong> · '+esc(family.adjType)+'</p><p>'+esc(family.grammar)+'</p>'+button('verb-show','Explorar a família lexical','btn secondary sm')+'</div>';
 detail+='<p class="atlas14-status '+st+'">'+MARK[st]+' '+LABEL[st]+(r?' · '+r.right+' acerto(s), '+r.wrong+' erro(s)':'')+'</p>';
 detail+='<div class="form-row">'+button('copy',ico('copy',15)+' Copiar termo','btn secondary sm')+button('train-field',ico('target',15)+' Treinar este campo','btn secondary sm')+button('practice',ico('mic',15)+' Praticar este campo','btn accent sm')+'</div></div>';
 return '<div class="atlas12-columns"><div class="stack"><div class="panel panel-pad"><div class="eyebrow">ENCONTRE A PALAVRA PRECISA</div><p class="muted small">'+esc(g().focus)+'</p>'+termButtons()+'</div>'+(view.query.trim()?'':swapsPanel())+'</div>'+detail+'</div>';
}
function history(){
 const {esc}=api,st=api.getStore(),h=st.atlasHistory||[];
 return '<div class="panel panel-pad"><div class="eyebrow">CADERNO DE PRÁTICA</div><h3 style="margin:10px 0">'+h.length+' registro(s)</h3>'+(h.length?h.slice(-5).reverse().map(x=>{
  const idx=h.indexOf(x);
  return '<div class="atlas12-history"><strong>'+esc(api.D.atlas[x.topic]?.title||'Campo')+' · Nível '+(x.level+1)+'</strong><p class="muted small">'+esc(x.text.slice(0,105))+'</p><span class="muted small">Autoavaliação: '+x.score+'/5'+(Array.isArray(x.rubric)?' · Voz '+x.rubric.join('/'):'')+(x.recorded?' · Take '+(x.takeSeconds||0)+'s (arquivo não armazenado)':'')+'</span> '+button('restore','Reabrir','btn secondary sm','data-index="'+idx+'"')+'</div>';
 }).join(''):'<p class="muted small">Sua primeira descrição registrada aparecerá aqui.</p>')+'</div>';
}
function feedbackBox(feedback){
 const {esc}=api;
 let html='<div class="atlas12-feedback" role="status"><strong>Indicadores simples — não é correção por IA</strong><p>'+feedback.words+' palavras · '+feedback.terms.length+' termos do campo · '+feedback.vague+' palavra(s) genérica(s)</p>'+(feedback.tips.length?'<ul>'+feedback.tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'<p>Releia em voz alta e confira a precisão de cada informação.</p>');
 if(feedback.swaps.length)html+='<div class="atlas14-found"><div class="eyebrow">TROCAS SUGERIDAS</div>'+feedback.swaps.map(s=>'<div class="atlas14-swap-head"><s>'+esc(s.word)+'</s>'+(s.hits>1?'<small>×'+s.hits+'</small>':'')+'<span aria-hidden="true">→</span>'+(s.swap?s.swap.options.map(o=>'<span class="atlas14-pill">'+esc(o)+'</span>').join('')+'<small class="muted">'+esc(api.D.atlas[s.topic].title)+'</small>':'<small class="muted">descreva forma, posição, luz, som ou movimento</small>')+'</div>').join('')+'</div>';
 return html+'</div>';
}
function exercise(){
 const {esc,ico}=api,text=draft(),feedback=view.feedback,level=LEVELS[view.level];
 let html='<div class="panel panel-pad atlas12-work"><div class="eyebrow">EXERCÍCIO GUIADO · CENA HIPOTÉTICA</div><h2>'+esc(g().scene)+'</h2><div class="atlas12-steps" role="group" aria-label="Etapas progressivas">'+LEVELS.map((l,i)=>button('level','0'+(i+1)+' · '+esc(l[0]),'atlas12-step '+(view.level===i?'active':''),'data-level="'+i+'"')).join('')+'</div><p class="muted"><strong>'+esc(level[1])+' sugeridos.</strong> '+esc(level[2])+'</p><div class="notice info">'+esc(g().focus)+'</div><label class="field-label" for="atlas12-writing" style="margin-top:22px">Sua narração</label><textarea id="atlas12-writing" class="field atlas12-writing" data-atlas-writing="1" rows="8" maxlength="3000" placeholder="Descreva somente o que de fato observou...">'+esc(text)+'</textarea><div class="row"><span class="small muted">Rascunho salvo automaticamente</span><span id="atlas12-count" class="small muted">'+sayWords(text)+' palavras</span></div><div id="atlas14-live" class="atlas14-live" aria-live="polite">'+liveHtml(text)+'</div><div class="form-row" style="margin-top:16px">'+button('review',ico('target',14)+' Analisar texto','btn accent')+button('model',ico('book',14)+(view.show?' Ocultar':' Ver')+' exemplo','btn secondary')+'</div>';
 if(feedback)html+=feedbackBox(feedback);
 if(view.show)html+='<div class="atlas12-example"><div class="eyebrow">EXEMPLO AUTORAL · SITUAÇÃO FICTÍCIA</div><p>'+esc(model())+'</p><div class="form-row">'+button('listen',ico('volume',14)+' Ouvir','btn secondary sm')+button('copy-model',ico('copy',14)+' Copiar modelo','btn secondary sm')+'</div></div>';
 html+='<div class="divider"></div><div class="form-row" style="align-items:end"><div><label class="field-label" for="atlas12-rating">Sua autoavaliação</label><select id="atlas12-rating" data-atlas-rating="1">'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(view.score===n?'selected':'')+'>'+n+' / 5</option>').join('')+'</select></div>'+button('save',ico('check',14)+' Registrar prática','btn accent')+button('tele',ico('film',14)+' Teleprompter','btn secondary')+button('timer',ico('timer',14)+' Cronômetro '+esc(level[1]),'btn secondary')+'</div><p class="muted small">Nenhum resultado é tratado como prova de habilidade ou verificação factual automática.</p></div>';
 // Vocabulário do campo à mão durante a escrita, com o estado de domínio
 const vocab='<div class="panel panel-pad"><div class="eyebrow">VOCABULÁRIO DO CAMPO</div><div class="atlas12-tags">'+api.D.atlas[view.topic].terms.map(t=>button('insert',esc(t)+MARK[status(view.topic,t)],'atlas14-chip','data-word="'+esc(t)+'" title="Inserir no texto"')).join('')+'</div><p class="muted small" style="margin:12px 0 0">Toque num termo para inseri-lo onde está o cursor. Use apenas os que correspondem à cena.</p></div>';
 return '<div class="atlas12-columns"><div class="stack">'+html+'</div><aside class="stack"><div class="panel panel-pad"><div class="eyebrow">ESCADA NARRATIVA</div><p class="muted">01 Observar → 02 Detalhar → 03 Comparar → 04 Interpretar. Em cada nível, o exemplo incorpora os anteriores.</p><p class="muted">Pratique primeiro sem olhar o modelo. Grave sua voz no Estúdio da Voz quando quiser.</p>'+button('voice',ico('mic',14)+' Ir ao Estúdio da Voz','btn secondary sm')+'</div>'+vocab+history()+'</aside></div>';
}
function training(){
 const {esc,ico}=api,q=view.quiz,t=totals(),p=fieldProgress(view.topic);
 if(!q)return '<div class="panel panel-pad atlas14-train"><div class="eyebrow">TREINO DE PRECISÃO · RECUPERAÇÃO ATIVA</div><h2 class="atlas14-title">Distinga termos vizinhos</h2><p class="muted">Cada rodada traz '+QUIZ_SIZE+' perguntas geradas dos verbetes: escolha o termo que corresponde à definição ou completa a frase. As alternativas são do mesmo campo — o desafio é perceber a diferença entre palavras próximas.</p><p class="muted small">Acertos espaçam as revisões (1, 3, 7, 14 e 30 dias); erros trazem o termo de volta no próximo treino. Revisões pendentes aparecem primeiro. Um termo conta como dominado após três acertos seguidos.</p><div class="form-row">'+button('quiz-start',ico('target',14)+' Treinar “'+esc(api.D.atlas[view.topic].title)+'” · '+p.mastered+'/'+p.total,'btn accent','data-scope="field"')+button('quiz-start',ico('spark',14)+' Treino misto do Atlas'+(t.due?' · '+t.due+' revisões':''),'btn secondary','data-scope="all"')+'<button type="button" class="btn secondary" data-ix="term-cards" data-topic="'+view.topic+'">'+ico('book',14)+' Cartões do campo</button></div></div>';
 if(q.done){
  const right=q.items.filter(x=>x.picked===x.term),missed=q.items.filter(x=>x.picked!==x.term);
  return '<div class="panel panel-pad atlas14-train" role="status"><div class="eyebrow">RESULTADO DA RODADA</div><h2 class="atlas14-title">'+right.length+' de '+q.items.length+' corretas</h2>'+
   (missed.length?'<p class="muted">Revise estes verbetes — eles voltarão no próximo treino:</p><div class="atlas12-tags">'+missed.map(x=>button('word',esc(x.term)+' <small>'+esc(api.D.atlas[x.topic].title)+'</small>','atlas12-term','data-topic="'+x.topic+'" data-word="'+esc(x.term)+'"')).join('')+'</div>':'<p class="muted">Rodada sem erros. Esses termos só voltarão quando a revisão vencer.</p>')+
   '<div class="form-row" style="margin-top:18px">'+button('quiz-start',ico('target',14)+' Nova rodada','btn accent','data-scope="'+q.scope+'"')+button('quiz-exit','Encerrar treino','btn secondary')+'</div><p class="muted small">Domínio total do Atlas: '+t.mastered+'/'+t.total+' termos.</p></div>';
 }
 const item=q.items[q.i],answered=item.picked!==null,c=card(item.topic,item.term);
 let html='<div class="panel panel-pad atlas14-train"><div class="row"><div class="eyebrow">PERGUNTA '+(q.i+1)+' DE '+q.items.length+' · '+esc(api.D.atlas[item.topic].title.toUpperCase())+'</div>'+button('quiz-exit','Sair','btn secondary sm')+'</div>'+bar(q.i+(answered?1:0),q.items.length,'Progresso da rodada')+
  '<p class="muted small" style="margin-top:16px">'+({scene:'Qual termo completa a cena com precisão?',gap:'Qual termo o verbete usa para completar esta frase?'}[item.type]||'Qual termo corresponde a esta definição?')+'</p>'+
  '<p class="atlas14-prompt">'+esc(item.prompt)+'</p><div class="atlas14-options" role="group" aria-label="Alternativas">'+
  item.options.map(o=>{
   let cls='atlas14-option';
   if(answered){if(o===item.term)cls+=' correct';else if(o===item.picked)cls+=' wrong'}
   return button('quiz-answer',esc(o),cls,'data-option="'+esc(o)+'"'+(answered?' disabled':''));
  }).join('')+'</div>';
 if(answered){
  const ok=item.picked===item.term,other=card(item.topic,item.picked);
  html+='<div class="atlas14-explain '+(ok?'ok':'no')+'" role="status"><strong>'+(ok?'Correto.':'Não é “'+esc(item.picked)+'”. A resposta é “'+esc(item.term)+'”.')+'</strong>'+(item.type!=='def'?'<p class="atlas14-filled">'+esc(item.prompt).replace('_____','<mark>'+esc(item.term)+'</mark>')+'</p>':'')+'<p>'+esc(c[1])+'</p><p class="small"><strong>Cuidado:</strong> '+esc(c[3])+'</p>'+
   (ok||!other?'':(item.type!=='def'?'<p class="small muted">Em uma frase isolada, mais de um termo pode soar plausível. Compare as definições para perceber o que cada um afirma:</p>':'')+'<p class="small muted"><strong>'+esc(item.picked)+':</strong> '+esc(other[1])+'</p>')+'</div>'+
   '<div class="form-row">'+button('quiz-next',(q.i<q.items.length-1?'Próxima pergunta':'Ver resultado')+' '+ico('arrow',14),'btn accent')+'</div>';
 }
 return html+'</div>';
}
/* ── Escrita assistida ─────────────────────────────────────────────
   Análise ao vivo enquanto o estudante digita (com atraso curto para não
   pesar) e inserção de termos do campo na posição do cursor. */
let liveTimer=null;
function liveHtml(t){
 const {esc}=api;
 if(!t.trim())return '<span class="muted small">Conforme você escreve, aparecem aqui os termos do campo usados e as palavras genéricas.</span>';
 const a=analyze(t);
 return '<span class="atlas14-live-item'+(a.terms.length?' ok':'')+'">'+a.terms.length+' termo(s) do campo'+(a.terms.length?': '+a.terms.map(esc).join(', '):'')+'</span>'+
  '<span class="atlas14-live-item'+(a.vague?' warn':'')+'">'+a.vague+' palavra(s) genérica(s)'+(a.swaps.length?': '+a.swaps.map(x=>esc(x.word)).join(', '):'')+'</span>';
}
function scheduleLive(text){
 clearTimeout(liveTimer);
 liveTimer=setTimeout(()=>{const el=document.getElementById('atlas14-live');if(el)el.innerHTML=liveHtml(text)},300);
}
function insertTerm(word){
 const ta=document.getElementById('atlas12-writing');
 if(!ta||!api.D.atlas[view.topic].terms.includes(word))return;
 const start=ta.selectionStart??ta.value.length,end=ta.selectionEnd??start,before=ta.value.slice(0,start),after=ta.value.slice(end);
 const pre=before&&!/\s$/.test(before)?' ':'',post=after&&!/^[\s.,;:!?]/.test(after)?' ':'';
 ta.value=(before+pre+word+post+after).slice(0,3000);
 const caret=Math.min(ta.value.length,(before+pre+word).length);
 ta.focus();ta.setSelectionRange(caret,caret);
 ta.dispatchEvent(new Event('input',{bubbles:true}));
}
function render(){
 if(!api)return '';
 const {D,esc,header,stat,ico}=api,rich=guides().reduce((n,a)=>n+a.terms.length,0),h=api.getStore().atlasHistory||[],t=totals();
 return header('VOCABULÁRIO / CAMADAS DA COMUNICAÇÃO','Atlas Descritivo','Aprenda palavras pelo contexto, distinga termos vizinhos, pratique quatro níveis de narração e revise no tempo certo. Não confunda impressão pessoal com fato verificado.')+
 '<div class="grid grid-4" style="margin-bottom:20px">'+stat('Verbetes aprofundados',rich)+stat('Termos dominados',t.mastered+' / '+t.total)+stat('Revisões pendentes',t.due)+stat('Práticas registradas',h.length)+'</div>'+
 '<div class="panel panel-pad atlas12-toolbar"><div><label class="field-label" for="atlas12-topic">Campo de observação</label><select id="atlas12-topic" data-atlas-topic="1">'+D.atlas.map((a,i)=>{const p=fieldProgress(i);return '<option value="'+i+'" '+(i===view.topic?'selected':'')+'>'+esc(a.title)+' · '+p.mastered+'/'+p.total+'</option>'}).join('')+'</select></div><div><label class="field-label" for="atlas12-search">Buscar em todo o Atlas</label><input id="atlas12-search" class="search" data-atlas-query="1" value="'+esc(view.query)+'" placeholder="Ex.: luz rasante, caimento, fachada..."></div></div>'+
 '<div class="filters" role="tablist" aria-label="Modos do Atlas">'+button('explore',ico('book',15)+' Vocabulário explicado','chip-button '+(view.tab==='explore'?'active':''))+button('train',ico('target',15)+' Treino de precisão'+(t.due?' <span class="atlas14-badge">'+t.due+'</span>':''),'chip-button '+(view.tab==='train'?'active':''))+button('practice',ico('mic',15)+' Prática progressiva','chip-button '+(view.tab==='practice'?'active':''))+ (window.StoryLabVerbLab?button('verbs',ico('book',15)+' Verbos & famílias','chip-button '+(view.tab==='verbs'?'active':'')):'')+'</div>'+
 (view.tab==='verbs'&&window.StoryLabVerbLab?window.StoryLabVerbLab.render():view.tab==='explore'?dictionary():view.tab==='train'?training():exercise());
}
function refreshQuery(el){
 const begin=el.selectionStart,end=el.selectionEnd;
 api.render();
 const next=document.getElementById('atlas12-search');
 if(next){next.focus();try{next.setSelectionRange(begin,end)}catch{}}
}
function init(context){
 api=context;
 window.StoryLabVerbLab?.bind?.({render:()=>api.render(),copy:text=>api.copy(text),open:(topic,term)=>openTerm(topic,term)});
 document.addEventListener('click',event=>{
  const b=event.target.closest('[data-atlas-action]');
  if(!b)return;
  event.preventDefault();
  const action=b.dataset.atlasAction,st=api.getStore();
  if(action==='explore'||action==='practice'||action==='train'||action==='verbs'){view.tab=action;view.feedback=null;view.show=false}
  else if(action==='word'){const i=Number(b.dataset.topic);if(!api.D.atlas[i]?.terms.includes(b.dataset.word))return;view.topic=i;view.word=b.dataset.word;view.query='';view.feedback=null;view.tab='explore'}
  else if(action==='verb-show'){const v=window.StoryLabVerbLab?.lookup?.(view.topic,currentCard().term);if(v){window.StoryLabVerbLab.focus(v.topic,v.pt);view.tab='verbs'}}
  else if(action==='copy'){api.copy(currentCard().term);return}
  else if(action==='copy-en'){const extra=window.STORYLAB_URBANISM?.byField?.[view.topic]?.[currentCard().term];if(extra)api.copy(extra.en);return}
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
  else if(action==='insert'){insertTerm(b.dataset.word);return}
  else if(action==='timer'){window.StoryLabInteract?.openTimer?.(parseInt(LEVELS[view.level][1],10),LEVELS[view.level][0]+' · '+g().scene,LEVELS[view.level][2]);return}
  else if(action==='train-field'){view.tab='train';startQuiz('field')}
  else if(action==='quiz-start'){view.tab='train';startQuiz(b.dataset.scope==='all'?'all':'field')}
  else if(action==='quiz-answer'){answer(b.dataset.option)}
  else if(action==='quiz-next'){nextQuestion()}
  else if(action==='quiz-exit'){view.quiz=null}
  api.render();
 });
 document.addEventListener('input',e=>{
  const t=e.target;
  // Os resultados da busca vivem na aba de vocabulário: digitar em outra aba leva até eles
  if(t.matches('[data-atlas-query]')){view.query=t.value;if(t.value.trim())view.tab='explore';refreshQuery(t)}
  if(t.matches('[data-atlas-writing]')){const st=api.getStore();st.atlasDrafts[key()]=t.value.slice(0,3000);view.feedback=null;api.save();const n=document.getElementById('atlas12-count');if(n)n.textContent=sayWords(t.value)+' palavras';scheduleLive(t.value)}
 });
 document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-atlas-topic]')){view.topic=Number(t.value);view.word='';view.show=false;view.feedback=null;view.quiz=null;api.render()}
  if(t.matches('[data-atlas-rating]'))view.score=Number(t.value);
 });
}
// Integração com cartões e revisão do dia (interact.js): termos vencidos, novos e nota
function termDeck(topic,limit=12){
 const t=now(),topics=topic===null||topic===undefined?api.D.atlas.map((_,i)=>i):[topic],due=[],fresh=[];
 topics.forEach(i=>api.D.atlas[i].terms.forEach(term=>{const c=card(i,term);if(!c)return;const s=status(i,term),item={topic:i,term,field:api.D.atlas[i].title,definition:c[1],example:c[2],caution:c[3],scene:sceneSentence(c)};if(s==='due')due.push([Number(record(i,term).next)||t,item]);else if(s==='new')fresh.push(item)}));
 due.sort((a,b)=>a[0]-b[0]);
 return {due:due.map(x=>x[1]).slice(0,limit),fresh:shuffle(fresh).slice(0,limit)};
}
function gradeTerm(topic,term,correct){if(api.D.atlas[topic]?.terms.includes(term))grade(topic,term,correct)}
// Abre um verbete a partir de outro módulo (ex.: busca universal)
function openTerm(topic,word){if(!api.D.atlas[topic]?.terms.includes(word))return;view.topic=topic;view.word=word;view.tab='explore';view.query='';view.feedback=null;view.quiz=null;api.navigate('atlas')}
// quiz() e analyze() expõem estado somente para leitura em testes automatizados
return {init,render,open:openTerm,termDeck,gradeTerm,mastered:()=>totals().mastered,context:()=>({topic:view.topic,level:view.level}),quiz:()=>view.quiz,analyze:t=>analyze(t)};
})();
