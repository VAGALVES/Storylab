/* StoryLab v2.18 · Linguagem Técnica, Comparador & Visita Guiada
   Dados locais, sem conclusão ou avaliação automática de fornecedores. */
window.StoryLabTradeTools=(()=>{
'use strict';
let api=null;
const state={cluster:'all',query:'',id:null,training:false,reveal:false,dueOnly:false,kind:'produto',a:'',b:'',visitId:'',phase:'preparo'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const patterns=()=>window.STORYLAB_TRADE_LANGUAGE?.patterns||[];
const clusters=()=>window.STORYLAB_TRADE_LANGUAGE?.groups||[];
const groups=kind=>(window.STORYLAB_TRADE_DATA?.groups||[]).filter(g=>g[0]===kind);
const notes=()=>Array.isArray(api?.getStore()?.tradeFieldNotes)?api.getStore().tradeFieldNotes:[];
const record=()=>api?.getStore?.()||{};
const reviews=()=>record().tradeLanguageReview||{};
const visits=()=>record().tradeVisitProgress||{};
const status=key=>(window.StoryLabTradeField?.status||[]).find(s=>s[0]===key)?.[1]||'Ainda não apurado';
const sectors=()=>window.STORYLAB_TRADE_ACADEMY?.sectors||[];
const sector=n=>sectors().find(s=>s.id===n?.sector)?.name||'Geral / multissetorial';
const button=(act,title,id='',cls='')=>'<button type="button" class="tt-btn '+cls+'" data-tt="'+act+'" data-id="'+esc(id)+'">'+title+'</button>';
const due=p=>!reviews()[p.id]?.next||reviews()[p.id].next<=Date.now();
const days=[1,3,7,14,30];
const phases=[
 {id:'preparo',name:'Antes da visita',hint:'Delimitar objetivo, escopo e autorização',steps:[
  ['objetivo','Definir produto, segmento e objetivo técnico da visita'],
  ['perguntas','Selecionar dúvidas a verificar e preparar frases PT/EN/中文'],
  ['documentos','Listar fichas, versões, certificados ou ensaios a solicitar'],
  ['consentimento','Verificar permissão para fotografias, gravações ou acesso a áreas restritas']]},
 {id:'perfil',name:'Conhecer o fornecedor',hint:'Identificar especialização e condições reais',steps:[
  ['modelo','Identificar fabricante, trading e operações subcontratadas'],
  ['capacidade','Perguntar por capacidade declarada e produção efetiva no mesmo período'],
  ['mercado','Registrar mercados atendidos sem inferir conformidade'],
  ['seguranca','Observar protocolos de segurança e questões de responsabilidade']]},
 {id:'demonstracao',name:'Produto & demonstração',hint:'Do observável ao mensurável',steps:[
  ['versao','Identificar versão, lote ou referência da amostra'],
  ['protocolo','Registrar método, condições e unidade de qualquer demonstração'],
  ['desempenho','Distinguir desempenho observado e declaração comercial'],
  ['limites','Perguntar sobre tolerâncias, falhas, manutenção e limites de uso']]},
 {id:'fechamento',name:'Síntese e próximos passos',hint:'Atribuir fontes e conservar lacunas',steps:[
  ['evidencias','Relacionar observações às fontes e documentos apresentados'],
  ['pendencias','Marcar informações que continuam sem comprovação'],
  ['acoes','Definir documentos, amostras e respostas esperadas'],
  ['resumo','Revisar o relatório e respeitar a confidencialidade do fornecedor']]}
];
const tag=(label,value)=>'<div class="tt-stat"><strong>'+esc(value)+'</strong><span>'+label+'</span></div>';
function language(){
 const all=patterns();
 const filtered=all.filter(p=>(state.cluster==='all'||p.group===state.cluster)&&
  (!state.dueOnly||due(p))&&(!state.query||normalize([p.titlePt,p.title,p.pt,p.en,p.zh,p.py,p.rule,p.context].join(' ')).includes(normalize(state.query))));
 const selected=filtered.find(p=>p.id===state.id)||filtered[0];
 const dueCount=all.filter(due).length, mastered=all.filter(p=>reviews()[p.id]?.level>=3).length;
 const r=selected&&reviews()[selected.id], hidden=state.training&&!state.reveal;
 return '<section class="tt-root"><div class="tt-hero"><div><span class="trade-kicker">TRADUÇÃO APLICADA / ESTRUTURAS EM PORTUGUÊS</span><h2>Construções descritivas em três idiomas</h2><p>Aprenda a dizer exatamente como um produto funciona, de que depende, o que foi comprovado e quem afirma cada dado. Português como referência; inglês e mandarim como traduções para a comunicação profissional.</p></div><div class="tt-metrics">'+tag('construções',all.length)+tag('a revisar',dueCount)+tag('em consolidação',mastered)+'</div></div>'+
 '<div class="tt-tools"><label class="tt-search">Buscar construção<input type="search" data-tt-search placeholder="Ex.: depender de, composto por, evidência…" value="'+esc(state.query)+'"></label><label class="tt-search">Campo semântico<select data-tt-cluster><option value="all">Todos os campos</option>'+clusters().map(g=>'<option value="'+esc(g[0])+'"'+(g[0]===state.cluster?' selected':'')+'>'+esc(g[1])+'</option>').join('')+'</select></label>'+
 button('due',state.dueOnly?'✓ Apenas revisões':'Revisões pendentes','','tt-filter'+(state.dueOnly?' is-active':''))+
 button('training',state.training?'✓ Modo treino':'Praticar sem resposta','','tt-filter'+(state.training?' is-active':''))+'</div>'+
 (!filtered.length?'<div class="trade-empty" role="status">Nenhum padrão corresponde aos filtros. Exiba todos os campos ou reveja a busca.</div>':
 '<div class="tt-language-grid"><nav class="tt-patterns" aria-label="Padrões da linguagem técnica">'+filtered.map(p=>button('pattern','<span>'+esc(clusters().find(g=>g[0]===p.group)?.[1]||p.group)+'</span><strong>'+esc(p.titlePt||p.pt)+'</strong><small>'+esc(p.context)+'</small>'+(!due(p)?'<em>Em revisão futura</em>':''),p.id,'tt-pattern'+(selected.id===p.id?' is-active':''))).join('')+'</nav>'+
 '<article class="tt-pattern-detail"><div class="tt-pattern-head"><span class="trade-kicker">'+esc(clusters().find(g=>g[0]===selected.group)?.[1]||selected.group)+'</span><h3>'+esc(selected.titlePt||selected.pt)+'</h3><p>'+esc(selected.context)+'</p></div>'+
 '<div class="tt-origin"><small>COMUNIQUE EM PORTUGUÊS</small><p lang="pt-BR">'+esc(selected.pt)+'</p></div>'+
 (hidden?'<div class="tt-conceal"><p>Reproduza a ideia em inglês e em mandarim antes de mostrar a construção.</p>'+button('reveal','Revelar resposta EN + 中文','','is-primary')+'</div>':
 '<div class="tt-syntax" aria-label="Estrutura da frase em português">'+(selected.framePt||selected.frame).map((chunk,i)=>'<div class="tt-syntax-node"><small>'+['REFERENTE','RELAÇÃO / REGÊNCIA','COMPLEMENTO / CONDIÇÃO'][i]+'</small><strong lang="en">'+esc(chunk)+'</strong></div>').join('')+'</div>'+
 '<div class="tt-translation"><div lang="en"><small>INGLÊS · '+esc(selected.title)+'</small><p>'+esc(selected.en)+'</p>'+button('speak','▶ Pronunciar em inglês',selected.id+':en')+'</div><div lang="zh-CN"><small>中文 · MANDARIM</small><p>'+esc(selected.zh)+'</p><em>'+esc(selected.py)+'</em>'+button('speak','▶ Pronunciar em mandarim',selected.id+':zh')+'</div></div>'+
 '<section class="tt-rule"><small>REGÊNCIA EM INGLÊS (APOIO)</small><p>'+esc(selected.rule)+'</p></section>'+
 '<section class="tt-trap"><small>ERRO A EVITAR / PRECISÃO</small><p>'+esc(selected.trap)+'</p></section>'+
 '<div class="tt-detail-actions">'+button('copy','Copiar construção PT / EN / 中文',selected.id)+'</div>')+
 (state.training&&!hidden?'<div class="tt-review"><strong>Como foi sua produção?</strong><p>Avaliação pessoal. Não é correção automática de pronúncia.</p><div>'+button('grade','Ainda preciso estudar',selected.id+':again')+button('grade','Consegui reproduzir',selected.id+':good','is-primary')+'</div></div>':'<p class="tt-review-hint">Ative “Praticar sem resposta” para usar a revisão espaçada e registrar sua evolução.</p>')+
 (r?.next?'<div class="tt-next">Revisão '+(due(selected)?'disponível agora':('agendada para '+new Date(r.next).toLocaleDateString('pt-BR')))+'. Acertos declarados: '+(r.level||0)+'.</div>':'')+
 '</article></div>')+'</section>';
}
function cell(n,g){
 const v=n?.entries?.[g[1]]||{},provided=!!String(v.text||'').trim();
 return '<div class="tt-compare-cell '+(provided?'has-data':'is-gap')+'"><span class="tt-basis">'+esc(status(v.basis))+'</span>'+
 '<p>'+esc(provided?v.text:'Não apurado neste dossiê')+'</p>'+
 (v.evidence?'<small>Fonte / referência: '+esc(v.evidence)+'</small>':
 '<small>'+ (provided?'Sem fonte documental ou referência registrada':'Evidência não registrada')+'</small>')+'</div>';
}
function compareText(a,b,kind){
 const lines=['STORYLAB | COMPARAÇÃO DE REGISTROS DE CAMPO',
 'Tipo: '+(kind==='produto'?'Produtos':'Fornecedores'),
 'A: '+(a.title||'Sem título')+' · '+sector(a),
 'B: '+(b.title||'Sem título')+' · '+sector(b),
 'Comparação documental, não classificação automática. Declarações não são comprovações.',''];
 for(const g of groups(kind)){
  lines.push(g[2]);
  for(const [tag,n] of [['A',a],['B',b]]){
   const e=n.entries?.[g[1]]||{};
   lines.push(tag+': '+(e.text?.trim()||'Não apurado'),
    'Origem: '+status(e.basis),
    'Referência: '+(e.evidence||'Não informada'));
  }lines.push('');
 }
 lines.push('Próximos passos A: '+(a.followUp||'Não definidos'),
 'Próximos passos B: '+(b.followUp||'Não definidos'));
 return lines.join('\n');
}
function comparison(){
 const available=notes().filter(n=>n.kind===state.kind);
 const a=available.find(n=>n.id===state.a)||available[0],b=available.find(n=>n.id===state.b&&n.id!==a?.id)||available.find(n=>n.id!==a?.id);
 const items=groups(state.kind);
 const filled=n=>items.filter(g=>!!n?.entries?.[g[1]]?.text?.trim()).length;
 const options=(selected,exclude)=>available.filter(n=>n.id!==exclude).map(n=>'<option value="'+esc(n.id)+'"'+(n.id===selected?' selected':'')+'>'+esc(n.title||n.kind+' sem título')+' · '+esc(sector(n))+'</option>').join('');
 let html='<section class="tt-root"><div class="tt-hero"><div><span class="trade-kicker">MATRIZ DE DECISÃO / SEM NOTAS INVENTADAS</span><h2>Comparador de Produtos & Fornecedores</h2><p>Coloque dois dossiês da mesma categoria lado a lado. Investigue lacunas, diferenças de origem e documentação — não transforme declarações em fatos.</p></div><div class="tt-metrics">'+tag('dossiês do tipo',available.length)+'</div></div>'+
 '<div class="tt-tools"><label class="tt-search">Tipo de comparação<select data-tt-kind><option value="produto"'+(state.kind==='produto'?' selected':'')+'>Produtos</option><option value="fornecedor"'+(state.kind==='fornecedor'?' selected':'')+'>Fornecedores</option></select></label></div>';
 if(available.length<2)return html+'<div class="tt-start-empty"><h3>Precisamos de dois registros comparáveis.</h3><p>Você tem '+available.length+' dossiê(s) desse tipo. Crie outro em Dossiês de Campo; nenhuma empresa ou medida de exemplo será inventada.</p>'+button('open-dossiers','Abrir Dossiês de Campo →')+'</div></section>';
 html+='<div class="tt-compare-choices"><label>REGISTRO A<select data-tt-a>'+options(a.id,b.id)+'</select></label><label>REGISTRO B<select data-tt-b>'+options(b.id,a.id)+'</select></label>'+button('copy-compare','Copiar comparação completa','','is-primary')+'</div>';
 if(a.sector!==b.sector)html+='<p class="tt-compare-alert" role="note">Atenção: as especializações são diferentes ('+esc(sector(a))+' × '+esc(sector(b))+'). Confirme que os requisitos e as condições de uso permitem comparação.</p>';
 html+='<div class="tt-compare-summary">'+tag('dimensões preenchidas · A',filled(a)+' / '+items.length)+tag('dimensões preenchidas · B',filled(b)+' / '+items.length)+'</div>';
 html+='<div class="tt-compare-table" role="table" aria-label="Comparação por dimensões"><div class="tt-compare-row tt-compare-header" role="row"><div role="columnheader">DIMENSÃO</div><div role="columnheader">'+esc(a.title||'Registro A')+'</div><div role="columnheader">'+esc(b.title||'Registro B')+'</div></div>';
 html+=items.map((g,i)=>'<div class="tt-compare-row" role="row"><div class="tt-compare-dimension" role="rowheader"><small>'+String(i+1).padStart(2,'0')+' / '+items.length+'</small><strong>'+esc(g[2])+'</strong><span>'+esc(g[3])+'</span></div>'+cell(a,g)+cell(b,g)+'</div>').join('');
 html+='</div><p class="tt-compare-legal">O preenchimento representa apenas a presença de anotações. Não mede qualidade, capacidade ou confiabilidade; nenhum documento é verificado automaticamente.</p></section>';
 return html;
}
function visit(){
 const all=notes(),n=all.find(n=>n.id===state.visitId)||all[0],phase=phases.find(p=>p.id===state.phase)||phases[0];
 const checked=n?(visits()[n.id]||[]):[];
 const total=phases.reduce((sum,p)=>sum+p.steps.length,0),count=phases.reduce((sum,p)=>sum+p.steps.filter(x=>checked.includes(x[0])).length,0);
 let html='<section class="tt-root"><div class="tt-hero"><div><span class="trade-kicker">PROTOCOLO OPERACIONAL / VISITA DE CAMPO</span><h2>Modo Visita Profissional</h2><p>Quatro momentos de trabalho, 16 verificações e um registro de acompanhamento. Use a mesma disciplina para roupas, robótica, automóveis e energia — com questões específicas no Radar Setorial.</p></div><div class="tt-metrics">'+tag('etapas',phases.length)+tag('verificações',total)+'</div></div>';
 if(!n)return html+'<div class="tt-start-empty"><h3>Crie um dossiê para começar a visita.</h3><p>O roteiro usa os registros locais e guarda o andamento por dossiê, sem atribuir fatos a fornecedores reais.</p>'+button('open-dossiers','Abrir Dossiês de Campo →')+'</div></section>';
 html+='<div class="tt-tools"><label class="tt-search">Acompanhar dossiê<select data-tt-visit>'+all.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===n.id?' selected':'')+'>'+esc(x.title||'Registro sem título')+' · '+esc(sector(x))+'</option>').join('')+'</select></label><div class="tt-visit-progress"><strong>'+count+' / '+total+'</strong><span>verificações assinaladas</span><div class="tt-progressbar" role="progressbar" aria-label="Verificações concluídas" aria-valuenow="'+count+'" aria-valuemin="0" aria-valuemax="'+total+'"><span style="width:'+(count/total*100)+'%"></span></div></div></div>'+
 '<nav class="tt-phase-tabs" aria-label="Momentos da visita">'+phases.map((p,i)=>button('phase','<span>0'+(i+1)+'</span><strong>'+esc(p.name)+'</strong><small>'+p.steps.filter(x=>checked.includes(x[0])).length+'/'+p.steps.length+' concluídas</small>',p.id,'tt-phase'+(phase.id===p.id?' is-active':''))).join('')+'</nav>'+
 '<article class="tt-visit-body"><div class="tt-visit-heading"><span class="trade-kicker">PROCEDIMENTO / '+esc(phase.name.toUpperCase())+'</span><h3>'+esc(phase.hint)+'</h3><p>Marque somente o que realmente verificou, perguntou ou solicitou. Um item assinalado não certifica o resultado.</p></div>'+
 '<div class="tt-checklist">'+phase.steps.map((st,i)=>'<label class="tt-check '+(checked.includes(st[0])?'is-done':'')+'"><input type="checkbox" data-tt-check="'+st[0]+'" '+(checked.includes(st[0])?'checked':'')+'><span><strong>'+String(i+1).padStart(2,'0')+'. '+esc(st[1])+'</strong><small>'+(checked.includes(st[0])?'Ação registrada':'Pendente')+'</small></span></label>').join('')+'</div>'+
 '<div class="tt-visit-next"><div><span class="trade-kicker">DADOS DE CAMPO</span><p>Produto ou fornecedor: <strong>'+esc(n.title||'Sem título')+'</strong> · '+esc(sector(n))+'</p></div>'+button('open-dossiers','Abrir este dossiê →','','is-primary')+'</div></article></section>';
 return html;
}
function grade(id,good){
 const p=patterns().find(x=>x.id===id);if(!p)return;
 const s=record(),all=s.tradeLanguageReview&&typeof s.tradeLanguageReview==='object'?s.tradeLanguageReview:{};
 const before=all[id]||{level:0},level=good?Math.min(5,(before.level||0)+1):0;
 all[id]={level,last:Date.now(),next:Date.now()+(good?days[level-1]:1)*86400000};
 s.tradeLanguageReview=all;api.save();state.reveal=false;api.render();
}
function setVisit(id,checked){
 const n=notes().find(x=>x.id===state.visitId)||notes()[0];
 if(!n||!phases.some(p=>p.steps.some(step=>step[0]===id)))return;
 const s=record();s.tradeVisitProgress=s.tradeVisitProgress||{};
 let progress=Array.isArray(s.tradeVisitProgress[n.id])?s.tradeVisitProgress[n.id]:[];
 progress=progress.filter(x=>x!==id);if(checked)progress.push(id);
 s.tradeVisitProgress[n.id]=progress;api.save();api.render();
}
function init(context){
 api=context;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-tt]');if(!b)return;
  e.preventDefault();
  const a=b.dataset.tt,id=b.dataset.id||'';
  if(a==='pattern'){state.id=id;state.reveal=false;api.render();return}
  if(a==='training'){state.training=!state.training;state.reveal=false;api.render();return}
  if(a==='due'){state.dueOnly=!state.dueOnly;state.reveal=false;api.render();return}
  if(a==='reveal'){state.reveal=true;api.render();return}
  if(a==='grade'){if(!state.training||!state.reveal)return;const [key,result]=id.split(':');grade(key,result==='good');return}
  if(a==='phase'){if(phases.some(p=>p.id===id)){state.phase=id;api.render()}return}
  if(a==='open-dossiers'){window.StoryLabTrade?.openTab?.('dossies');return}
  if(a==='copy-compare'){
   const list=notes().filter(x=>x.kind===state.kind);
   const first=list.find(x=>x.id===state.a)||list[0],second=list.find(x=>x.id===state.b&&x.id!==first?.id)||list.find(x=>x.id!==first?.id);
   if(first&&second)api.copy(compareText(first,second,state.kind));return;
  }
  if(a==='speak'||a==='copy'){
   const [key,lang]=id.split(':'),p=patterns().find(x=>x.id===key);if(!p)return;
   if(a==='speak'&&lang==='en')api.say(p.en,'en-US');
   if(a==='speak'&&lang==='zh')api.say(p.zh,'zh-CN');
   if(a==='copy')api.copy([p.pt,p.en,p.zh,p.py,p.rule].join('\n'));return;
  }
 });
 document.addEventListener('input',e=>{
  if(e.target.matches?.('[data-tt-search]')){state.query=String(e.target.value||'').slice(0,120);state.reveal=false;api.render(true)}
 });
 document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches?.('[data-tt-check]')){setVisit(t.dataset.ttCheck,!!t.checked);return}
  if(t.matches?.('[data-tt-cluster]')){state.cluster=t.value;state.reveal=false;api.render()}
  if(t.matches?.('[data-tt-kind]')){state.kind=t.value==='fornecedor'?'fornecedor':'produto';state.a='';state.b='';api.render()}
  if(t.matches?.('[data-tt-a]')){state.a=t.value;state.b=state.a===state.b?'':state.b;api.render()}
  if(t.matches?.('[data-tt-b]')){state.b=t.value;state.a=state.a===state.b?'':state.a;api.render()}
  if(t.matches?.('[data-tt-visit]')){if(notes().some(n=>n.id===t.value)){state.visitId=t.value;api.render()}}
 });
}
return {init,language,comparison,visit,compareText,phases};
})();