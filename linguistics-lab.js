/* StoryLab Shanghai — Academia da Linguagem, v2.1.
   Estudo acadêmico aprofundado com diagramas semânticos específicos.
   Dados autorais carregados de content/linguistics_chapters.json.
   Nenhuma pontuação automática, rastreador externo ou serviço remoto. */
window.StoryLabLinguistics = (() => {
  'use strict';
  const DATA = () => window.STORYLAB_LINGUISTICS || [];
  const state = {active:0, diagramStep:0, tab:'theory'};
  let api = null;
  const colors = {ink:'#20302d',muted:'#62716c',accent:'#a45c42',dark:'#214b42',pale:'#f1e3d6',sage:'#d9e7db',paper:'#fffefa'};
  function svgText(x,y,text,opt=''){return '<text x="'+x+'" y="'+y+'" '+opt+'>'+text+'</text>'}
  const base = '<defs><marker id="lingArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#a45c42"/></marker></defs>';
  const line=(x1,y1,x2,y2,opt='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#a45c42" stroke-width="2.5" '+opt+'/>';
  function card(x,y,w,h,label,desc,active=false){
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="15" fill="'+(active?'#214b42':'#f1e3d6')+'" stroke="'+(active?'#214b42':'#d3bca8')+'"/>'+
    svgText(x+w/2,y+32,label,'font-size="17" font-weight="700" text-anchor="middle" fill="'+(active?'#ffffff':'#20302d')+'"')+
    svgText(x+w/2,y+54,desc,'font-size="12" text-anchor="middle" fill="'+(active?'#dfebe4':'#62716c')+'"');
  }
  function diagramNote(item,step){
    const index=Math.max(0,Math.min(2,Number(step)||0));
    if(item.visual.kind==='syntax')return [
      '01 · Oração simples: “O prédio” (sintagma nominal) + “foi reformado” (sintagma verbal).',
      '02 · Oração com encaixe: a relativa “que fica ao lado do museu” modifica “o prédio”.',
      '03 · Reformulação para narração: duas frases autônomas ligadas pelo pronome “ele”.'
    ][index];
    if(item.visual.kind==='camera')return [
      '01 · Câmera ao sul, apontada ao norte: a loja aparece à esquerda da entrada.',
      '02 · Câmera ao norte, apontada ao sul: a praça aparece à esquerda; o referencial se inverte.',
      '03 · Câmera a oeste, apontada ao leste: a loja fica antes do edifício no percurso.'
    ][index];
    return 'Etapa '+String(index+1).padStart(2,'0')+' de 03 · Observe no esquema qual elemento foi destacado.';
  }
  function diagramSvg(item, step){
    const kind=item.visual.kind, active=step%3;
    let art='';
    if(kind==='voice'){
      const nodes=[['Pulmões','Fluxo de ar'],['Laringe','Vibração'],['Articuladores','Língua e lábios'],['Escuta','Percepção']];
      art+='<path d="M70 185 Q52 121 84 114 Q115 112 113 183 M124 183 Q124 113 153 114 Q186 121 166 185" fill="#d9e7db" stroke="#214b42" stroke-width="2" opacity=".5"/>';
      nodes.forEach((n,i)=>{const x=52+i*171;art+=card(x,100,144,81,n[0],n[1],active===Math.min(i,2));if(i<3)art+=line(x+148,140,x+165,140,'marker-end="url(#lingArrow)"')});
      art+=svgText(380,226,'A fonética descreve a produção e a percepção físicas dos sons.','font-size="14" text-anchor="middle" fill="#62716c"');
      art+=svgText(380,248,'A fonologia explica como os contrastes funcionam no sistema da língua.','font-size="13" text-anchor="middle" fill="#62716c"');
    } else if(kind==='stress'){
      const words=['A VITRINE','MUDOU','ONTEM'],positions=[128,360,595];
      words.forEach((w,i)=>{const is=i===active, width=i===0?204:165, x=positions[i]-(width/2);art+='<rect x="'+x+'" y="122" width="'+width+'" height="82" rx="13" fill="'+(is?'#214b42':'#f1e3d6')+'"/>'+svgText(positions[i],170,w,'font-size="22" text-anchor="middle" font-weight="'+(is?'760':'530')+'" fill="'+(is?'#fffefa':'#20302d')+'"');});
      const ys=[[70,102,106],[108,67,108],[111,102,66]][active];
      art+='<path d="M53 112 Q90 '+ys[0]+' 130 '+ys[0]+' S275 '+ys[1]+' 360 '+ys[1]+' S525 '+ys[2]+' 592 '+ys[2]+' S681 110 707 113" fill="none" stroke="#a45c42" stroke-width="4" stroke-linecap="round"/>';
      art+=svgText(380,245,['O quê mudou? — A VITRINE.','O que aconteceu? — MUDOU.','Quando aconteceu? — ONTEM.'][active],'font-size="16" text-anchor="middle" fill="#214b42" font-weight="600"');
    } else if(kind==='syntax'){
      if(active===0){
        // 01 — Oração simples: constituintes e funções, sem encaixes.
        art+=card(282,28,196,63,'ORAÇÃO SIMPLES','O prédio foi reformado',true);
        art+=line(381,92,195,130)+line(381,92,565,130);
        art+=card(58,132,273,86,'SINTAGMA NOMINAL','O prédio');
        art+=card(428,132,274,86,'SINTAGMA VERBAL','foi reformado');
        art+=svgText(380,257,'01  ·  Duas unidades constituintes formam uma oração.','font-size="15" text-anchor="middle" fill="#214b42" font-weight="600"');
      } else if(active===1){
        // 02 — Uma relativa encaixada dentro do sintagma nominal.
        art+=card(195,34,370,68,'ORAÇÃO PRINCIPAL','O prédio ... foi reformado',true);
        art+=line(381,104,381,144,'marker-end="url(#lingArrow)"');
        art+=card(210,149,340,76,'ORAÇÃO RELATIVA','que fica ao lado do museu');
        art+=svgText(380,263,'02  ·  O encaixe adiciona informação sobre “o prédio”.','font-size="15" text-anchor="middle" fill="#214b42" font-weight="600"');
      } else {
        // 03 — Reformulação para voz: duas orações e uma retomada anafórica.
        art+=card(35,107,314,94,'FRASE 1','O prédio foi reformado.',true);
        art+=card(415,107,314,94,'FRASE 2','Ele fica ao lado do museu.');
        art+=line(351,151,409,151,'marker-end="url(#lingArrow)"');
        art+=svgText(380,75,'ELE  →  retoma “O PRÉDIO”','font-size="15" font-weight="650" text-anchor="middle" fill="#a45c42"');
        art+=svgText(380,257,'03  ·  A anáfora conecta duas frases mais curtas.','font-size="15" text-anchor="middle" fill="#214b42" font-weight="600"');
      }
    } else if(kind==='layers'){
      art+=card(26,108,211,91,'O QUE FOI DITO','Algumas lojas abriram',active===0);
      art+=card(274,108,211,91,'O QUE FOI INFERIDO','Talvez nem todas',active===1);
      art+=card(522,108,211,91,'O QUE FALTA SABER','As outras abriram?',active===2);
      art+=line(241,153,269,153,'marker-end="url(#lingArrow)" stroke-dasharray="5 5"');
      art+=line(489,153,516,153,'marker-end="url(#lingArrow)" stroke-dasharray="5 5"');
      art+=svgText(380,249,'Inferência conversacional ≠ evidência de que a hipótese é verdadeira.','font-size="14" text-anchor="middle" fill="#214b42"');
    } else if(kind==='camera'){
      // Representação esquemática em planta; cima=N e baixo=S.
      // A posição da câmera e o sentido do olhar mudam a cada etapa.
      art+='<rect x="283" y="112" width="194" height="107" rx="10" fill="#d9e7db" stroke="#648073" stroke-width="3"/>';
      art+=svgText(380,142,'EDIFÍCIO','font-size="20" font-weight="700" fill="#214b42" text-anchor="middle"');
      art+='<rect x="321" y="151" width="118" height="49" rx="8" fill="#f1e3d6" stroke="#c3a98f" stroke-width="2"/>';
      art+=svgText(380,181,'ENTRADA','font-size="15" font-weight="700" text-anchor="middle" fill="#20302d"');
      art+='<rect x="85" y="133" width="134" height="69" rx="12" fill="#f1e3d6" stroke="#c3a98f"/>';
      art+=svgText(152,174,'LOJA','font-size="17" text-anchor="middle" fill="#20302d"');
      art+='<rect x="542" y="133" width="134" height="69" rx="12" fill="#f1e3d6" stroke="#c3a98f"/>';
      art+=svgText(609,174,'PRAÇA','font-size="17" text-anchor="middle" fill="#20302d"');
      art+=svgText(711,53,'N ↑','font-size="15" font-weight="700" text-anchor="middle" fill="#a45c42"');
      const positions=[[380,259,380,220],[380,68,380,110],[51,239,281,206]];
      const p=positions[active];
      art+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="22" fill="#214b42" stroke="#f1e3d6" stroke-width="3"/>';
      art+=svgText(p[0],p[1]+4,'CAM','font-size="11" text-anchor="middle" fill="#ffffff" font-weight="700"');
      art+=line(
        active===2?p[0]+24:p[0],
        active===0?p[1]-24:active===1?p[1]+24:p[1]-3,
        p[2],p[3],
        'stroke-dasharray="6 5" stroke-width="3" marker-end="url(#lingArrow)"'
      );
      art+=svgText(380,293,[
        '01  ·  Olhando para o norte: a loja está à esquerda.',
        '02  ·  Olhando para o sul: a praça está à esquerda.',
        '03  ·  Olhando para leste: a loja vem antes do edifício.'
      ][active],'font-size="13" text-anchor="middle" fill="#214b42" font-weight="600"');
    } else if(kind==='chain'){
      const terms=[['ÁRVORES','tema'],['COPAS','retomada'],['SOMBRA','informação nova'],['BANCOS','novo foco']];
      terms.forEach((n,i)=>{const x=26+i*183;art+=card(x,108,161,84,n[0],n[1],active===Math.min(i,2));if(i<3)art+=line(x+163,148,x+179,148,'marker-end="url(#lingArrow)"')});
      art+=svgText(380,236,'A repetição controlada mantém o referente reconhecível entre frases.','font-size="14" fill="#214b42" text-anchor="middle"');
    } else if(kind==='act'){
      const labels=[['FORMA','Você pode fechar?'],['AÇÃO POSSÍVEL','Pedido indireto'],['EFEITO','Pessoa fecha']];
      labels.forEach((n,i)=>{const x=27+i*249;art+=card(x,112,207,86,n[0],n[1],active===i);if(i<2)art+=line(x+210,156,x+245,156,'marker-end="url(#lingArrow)"')});
      art+=svgText(380,243,'A passagem da forma à ação depende de contexto e interlocutores.','font-size="14" fill="#214b42" text-anchor="middle"');
    } else if(kind==='turns'){
      const turns=[['REPÓRTER','Quantas unidades?',35,50,210],['FONTE','Foram vinte...',225,118,195],['FONTE','melhor: vinte e duas',430,180,288]];
      turns.forEach((n,i)=>{const x=n[2];art+='<rect x="'+x+'" y="'+n[3]+'" width="'+n[4]+'" height="58" rx="10" fill="'+(active===i?'#214b42':i===0?'#d9e7db':'#f1e3d6')+'" />'+svgText(x+11,n[3]+20,n[0],'font-size="12" font-weight="700" fill="'+(active===i?'#fff':'#62716c')+'"')+svgText(x+11,n[3]+42,n[1],'font-size="15" fill="'+(active===i?'#fff':'#20302d')+'"');});
      art+='<path d="M245 91 Q292 108 322 117 M420 152 Q449 179 466 181" fill="none" stroke="#a45c42" stroke-dasharray="6 6" stroke-width="2"/>';
      art+=svgText(380,262,'Pergunta → resposta inicial → reparo: o sentido evolui na sequência.','font-size="13" fill="#214b42" text-anchor="middle"');
    }
    return '<svg class="ling-diagram" viewBox="0 0 760 300" role="img" aria-label="'+escape(item.visual.title+': '+item.visual.caption+' '+diagramNote(item,active))+'" xmlns="http://www.w3.org/2000/svg">'+base+
    '<rect x="1" y="1" width="758" height="298" rx="21" fill="#fffefa" stroke="#e0d6cb" stroke-width="2"/>'+
    svgText(30,32,'STORYLAB  /  MECANISMO LINGUÍSTICO','font-size="11" font-weight="700" letter-spacing="2" fill="#a45c42"')+art+'</svg>';
  }
  function escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function st(){return api?.getStore()||{linguisticsDone:[],linguisticsAnswers:{},linguisticsNotes:{}}}
  function c(){return DATA()[state.active]||DATA()[0]}
  function checked(ch){return st().linguisticsDone?.includes(ch.id)}
  function btn(action,text,attrs='',cls='btn secondary sm'){return '<button type="button" class="'+cls+'" data-ling-action="'+action+'" '+attrs+'>'+text+'</button>'}
  function caseStudy(ch){
    return '<section class="ling-contrast"><div class="eyebrow">CONTRASTE EXPLICADO</div><h3>Antes de escolher as palavras, escolha o sentido</h3><div class="ling-comparison"><div><span class="ling-comparison-label">FORMULAÇÃO INICIAL</span><p>'+escape(ch.visual.before)+'</p></div><div class="ling-revised"><span class="ling-comparison-label">REFORMULAÇÃO PRECISA</span><p>'+escape(ch.visual.after)+'</p></div></div><p class="ling-reason"><strong>Por quê?</strong> '+escape(ch.visual.why)+'</p></section>';
  }
  function theory(ch){
    return '<div class="ling-theory">'+ch.sections.map((section,i)=>'<section class="ling-section" id="ling-section-'+i+'"><div class="ling-section-heading"><span class="ling-section-number">0'+(i+1)+'</span><div><span class="eyebrow">CAMADA TEÓRICA</span><h3>'+escape(section.title)+'</h3></div></div><p>'+escape(section.body)+'</p><div class="ling-example"><span class="eyebrow">APLICAÇÃO NA SUA NARRAÇÃO</span><p>'+escape(section.example)+'</p></div></section>').join('')+
    '<section class="ling-curiosity"><div class="ling-curiosity-icon" aria-hidden="true">✳</div><div><div class="eyebrow">CURIOSIDADE CIENTÍFICA</div><h3>'+escape(ch.curiosity.title)+'</h3><p>'+escape(ch.curiosity.body)+'</p></div></section>'+
    '<section class="ling-terms"><div class="eyebrow">MINIGLOSSÁRIO CIENTÍFICO</div><div class="ling-terms-grid">'+ch.terms.map(t=>'<div><strong>'+escape(t[0])+'</strong><p>'+escape(t[1])+'</p></div>').join('')+'</div></section>';
  }
  function practice(ch){
    const record=st().linguisticsAnswers?.[ch.id],chosen=record?.selected,answer=ch.quiz;
    let html='<section class="ling-practice"><span class="eyebrow">ATIVIDADE DE TRANSFERÊNCIA</span><h3>'+escape(ch.exercise.prompt)+'</h3><ol>'+ch.exercise.steps.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ol></section>';
    html+='<section class="ling-quiz"><div class="eyebrow">CHECAGEM DE COMPREENSÃO</div><h3>'+escape(answer.question)+'</h3><div class="ling-options">'+answer.options.map((opt,i)=>btn('answer',String.fromCharCode(65+i)+'. '+escape(opt),'data-index="'+i+'"','ling-option '+(chosen===i?'selected':'')+(chosen!==undefined&&i===answer.correct?' correct':'')+(chosen===i&&i!==answer.correct?' incorrect':''))).join('')+'</div>';
    if(chosen!==undefined)html+='<div class="ling-explanation" role="status"><strong>'+(chosen===answer.correct?'Boa interpretação.':'Revise o mecanismo.')+'</strong><p>'+escape(answer.why)+'</p></div>';
    html+='</section><section class="ling-notes"><div class="eyebrow">CADERNO PESSOAL</div><label for="ling-notes-input">O que você aprendeu e como aplicará em seu próximo vídeo?</label><textarea id="ling-notes-input" data-ling-note="1" rows="5" maxlength="3500" placeholder="Ex.: preciso diferenciar afirmação, inferência e informação verificada...">'+escape(st().linguisticsNotes?.[ch.id]||'')+'</textarea><p class="small muted">Salvo automaticamente no navegador e incluído no backup de progresso.</p></section>';
    return html;
  }
  function references(ch){
    return '<section class="ling-references"><div class="eyebrow">LEITURA E APROFUNDAMENTO</div><h3>Fontes de consulta</h3><p>Estas referências orientam o estudo de conceitos próximos aos discutidos; não substituem bibliografia especializada nem significam revisão acadêmica externa deste material. A leitura exige conexão.</p><div class="ling-reading-list">'+ch.readings.map(r=>'<a href="'+escape(r.url)+'" target="_blank" rel="noopener noreferrer"><span>↗</span><strong>'+escape(r.label)+'</strong></a>').join('')+'</div><div class="ling-usage"><strong>Critério editorial:</strong> os esquemas deste módulo são modelos didáticos simplificados. A validade de uma interpretação depende do contexto e da análise; não se deduz intenção ou causalidade de um desenho.</div></section>';
  }
  function related(ch){
    const matches=ch.related.map(id=>api.D.courses.find(course=>course.id===id)).filter(Boolean);
    return '<section class="ling-related"><div class="eyebrow">CONEXÃO COM A ACADEMIA</div><h3>Estude também nas disciplinas existentes</h3><div class="ling-related-list">'+matches.map(x=>btn('related',escape(x.title)+' <span>↗</span>','data-course="'+escape(x.id)+'"','ling-related-button')).join('')+'</div></section>';
  }
  function render(){
    if(!api||!DATA().length)return '<div class="notice">Biblioteca acadêmica em inicialização.</div>';
    const chapters=DATA(),chapter=c(),done=st().linguisticsDone||[];
    const selected=state.diagramStep;
    return api.header('ACADEMIA / LINGUÍSTICA / NARRATIVA','Linguística Aplicada','A ciência da linguagem aplicada à fala, à entrevista e ao jornalismo audiovisual. Teoria, desenhos específicos, exemplos contrastivos e prática verificável.')+
    '<div class="grid grid-4 ling-stats" style="margin-bottom:20px">'+api.stat('Capítulos completos',chapters.length)+api.stat('Camadas teóricas',chapters.reduce((n,ch)=>n+ch.sections.length,0))+api.stat('Conceitos explicados',chapters.reduce((n,ch)=>n+ch.terms.length,0))+api.stat('Estudos concluídos',done.filter(id=>chapters.some(ch=>ch.id===id)).length+'/'+chapters.length)+'</div>'+
    '<div class="ling-shell"><aside class="ling-syllabus"><div class="eyebrow">ÍNDICE ACADÊMICO</div><p>Escolha um conceito para abrir o dossiê ilustrado.</p><div class="ling-chapter-list">'+chapters.map((ch,i)=>btn('chapter','<span class="ling-chapter-num">'+String(i+1).padStart(2,'0')+'</span><span class="ling-chapter-label"><strong>'+escape(ch.title)+'</strong><small>'+escape(ch.area)+' · '+ch.minutes+' min</small></span><span class="ling-chapter-status" aria-label="'+(checked(ch)?'Concluído':'Não concluído')+'">'+(checked(ch)?'✓':'→')+'</span>','data-index="'+i+'" aria-current="'+(state.active===i?'true':'false')+'"','ling-chapter '+(state.active===i?'active':'')+(checked(ch)?' is-done':''))).join('')+'</div></aside>'+
    '<article class="ling-article"><div class="ling-hero"><div><span class="eyebrow">'+escape(chapter.area.toUpperCase())+' / DOSSIÊ '+String(state.active+1).padStart(2,'0')+'</span><h2>'+escape(chapter.title)+'</h2><p>'+escape(chapter.subtitle)+'</p></div><div class="ling-duration">'+chapter.minutes+'<span>min de estudo</span></div></div>'+
    '<figure class="ling-figure"><div class="ling-figure-heading"><span class="eyebrow">ESQUEMA VISUAL EXPLICADO</span><strong>'+escape(chapter.visual.title)+'</strong></div>'+diagramSvg(chapter,selected)+
    '<figcaption>'+escape(chapter.visual.caption)+' <strong>'+escape(diagramNote(chapter,selected))+'</strong></figcaption><div class="ling-figure-controls"><span class="small muted">Explore as perspectivas:</span>'+[0,1,2].map(i=>btn('diagram','0'+(i+1),'data-index="'+i+'" aria-label="Etapa '+(i+1)+' de 3: '+escape(diagramNote(chapter,i))+'" aria-pressed="'+(selected===i?'true':'false')+'"','ling-diagram-button '+(selected===i?'active':''))).join('')+'</div></figure>'+
    caseStudy(chapter)+
    '<div class="ling-tabs" role="tablist" aria-label="Conteúdo acadêmico">'+[['theory','Fundamentação'],['practice','Exercício e revisão'],['references','Referências']].map(([id,label])=>btn('tab',label,'data-tab="'+id+'" role="tab" aria-selected="'+(state.tab===id?'true':'false')+'"','ling-tab '+(state.tab===id?'active':''))).join('')+'</div>'+
    (state.tab==='theory'?theory(chapter):state.tab==='practice'?practice(chapter):references(chapter))+
    related(chapter)+
    '<div class="ling-footer"><span class="small muted">Concluir significa registrar estudo pessoal, não certificação acadêmica.</span>'+btn('complete',(checked(chapter)?'✓ Estudo concluído':'Marcar capítulo como estudado'),'','btn '+(checked(chapter)?'secondary':'accent'))+'</div></article></div>';
  }
  function init(context){
    api=context;
    document.addEventListener('click',event=>{
      const target=event.target.closest('[data-ling-action]');if(!target)return;
      event.preventDefault();
      const action=target.dataset.lingAction;
      if(action==='chapter'){const i=Number(target.dataset.index);if(!Number.isInteger(i)||i<0||i>=DATA().length)return;state.active=i;state.diagramStep=0;state.tab='theory';api.render();return}
      if(action==='diagram'){const i=Number(target.dataset.index);if(i<0||i>2||!Number.isInteger(i))return;state.diagramStep=i;api.render();return}
      if(action==='tab'){if(!['theory','practice','references'].includes(target.dataset.tab))return;state.tab=target.dataset.tab;api.render();return}
      if(action==='answer'){const i=Number(target.dataset.index);if(i<0||i>=c().quiz.options.length)return;const store=st();store.linguisticsAnswers=store.linguisticsAnswers||{};store.linguisticsAnswers[c().id]={selected:i,at:new Date().toISOString()};api.save();api.render();return}
      if(action==='complete'){const store=st();store.linguisticsDone=Array.isArray(store.linguisticsDone)?store.linguisticsDone:[];if(checked(c()))store.linguisticsDone=store.linguisticsDone.filter(x=>x!==c().id);else store.linguisticsDone.push(c().id);api.save();api.render();return}
      if(action==='related'){const id=target.dataset.course;if(!c().related.includes(id))return;api.navigate('course',{courseId:id});return}
    });
    document.addEventListener('input',event=>{
      const target=event.target;if(!target.matches('[data-ling-note]'))return;
      const store=st();store.linguisticsNotes=store.linguisticsNotes||{};store.linguisticsNotes[c().id]=target.value.slice(0,3500);api.save();
    });
  }
  function jumpForCourse(id){const index=DATA().findIndex(c=>c.related.includes(id));if(index<0)return false;state.active=index;state.tab='theory';state.diagramStep=0;return true}
  function relatedTo(id){
    const count=DATA().filter(c=>c.related.includes(id)).length;
    if(!count)return '';
    return '<div class="ling-inline-invitation"><span>✳</span><div><strong>Estude o fundamento linguístico desta disciplina</strong><p>'+count+' dossiê(s) ilustrado(s), com teoria, exemplos e exercícios.</p></div>'+btn('jump','Abrir linguística','data-course="'+escape(id)+'"','btn secondary sm')+'</div>';
  }
  function attachInlineListener(){
    document.addEventListener('click',event=>{
      const b=event.target.closest('[data-ling-action="jump"]');if(!b||!api)return;
      event.preventDefault();event.stopPropagation();if(jumpForCourse(b.dataset.course))api.navigate('linguistics');
    },true);
  }
  attachInlineListener();
  return {init,render,jumpForCourse,relatedTo,diagramSvg};
})();