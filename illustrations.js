/* StoryLab — diagramas explicativos das aulas.
   Cada figura é uma especificação declarativa ({type, title, caption, ...}) desenhada aqui em SVG.
   Vantagens: estilo único, cores do tema (claro/escuro), peso mínimo e funcionamento offline. */
window.StoryLabFigures=(()=>{
'use strict';
const W=480;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Quebra o texto em linhas de até `max` caracteres, sem cortar palavras
function wrap(text,max){
 const words=String(text??'').split(/\s+/).filter(Boolean),lines=[];let cur='';
 words.forEach(w=>{if(cur&&(cur+' '+w).length>max){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w});
 if(cur)lines.push(cur);
 return lines;
}
// Bloco de texto centrado (ou alinhado) em x,y, com linhas de altura `lh`
function text(str,x,y,{max=28,size=19,lh=null,cls='fig-t',anchor='middle',weight=null,valign='middle'}={}){
 const lines=wrap(str,max),h=lh||Math.round(size*1.25);
 const top=valign==='middle'?y-(lines.length-1)*h/2:y;
 return '<text class="'+cls+'" x="'+x+'" y="'+top+'" font-size="'+size+'" text-anchor="'+anchor+'" dominant-baseline="middle"'+(weight?' font-weight="'+weight+'"':'')+'>'+
  lines.map((l,i)=>'<tspan x="'+x+'" dy="'+(i?h:0)+'">'+esc(l)+'</tspan>').join('')+'</text>';
}
const lines=(str,max)=>wrap(str,max).length;
const box=(x,y,w,h,cls='fig-box',r=14)=>'<rect class="'+cls+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'"/>';
const arrow=(x1,y1,x2,y2)=>'<line class="fig-line" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" marker-end="url(#fig-arrow)"/>';
const DEFS='<defs><marker id="fig-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fig-tip" d="M0 0L10 5L0 10z"/></marker></defs>';
const tone=i=>'fig-tone'+(i%4);

// ── Tipos de diagrama ──
const T={
 // Etapas em sequência (de cima para baixo)
 flow(f){
  const steps=f.steps||[];let y=12,out='';
  steps.forEach((s,i)=>{
   const h=Math.max(70,28+lines(s.t,30)*23+(s.d?lines(s.d,42)*21+6:0));
   out+=box(40,y,W-80,h,'fig-box '+tone(i))+'<circle class="fig-dot '+tone(i)+'" cx="40" cy="'+(y+h/2)+'" r="17"/>'+text(String(i+1),40,y+h/2,{size:16,cls:'fig-n',weight:800});
   const th=lines(s.t,30)*23,dh=s.d?lines(s.d,42)*21+6:0,top=y+(h-th-dh)/2+12;
   out+=text(s.t,W/2+8,top,{max:30,size:19,lh:23,weight:700,valign:'top'});
   if(s.d)out+=text(s.d,W/2+8,top+th+4,{max:42,size:16,lh:21,cls:'fig-d',valign:'top'});
   y+=h;
   if(i<steps.length-1){out+=arrow(W/2,y+3,W/2,y+29);y+=34}
  });
  return [out,y+12];
 },
 // Ciclo: etapas que se realimentam
 cycle(f){
  const n=(f.steps||[]).length,cx=W/2,cy=250,R=165,rr=62;let out='<circle class="fig-ring" cx="'+cx+'" cy="'+cy+'" r="'+R+'"/>';
  f.steps.forEach((s,i)=>{
   const a=-Math.PI/2+i*2*Math.PI/n,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
   const b=a+Math.PI/n,ax=cx+R*Math.cos(b),ay=cy+R*Math.sin(b);
   out+='<path class="fig-tip" transform="translate('+ax.toFixed(1)+' '+ay.toFixed(1)+') rotate('+(b*180/Math.PI+90).toFixed(1)+')" d="M-9 -7L5 0L-9 7z"/>';
   out+='<circle class="fig-node '+tone(i)+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rr+'"/>'+text(s.t,x,y,{max:12,size:16,lh:19,weight:700});
  });
  if(f.center)out+=text(f.center,cx,cy,{max:16,size:17,cls:'fig-d',weight:700});
  return [out,cy+R+rr+14];
 },
 // Pirâmide (ou pirâmide invertida): camadas de importância
 pyramid(f){
  const L=f.layers||[],n=L.length,H=n*84,top=14,inv=!!f.inverted;let out='';
  L.forEach((l,i)=>{
   const y0=top+i*84,y1=y0+84,w=k=>inv?(W-60)*(1-k/n*0.82):(W-60)*(0.18+k/n*0.82);
   const wa=w(i),wb=w(i+1),xa=(W-wa)/2,xb=(W-wb)/2;
   out+='<path class="fig-box '+tone(i)+'" d="M'+xa+' '+y0+'H'+(xa+wa)+'L'+(xb+wb)+' '+y1+'H'+xb+'Z"/>';
   const wmin=Math.min(wa,wb),max=Math.max(10,Math.floor(wmin/11));
   out+=text(l.t,W/2,y0+(l.d?30:42),{max,size:18,weight:700});
   if(l.d)out+=text(l.d,W/2,y0+58,{max:Math.max(12,Math.floor(wmin/9)),size:14,cls:'fig-d'});
  });
  return [out,top+H+14];
 },
 // Comparação em duas colunas
 compare(f){
  const rows=f.rows||[],cw=(W-50)/2;let y=10,out=box(20,y,cw-5,56,'fig-box fig-tone0')+box(W/2+5,y,cw-5,56,'fig-box fig-tone1')+
   text(f.a,20+(cw-5)/2,y+28,{max:19,size:18,weight:800})+text(f.b,W/2+5+(cw-5)/2,y+28,{max:19,size:18,weight:800});
  y+=66;
  rows.forEach(r=>{
   if(r.label){out+=text(r.label,W/2,y+12,{max:60,size:14,cls:'fig-k',weight:800});y+=26}
   const h=Math.max(lines(r.a,22),lines(r.b,22))*21+26;
   out+=box(20,y,cw-5,h,'fig-cell')+box(W/2+5,y,cw-5,h,'fig-cell')+text(r.a,20+(cw-5)/2,y+h/2,{max:22,size:16,lh:21})+text(r.b,W/2+5+(cw-5)/2,y+h/2,{max:22,size:16,lh:21});
   y+=h+10;
  });
  return [out,y+4];
 },
 // Matriz 2×2 com eixos
 matrix(f){
  const c=f.cells||[],x0=56,y0=20,s=(W-x0-24)/2;let out='';
  c.slice(0,4).forEach((q,i)=>{
   const x=x0+(i%2)*(s+10),y=y0+Math.floor(i/2)*(s+10);
   out+=box(x,y,s,s,'fig-box '+tone(i))+text(q.t,x+s/2,y+(q.d?s*0.32:s/2),{max:16,size:18,weight:800});
   if(q.d)out+=text(q.d,x+s/2,y+s*0.66,{max:21,size:15,lh:20,cls:'fig-d'});
  });
  const ax=f.x||[],ay=f.y||[];
  out+=arrow(x0,y0+2*s+26,x0+2*s+10,y0+2*s+26)+text(ax[0]||'',x0,y0+2*s+50,{size:14,cls:'fig-k',anchor:'start',max:30})+text(ax[1]||'',x0+2*s+10,y0+2*s+50,{size:14,cls:'fig-k',anchor:'end',max:30});
  out+=arrow(x0-24,y0+2*s+10,x0-24,y0)+'<g transform="rotate(-90 '+(x0-44)+' '+(y0+s)+')">'+text((ay[0]||'')+'  →  '+(ay[1]||''),x0-44,y0+s,{size:14,cls:'fig-k',max:60})+'</g>';
  return [out,y0+2*s+70];
 },
 // Linha do tempo vertical
 timeline(f){
  const ev=f.events||[];let y=24,out='';const x=116;
  const parts=ev.map(e=>{const h=Math.max(58,lines(e.t,30)*22+(e.d?lines(e.d,36)*20:0)+18);return h});
  const total=parts.reduce((a,b)=>a+b+14,0);
  out+='<line class="fig-axis" x1="'+x+'" y1="14" x2="'+x+'" y2="'+(24+total)+'"/>';
  ev.forEach((e,i)=>{
   const h=parts[i];
   out+='<circle class="fig-dot '+tone(i)+'" cx="'+x+'" cy="'+(y+20)+'" r="11"/>'+text(e.when,x-22,y+20,{size:15,anchor:'end',weight:800,cls:'fig-k',max:11});
   out+=text(e.t,x+24,y+14,{size:18,anchor:'start',max:30,lh:22,weight:700,valign:'top'});
   if(e.d)out+=text(e.d,x+24,y+14+lines(e.t,30)*22,{size:15,anchor:'start',max:36,lh:20,cls:'fig-d',valign:'top'});
   y+=h+14;
  });
  return [out,y+6];
 },
 // Espectro: um contínuo entre dois polos
 spectrum(f){
  const m=f.marks||[],x0=30,x1=W-30,y=120;let out='<defs><linearGradient id="fig-grad"><stop offset="0" class="fig-stop0"/><stop offset="1" class="fig-stop1"/></linearGradient></defs>';
  out+='<rect x="'+x0+'" y="'+(y-14)+'" width="'+(x1-x0)+'" height="28" rx="14" fill="url(#fig-grad)"/>';
  out+=text(f.from,x0,y+50,{size:16,anchor:'start',weight:800,max:18})+text(f.to,x1,y+50,{size:16,anchor:'end',weight:800,max:18});
  m.forEach((k,i)=>{const x=x0+(x1-x0)*Math.min(1,Math.max(0,k.at)),up=i%2===0;
   out+='<line class="fig-line" x1="'+x+'" y1="'+(y-16)+'" x2="'+x+'" y2="'+(up?y-40:y+82)+'"/><circle class="fig-dot '+tone(i)+'" cx="'+x+'" cy="'+y+'" r="8"/>'+
    text(k.t,Math.min(x1-44,Math.max(x0+44,x)),up?y-62:y+104,{size:15,max:13,lh:18})});
  return [out,y+150];
 },
 // Centro e ramificações
 hub(f){
  const n=(f.nodes||[]).length,cx=W/2,cy=205,R=150;let out='';
  f.nodes.forEach((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a)*0.92;
   out+='<line class="fig-line" x1="'+cx+'" y1="'+cy+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'"/>'+box(x-72,y-34,144,68,'fig-box '+tone(i))+text(s.t,x,y,{max:13,size:16,lh:19,weight:700})});
  out+='<circle class="fig-core" cx="'+cx+'" cy="'+cy+'" r="60"/>'+text(f.center,cx,cy,{max:10,size:18,weight:800,cls:'fig-tc'});
  return [out,cy+R*0.92+50];
 },
 // Diagrama de Venn (2 ou 3 conjuntos)
 venn(f){
  const s=f.sets||[],three=s.length>2,cy=three?200:180,r=three?108:118;let out='';
  const pos=three?[[W/2-72,cy-40],[W/2+72,cy-40],[W/2,cy+85]]:[[W/2-75,cy],[W/2+75,cy]];
  s.slice(0,3).forEach((t,i)=>{const [x,y]=pos[i];out+='<circle class="fig-venn '+tone(i)+'" cx="'+x+'" cy="'+y+'" r="'+r+'"/>';
   const lx=three?[x-45,x+45,x][i]:(i?x+45:x-45),ly=three?[y-35,y-35,y+52][i]:y;out+=text(t,lx,ly,{max:12,size:16,lh:19,weight:700})});
  if(f.center)out+=text(f.center,W/2,three?cy+15:cy,{max:10,size:15,cls:'fig-k',weight:800});
  return [out,(three?cy+85+r:cy+r)+16];
 },
 // Camadas concêntricas (de fora para dentro)
 layers(f){
  const L=f.layers||[],n=L.length,cx=W/2,cy=200,R0=188;let out='';
  L.forEach((l,i)=>{const r=R0-i*(R0-55)/Math.max(1,n-1)*(n>1?1:0);out+='<circle class="fig-node '+tone(i)+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>'});
  L.forEach((l,i)=>{const r=R0-i*(R0-55)/Math.max(1,n-1),next=i<n-1?R0-(i+1)*(R0-55)/Math.max(1,n-1):0,y=i<n-1?cy-(r+next)/2:cy;
   out+=text(l.t,cx,y,{max:i<n-1?26:12,size:i<n-1?16:17,weight:700})});
  return [out,cy+R0+14];
 },
 // Escalas de plano: quadros encaixados do mais aberto ao mais fechado
 frames(f){
  const L=f.frames||[],n=L.length;let out='',x=14,y=14,w=W-28,h=320;
  L.forEach((l,i)=>{out+=box(x,y,w,h,'fig-frame '+tone(i),6)+text(l.t,x+12,y+20,{size:15,anchor:'start',weight:800,cls:'fig-k',max:30});
   if(l.d&&i===n-1)out+=text(l.d,x+w/2,y+h/2+10,{size:15,max:Math.floor(w/9),cls:'fig-d'});
   const dx=w*0.13,dy=h*0.13;x+=dx;y+=dy+10;w-=2*dx;h-=2*dy+10});
  return [out,348];
 },
 // Regra dos terços: quadro 3×3 com pontos de interesse
 thirds(f){
  const x0=14,y0=14,w=W-28,h=(W-28)*9/16;let out=box(x0,y0,w,h,'fig-frame fig-tone0',6);
  [1,2].forEach(k=>{out+='<line class="fig-grid" x1="'+(x0+w*k/3)+'" y1="'+y0+'" x2="'+(x0+w*k/3)+'" y2="'+(y0+h)+'"/><line class="fig-grid" x1="'+x0+'" y1="'+(y0+h*k/3)+'" x2="'+(x0+w)+'" y2="'+(y0+h*k/3)+'"/>'});
  if(f.horizon)out+='<line class="fig-line" x1="'+x0+'" y1="'+(y0+h*2/3)+'" x2="'+(x0+w)+'" y2="'+(y0+h*2/3)+'"/>'+text(f.horizon,x0+10,y0+h*2/3+18,{size:13,anchor:'start',cls:'fig-k',max:40});
  (f.points||[]).forEach((p,i)=>{const px=x0+w*(p.col===2?2/3:1/3),py=y0+h*(p.row===2?2/3:1/3);
   out+='<circle class="fig-dot '+tone(i+1)+'" cx="'+px+'" cy="'+py+'" r="13"/>'+text(p.t,px,py-34,{size:15,max:18,weight:700})});
  return [out,y0+h+16];
 },
 // Barras horizontais com base zero (visualização honesta)
 bars(f){
  const it=f.items||[],max=Math.max(...it.map(i=>Number(i.v)||0),1),x0=150,x1=W-64;let y=14,out='';
  it.forEach((b,i)=>{const w=(x1-x0)*(Number(b.v)||0)/max;out+=text(b.t,x0-10,y+20,{size:15,anchor:'end',max:17})+box(x0,y+4,Math.max(2,w),32,'fig-box '+tone(i),6)+text(String(b.v)+(f.unit?' '+f.unit:''),x0+w+8,y+20,{size:15,anchor:'start',weight:800,max:14});y+=48});
  out+='<line class="fig-axis" x1="'+x0+'" y1="6" x2="'+x0+'" y2="'+(y+2)+'"/>';
  if(f.note)out+=text(f.note,W/2,y+24,{size:14,cls:'fig-k',max:56});
  return [out,y+(f.note?44:12)];
 }
};
const TYPES=Object.keys(T);

function svg(f){
 const draw=T[f&&f.type];if(!draw)return '';
 const [body,h]=draw(f);
 return '<svg class="fig-svg" viewBox="0 0 '+W+' '+Math.ceil(h)+'" role="img" aria-label="'+esc(f.title)+'" xmlns="http://www.w3.org/2000/svg">'+DEFS+body+'</svg>';
}
function render(f){
 const s=svg(f);if(!s)return '';
 return '<figure class="fig"><div class="fig-head"><span class="eyebrow">ESQUEMA</span><strong>'+esc(f.title)+'</strong></div>'+s+(f.caption?'<figcaption>'+esc(f.caption)+'</figcaption>':'')+'</figure>';
}
return {render,svg,wrap,TYPES};
})();
