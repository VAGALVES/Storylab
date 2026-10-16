/* StoryLab v2.22 · sete representações didáticas distintas.
   Os SVGs ensinam o eixo de comparação, jamais alegam grandeza medida. */
window.StoryLabScaleDiagrams=(()=>{
 'use strict';
 const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const colors={bg:'#16322f',line:'#b2d0c4',hi:'#f8c985',surface:'#56877a',dark:'#224844'};
 const text=(x,y,str,color=colors.line,size=11)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-family="system-ui,sans-serif" font-weight="750" fill="'+color+'" text-anchor="middle">'+safe(str)+'</text>';
 function sample(id,index,x){
  const n=index+1,c=colors;
  if(id==='dimensao'){
   const size=21+n*14,y=142-size;
   return '<rect x="'+(x+56-size/2)+'" y="'+y+'" width="'+size+'" height="'+size+'" rx="6" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="3"/>';
  }
  if(id==='massa'){
   const weight=n*4;
   return '<rect x="'+(x+27)+'" y="84" width="58" height="58" rx="8" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="2"/>'+
    '<path d="M'+(x+56)+' 82 V'+(82-weight)+'" stroke="'+c.hi+'" stroke-width="5" stroke-linecap="round"/>'+
    '<path d="M'+(x+48)+' '+(90-weight)+' L'+(x+56)+' '+(79-weight)+' L'+(x+64)+' '+(90-weight)+'" fill="none" stroke="'+c.hi+'" stroke-width="3"/>';
  }
  if(id==='firmeza'){
   const indent=n*5;
   return '<path d="M'+(x+15)+' 116 Q'+(x+27)+' 105 '+(x+39)+' 116 Q'+(x+56)+' '+(116+indent)+' '+(x+73)+' 116 Q'+(x+86)+' 105 '+(x+99)+' 116 V145 H'+(x+15)+' Z" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="2"/>'+
    '<path d="M'+(x+56)+' 59 V96" stroke="'+c.hi+'" stroke-width="4"/>'+
    '<path d="M'+(x+45)+' 86 L'+(x+56)+' 101 L'+(x+67)+' 86" fill="none" stroke="'+c.hi+'" stroke-width="3"/>';
  }
  if(id==='flexao'){
   const drop=(6-n)*9;
   return '<circle cx="'+(x+13)+'" cy="99" r="8" fill="'+c.hi+'"/>'+
    '<path d="M'+(x+16)+' 98 Q'+(x+58)+' '+(98+drop*1.7)+' '+(x+102)+' 98" fill="none" stroke="'+c.line+'" stroke-width="10" stroke-linecap="round"/>'+
    '<path d="M'+(x+58)+' 34 V66" stroke="'+c.hi+'" stroke-width="3"/><path d="M'+(x+49)+' 58 L'+(x+58)+' 69 L'+(x+67)+' 58" fill="none" stroke="'+c.hi+'" stroke-width="3"/>';
  }
  if(id==='rugosidade'){
   const top=105;
   let d='M'+(x+10)+' '+top;
   for(let j=0;j<14;j++){
    const xx=x+10+j*7;
    d+=' L'+xx+' '+(top-(j%2?0:index*5));
   }
   return '<path d="'+d+' L'+(x+105)+' 142 H'+(x+10)+' Z" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="2"/>';
  }
  if(id==='brilho'){
   const count=index;
   let streaks='';
   for(let j=0;j<count;j++)streaks+='<path d="M'+(x+19+j*18)+' 82 L'+(x+30+j*18)+' 111" stroke="'+c.hi+'" stroke-width="'+(2+index*.5)+'" stroke-linecap="round" opacity=".9"/>';
   return '<rect x="'+(x+9)+'" y="67" width="98" height="70" rx="8" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="2"/>'+streaks;
  }
  if(id==='espessura'){
   const thick=5+n*8;
   return '<rect x="'+(x+19)+'" y="'+(129-thick)+'" width="77" height="'+thick+'" rx="2" fill="'+c.surface+'" stroke="'+c.line+'" stroke-width="3"/>'+
    '<path d="M'+(x+100)+' '+(129-thick)+' V129" stroke="'+c.hi+'" stroke-width="2"/>';
  }
  return '';
 }
 const summary={
  dimensao:'Cinco corpos da mesma classe, desenhados com extensão crescente e referência de chão.',
  massa:'Os cinco corpos são visualmente iguais. O símbolo de carga não comprova sua massa: pesar exige balança.',
  firmeza:'Superfície sob pressão conceitualmente comparável. A deformação do desenho não é ensaio de dureza.',
  flexao:'Mesma geometria sob ação ilustrada. Quanto maior a curvatura, maior a flexibilidade sugerida; força não calibrada.',
  rugosidade:'Relevo esquemático crescente. Rugosidade real exigiria método e grandeza específicos.',
  brilho:'Reflexos concentrados ilustrativos sob a mesma luz. Brilho não define opacidade nem material.',
  espessura:'Seções da mesma família com distância entre faces crescente. Sem valores ou unidades atribuídos.'
 };
 function render(scale,active){
  const id=scale?.id;if(!Object.hasOwn(summary,id))return '';
  const steps=scale.steps||[];const parts=[];
  for(let i=0;i<5;i++){
   const x=12+i*120;
   parts.push('<g><rect x="'+x+'" y="15" width="114" height="165" rx="12" fill="'+(i===active?'#28534a':'#1b3b38')+'" stroke="'+(i===active?colors.hi:'#517b70')+'" stroke-width="'+(i===active?3:1)+'"/>'+
    text(x+57,35,'GRAU '+(i+1),i===active?colors.hi:colors.line,11)+
    sample(id,i,x)+text(x+57,165,i===active?'SELECIONADO':'',colors.hi,9)+'</g>');
  }
  return '<figure class="precision-visual-scale"><figcaption><span class="trade-kicker">VISUALIZAR O EIXO / '+safe(scale.title)+'</span><p>'+safe(summary[id])+'</p></figcaption>'+
    '<svg viewBox="0 0 626 197" role="img" aria-label="Cinco exemplos conceituais, grau '+(active+1)+' selecionado, de '+safe(scale.title)+'" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="1" y="1" width="624" height="195" rx="14" fill="'+colors.bg+'"/>'+parts.join('')+'</svg>'+
    '<p class="precision-visual-disclaimer">Esquema qualitativo para aprendizagem da palavra. Não expressa uma medição de produto nem intervalos numericamente iguais.</p></figure>';
 }
 return {render,summary};
})();