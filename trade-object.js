/* StoryLab Shanghai · Atlas da Coisa + Estúdio de Descrição · v2.19
   Primeiro a propriedade observada; depois a lente setorial ou narrativa.
   Sem alegações ou medidas inventadas. */
window.StoryLabObject=(()=>{
 'use strict';
 let api=null;
 const state={dimension:'all',query:'',id:null,contrast:0};
 const DATA=()=>window.STORYLAB_OBJECT_DATA||{dimensions:[],terms:[],contrasts:[],exemplars:[]};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const saved=()=>api?.getStore?.()||{};
 const measures=[
  ['altura','Altura','cm'],['largura','Largura','cm'],['comprimento','Comprimento','cm'],
  ['profundidade','Profundidade','cm'],['espessura','Espessura','mm'],['massa','Massa','kg']
 ];
 const defaults=()=>({subject:'',kind:'produto',lens:'vlog',basis:'impressao',material:'',context:'',note:'',metrics:{},units:{},attributes:[]});
 const draft=()=>{
  const s=saved();
  if(!s.tradeObjectDraft||typeof s.tradeObjectDraft!=='object'||Array.isArray(s.tradeObjectDraft))
   s.tradeObjectDraft=defaults();
  const d=s.tradeObjectDraft;
  if(!Array.isArray(d.attributes))d.attributes=[];
  if(!d.metrics||typeof d.metrics!=='object'||Array.isArray(d.metrics))d.metrics={};
  if(!d.units||typeof d.units!=='object'||Array.isArray(d.units))d.units={};
  return d;
 };
 const lensNames={vlog:'Vlog exploratório',review:'Review crítico',venda:'Apresentação comercial',tecnico:'Análise técnica',marca:'Retrato de marca / fornecedor'};
 const basisNames={impressao:'Impressão inicial, sem verificação',observado:'Observação direta / manuseio',declarado:'Informação declarada por terceiros',medido:'Dimensões informadas a partir de medições'};
 const kindNames={produto:'Produto ou objeto',empresa:'Empresa, marca ou showroom'};
 const btn=(action,label,id='',className='')=>'<button type="button" class="to-btn '+className+'" data-to="'+action+'" data-id="'+esc(id)+'">'+label+'</button>';
 const labelFor=id=>DATA().dimensions.find(x=>x[0]===id)?.[1]||id;
 const term=id=>DATA().terms.find(x=>x[0]===id);
 const activeAttributes=()=>draft().attributes.map(term).filter(Boolean);
 function terms(){
  const q=norm(state.query.trim());
  return DATA().terms.filter(t=>(state.dimension==='all'||t[1]===state.dimension)&&
   (!q||norm([t[2],t[3],t[4],t[5],t[6],t[7],t[8],labelFor(t[1])].join(' ')).includes(q)));
 }
 function atlas(){
  const arr=terms(),selected=arr.find(x=>x[0]===state.id)||arr[0],contr=DATA().contrasts[state.contrast]||DATA().contrasts[0];
  const count=DATA().terms.length;
  let result='<section class="to-root"><header class="to-hero"><div><span class="trade-kicker">O ATLAS DO OBJETO / A PALAVRA PRECISA</span><h2>Ver mais. Nomear melhor. Narrar com propriedade.</h2><p>Não comece pela indústria. Comece pela coisa: escala, massa, geometria, matéria, textura, tato, montagem, ergonomia, funcionamento, percepção e uso — e estenda o olhar à marca e ao fabricante.</p></div><div class="to-hero-metrics"><strong>'+count+'</strong><span>descritores em PT · EN · 中文</span></div></header>'+
   '<div class="to-axes"><span class="trade-kicker">12 DIMENSÕES DO OLHAR</span><div class="to-axis-scroll">'+btn('dimension','Todas as dimensões','all','to-axis'+(state.dimension==='all'?' is-active':''))+
   DATA().dimensions.map(d=>btn('dimension',esc(d[1]),d[0],'to-axis'+(state.dimension===d[0]?' is-active':''))).join('')+'</div></div>'+
   '<label class="to-search"><span>BUSCAR POR PALAVRA, SENSAÇÃO, FORMA OU CONCEITO</span><input type="search" data-to-search data-model="objectSearch" value="'+esc(state.query)+'" placeholder="Ex.: macio, maciço, fosco, densidade, controle, peso…" autocomplete="off" aria-label="Buscar descritores universais"></label>'+
   '<div class="to-main">';
  if(!selected)result+='<div class="trade-empty" role="status">Nenhum atributo corresponde aos filtros. Tente outra palavra ou dimensão.</div>';
  else result+='<nav class="to-index" aria-label="Atributos filtrados">'+arr.map(t=>btn('term','<span>'+esc(labelFor(t[1]))+'</span><strong>'+esc(t[2])+'</strong><small>'+esc(t[3])+'</small>',t[0],'to-index-item'+(t[0]===selected[0]?' is-active':''))).join('')+'</nav>'+
   '<article class="to-definition"><div class="to-definition-head"><span class="trade-kicker">'+esc(labelFor(selected[1]))+'</span><span>'+esc(selected[0].toUpperCase())+'</span></div><h3>'+esc(selected[2])+'</h3>'+
   '<div class="to-translation"><div lang="en"><small>INGLÊS</small><strong>'+esc(selected[3])+'</strong>'+btn('speak','▶ Ouvir',selected[0]+':en')+'</div>'+
   '<div lang="zh-CN"><small>MANDARIM</small><strong>'+esc(selected[4])+'</strong><em>'+esc(selected[5])+'</em>'+btn('speak','▶ Ouvir',selected[0]+':zh')+'</div></div>'+
   '<section class="to-meaning"><small>PRECISÃO SEMÂNTICA</small><p>'+esc(selected[6])+'</p></section>'+
   '<section class="to-observation"><small>NO MUNDO REAL</small><p>'+esc(selected[7])+'</p></section>'+
   '<section class="to-question"><small>OLHAR DE ÁGUIA · PERGUNTA DE VERIFICAÇÃO</small><p>'+esc(selected[8])+'</p></section>'+
   '<div class="to-detail-actions">'+btn('copy','Copiar termo e distinções',selected[0])+
   btn('add',draft().attributes.includes(selected[0])?'✓ No meu roteiro':'+ Levar ao roteiro',selected[0],'to-add'+(draft().attributes.includes(selected[0])?' is-active':''))+'</div></article>';
  result+='</div>'+
   '<div class="to-between-actions">'+btn('studio','→ Abrir Estúdio de Descrição')+'<span>Monte uma apresentação com os atributos que você selecionou acima.</span></div>'+
   '<section class="to-contrast-section"><div class="to-contrast-head"><div><span class="trade-kicker">NÃO SÃO SINÔNIMOS</span><h3>O duelo das palavras</h3><p>Precisão também significa saber o que uma palavra <em>não</em> quer dizer.</p></div><span>'+String(state.contrast+1).padStart(2,'0')+' / '+DATA().contrasts.length+'</span></div>'+
   '<div class="to-contrast-display"><div>'+esc(contr[0])+'</div><span>≠</span><div>'+esc(contr[1])+'</div></div>'+
   '<div class="to-contrast-reading"><strong>'+esc(contr[2])+'</strong><p>'+esc(contr[3])+'</p></div>'+
   '<div class="to-contrast-actions">'+btn('contrast','← Contraste anterior','prev')+btn('contrast','Próximo contraste →','next')+'</div></section>'+
   '<section class="to-guideline"><span class="trade-kicker">MÉTODO EDITORIAL</span><div><strong>Observe</strong><span>Qual dimensão e qual referência?</span></div><div><strong>Diferencie</strong><span>O termo é aparência, matéria, sensação ou grandeza?</span></div><div><strong>Qualifique</strong><span>Em que condições e com qual evidência?</span></div><div><strong>Narre</strong><span>Que experiência ou função isso ajuda a explicar?</span></div></section></section>';
  return result;
 }
 function choices(map,chosen){return Object.entries(map).map(([id,label])=>'<option value="'+esc(id)+'"'+(chosen===id?' selected':'')+'>'+esc(label)+'</option>').join('')}
 function metricLabel(key,v,u){return measures.find(m=>m[0]===key)?.[1]+': '+v+' '+u}
 function validMetric(raw){const v=String(raw||'').trim().replace(',','.');if(!/^(?:\d{1,6}(?:\.\d{1,3})?|\.\d{1,3})$/.test(v)||Number(v)<=0)return '';return v}
 function buildScript(d=draft()){
  const subject=(d.subject||'este objeto').trim()||'este objeto';
  const isCompany=d.kind==='empresa';
  const items=d.attributes.map(term).filter(Boolean).slice(0,8);
  const names=items.map(t=>t[2]);
  const facts=measures.map(m=>{
   const raw=d.metrics?.[m[0]],v=validMetric(raw),u=d.units?.[m[0]]||m[2];
   return v&&['mm','cm','m','g','kg'].includes(u)&&((m[0]==='massa')?['g','kg'].includes(u):['mm','cm','m'].includes(u))?metricLabel(m[0],v.replace('.',','),u):null;
  }).filter(Boolean);
  const qualifier=({
   impressao:'Nesta primeira observação, sem ensaio ou medição independente,',
   observado:'No manuseio e na observação realizados,',
   declarado:'Segundo as informações apresentadas, ainda não verificadas de forma independente,',
   medido:'Considerando as medições registradas, que exigem método e condições identificáveis,'
  })[d.basis]||'Na observação inicial,';
  const traits=names.length?names.join(', '):'as características ainda precisam ser examinadas';
  const setting=d.context?.trim()||'no contexto de uso pretendido';
  const material=d.material?.trim()||'composição ainda não identificada';
  const positive=d.lens==='venda';
  const result=[
   {shot:'01 · PLANO DE CONTEXTO',goal:'Situar e atrair',camera:isCompany?'Apresente a fachada, o showroom ou o ambiente de trabalho, sem mostrar terceiros sem consentimento.':'Comece pelo objeto inteiro e por sua relação com o ambiente; mostre a escala antes do detalhe.',
    speech:(isCompany?'Estamos conhecendo '+subject+', e a primeira pergunta é que tipo de empresa ela é e qual papel desempenha em seu mercado.':'Aqui está '+subject+'. Antes de julgar sua qualidade, vale entender o que ele é, para quem foi pensado e em que contexto será utilizado.')},
   {shot:'02 · PLANO GERAL / PERFIL',goal:'Mostrar escala, proporção e estrutura',camera:isCompany?'Mostre o portfólio e a organização espacial, sem inferir capacidade produtiva pela aparência.':'Faça frontal, perfil, traseira e referência de escala; evite zoom que distorça proporções.',
    speech:qualifier+' '+(isCompany?'a apresentação e a variedade dos produtos sugerem uma identidade a investigar.':'o desenho apresenta '+traits+'.')+
      (facts.length?' As medidas registradas são: '+facts.join('; ')+'.':' Sem medidas registradas, mantenho a avaliação dimensional como impressão.')},
   {shot:'03 · CLOSE DE MATÉRIA E ACABAMENTO',goal:'Nomear o detalhe',camera:'Aproxime-se de juntas, bordas, textura e revestimento. Registre a fonte caso o material seja apenas declarado.',
    speech:isCompany?'A comunicação visual e a seleção dos produtos ajudam a perceber o posicionamento da marca. É importante distinguir a apresentação comercial das operações que a empresa realiza.':
     'No detalhe, o aspecto do material merece atenção: '+material+'. '+(names.some(x=>['maciço','metálico','denso','duro','durável'].includes(x))?'Aqui, aparência e propriedade física não são a mesma coisa.':'Uma superfície pode parecer refinada sem, por isso, comprovar durabilidade.')},
   {shot:'04 · DEMONSTRAÇÃO / INTERAÇÃO',goal:'Explicar funcionamento e experiência',camera:isCompany?'Peça autorização para mostrar demonstrações, processos e pessoas.':'Mostre pega, comandos, articulações, operação e contexto real, distinguindo execução de publicidade.',
    speech:'Na prática, o que importa é como '+subject+' se comporta '+setting+'. '+(d.note?.trim()?'Minha observação específica: '+d.note.trim()+'.':'Para avaliar ergonomia e funcionamento, precisamos observar a tarefa e as condições de uso.')},
   {shot:'05 · CONCLUSÃO RESPONSÁVEL',goal:positive?'Argumentar benefícios sem exagerar':'Comparar sem prometer o que não se confirmou',camera:'Retorne ao plano geral e feche com um detalhe memorável; mantenha números e alegações atribuídos.',
    speech:positive?'Os pontos de interesse estão no desenho, na solução proposta e na experiência de uso. Vale verificar especificações, materiais e resultados antes de transformar vantagens percebidas em promessas.':
     'A impressão inicial permite descrever formas, materiais aparentes e escolhas de design. Já desempenho, confiabilidade e conformidade exigem critérios e evidências próprias antes de uma conclusão definitiva.'}
  ];
  return result;
 }
 function copyScript(){
  const d=draft(),story=buildScript(d);
  return ['STORYLAB | ROTEIRO DESCRITIVO / '+(lensNames[d.lens]||'Vlog'),kindNames[d.kind]+': '+(d.subject||'Não definido'),
   'Origem: '+(basisNames[d.basis]||'Não definida'),'Contexto: '+(d.context||'Não informado'),'','REPERTÓRIO SELECIONADO:',
   activeAttributes().map(t=>'• '+t[2]+' | '+t[3]+' | '+t[4]+' | '+t[5]+' — '+t[6]).join('\n')||'Ainda sem descritores','',
   ...story.flatMap(s=>[s.shot,s.goal,'Imagem: '+s.camera,'Fala: '+s.speech,'']),
   'Nota: roteiro de formação; dados não verificados precisam de atribuição e ensaios adequados.'].join('\n');
 }
 function studio(){
  const d=draft(),assets=activeAttributes(),script=buildScript(d);
  return '<section class="to-root"><header class="to-hero"><div><span class="trade-kicker">ESTÚDIO DE DESCRIÇÃO / STORYLAB SHANGHAI</span><h2>Da palavra exata à história bem contada.</h2><p>Construa uma apresentação autoral de produto, marca ou fornecedor. Selecione atributos reais, registre dimensões com unidades e obtenha um roteiro de cinco planos — sem números ou vantagens fabricados.</p></div><div class="to-hero-metrics"><strong>'+assets.length+' / 8</strong><span>atributos escolhidos</span></div></header>'+
   '<div class="to-presets"><div><span class="trade-kicker">COMECE PELO TIPO DE OBJETO</span><p>Escolha um ponto de partida sem presumir atributos, especificações ou desempenho.</p></div><div>'+DATA().exemplars.map(e=>btn('example',esc(e[1]),e[0],'to-preset')).join('')+'</div></div>'+
   '<div class="to-studio-grid"><section class="to-studio-form"><div class="to-studio-form-head"><span class="trade-kicker">01 / OBJETO DO OLHAR</span><h3>O que vamos apresentar?</h3></div>'+
   '<label>PRODUTO, MARCA OU EMPRESA<input data-to-field="subject" data-model="objectSubject" maxlength="110" placeholder="Ex.: motocicleta elétrica, câmera de bolso, fábrica de motores…" value="'+esc(d.subject)+'"></label>'+
   '<div class="to-form-row"><label>TIPO<select data-to-field="kind">'+choices(kindNames,d.kind)+'</select></label><label>LENTE NARRATIVA<select data-to-field="lens">'+choices(lensNames,d.lens)+'</select></label></div>'+
   '<label>FONTE E ESTADO DAS INFORMAÇÕES<select data-to-field="basis">'+choices(basisNames,d.basis)+'</select></label>'+
   '<label>MATERIAL / CONSTITUIÇÃO (DESCREVA COM ATRIBUIÇÃO)<input data-to-field="material" data-model="objectMaterial" maxlength="180" placeholder="Ex.: parece alumínio; o fabricante declara aço inox…" value="'+esc(d.material)+'"></label>'+
   '<label>CONTEXTO DO USO<input data-to-field="context" data-model="objectContext" maxlength="200" placeholder="Ex.: em trânsito urbano, durante filmagem, sentado por 30 minutos…" value="'+esc(d.context)+'"></label>'+
   '<div class="to-measures"><div><span class="trade-kicker">02 / DIMENSÕES REAIS OU DECLARADAS</span><p>Observe a orientação ilustrada antes de registrar grandezas com unidade. Os valores só serão usados se informados.</p></div>'+(window.StoryLabPrecision?.diagram(true)||'')+'<div class="to-measure-grid">'+measures.map(m=>
    '<label>'+m[1]+'<span><input inputmode="decimal" data-to-metric="'+m[0]+'" data-model="objectMetric-'+m[0]+'" maxlength="12" value="'+esc(d.metrics?.[m[0]]||'')+'" placeholder="—" aria-label="'+m[1]+'"><select data-to-unit="'+m[0]+'" aria-label="Unidade de '+m[1]+'">'+
     (m[0]==='massa'?['g','kg']:['mm','cm','m']).map(u=>'<option value="'+u+'"'+((d.units?.[m[0]]||m[2])===u?' selected':'')+'>'+u+'</option>').join('')+'</select></span></label>').join('')+'</div></div>'+
   '<label>OBSERVAÇÃO AUTORAL / TESTE (OPCIONAL)<textarea data-to-field="note" data-model="objectNote" maxlength="550" rows="4" placeholder="O que você viu, tocou ou testou? Em que situação? O que ainda falta confirmar?">'+esc(d.note)+'</textarea></label>'+
   '<div class="to-studio-attributes"><div><span class="trade-kicker">03 / PALAVRAS PARA A NARRAÇÃO</span><p>Escolha até oito propriedades. Para mudar o repertório, volte ao Atlas Universal.</p></div>'+
   (assets.length?'<div class="to-selected">'+assets.map(t=>btn('remove','× '+esc(t[2]),t[0])).join('')+'</div>':'<p class="to-empty-traits">Nenhum atributo escolhido. Abra o Atlas Universal, explore contrastes e use “Levar ao roteiro”.</p>')+
   '<div class="to-studio-links">'+btn('atlas','Explorar atributos →')+btn('clear','Reiniciar roteiro')+'</div></div></section>'+
   '<section class="to-script"><div class="to-script-head"><div><span class="trade-kicker">04 / SEQUÊNCIA AUDIOVISUAL</span><h3>Roteiro em cinco planos</h3><p>Orientações de imagem + sugestão de narração editorial. Ajuste a fala à experiência real.</p></div>'+btn('copy-script','Copiar roteiro')+'</div>'+
   '<div class="to-script-frames">'+script.map((s,i)=>'<article class="to-frame"><div class="to-frame-index">'+String(i+1).padStart(2,'0')+'</div><div><span class="trade-kicker">'+esc(s.shot)+'</span><h4>'+esc(s.goal)+'</h4><div class="to-frame-shot"><small><span aria-hidden="true">◉</span> DIREÇÃO DE CÂMERA</small><p>'+esc(s.camera)+'</p></div><div class="to-frame-voice"><small><span aria-hidden="true">❝</span> NARRAÇÃO SUGERIDA</small><p>'+esc(s.speech)+'</p></div></div></article>').join('')+'</div>'+
   '<p class="to-script-disclaimer">Este é um rascunho narrativo gerado com os seus dados, não uma avaliação técnica nem tradução automática para mandarim. Os cartões do atlas oferecem os equivalentes PT/EN/中文 para estudar e usar no campo.</p></section></div></section>';
 }
 function saveField(key,value){
  if(!['subject','kind','lens','basis','material','context','note'].includes(key))return false;
  const d=draft();
  if(key==='kind'&&!Object.keys(kindNames).includes(value))return false;
  if(key==='lens'&&!Object.hasOwn(lensNames,value))return false;
  if(key==='basis'&&!Object.hasOwn(basisNames,value))return false;
  d[key]=String(value||'').slice(0,key==='note'?550:key==='context'?200:key==='material'?180:110);
  saved().tradeObjectDraft=d;api.save();return true;
 }
 function init(ctx){
  api=ctx;
  document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-to]');if(!b)return;
   e.preventDefault();const action=b.dataset.to,id=b.dataset.id||'';
   if(action==='dimension'){
    if(id==='all'||DATA().dimensions.some(x=>x[0]===id)){state.dimension=id;state.id=null;api.render()}return;
   }
   if(action==='term'){if(term(id)){state.id=id;api.render()}return}
   if(action==='contrast'){state.contrast=(state.contrast+(id==='prev'?-1:1)+DATA().contrasts.length)%DATA().contrasts.length;api.render();return}
   if(action==='speak'){const [tid,lang]=id.split(':'),t=term(tid);if(t&&['en','zh'].includes(lang))api.say(t[lang==='en'?3:4],lang==='en'?'en-US':'zh-CN');return}
   if(action==='copy'){const t=term(id);if(t)api.copy([t[2],t[3],t[4],t[5],t[6],t[7],t[8]].join('\n'));return}
   if(action==='add'||action==='remove'){
    const d=draft();if(!term(id))return;
    d.attributes=Array.isArray(d.attributes)?d.attributes:[];
    if(action==='remove')d.attributes=d.attributes.filter(x=>x!==id);
    else if(!d.attributes.includes(id)&&d.attributes.length<8)d.attributes.push(id);
    saved().tradeObjectDraft=d;api.save();api.render();return;
   }
   if(action==='example'){const ex=DATA().exemplars.find(e=>e[0]===id);if(!ex)return;const d=draft();d.subject=ex[1];d.kind=id==='empresa'?'empresa':'produto';d.note='';saved().tradeObjectDraft=d;api.save();api.render();return}
   if(action==='atlas'){window.StoryLabTrade?.openTab?.('objeto');return}
   if(action==='studio'){window.StoryLabTrade?.openTab?.('roteiro');return}
   if(action==='clear'){if(typeof window.confirm==='function'&&!window.confirm('Limpar o roteiro e as observações locais?'))return;
    saved().tradeObjectDraft=defaults();api.save();api.render();return}
   if(action==='copy-script')api.copy(copyScript());
  });
  document.addEventListener('input',e=>{
   if(e.target.matches?.('[data-to-search]')){state.query=String(e.target.value||'').slice(0,120);state.id=null;api.render(true);return}
   const key=e.target.dataset?.toField;
   if(key&&e.target.matches?.('[data-to-field]')){if(saveField(key,e.target.value))api.render(true);return}
   const metric=e.target.dataset?.toMetric;
   if(metric&&measures.some(m=>m[0]===metric)){
    const d=draft();d.metrics=d.metrics||{};d.metrics[metric]=String(e.target.value||'').slice(0,12);
    saved().tradeObjectDraft=d;api.save();api.render(true);
   }
  });
  document.addEventListener('change',e=>{
   const key=e.target.dataset?.toField;if(key){if(saveField(key,e.target.value))api.render();return}
   const metric=e.target.dataset?.toUnit;
   if(metric&&measures.some(m=>m[0]===metric)){
    const u=e.target.value,valid=metric==='massa'?['g','kg']:['mm','cm','m'];
    if(!valid.includes(u))return;
    const d=draft();d.units=d.units||{};d.units[metric]=u;
    saved().tradeObjectDraft=d;api.save();api.render();
   }
  });
 }
 return {init,atlas,studio,terms,buildScript,copyScript,validMetric};
})();