/* StoryLab v2.20 · O núcleo: verbos, escalas coerentes e medidas orientadas. */
window.StoryLabPrecision=(()=>{
'use strict';
let api=null;
const state={family:'composicao',verb:0,scale:'dimensao',step:2,shape:'caixa',measure:'altura'};
const data=()=>window.STORYLAB_PRECISION_DATA||{verbs:[],scales:[],independent:[],qualifiers:[]};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(act,content,id,css='')=>'<button type="button" class="precision-btn '+css+'" data-precision="'+act+'" data-id="'+esc(id)+'">'+content+'</button>';
const heading=(eyebrow,title,desc)=>'<div class="precision-heading"><span class="trade-kicker">'+eyebrow+'</span><h2>'+title+'</h2><p>'+desc+'</p></div>';
const family=()=>data().verbs.find(x=>x[0]===state.family)||data().verbs[0];
function verbs(){
 const g=family();if(!g)return '';
 const v=g[2][state.verb]||g[2][0];
 return '<section class="precision-root">'+heading('VERBOS · AÇÃO E RELAÇÃO','O objeto ganha vida com os verbos.','Antes de traduzir, domine a ação, o referente, a preposição e o complemento em português. É isso que permite narrar composição, forma, movimento, funcionamento e avaliação.')+
 '<div class="precision-filters" role="group" aria-label="Famílias verbais">'+data().verbs.map(x=>button('family',esc(x[1]),x[0],x[0]===g[0]?'selected':'')).join('')+'</div>'+
 '<div class="precision-layout"><nav class="precision-wordlist" aria-label="Verbos desta família">'+g[2].map((x,i)=>button('verb','<small>VERBO '+(i+1)+'</small><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span>',String(i),'precision-word'+(i===state.verb?' selected':''))).join('')+'</nav>'+
 '<article class="precision-detail"><span class="trade-kicker">PORTUGUÊS / '+esc(g[1])+'</span><h3>'+esc(v[0])+'</h3><p>'+esc(v[8])+'</p>'+
 '<div class="precision-quote"><small>EM CONTEXTO</small><p>'+esc(v[4])+'</p></div>'+
 '<div class="precision-parts" role="group" aria-label="Sintaxe em português">'+[v[5],v[6],v[7]].map((x,i)=>'<div><small>'+['REFERENTE','VERBO E REGÊNCIA','COMPLEMENTO'][i]+'</small><strong>'+esc(x)+'</strong></div>').join('<span aria-hidden="true" class="precision-part-arrow">→</span>')+'</div>'+
 '<div class="precision-rule"><small>REGRA DE CONSTRUÇÃO</small><p>'+esc(v[9])+'</p></div>'+
 '<div class="precision-translation"><div><small>INGLÊS · TRADUÇÃO</small><strong lang="en">'+esc(v[1])+'</strong>'+button('speak','▶ Ouvir',g[0]+':'+state.verb+':en')+'</div>'+
 '<div><small>MANDARIM · TRADUÇÃO</small><strong lang="zh-CN">'+esc(v[2])+'</strong><em>'+esc(v[3])+'</em>'+button('speak','▶ Ouvir',g[0]+':'+state.verb+':zh')+'</div></div>'+
 button('copy','Copiar estrutura trilingue',g[0]+':'+state.verb)+'</article></div></section>';
}
function scales(){
 const s=data().scales.find(x=>x.id===state.scale)||data().scales[0];if(!s)return '';
 const index=Math.max(0,Math.min(4,state.step)),word=s.steps[index];
 return '<section class="precision-root">'+heading('ADJETIVOS · UM EIXO DE CADA VEZ','Escalas que não confundem conceitos.','A gradação só é válida quando os graus descrevem a mesma propriedade, em condições comparáveis. Compacto não é o meio do caminho entre pequeno e grande; maciço não é sinônimo de duro.')+
 '<div class="precision-filters" role="group" aria-label="Propriedades para graduar">'+data().scales.map(x=>button('scale',esc(x.title),x.id,x.id===s.id?'selected':'')).join('')+'</div>'+
 '<article class="precision-detail"><span class="trade-kicker">PROPRIEDADE / '+esc(s.axis)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.context)+'</p>'+
 '<div class="precision-spectrum" role="group" aria-label="Graus da escala">'+s.steps.map((x,i)=>button('step','<small>GRAU '+(i+1)+'</small><strong>'+esc(x[0])+'</strong>',String(i),'precision-degree'+(index===i?' selected':''))).join('')+'</div>'+
 '<div class="precision-scale-focus"><span class="trade-kicker">GRAU '+(index+1)+' / 5</span><strong>'+esc(word[0])+'</strong><span lang="en">EN · '+esc(word[1])+'</span><span lang="zh-CN">中文 · '+esc(word[2])+'</span></div>'+
 '<div class="precision-rule"><small>ATENÇÃO À DISTINÇÃO</small><p>'+esc(s.caution)+'</p></div></article>'+
 '<div class="precision-subsection"><span class="trade-kicker">EIXOS DIFERENTES, NÃO DEGRAUS DA MESMA ESCALA</span><h3>Não misture o que a palavra mede.</h3><div class="precision-pair-grid">'+data().independent.map(x=>'<article><small>'+esc(x[0])+'</small><strong>'+esc(x[1])+'</strong><p>'+esc(x[2])+'</p></article>').join('')+'</div></div>'+
 '<div class="precision-subsection"><span class="trade-kicker">QUALIFICADORES E FONTES</span><h3>Uma palavra de intensidade também precisa de contexto.</h3><div class="precision-qualifier-grid">'+data().qualifiers.map(x=>'<div><small>'+esc(x[0])+'</small><strong>'+esc(x[1])+'</strong><span lang="en">'+esc(x[2])+'</span><span lang="zh-CN">'+esc(x[3])+'</span></div>').join('')+'</div></div></section>';
}
const measures=[
 ['altura','Altura','Eixo vertical da base ao ponto superior, conforme a posição adotada.'],
 ['largura','Largura','Extensão transversal, em geral percebida na vista frontal.'],
 ['comprimento','Comprimento','Extensão longitudinal, conforme a direção de referência adotada.'],
 ['profundidade','Profundidade','Extensão da frente ao fundo; a referência precisa ser declarada.'],
 ['espessura','Espessura','Distância entre faces locais de uma peça, não a dimensão total do objeto.'],
 ['massa','Massa','Grandeza física, expressa em g ou kg, que não corresponde a uma seta espacial.']
];
function svg(shape,metric){
 const a='#9ed1c0',hi='#ffd293',muted='#b5c9c4';
 const col=k=>k===metric?hi:a;
 const ln=(x,y,x2,y2,k)=>'<line x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col(k)+'" stroke-width="3" marker-start="url(#pr-arrow)" marker-end="url(#pr-arrow)"/>';
 const txt=(x,y,s,color=muted,size=14)=>'<text x="'+x+'" y="'+y+'" fill="'+color+'" font-size="'+size+'" font-family="system-ui,sans-serif" font-weight="700">'+s+'</text>';
 let body='';
 if(shape==='veiculo'){
  body='<path d="M108 245 L161 230 L229 170 Q245 155 281 155 L362 155 Q390 157 418 200 L480 225 Q510 237 520 260 L520 285 L110 285 Z" fill="#35635a" stroke="#aecfc4" stroke-width="3"/>'+
  '<path d="M249 170 L360 170 L402 213 L212 213 Z" fill="#1c4140" stroke="#aecfc4" stroke-width="2"/>'+
  '<circle cx="196" cy="276" r="36" fill="#112b2d" stroke="#aecfc4" stroke-width="6"/><circle cx="444" cy="276" r="36" fill="#112b2d" stroke-width="6"/>'+
  ln(116,338,516,338,'comprimento')+txt(265,368,'COMPRIMENTO',col('comprimento'))+
  ln(84,158,84,293,'altura')+txt(16,222,'ALTURA',col('altura'))+
  txt(177,110,'LARGURA: utilizar vista frontal',col('largura'),13);
 }else if(shape==='placa'){
  body='<path d="M222 112 L442 155 L414 293 L194 250 Z" fill="#39645e" stroke="#b1d6ca" stroke-width="3"/>'+
  '<path d="M222 112 L234 100 L454 143 L442 155 Z" fill="#5c8980" stroke="#b1d6ca" stroke-width="2"/>'+
  '<path d="M442 155 L454 143 L426 280 L414 293 Z" fill="#234b45" stroke="#b1d6ca" stroke-width="2"/>'+
  ln(212,70,442,111,'largura')+txt(287,54,'LARGURA',col('largura'))+
  ln(166,112,138,253,'altura')+txt(57,210,'ALTURA',col('altura'))+
  ln(470,150,458,162,'espessura')+txt(466,132,'ESPESSURA',col('espessura'),13);
 }else if(shape==='cilindro'){
  body='<ellipse cx="318" cy="131" rx="111" ry="42" fill="#5a877a" stroke="#bbd9cd" stroke-width="3"/>'+
  '<path d="M207 131 V286 A111 42 0 0 0 429 286 V131" fill="#355e56" stroke="#bbd9cd" stroke-width="3"/>'+
  '<ellipse cx="318" cy="286" rx="111" ry="42" fill="none" stroke="#bbd9cd" stroke-width="2" stroke-dasharray="7 8"/>'+
  ln(180,133,180,287,'altura')+txt(49,225,'ALTURA',col('altura'))+
  ln(210,76,427,76,'largura')+txt(258,60,'DIÂMETRO',col('largura'));
 }else{
  body='<path d="M153 154 L350 154 L458 91 L261 91 Z" fill="#4c796d" stroke="#b1d7cb" stroke-width="2"/>'+
  '<path d="M350 154 L458 91 L458 245 L350 309 Z" fill="#254c46" stroke="#b1d7cb" stroke-width="2"/>'+
  '<path d="M153 154 H350 V309 H153 Z" fill="#365f58" stroke="#b1d7cb" stroke-width="2"/>'+
  ln(153,341,350,341,metric==='comprimento'?'comprimento':'largura')+
  txt(199,371,metric==='comprimento'?'COMPRIMENTO':'LARGURA',col(metric==='comprimento'?'comprimento':'largura'),13)+
  ln(124,154,124,309,'altura')+txt(18,234,'ALTURA',col('altura'))+
  ln(377,141,485,79,'profundidade')+txt(463,59,'PROFUNDIDADE',col('profundidade'),12);
 }
 if(metric==='massa')body+='<g stroke="#ffd293" stroke-width="3" fill="none"><path d="M557 212 V307 M522 307 H593 M523 239 H591 M523 239 L508 272 H539 Z M591 239 L575 272 H606 Z"/></g>'+txt(523,333,'MASSA (g, kg)',hi,12);
 if(metric==='espessura'&&shape!=='placa')body+='<path d="M500 270 H565 L571 285 H506 Z" fill="#699e90" stroke="#bbd9cd" stroke-width="2"/>'+ln(586,270,586,285,'espessura')+txt(495,319,'ESPESSURA / CORTE',hi,11);
 return '<svg viewBox="0 0 650 400" role="img" aria-label="Esquema de '+esc(shape)+' destacando '+esc(measures.find(m=>m[0]===metric)?.[1]||metric)+'" xmlns="http://www.w3.org/2000/svg">'+
 '<defs><marker id="pr-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="none" stroke="#b1d7cb" stroke-width="2"/></marker></defs>'+
 '<rect x="1" y="1" width="648" height="398" rx="16" fill="#142b2b" stroke="#517f71" stroke-width="2"/>'+
 txt(25,27,'ILUSTRAÇÃO · ORIENTAÇÃO, NÃO ESCALA REAL','#c8dfd7',12)+body+'</svg>';
}
function diagram(compact=false){
 const types=[['caixa','Objeto volumétrico'],['placa','Objeto plano'],['veiculo','Veículo / perfil'],['cilindro','Corpo cilíndrico']];
 const m=measures.find(x=>x[0]===state.measure)||measures[0];
 const warning=state.measure==='massa'?'Massa exige balança: não é distância no espaço.':
 state.shape==='veiculo'&&state.measure==='largura'?'Largura exige vista frontal: o perfil não a revela.':
 state.shape==='caixa'&&state.measure==='comprimento'?'Comprimento e largura em uma caixa dependem da orientação declarada.':
 state.measure==='espessura'?'Espessura é local: examine as duas faces na seção escolhida.':
 'Referências mudam conforme a orientação e o tipo de objeto.';
 return '<div class="precision-diagram'+(compact?' compact':'')+'"><div class="precision-diagram-head"><span class="trade-kicker">GEOMETRIA E GRANDEZAS</span><h3>Onde medimos cada coisa?</h3><p>Um esquema didático para identificar a direção, não para representar números de um produto real.</p></div>'+
 '<div class="precision-diagram-actions"><div role="group" aria-label="Tipo de objeto">'+types.map(x=>button('shape',esc(x[1]),x[0],x[0]===state.shape?'selected':'')).join('')+'</div>'+
 '<div role="group" aria-label="Grandeza a destacar">'+measures.map(x=>button('measure',esc(x[1]),x[0],x[0]===state.measure?'selected':'')).join('')+'</div></div>'+
 '<div class="precision-diagram-columns"><div class="precision-svg">'+svg(state.shape,state.measure)+'</div><div class="precision-dimension-info"><span class="trade-kicker">GRANDEZA SELECIONADA</span><h4>'+esc(m[1])+'</h4><p>'+esc(m[2])+'</p><div class="precision-rule"><small>LEITURA CORRETA</small><p>'+esc(warning)+'</p></div><p class="precision-footnote">Declare unidade, ponto de referência, método e se o valor foi observado, medido ou informado por terceiros.</p></div></div></div>';
}
function measurements(){
 return '<section class="precision-root">'+heading('MEDIR · DESCREVER COM REFERÊNCIA','A dimensão depende do olhar e do eixo.','Altura, largura, comprimento, profundidade e espessura são grandezas espaciais. Massa é outra propriedade. As ilustrações tornam essa diferença visível.')+diagram()+'</section>';
}
function init(context){
 api=context;
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-precision]');if(!b)return;
  e.preventDefault();const act=b.dataset.precision,id=b.dataset.id||'';
  if(act==='family'&&data().verbs.some(x=>x[0]===id)){state.family=id;state.verb=0;api.render();return}
  if(act==='verb'){const n=Number(id);if(Number.isInteger(n)&&n>=0&&n<(family()?.[2].length||0)){state.verb=n;api.render()}return}
  if(act==='scale'&&data().scales.some(s=>s.id===id)){state.scale=id;state.step=2;api.render();return}
  if(act==='step'){const n=Number(id);if(Number.isInteger(n)&&n>=0&&n<5){state.step=n;api.render()}return}
  if(act==='shape'&&['caixa','placa','veiculo','cilindro'].includes(id)){state.shape=id;api.render();return}
  if(act==='measure'&&measures.some(x=>x[0]===id)){state.measure=id;api.render();return}
  if(act==='speak'||act==='copy'){
   const [familyId,index,lang]=id.split(':'),v=data().verbs.find(x=>x[0]===familyId)?.[2][Number(index)];if(!v)return;
   if(act==='copy')api.copy([v[0],v[4],v[9],'EN: '+v[1],'中文: '+v[2],v[3]].join('\n'));
   else if(lang==='en')api.say(v[1],'en-US');
   else if(lang==='zh')api.say(v[2],'zh-CN');
  }
 });
}
return {init,verbs,scales,measurements,diagram,svg};
})();