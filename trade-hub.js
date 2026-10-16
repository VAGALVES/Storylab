/* StoryLab Shanghai · Dossiê de fornecedores e produtos · v2.15
   Atlas e fraseoteca profissional para visitas de campo.
   Sem chamadas externas, sem cadastro de empresas reais, sem métricas inferidas. */
window.StoryLabTrade = (() => {
  'use strict';
  const state={tab:'produto',group:'all',scenario:'all',query:'',selected:null,training:false,reveal:[]};
  let api=null;
  const data=()=>window.STORYLAB_TRADE_DATA||{groups:[],terms:[]};
  const library=()=>window.STORYLAB_TRADE_PHRASES||{scenarios:[],phrases:[]};
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const store=()=>api?.getStore()||{tradeSaved:[],tradeSeen:[]};
  const saved=()=>Array.isArray(store().tradeSaved)?store().tradeSaved:[];
  const seen=()=>Array.isArray(store().tradeSeen)?store().tradeSeen:[];
  const kindTitle=domain=>domain==='produto'?'Produtos':'Fornecedores';
  function groupLabel(domain,id){
    return data().groups.find(g=>g[0]===domain&&g[1]===id)?.[2]||id;
  }
  function toolbar(){
    const tabs=[['produto','Atlas de produtos'],['fornecedor','Atlas de fornecedores'],['frases','Fraseoteca de campo']];
    return '<div class="trade-tabs" role="group" aria-label="Escolher repertório">'+tabs.map(t=>
      '<button type="button" data-trade="tab" data-value="'+t[0]+'" class="trade-tab'+(state.tab===t[0]?' active':'')+'" aria-pressed="'+(state.tab===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  }
  function controls(){
    const isPhrase=state.tab==='frases';
    const opts=isPhrase?library().scenarios.map(g=>[g[0],g[1]]):data().groups.filter(g=>g[0]===state.tab).map(g=>[g[1],g[2]]);
    const field=isPhrase?'scenario':'group';
    const value=isPhrase?state.scenario:state.group;
    return '<div class="trade-controls"><label class="trade-search"><span>BUSCAR NO REPERTÓRIO</span><input type="search" data-trade-search data-model="tradeSearch" placeholder="'+(isPhrase?'Ex.: prazo, amostra, preço, teste...':'Ex.: composição, acabamento, capacidade...')+'" value="'+esc(state.query)+'" autocomplete="off" aria-label="Buscar termos e frases"></label>'+
      '<label class="trade-filter"><span>'+ (isPhrase?'SITUAÇÃO PROFISSIONAL':'DIMENSÃO DE ANÁLISE') +'</span><select data-trade-filter="'+field+'" aria-label="'+(isPhrase?'Filtrar por situação':'Filtrar por dimensão')+'">'+
      '<option value="all">Todas as '+(isPhrase?'situações':'dimensões')+'</option>'+
      opts.map(([id,label])=>'<option value="'+esc(id)+'"'+(value===id?' selected':'')+'>'+esc(label)+'</option>').join('')+'</select></label></div>';
  }
  function action(label,action,id,cls=''){
    return '<button type="button" class="trade-action '+cls+'" data-trade="'+action+'" data-id="'+esc(id)+'">'+label+'</button>';
  }
  function termDetail(term){
    const key='t:'+term.id,star=saved().includes(key);
    return '<article class="trade-detail" aria-label="Dossiê técnico do termo">'+
      '<div class="trade-detail-top"><span class="trade-kicker">'+esc(groupLabel(term.domain,term.group))+'</span><span class="trade-item-id">'+esc(term.id.toUpperCase())+'</span></div>'+
      '<h3>'+esc(term.pt)+'</h3><div class="trade-translations">'+
      '<section lang="en"><small>ENGLISH</small><p>'+esc(term.en)+'</p>'+action('▶ Ouvir inglês','speak',term.id+':en')+'</section>'+
      '<section lang="zh-CN"><small>中文 · MANDARIM</small><p>'+esc(term.zh)+'</p><em>'+esc(term.py)+'</em>'+action('▶ Ouvir mandarim','speak',term.id+':zh')+'</section></div>'+
      '<section class="trade-explanation"><small>DEFINIÇÃO E DISTINÇÃO TÉCNICA</small><p>'+esc(term.definition)+'</p></section>'+
      '<div class="trade-detail-actions">'+action(star?'★ Remover dos salvos':'☆ Salvar termo','save',key,'trade-save')+
      action('Copiar PT · EN · 中文','copy',term.id)+'</div>'+
      '<p class="trade-evidence"><strong>Regra de campo:</strong> se o atributo depender de medição, certificado, relatório ou processo, solicite a evidência correspondente. Aparência e declarações comerciais não equivalem a comprovação.</p></article>';
  }
  function filteredTerms(){
    const q=norm(state.query);
    return data().terms.filter(t=>t.domain===state.tab&&(state.group==='all'||t.group===state.group)&&
      (!q||norm([t.pt,t.en,t.zh,t.py,t.definition,groupLabel(t.domain,t.group)].join(' ')).includes(q)));
  }
  function atlas(){
    const terms=filteredTerms(),chosen=terms.find(t=>t.id===state.selected)||terms[0];
    const overview=state.tab==='produto'?
      'Investigue a natureza do produto, sua construção, o que oferece, os limites de uso e quais atributos podem ser comprovados.':
      'Descreva o perfil do fornecedor, seu mercado, os recursos que realmente opera, os controles e as condições de colaboração.';
    return '<div class="trade-section-intro"><div><span class="trade-kicker">ATLAS TÉCNICO / '+kindTitle(state.tab).toUpperCase()+'</span>'+
       '<h2>'+kindTitle(state.tab)+': do observável ao verificável</h2><p>'+overview+'</p></div>'+
       '<strong class="trade-count">'+terms.length+'<small>verbetes encontrados</small></strong></div>'+controls()+
       (!terms.length?'<div class="trade-empty" role="status">Nenhum verbete corresponde aos filtros. Experimente outra dimensão ou busca.</div>':
       '<div class="trade-atlas-grid"><nav class="trade-lexicon-list" aria-label="Verbetes filtrados">'+terms.map(t=>{
         const active=chosen.id===t.id;
         return '<button type="button" class="trade-lexicon-item'+(active?' active':'')+'" data-trade="term" data-id="'+t.id+'" aria-current="'+(active?'true':'false')+'"><span>'+esc(groupLabel(t.domain,t.group))+'</span><strong>'+esc(t.pt)+'</strong><small>'+esc(t.en)+'</small></button>';
       }).join('')+'</nav>'+termDetail(chosen)+'</div>');
  }
  function phraseCard(p){
    const key='p:'+p.id,isSaved=saved().includes(key),isSeen=seen().includes(key);
    const show=!state.training||state.reveal.includes(p.id);
    return '<article class="trade-phrase-card" aria-label="Expressão profissional">'+
      '<div class="trade-phrase-top"><span class="trade-kicker">'+esc(library().scenarios.find(g=>g[0]===p.scenario)?.[1]||p.scenario)+'</span><span class="trade-item-id">'+esc(p.id.toUpperCase())+'</span></div>'+
      '<h3 lang="pt-BR">'+esc(p.pt)+'</h3>'+
      (show?'<div class="trade-phrase-languages">'+
        '<div lang="en"><small>ENGLISH</small><p>'+esc(p.en)+'</p>'+action('▶ Ouvir','speak',p.id+':en')+'</div>'+
        '<div lang="zh-CN"><small>中文 / PINYIN</small><p>'+esc(p.zh)+'</p><em>'+esc(p.py)+'</em>'+action('▶ Ouvir','speak',p.id+':zh')+'</div></div>':
        '<p class="trade-practice-prompt">Produza a frase em inglês e em mandarim antes de revelar a resposta.</p>'+action('Revelar EN + 中文','reveal',p.id,'trade-reveal'))+
      '<div class="trade-phrase-footer">'+action('▶ PT','speak',p.id+':pt')+
        action(isSeen?'✓ Praticada':'Marcar como praticada','seen',key)+
        action(isSaved?'★ Salva':'☆ Salvar','save',key)+
        action('Copiar trilingue','copy',p.id)+'</div></article>';
  }
  function filteredPhrases(){
    const q=norm(state.query);
    return library().phrases.filter(p=>(state.scenario==='all'||p.scenario===state.scenario)&&
      (!q||norm([p.pt,p.en,p.zh,p.py,library().scenarios.find(g=>g[0]===p.scenario)?.[1]].join(' ')).includes(q)));
  }
  function phrasebook(){
    const items=filteredPhrases();
    return '<div class="trade-section-intro"><div><span class="trade-kicker">FRASEOTECA PROFISSIONAL / PT · EN · 中文</span>'+
     '<h2>Da observação à conversa técnica</h2><p>Aborde fornecedores, descreva produtos, peça demonstrações, confirme números e formalize próximos passos. Use o modo prática para tentar traduzir antes de revelar.</p></div>'+
     '<strong class="trade-count">'+items.length+'<small>construções encontradas</small></strong></div>'+controls()+
     '<div class="trade-phrase-tools"><button type="button" data-trade="training" class="trade-training'+(state.training?' active':'')+'" aria-pressed="'+state.training+'">'+(state.training?'✓ Modo prática':'Iniciar modo prática')+'</button>'+
     '<span>Frases trilingues com pronúncia por síntese de voz do dispositivo.</span></div>'+
     (!items.length?'<div class="trade-empty" role="status">Nenhuma frase encontrada. Altere sua busca ou situação profissional.</div>':
     '<div class="trade-phrase-grid">'+items.map(phraseCard).join('')+'</div>');
  }
  function render(){
    if(!api)return '<div class="notice">Repertório profissional em inicialização.</div>';
    const totals=data().terms.length,number=library().phrases.length;
    return '<div class="trade-root">'+api.header('STORYLAB / CAMPO SHANGHAI / REPERTÓRIO PROFISSIONAL','Fornecedores & Produtos','Um laboratório de linguagem para visitar empresas, examinar mercadorias, fazer perguntas técnicas e apresentar conclusões verificáveis.')+
       '<div class="trade-hero"><div><span>O UNIVERSO DO PRODUTO E DE QUEM O PRODUZ</span><strong>Observar. Descrever. Questionar. Comprovar.</strong><p>Do detalhe físico ao negócio e à cadeia produtiva: um repertório técnico, linguístico e profissional para a experiência em Xangai.</p></div><div class="trade-hero-metrics"><div><strong>'+totals+'</strong><small>verbetes PT/EN/中文</small></div><div><strong>'+number+'</strong><small>frases em 3 idiomas</small></div><div><strong>'+saved().length+'</strong><small>itens salvos</small></div></div></div>'+
      toolbar()+(state.tab==='frases'?phrasebook():atlas())+
      '<footer class="trade-disclaimer">Glossário e traduções para estudo e conversação. Terminologia técnica e chinês de uso profissional devem ser confirmados quando aplicáveis ao setor, ao contrato e à fábrica. Nenhum dado de desempenho ou fornecedor é presumido.</footer></div>';
  }
  function record(id,add){
    const s=store(),name=add==='save'?'tradeSaved':'tradeSeen';
    s[name]=Array.isArray(s[name])?s[name]:[];
    const idx=s[name].indexOf(id);
    if(idx>=0&&add==='save')s[name].splice(idx,1);
    else if(idx<0)s[name].push(id);
    api.save();
  }
  function item(id){
    return id.startsWith('t')?data().terms.find(x=>x.id===id):library().phrases.find(x=>x.id===id);
  }
  function init(ctx){
    api=ctx;
    document.addEventListener('click',e=>{
      const b=e.target.closest?.('[data-trade]');
      if(!b)return;
      e.preventDefault();
      const a=b.dataset.trade,id=b.dataset.id||'',value=b.dataset.value||'';
      if(a==='tab'){
        state.tab=value;state.group='all';state.scenario='all';state.query='';state.selected=null;state.reveal=[];api.render();return;
      }
      if(a==='term'){state.selected=id;api.render();return}
      if(a==='training'){state.training=!state.training;state.reveal=[];api.render();return}
      if(a==='reveal'){if(!state.reveal.includes(id))state.reveal.push(id);api.render();return}
      if(a==='save'||a==='seen'){record(id,a);api.render();return}
      if(a==='speak'){
        const [key,lang]=id.split(':');const found=item(key);
        if(!found||!['pt','en','zh'].includes(lang))return;
        api.say(found[lang],lang==='zh'?'zh-CN':lang==='en'?'en-US':'pt-BR');return;
      }
      if(a==='copy'){
        const found=item(id);if(!found)return;
        api.copy([found.pt,found.en,found.zh,found.py].filter(Boolean).join('\n'));return;
      }
    });
    document.addEventListener('input',e=>{
      const el=e.target;
      if(!el.matches?.('[data-trade-search]'))return;
      state.query=el.value.slice(0,120);state.selected=null;api.render(true);
    });
    document.addEventListener('change',e=>{
      const field=e.target?.dataset?.tradeFilter;
      if(field==='group'){state.group=e.target.value;state.selected=null;api.render()}
      if(field==='scenario'){state.scenario=e.target.value;api.render()}
    });
  }
  return {init,render,filteredTerms,filteredPhrases};
})();