/* StoryLab Shanghai — Academia da Linguagem, revisão de curadoria.
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
    const i=Math.max(0,Math.min(2,Number(step)||0));
    const stages={
      voice:[
        '01 · Fonética: acompanhe o ar, a fonação, a articulação e a emissão do som.',
        '02 · Fonologia: trocar /p/ por /b/ distingue “pato” de “bato” em português.',
        '03 · Variação: “tia” pode ter [t] ou [tʃ] em variedades do português, sem mudar a palavra.'
      ],
      stress:[
        '01 · Foco no referente: o que mudou foi a vitrine.',
        '02 · Foco no acontecimento: a vitrine mudou, em vez de permanecer igual.',
        '03 · Foco no tempo: o acontecimento foi ontem.'
      ],
      syntax:[
        '01 · Oração simples: sintagma nominal + sintagma verbal.',
        '02 · Oração relativa: “que fica ao lado do museu” modifica “o prédio”.',
        '03 · Reformulação: duas frases independentes ligadas pelo pronome “ele”.'
      ],
      layers:[
        '01 · O dito: “algumas lojas abriram” é a afirmação literal.',
        '02 · O inferido: “não todas” é uma leitura possível, não uma consequência lógica necessária.',
        '03 · O verificável: é preciso checar o que ocorreu com as demais lojas.'
      ],
      camera:[
        '01 · Câmera ao sul, apontada ao norte: a loja está à esquerda.',
        '02 · Câmera ao norte, apontada ao sul: a praça fica à esquerda.',
        '03 · Câmera a oeste, olhando para leste: a loja antecede o edifício no percurso.'
      ],
      chain:[
        '01 · Enumeração: as palavras não apresentam uma relação discursiva estabelecida.',
        '02 · Retomada: “árvores”, “copas” e “sombra” passam a sustentar um fio temático.',
        '03 · Progressão: cada frase retoma uma ideia e apresenta a próxima.'
      ],
      act:[
        '01 · Forma: uma pergunta sobre a capacidade de fechar a janela.',
        '02 · Força: pode funcionar como pedido indireto naquele contexto.',
        '03 · Efeito: a pessoa pode atender, recusar ou solicitar esclarecimento.'
      ],
      turns:[
        '01 · Turno inicial: o repórter formula uma pergunta.',
        '02 · Turno seguinte: a fonte começa a responder e faz uma pausa.',
        '03 · Autorreparo: a fonte corrige “vinte” para “vinte e duas”.'
      ]
    };
    return (stages[item.visual.kind]||[])[i]||'Etapa '+(i+1)+' de três.';
  }
  function diagramSvg(item, step){
    const kind=item.visual.kind, active=Math.max(0,Math.min(2,Number(step)||0));
    let art='';
    if(kind==='voice'){

      if(active===0){
        art+=card(33,111,153,84,'AR','Pulmões',true)+card(223,111,153,84,'FONAÇÃO','Laringe')+card(413,111,153,84,'ARTICULAÇÃO','Língua e lábios')+card(603,111,124,84,'SOM','Onda física');
        [189,379,569].forEach(x=>art+=line(x,152,x+30,152,'marker-end="url(#lingArrow)"'));
        art+=svgText(380,246,'01 · Fonética: como a fala é produzida e transmitida.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else if(active===1){
        art+=card(65,105,280,111,'PATO','/p/ no início',true)+card(414,105,280,111,'BATO','/b/ no início',true);
        art+=line(349,158,409,158,'marker-start="url(#lingArrow)" marker-end="url(#lingArrow)"');
        art+=svgText(380,80,'UM CONTRASTE DISTINGUE PALAVRAS','font-size="17" font-weight="700" text-anchor="middle" fill="#a45c42"');
        art+=svgText(380,255,'02 · Fonologia: /p/ e /b/ distinguem palavras em português.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else{
        art+=card(46,105,216,109,'TIA','Realização [t]',true)+card(498,105,216,109,'TIA','Realização [tʃ]',true);
        art+=line(267,157,491,157,'stroke-dasharray="6 5"');
        art+='<circle cx="380" cy="157" r="33" fill="#d9e7db" stroke="#214b42" stroke-width="2"/>';
        art+=svgText(380,151,'MESMA','font-size="12" font-weight="700" text-anchor="middle" fill="#214b42"')+svgText(380,170,'PALAVRA','font-size="11" text-anchor="middle" fill="#214b42"');
        art+=svgText(380,255,'03 · Variação de pronúncia não é erro por definição.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }
    } else if(kind==='stress'){

      const words=['A VITRINE','MUDOU','ONTEM'],xs=[132,380,628],widths=[207,194,194];
      words.forEach((word,i)=>{
        const chosen=i===active,w=widths[i],x=xs[i]-w/2;
        art+='<rect x="'+x+'" y="112" width="'+w+'" height="'+(chosen?104:82)+'" rx="13" fill="'+(chosen?'#214b42':'#f1e3d6')+'" stroke="'+(chosen?'#214b42':'#d3bca8')+'" stroke-width="2"/>';
        art+=svgText(xs[i],155,word,'font-size="22" font-weight="700" text-anchor="middle" fill="'+(chosen?'#fffefa':'#20302d')+'"');
        if(chosen){art+=svgText(xs[i],182,'FOCO','font-size="13" font-weight="700" text-anchor="middle" fill="#d9e7db"');art+='<path d="M'+(xs[i]-49)+' 98 L'+(xs[i]+49)+' 98" stroke="#a45c42" stroke-width="5" stroke-linecap="round"/>'}
      });
      art+=svgText(380,256,['01 · O que mudou? — A VITRINE.','02 · O que aconteceu? — MUDOU.','03 · Quando mudou? — ONTEM.'][active],'font-size="16" font-weight="600" text-anchor="middle" fill="#214b42"');
      art+=svgText(380,280,'Ênfase ilustrativa; não é uma medição acústica.','font-size="12" text-anchor="middle" fill="#62716c"');
    } else if(kind==='syntax'){
      if(active===0){
        // 01 — Oração simples: constituintes e funções, sem encaixes.
        art+=card(282,28,196,63,'ORAÇÃO SIMPLES','O prédio foi reformado',true);
        art+=line(381,92,195,130)+line(381,92,565,130);
        art+=card(58,132,273,86,'SINTAGMA NOMINAL','O prédio');
        art+=card(428,132,274,86,'SINTAGMA VERBAL','foi reformado');
        art+=svgText(380,257,'01  ·  Duas unidades constituintes formam uma oração.','font-size="15" text-anchor="middle" fill="#214b42" font-weight="600"');
      } else if(active===1){
        // 02 — A relativa integra o sintagma nominal; não é adjunto da oração inteira.
        art+=card(276,20,208,60,'ORAÇÃO','estrutura completa',true);
        art+=line(380,82,201,109)+line(380,82,555,109);
        art+=card(38,112,326,70,'SINTAGMA NOMINAL','O prédio que fica ao lado...');
        art+=card(419,112,305,70,'SINTAGMA VERBAL','foi reformado');
        art+=line(201,184,201,197,'marker-end="url(#lingArrow)"');
        art+=card(42,201,322,61,'ORAÇÃO RELATIVA','que fica ao lado do museu',true);
        art+=svgText(551,245,'Modifica “o prédio”','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
        art+=svgText(380,282,'02 · A relativa está encaixada no sintagma nominal.','font-size="14" text-anchor="middle" fill="#214b42"');
      } else {
        // 03 — Reformulação para voz: duas orações e uma retomada anafórica.
        art+=card(35,107,314,94,'FRASE 1','O prédio foi reformado.',true);
        art+=card(415,107,314,94,'FRASE 2','Ele fica ao lado do museu.');
        art+=line(351,151,409,151,'marker-end="url(#lingArrow)"');
        art+=svgText(380,75,'ELE  →  retoma “O PRÉDIO”','font-size="15" font-weight="650" text-anchor="middle" fill="#a45c42"');
        art+=svgText(380,257,'03  ·  A anáfora conecta duas frases mais curtas.','font-size="15" text-anchor="middle" fill="#214b42" font-weight="600"');
      }
    } else if(kind==='layers'){

      if(active===0){
        art+=card(175,108,410,100,'AFIRMAÇÃO LITERAL','Algumas lojas abriram.',true);
        art+=svgText(380,248,'01 · É isso que a frase afirma diretamente.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else if(active===1){
        art+=card(45,109,292,93,'DITO','Algumas lojas abriram.')+card(421,109,292,93,'INFERÊNCIA','Talvez nem todas tenham aberto',true);
        art+=line(341,155,415,155,'stroke-dasharray="6 5" marker-end="url(#lingArrow)"');
        art+=svgText(380,246,'02 · Inferência possível, não uma conclusão necessária.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else{
        art+=card(51,112,257,92,'HIPÓTESE','Nem todas abriram?')+card(452,112,257,92,'CHECAGEM','E as demais lojas?',true);
        art+=line(314,156,446,156,'stroke-dasharray="6 5" marker-end="url(#lingArrow)"');
        art+=svgText(380,249,'03 · Verificar é perguntar, observar ou buscar evidência.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }
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

      if(active===0){
        [['ÁRVORES',95],['FACHADAS',284],['BANCOS',473],['PESSOAS',662]].forEach(([name,x])=>{
          art+='<rect x="'+(x-78)+'" y="117" width="156" height="80" rx="13" fill="#f1e3d6" stroke="#d3bca8"/>';
          art+=svgText(x,161,name,'font-size="15" font-weight="700" text-anchor="middle" fill="#20302d"');
        });
        art+=svgText(380,244,'01 · Detalhes isolados: ainda não há progressão temática.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else if(active===1){
        art+=card(49,113,194,86,'ÁRVORES','Referente inicial',true)+card(283,113,194,86,'COPAS','Retomada lexical')+card(517,113,194,86,'SOMBRA','Informação nova');
        art+=line(247,155,276,155,'marker-end="url(#lingArrow)"')+line(481,155,510,155,'marker-end="url(#lingArrow)"');
        art+=svgText(380,244,'02 · Um referente retomado prepara o próximo detalhe.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else{
        [['1. AS ÁRVORES','possuem copas amplas'],['2. ESSAS COPAS','formam áreas de sombra'],['3. NA SOMBRA','observamos bancos']].forEach((n,i)=>{
          const x=38+i*248;art+=card(x,114,224,94,n[0],n[1],i===2);
          if(i<2)art+=line(x+227,160,x+244,160,'marker-end="url(#lingArrow)"');
        });
        art+=svgText(380,253,'03 · Tema conhecido → acréscimo → novo tema de narração.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }
    } else if(kind==='act'){

      if(active===0){
        art+=card(144,105,470,111,'FORMA INTERROGATIVA','Você consegue fechar a janela?',true);
        art+=svgText(380,249,'01 · Literalmente, pergunta sobre capacidade.','font-size="15" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else if(active===1){
        art+=card(52,115,299,93,'FORMA','Você consegue fechar?')+card(406,115,299,93,'ATO POSSÍVEL','Pedido indireto',true);
        art+=line(355,158,399,158,'stroke-dasharray="6 5" marker-end="url(#lingArrow)"');
        art+=svgText(380,250,'02 · Contexto e relação social ajudam a interpretar o pedido.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else{
        art+=card(41,106,202,90,'PEDIDO','Fechar a janela',true);
        art+=card(316,54,402,79,'REAÇÃO POSSÍVEL A','A pessoa fecha a janela');
        art+=card(316,173,402,79,'REAÇÃO POSSÍVEL B','A pessoa recusa ou pede esclarecimento');
        art+='<path d="M246 150 L278 150 L278 94 L310 94 M278 150 L278 214 L310 214" fill="none" stroke="#a45c42" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#lingArrow)"/>';
        art+=svgText(380,280,'03 · A reação não é garantida pelo enunciado.','font-size="13" font-weight="600" text-anchor="middle" fill="#214b42"');
      }
    } else if(kind==='turns'){

      if(active===0){
        art+=card(74,102,273,98,'REPÓRTER','Quantas unidades?',true);
        art+=card(414,102,273,98,'FONTE','Aguardando resposta');
        art+=line(352,150,408,150,'marker-end="url(#lingArrow)"');
        art+=svgText(380,253,'01 · O primeiro turno cria uma expectativa de resposta.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else if(active===1){
        art+=card(56,105,257,102,'PERGUNTA','Quantas unidades?');
        art+=card(436,105,268,102,'RESPOSTA PARCIAL','Foram vinte...',true);
        art+=line(318,157,429,157,'marker-end="url(#lingArrow)"');
        art+=svgText(380,249,'02 · As reticências registram uma pausa, não provam intenção.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }else{
        art+=card(35,111,240,97,'PRIMEIRA VERSÃO','Foram vinte...');
        art+=card(485,111,240,97,'AUTORREPARO','Melhor: vinte e duas',true);
        art+=line(280,156,479,156,'stroke-dasharray="6 5" marker-end="url(#lingArrow)"');
        art+=svgText(380,79,'ATUALIZAÇÃO DO DADO','font-size="17" font-weight="700" text-anchor="middle" fill="#a45c42"');
        art+=svgText(380,252,'03 · O número corrigido é 22; não preserve 20 como resposta final.','font-size="14" font-weight="600" text-anchor="middle" fill="#214b42"');
      }
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