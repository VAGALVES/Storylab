/* StoryLab Shanghai · Dossiês de Campo v2.16
   Diário profissional local: fatos observados, alegações e evidências permanecem distintos.
   Nenhuma informação é enviada a servidores. */
window.StoryLabTradeField=(()=>{
'use strict';
const state={id:null,group:null};
let api=null;
const STATUS=[
 ['pendente','Ainda não apurado'],
 ['observado','Observação direta'],
 ['declarado','Declaração do fornecedor'],
 ['documentado','Documento apresentado (não validado)'],
 ['medido','Medição registrada']
];
const PROMPTS={
 identidade:['A que categoria pertence e para qual público foi projetado?','Which category does this product belong to, and who is it designed for?','这个产品属于什么类别？主要面向哪些客户？','Zhège chǎnpǐn shǔyú shénme lèibié? Zhǔyào miànxiàng nǎxiē kèhù?'],
 materiais:['Qual é a composição exata e como ela foi verificada?','What is the exact material composition, and how was it verified?','具体的材料成分是什么？是如何核实的？','Jùtǐ de cáiliào chéngfèn shì shénme? Shì rúhé héshí de?'],
 construcao:['Quais métodos de construção e acabamento são utilizados?','Which construction and finishing methods are used?','使用了哪些制作和后整理工艺？','Shǐyòng le nǎxiē zhìzuò hé hòu zhěnglǐ gōngyì?'],
 forma:['Quais são as medidas críticas, tolerâncias e critérios de caimento?','What are the critical measurements, tolerances, and fit criteria?','关键尺寸、公差和版型标准是什么？','Guānjiàn chǐcùn, gōngchā hé bǎnxíng biāozhǔn shì shénme?'],
 desempenho:['O desempenho foi testado? Em quais condições?','Has its performance been tested? Under what conditions?','产品性能经过测试吗？测试条件是什么？','Chǎnpǐn xìngnéng jīngguò cèshì ma? Cèshì tiáojiàn shì shénme?'],
 qualidade:['Quais defeitos e critérios de aceitação são relevantes?','Which defects and acceptance criteria are relevant?','哪些缺陷和验收标准需要重点关注？','Nǎxiē quēxiàn hé yànshōu biāozhǔn xūyào zhòngdiǎn guānzhù?'],
 valor:['Quais fatores influenciam o custo e a viabilidade de produção?','What factors affect cost and manufacturing feasibility?','哪些因素会影响成本和生产可行性？','Nǎxiē yīnsù huì yǐngxiǎng chéngběn hé shēngchǎn kěxíngxìng?'],
 ciclo:['Como o lote é identificado e o produto é armazenado e transportado?','How is the batch identified, and how is the product stored and transported?','如何识别批次？产品如何储存和运输？','Rúhé shíbié pīcì? Chǎnpǐn rúhé chǔcún hé yùnshū?'],
 perfil:['A empresa fabrica diretamente ou atua como trading? Em que se especializa?','Does the company manufacture directly or operate as a trading company? What does it specialize in?','贵公司是直接生产还是贸易公司？主要专长是什么？','Guì gōngsī shì zhíjiē shēngchǎn háishì màoyì gōngsī? Zhǔyào zhuāncháng shì shénme?'],
 capacidade:['Qual é a capacidade mensal por categoria e a produção efetiva atual?','What is the monthly capacity by category, and what is the current actual output?','各类产品的月产能是多少？目前的实际产量是多少？','Gè lèi chǎnpǐn de yuè chǎnnéng shì duōshǎo? Mùqián de shíjì chǎnliàng shì duōshǎo?'],
 processos:['Quais etapas são internas e quais são subcontratadas?','Which stages are performed in-house and which are subcontracted?','哪些工序在厂内完成，哪些需要外包？','Nǎxiē gōngxù zài chǎngnèi wánchéng, nǎxiē xūyào wàibāo?'],
 desenvolvimento:['Quantas rodadas de amostra normalmente são necessárias antes da aprovação?','How many sample rounds are usually needed before approval?','样品通常需要修改几轮才能获批？','Yàngpǐn tōngcháng xūyào xiūgǎi jǐ lún cáinéng huòpī?'],
 gestao:['Como os defeitos são medidos e as ações corretivas gerenciadas?','How are defects measured and corrective actions managed?','如何统计缺陷并管理纠正措施？','Rúhé tǒngjì quēxiàn bìng guǎnlǐ jiūzhèng cuòshī?'],
 comercial:['Quais são o MOQ, o prazo e as condições de pagamento para este modelo?','What are the MOQ, lead time, and payment terms for this style?','这个款式的最小起订量、交期和付款条件是什么？','Zhège kuǎnshì de zuìxiǎo qǐdìngliàng, jiāoqī hé fùkuǎn tiáojiàn shì shénme?'],
 logistica:['Quais são os fornecedores críticos e os principais riscos de entrega?','Who are the critical upstream suppliers, and what are the main delivery risks?','关键上游供应商有哪些？主要交付风险是什么？','Guānjiàn shàngyóu gōngyìngshāng yǒu nǎxiē? Zhǔyào jiāofù fēngxiǎn shì shénme?'],
 responsabilidade:['Quais certificados estão vigentes e qual é o escopo de cada um?','Which certificates are current, and what is the scope of each one?','目前有哪些有效证书？每份证书的适用范围是什么？','Mùqián yǒu nǎxiē yǒuxiào zhèngshū? Měi fèn zhèngshū de shìyòng fànwéi shì shénme?']
};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups=kind=>(window.STORYLAB_TRADE_DATA?.groups||[]).filter(g=>g[0]===kind);
const notes=()=>Array.isArray(api?.getStore()?.tradeFieldNotes)?api.getStore().tradeFieldNotes:[];
const current=()=>notes().find(n=>n.id===state.id)||notes()[0]||null;
const groupText=(note,g)=>note.entries?.[g]?.text||'';
function copyText(note){
 const lines=[
  'STORYLAB | DOSSIÊ DE CAMPO',
  (note.kind==='produto'?'Produto':'Fornecedor')+': '+(note.title||'Sem título'),
  'Empresa / contato: '+(note.partner||'Não informado'),
  'Data: '+(note.date||'Não informada'),
  'Estado das informações: registros pessoais, sem certificação de evidências',''
 ];
 for(const g of groups(note.kind)){
  const entry=note.entries?.[g[1]]||{};
  lines.push(g[2], 'Origem: '+(STATUS.find(s=>s[0]===entry.basis)?.[1]||STATUS[0][1]),
   'Registro: '+(entry.text||'Não apurado'),
   'Fonte / documento / referência: '+(entry.evidence||'Não informada'),'');
 }
 lines.push('Próximos passos: '+(note.followUp||'Não definidos'));
 return lines.join('\n');
}
function create(kind){
 if(!['produto','fornecedor'].includes(kind)||notes().length>=20)return;
 const now=new Date(),date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const entry={id:'f-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),kind,title:'',partner:'',date,entries:{},followUp:''};
 const s=api.getStore();s.tradeFieldNotes=Array.isArray(s.tradeFieldNotes)?s.tradeFieldNotes:[];
 s.tradeFieldNotes.unshift(entry);state.id=entry.id;state.group=groups(kind)[0][1];api.save();api.render();
}
function button(a,label,id='',extra=''){
 return '<button type="button" class="trade-action '+extra+'" data-trade-field="'+a+'" data-id="'+esc(id)+'">'+label+'</button>';
}
function overview(){
 const all=notes();
 return '<div class="trade-field-top"><div><span class="trade-kicker">CADERNO DE CAMPO / PRÁTICA PROFISSIONAL</span><h2>Dossiês de visitas e produtos</h2><p>Registre características, respostas e evidências por dimensão, sem confundir observação e confirmação técnica. Os registros ficam apenas neste navegador e entram no backup do StoryLab.</p></div>'+
 '<div class="trade-field-create">'+button('new','+ Novo produto','produto')+button('new','+ Nova visita a fornecedor','fornecedor')+'</div></div>'+
 '<div class="trade-field-list" aria-label="Dossiês salvos">'+(all.length?all.map(n=>button('open',
 esc(n.title||(n.kind==='produto'?'Produto sem título':'Fornecedor sem título'))+' <small>'+esc(n.date)+'</small>',n.id,
 n.id===current()?.id?'is-active':'')).join(''):'<div class="trade-empty">Nenhum dossiê ainda. Crie o primeiro para transformar o Atlas em instrumento de visita.</div>')+'</div>'+
 (all.length>=20?'<p class="trade-field-limit">Limite de 20 dossiês locais; copie e guarde os registros antes de excluir os antigos.</p>':'');
}
function render(){
 const note=current();
 let html='<section class="trade-field">'+overview();
 if(!note)return html+'</section>';
 const sections=groups(note.kind);
 const group=sections.find(g=>g[1]===state.group)||sections[0];
 const i=sections.findIndex(g=>g[1]===group[1]);
 const filled=sections.filter(g=>groupText(note,g[1]).trim()).length;
 const entry=note.entries?.[group[1]]||{},prompt=PROMPTS[group[1]];
 html+='<article class="trade-field-editor"><div class="trade-field-editor-head"><div><span class="trade-kicker">'+(note.kind==='produto'?'DOSSIÊ DE PRODUTO':'DOSSIÊ DE FORNECEDOR')+'</span><h3>'+(note.title?esc(note.title):'Registro sem título')+'</h3><p>'+filled+' de '+sections.length+' dimensões com anotações · salvo automaticamente</p></div><div class="trade-field-actions">'+button('copy','Copiar relatório',note.id)+button('delete','Excluir dossiê',note.id,'trade-field-danger')+'</div></div>'+
 '<div class="trade-field-meta"><label>PRODUTO / FORNECEDOR / REFERÊNCIA<input data-field-input="title" maxlength="120" placeholder="Ex.: blazer com forro ou fábrica de malharia" value="'+esc(note.title)+'"></label>'+
 '<label>EMPRESA OU CONTATO (OPCIONAL)<input data-field-input="partner" maxlength="120" placeholder="Identificação, sem dados confidenciais" value="'+esc(note.partner)+'"></label>'+
 '<label>DATA DA VISITA<input type="date" data-field-input="date" value="'+esc(note.date)+'"></label></div>'+
 '<div class="trade-field-dims" role="group" aria-label="Dimensões do dossiê">'+sections.map((g,k)=>button('group',String(k+1).padStart(2,'0')+' · '+esc(g[2])+(groupText(note,g[1]).trim()?' ✓':''),g[1],group[1]===g[1]?'is-active':'')).join('')+'</div>'+
 '<section class="trade-field-dimension" aria-label="Dimensão selecionada"><div class="trade-field-dimension-head"><span class="trade-kicker">DIMENSÃO '+(i+1)+' / '+sections.length+'</span><h4>'+esc(group[2])+'</h4><p>'+esc(group[3])+'</p></div>'+
 '<div class="trade-field-prompt"><span class="trade-kicker">PERGUNTA TÉCNICA PARA A VISITA</span><p>'+esc(prompt[0])+'</p><div lang="en"><strong>EN</strong> '+esc(prompt[1])+'</div><div lang="zh-CN"><strong>中文</strong> '+esc(prompt[2])+'<small>'+esc(prompt[3])+'</small></div><div class="trade-field-prompt-actions">'+button('speak','▶ English',group[1]+':en')+button('speak','▶ 中文',group[1]+':zh')+button('copy-question','Copiar pergunta em 3 idiomas',group[1])+'</div></div>'+
 '<div class="trade-field-entry"><label>O QUE FOI OBSERVADO, DITO OU APRESENTADO<textarea rows="6" maxlength="1600" data-field-input="text" placeholder="Descreva precisamente, registre números com unidade e não transforme declarações em fatos verificados.">'+esc(entry.text||'')+'</textarea></label>'+
 '<label>ORIGEM DESTA INFORMAÇÃO<select data-field-basis>'+STATUS.map(s=>'<option value="'+s[0]+'"'+((entry.basis||'pendente')===s[0]?' selected':'')+'>'+esc(s[1])+'</option>').join('')+'</select></label>'+
 '<label>FONTE, AMOSTRA, MEDIÇÃO OU DOCUMENTO ASSOCIADO<input maxlength="240" data-field-input="evidence" placeholder="Ex.: fala do gerente, ficha técnica nº…, relatório de teste…" value="'+esc(entry.evidence||'')+'"></label>'+
 '<p class="trade-field-caution">A escolha “Documento apresentado” indica apenas que foi visto ou recebido; não valida autenticidade, escopo ou atualidade. Mantenha atribuições e ressalvas no relatório.</p></div>'+
 '<div class="trade-field-step-actions">'+button('group','← Dimensão anterior',sections[(i+7)%8][1])+button('group','Próxima dimensão →',sections[(i+1)%8][1])+'</div></section>'+
 '<div class="trade-field-next"><label>PRÓXIMAS VERIFICAÇÕES E AÇÕES<textarea rows="3" maxlength="1000" data-field-input="followUp" placeholder="Ex.: solicitar tabela de medidas revisada, confirmar capacidade com registros, agendar nova amostra…">'+esc(note.followUp||'')+'</textarea></label></div>'+
 '<p class="trade-field-privacy">Dados locais neste dispositivo; não insira informações comerciais confidenciais sem autorização. Use o backup do StoryLab ou copie o relatório para preservar suas anotações.</p></article>';
 return html+'</section>';
}
function updateField(el){
 const note=current();if(!note)return;
 const property=el.dataset.fieldInput;
 if(!['title','partner','date','text','evidence','followUp'].includes(property))return;
 const val=String(el.value||'');
 if(property==='text'||property==='evidence'){
  const group=groups(note.kind).find(g=>g[1]===(state.group||groups(note.kind)[0][1]))?.[1];if(!group)return;
  note.entries=note.entries||{};note.entries[group]=note.entries[group]||{basis:'pendente',text:'',evidence:''};
  note.entries[group][property]=val.slice(0,property==='text'?1600:240);
 }else if(property==='date')note.date=/^\d{4}-\d{2}-\d{2}$/.test(val)?val:'';
 else note[property]=val.slice(0,property==='followUp'?1000:120);
 api.save();
}
function init(context){
 api=context;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-trade-field]');if(!b)return;
  e.preventDefault();const type=b.dataset.tradeField,id=b.dataset.id||'';
  if(type==='new'){create(id);return}
  if(type==='open'){if(notes().some(n=>n.id===id)){state.id=id;state.group=null;api.render()}return}
  if(type==='group'){const note=current();if(note&&groups(note.kind).some(g=>g[1]===id)){state.group=id;api.render()}return}
  if(type==='copy'){const note=notes().find(n=>n.id===id);if(note)api.copy(copyText(note));return}
  if(type==='delete'){const s=api.getStore(),index=notes().findIndex(n=>n.id===id);if(index<0)return;
    if(typeof window.confirm==='function'&&!window.confirm('Excluir este dossiê local? A ação não pode ser desfeita sem um backup.'))return;
    s.tradeFieldNotes.splice(index,1);state.id=null;state.group=null;api.save();api.render();return;
  }
  if(type==='speak'||type==='copy-question'){
   const [group,lang]=id.split(':'),prompt=PROMPTS[group];if(!prompt)return;
   if(type==='speak'&&lang==='en')api.say(prompt[1],'en-US');
   if(type==='speak'&&lang==='zh')api.say(prompt[2],'zh-CN');
   if(type==='copy-question')api.copy(prompt.join('\n'));
  }
 });
 document.addEventListener('input',e=>{if(e.target.matches?.('[data-field-input]'))updateField(e.target)});
 document.addEventListener('change',e=>{
  if(!e.target.matches?.('[data-field-basis]'))return;
  const note=current(),group=note&&groups(note.kind).find(g=>g[1]===(state.group||groups(note.kind)[0][1]))?.[1];
  if(!group||!STATUS.some(s=>s[0]===e.target.value))return;
  note.entries=note.entries||{};note.entries[group]=note.entries[group]||{text:'',evidence:''};
  note.entries[group].basis=e.target.value;api.save();
 });
}
return {init,render,copyText,prompts:PROMPTS,status:STATUS};
})();