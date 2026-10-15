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
  const L=f.layers||[],n=L.length,H=n*94,top=14,inv=!!f.inverted;let out='';
  L.forEach((l,i)=>{
   const y0=top+i*94,y1=y0+94,w=k=>inv?(W-60)*(1-k/n*0.58):(W-60)*(0.42+k/n*0.58);
   const wa=w(i),wb=w(i+1),xa=(W-wa)/2,xb=(W-wb)/2;
   out+='<path class="fig-box '+tone(i)+'" d="M'+xa+' '+y0+'H'+(xa+wa)+'L'+(xb+wb)+' '+y1+'H'+xb+'Z"/>';
   const wmin=Math.min(wa,wb),max=Math.max(13,Math.floor(wmin/10.5));
   out+=text(l.t,W/2,y0+(l.d?31:47),{max,size:16,weight:700});
   if(l.d)out+=text(l.d,W/2,y0+65,{max:Math.max(13,Math.floor(wmin/9.5)),size:13,cls:'fig-d'});
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

 // Escada: degraus crescentes (níveis de dificuldade, etapas de aprofundamento)
 stairs(f,opts){
  const L=f.steps||[],n=L.length,bw=(W-40)/n,base=200;let out='';
  L.forEach((st,i)=>{const h=64+i*(110/Math.max(1,n-1)),x=20+i*bw,on=!!(opts&&opts.active!=null&&[].concat(opts.active).includes(st.t));
   out+='<rect class="fig-box '+(on?'fig-step-on':tone(i))+'" x="'+(x+2)+'" y="'+(base-h)+'" width="'+(bw-4)+'" height="'+h+'" rx="10"/>'+
    text(st.t,x+bw/2,base-h+24,{size:15,weight:800,max:11})+(st.d?text(st.d,x+bw/2,base-h+46,{size:13,cls:'fig-d',max:12}):'');});
  out+=arrow(24,base+22,W-24,base+22)+text(f.axis||'',W/2,base+42,{size:13,cls:'fig-k',max:60});
  return [out,base+56];
 },
 // Espectro: um contínuo entre dois polos
 spectrum(f,opts){
  // Curadoria: uma progressão qualitativa NÃO possui distâncias mensuradas.
  // Em vez do gradiente 0–100%, use cartões enumerados, sem falsa precisão.
  const marks=f.marks||[],n=marks.length;
  if(!n)return ['',110];
  const cols=Math.min(3,n),rows=Math.ceil(n/cols),gap=11,x0=16,w=(W-x0*2-gap*(cols-1))/cols;
  const maxChars=Math.max(9,Math.floor(w/8.4));
  const maxLines=Math.max(...marks.map(m=>lines(m.t,maxChars)));
  const rowH=Math.max(90,Math.min(145,40+maxLines*19)),rowGap=24;
  let out=text('PROGRESSÃO QUALITATIVA · SEM DISTÂNCIA NUMÉRICA',W/2,22,{size:12,cls:'fig-k',weight:800,max:60});
  marks.forEach((item,i)=>{
   const col=i%cols,row=Math.floor(i/cols),x=x0+col*(w+gap),y=43+row*(rowH+rowGap);
   const on=!!(opts&&opts.active===item.t),cls=on?'fig-box fig-stage-active':'fig-box '+tone(i);
   out+=box(x,y,w,rowH,cls,12);
   out+=text(String(i+1).padStart(2,'0'),x+16,y+18,{size:13,anchor:'start',weight:800,cls:on?'fig-stage-number fig-on':'fig-k'});
   out+=text(item.t,x+w/2,y+rowH/2+7,{max:maxChars,size:15,lh:19,weight:on?800:650});
   if(i<n-1&&col<cols-1)out+=arrow(x+w+1,y+rowH/2,x+w+gap-3,y+rowH/2);
  });
  const base=43+rows*rowH+(rows-1)*rowGap;
  out+=text('INÍCIO: '+(f.from||''),x0,base+18,{size:13,anchor:'start',cls:'fig-k',weight:650,max:29});
  out+=text('DESTINO: '+(f.to||''),W-x0,base+18,{size:13,anchor:'end',cls:'fig-k',weight:650,max:29});
  return [out,base+44];
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
 thirds(f,opts){
  const x0=14,y0=14,w=W-28,h=(W-28)*9/16;let out=box(x0,y0,w,h,'fig-frame fig-tone0',6);
  [1,2].forEach(k=>{out+='<line class="fig-grid" x1="'+(x0+w*k/3)+'" y1="'+y0+'" x2="'+(x0+w*k/3)+'" y2="'+(y0+h)+'"/><line class="fig-grid" x1="'+x0+'" y1="'+(y0+h*k/3)+'" x2="'+(x0+w)+'" y2="'+(y0+h*k/3)+'"/>'});
  if(f.horizon)out+='<line class="fig-line" x1="'+x0+'" y1="'+(y0+h*2/3)+'" x2="'+(x0+w)+'" y2="'+(y0+h*2/3)+'"/>'+text(f.horizon,x0+10,y0+h*2/3+18,{size:13,anchor:'start',cls:'fig-k',max:40});
  (f.points||[]).forEach((p,i)=>{const px=x0+w*(p.col===2?2/3:1/3),py=y0+h*(p.row===2?2/3:1/3);
   out+='<circle class="fig-dot '+tone(i+1)+'" cx="'+px+'" cy="'+py+'" r="13"/>'+text(p.t,px,py-34,{size:15,max:18,weight:opts&&opts.active===p.t?800:700,cls:opts&&opts.active===p.t?'fig-t fig-on':'fig-t'})});
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

// ── Anatomia: um desenho simples com as peças rotuladas pelos termos do Atlas ──
// Cada forma desenha em coordenadas locais (280 de largura) e declara pontos de ancoragem por nome.
const P=(d,c='fig-sh')=>'<path class="'+c+'" d="'+d+'"/>';
const R_=(x,y,w,h,c='fig-sh',r=0)=>'<rect class="'+c+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(r?' rx="'+r+'"':'')+'/>';
const L_=(x1,y1,x2,y2,c='fig-stroke')=>'<line class="'+c+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
const C_=(cx,cy,r,c='fig-sh')=>'<circle class="'+c+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>';
const SHAPES={
 // Fachada institucional: frontão, cornija, platibanda, marquise, vão, balaustrada, brise, embasamento
 facade:{h:290,anchors:{'frontão':[112,78],cornija:[206,103],platibanda:[14,157],marquise:[114,199],'vão':[94,145],balaustrada:[192,176],brise:[255,200],embasamento:[272,262]},
  svg:()=>L_(0,270,280,270)+R_(80,100,120,170)+R_(5,160,75,110)+R_(200,160,75,110)+
   P('M74 100L140 50L206 100Z','fig-sh2')+R_(74,98,132,10,'fig-sh2')+R_(5,152,75,10,'fig-sh2')+R_(200,152,75,10,'fig-sh2')+
   R_(5,252,270,18,'fig-sh3')+R_(122,210,36,42,'fig-dark')+R_(112,196,56,7,'fig-sh2')+L_(116,203,122,214)+L_(164,203,158,214)+
   R_(94,120,20,50,'fig-dark')+R_(166,120,20,50,'fig-dark')+R_(160,170,32,12,'fig-sh')+
   [164,170,176,182,188].map(x=>L_(x,170,x,182)).join('')+
   R_(25,185,30,47,'fig-dark')+R_(225,185,30,47,'fig-dark')+[191,197,203,209,215,221,227].map(y=>L_(225,y,255,y,'fig-slat')).join('')},
 // Vaso: rebordo, bocal, gargalo, bojo, asa, nervura, pedestal
 vessel:{h:300,anchors:{rebordo:[96,38],bocal:[160,35],gargalo:[106,64],bojo:[60,170],asa:[261,150],nervura:[218,172],pedestal:[96,272]},
  svg:()=>P('M105 40L105 85C70 105 55 150 60 195C62 235 85 258 100 262L180 262C195 258 218 235 220 195C225 150 210 105 175 85L175 40Z')+
   '<path class="fig-handle" d="M218 120C268 100 280 180 222 214"/>'+
   '<path class="fig-accent" d="M61 172Q140 194 219 172"/>'+
   R_(98,31,84,10,'fig-sh2',4)+'<ellipse class="fig-dark" cx="140" cy="36" rx="36" ry="5"/>'+R_(92,262,96,20,'fig-sh3',3)},
 // Casaco: lapela, pesponto, pence, aviamentos, arremate
 jacket:{h:300,anchors:{lapela:[98,96],pesponto:[166,92],pence:[104,205],aviamentos:[144,170],arremate:[76,262]},
  svg:()=>P('M85 50L195 50L205 270L75 270Z')+P('M85 50L45 72L30 232L56 238L76 116Z')+P('M195 50L235 72L250 232L224 238L204 116Z')+
   P('M112 50L140 152L118 152L95 96Z','fig-sh2')+P('M168 50L140 152L162 152L185 96Z','fig-sh2')+
   '<path class="fig-dash" d="M117 58L140 142"/><path class="fig-dash" d="M163 58L140 142"/>'+
   C_(140,172,4,'fig-dark')+C_(140,206,4,'fig-dark')+
   '<path class="fig-stroke" d="M104 168L112 168L108 226Z"/><path class="fig-stroke" d="M176 168L168 168L172 226Z"/>'+
   '<path class="fig-dash" d="M78 262L202 262"/>'},
 // Ave: crista, penacho, plumagem, dorso, ventre, garras
 bird:{h:290,anchors:{crista:[78,62],dorso:[168,106],penacho:[258,104],'plumagem':[152,152],ventre:[140,198],garras:[104,262]},
  svg:()=>'<path class="fig-sh2" d="M205 130C235 100 262 96 270 108C250 112 240 128 218 142Z"/><path class="fig-sh3" d="M208 138C238 128 264 134 272 152C248 150 236 156 214 154Z"/>'+
   '<ellipse class="fig-sh" cx="140" cy="150" rx="76" ry="50" transform="rotate(-12 140 150)"/>'+
   C_(80,102,24)+P('M57 98L38 106L57 112Z','fig-sh2')+C_(88,96,3,'fig-dark')+
   P('M66 82C62 66 70 60 74 70C76 58 86 58 86 74C92 66 98 72 92 84Z','fig-sh2')+
   '<path class="fig-accent" d="M120 148C150 118 190 128 198 156C170 170 138 168 120 148Z"/>'+
   L_(124,196,124,250)+L_(156,196,156,250)+
   [[124,250,104,262],[124,250,124,265],[124,250,144,262],[156,250,136,262],[156,250,156,265],[156,250,176,262]].map(a=>L_(a[0],a[1],a[2],a[3])).join('')+L_(60,270,220,270,'fig-ground')},
 // Corte de relevo: colina, encosta, sopé, várzea, ribanceira, espelho d'água, escarpa
 terrain:{h:290,anchors:{colina:[70,84],bosque:[46,102],encosta:[112,146],'sopé':[134,204],'várzea':[166,206],ribanceira:[204,208],"espelho d'água":[222,214],escarpa:[247,150]},
  svg:()=>P('M0 270L0 205C20 180 38 96 70 84C100 76 118 160 134 206L200 206C204 208 208 212 214 216L230 216C236 212 240 208 244 206L246 100L280 96L280 270Z','fig-earth')+
   R_(204,208,36,10,'fig-water')+
   [[28,128],[46,108],[60,150],[90,118]].map(a=>L_(a[0],a[1]+14,a[0],a[1]+2,'fig-trunk')+C_(a[0],a[1]-4,8,'fig-leaf')).join('')+
   [150,162,174,186].map(x=>'<path class="fig-grass" d="M'+x+' 206l-3-9M'+x+' 206l0-11M'+x+' 206l3-9"/>').join('')},
 // Perspectiva de vista: linha de cumeada, skyline, horizonte, ponto de fuga, bruma
 perspective:{h:260,anchors:{'linha de cumeada':[44,92],skyline:[222,104],horizonte:[8,128],'ponto de fuga':[140,128],bruma:[262,126]},
  svg:()=>R_(0,40,280,88,'fig-sky')+P('M0 128L0 96L30 80L58 98L90 72L124 104L150 86L180 110L204 90L238 112L280 94L280 128Z','fig-far')+
   P('M170 128L170 112L180 112L180 100L192 100L192 108L202 108L202 90L214 90L214 104L226 104L226 96L238 96L238 128Z','fig-city')+
   R_(0,110,280,22,'fig-haze')+R_(0,128,280,122,'fig-ground2')+L_(0,128,280,128,'fig-horizon')+
   P('M70 250L210 250L146 128L134 128Z','fig-road')+'<path class="fig-dash" d="M140 250L140 128"/>'+C_(140,128,4,'fig-dark')},
 // Luz sobre um volume: zenital, rasante, direcional, rebatida
 light:{h:290,anchors:{zenital:[140,24],rasante:[91,158],'direcional':[250,60],rebatida:[250,236]},
  svg:()=>L_(10,262,270,262,'fig-ground')+R_(104,150,72,112,'fig-sh2',6)+'<ellipse class="fig-sh" cx="140" cy="150" rx="36" ry="9"/>'+
   '<path class="fig-shadow" d="M176 262L250 262L226 250L176 250Z"/>'+
   '<path class="fig-ray" d="M140 28L140 138" marker-end="url(#fig-arrow)"/>'+
   '<path class="fig-ray" d="M80 35L100 210" marker-end="url(#fig-arrow)"/>'+
   '<path class="fig-ray" d="M244 64L178 136" marker-end="url(#fig-arrow)"/>'+
   R_(244,200,22,56,'fig-sh3')+'<path class="fig-ray fig-ray2" d="M240 226L182 214" marker-end="url(#fig-arrow)"/>'},
 // Planta urbana: adjacente, defronte, na diagonal, perpendicular, paralelo
 plan:{h:290,anchors:{adjacente:[95,214],defronte:[50,64],'na diagonal':[242,64],perpendicular:[195,114],paralelo:[8,146]},
  svg:()=>R_(0,120,280,50,'fig-street')+R_(180,0,30,290,'fig-street')+
   '<path class="fig-dash" d="M0 145L180 145M210 145L280 145"/>'+
   R_(10,180,85,90,'fig-sh2')+R_(95,180,85,90,'fig-sh3')+R_(215,180,60,90,'fig-sh')+
   R_(10,20,85,90,'fig-sh')+R_(95,20,85,90,'fig-sh')+R_(215,20,60,90,'fig-sh3')+
   '<text class="fig-n2" x="52" y="230" text-anchor="middle" font-size="22">A</text><text class="fig-n2" x="137" y="230" text-anchor="middle" font-size="22">B</text>'}
};

// ── Formas adicionais: rosto, rua, interior, roda de cores ──
const POL=(cx,cy,r,a)=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];
const F1=n=>(Math.round(n*10)/10);
const WEDGE=(cx,cy,r0,r1,a0,a1)=>{const A=POL(cx,cy,r1,a0),B=POL(cx,cy,r1,a1),C=POL(cx,cy,r0,a1),D=POL(cx,cy,r0,a0);return 'M'+F1(A[0])+' '+F1(A[1])+'A'+r1+' '+r1+' 0 0 1 '+F1(B[0])+' '+F1(B[1])+'L'+F1(C[0])+' '+F1(C[1])+'A'+r0+' '+r0+' 0 0 0 '+F1(D[0])+' '+F1(D[1])+'Z'};
const ARC=(cx,cy,r,a0,a1)=>{const A=POL(cx,cy,r,a0),B=POL(cx,cy,r,a1);return 'M'+F1(A[0])+' '+F1(A[1])+'A'+r+' '+r+' 0 '+(a1-a0>180?1:0)+' 1 '+F1(B[0])+' '+F1(B[1])};
Object.assign(SHAPES,{
 // Rosto de frente: calvície, grisalho, mecha, vinco, olheiras, armação, barba por fazer, cicatriz
 face:{h:300,anchors:{'calvície':[98,94],grisalho:[214,112],mecha:[134,106],vinco:[112,128],olheiras:[104,166],'armação':[94,150],'barba por fazer':[200,230],cicatriz:[192,196]},
  svg:()=>'<ellipse class="fig-sh" cx="60" cy="158" rx="9" ry="20"/><ellipse class="fig-sh" cx="220" cy="158" rx="9" ry="20"/><ellipse class="fig-sh" cx="140" cy="152" rx="80" ry="100"/>'+
   P('M62 135C58 70 100 42 140 42C180 42 222 70 218 135C210 112 196 100 184 96C176 88 160 84 140 90C120 84 104 88 96 96C84 100 70 112 62 135Z','fig-hair')+
   '<path class="fig-streak" d="M70 112L84 100M210 112L196 100M76 128L88 112M204 128L192 112"/>'+
   '<path class="fig-hairline" d="M126 90C116 108 126 124 136 114"/>'+
   '<path class="fig-fine" d="M112 122Q140 116 168 122M114 130Q140 125 166 130"/>'+
   '<path class="fig-fine" d="M114 192C106 208 108 222 114 232M166 192C174 208 172 222 166 232"/>'+
   '<ellipse class="fig-dark" cx="112" cy="150" rx="6" ry="4"/><ellipse class="fig-dark" cx="168" cy="150" rx="6" ry="4"/>'+
   '<path class="fig-shade" d="M98 162Q112 172 126 162M154 162Q168 172 182 162"/>'+
   '<rect class="fig-glass" x="92" y="136" width="40" height="28" rx="11"/><rect class="fig-glass" x="148" y="136" width="40" height="28" rx="11"/><path class="fig-glass" d="M132 148L148 148"/>'+
   '<path class="fig-stroke" d="M140 152L135 182L147 184"/><path class="fig-stroke" d="M118 214Q140 224 162 214"/>'+
   [[96,214],[102,224],[110,232],[120,238],[130,242],[140,243],[150,242],[160,238],[170,232],[178,224],[184,214],[104,208],[116,226],[128,232],[152,232],[164,226],[176,208],[134,236],[146,236]].map(a=>'<circle class="fig-stub" cx="'+a[0]+'" cy="'+a[1]+'" r="1.6"/>').join('')+
   '<path class="fig-scar" d="M184 180L198 208M181 192L190 189M187 200L196 197"/>'},
 // Rua em corte: fachada ativa, calçada, arborização, mobiliário urbano, travessia
 street:{h:290,anchors:{'fachada ativa':[34,196],'calçada':[96,258],'arborização':[134,150],'mobiliário urbano':[96,242],'travessia':[210,266]},
  svg:()=>R_(0,40,76,222,'fig-sh')+R_(8,176,60,60,'fig-dark')+P('M4 168L72 168L66 182L10 182Z','fig-sh2')+[14,26,38,50].map(x=>L_(x,60,x,150,'fig-slat')).join('')+R_(14,70,16,24,'fig-dark')+R_(46,70,16,24,'fig-dark')+
   R_(76,254,70,12,'fig-sh3')+R_(146,266,134,14,'fig-road')+L_(146,254,146,266)+
   L_(124,254,124,196,'fig-trunk')+C_(124,172,28,'fig-leaf')+C_(110,184,16,'fig-leaf')+C_(140,184,16,'fig-leaf')+
   R_(86,242,34,5,'fig-sh2')+L_(88,242,88,230)+L_(120,242,120,230)+R_(86,226,34,4,'fig-sh2')+L_(92,247,92,254)+L_(114,247,114,254)+
   '<path class="fig-dash2" d="M156 273L270 273"/>'+L_(10,262,146,262)},
 // Interior em corte: pé-direito, forro, viga aparente, claraboia, luminária pendente, nicho, lambri, piso de taco
 room:{h:290,anchors:{'pé-direito':[10,150],forro:[34,46],lambri:[38,214],'piso de taco':[70,262],'viga aparente':[180,58],claraboia:[150,38],'luminária pendente':[142,96],nicho:[242,130]},
  svg:()=>R_(20,40,240,212,'fig-room')+R_(20,40,240,12,'fig-sh2')+R_(60,52,18,12,'fig-beam')+R_(190,52,18,12,'fig-beam')+R_(110,34,56,10,'fig-glass2')+
   R_(20,170,50,82,'fig-wood')+[30,40,50,60].map(x=>L_(x,170,x,252,'fig-slat2')).join('')+
   R_(226,108,32,44,'fig-dark')+L_(226,152,258,152)+
   L_(138,52,138,92)+P('M124 106C124 94 132 90 138 90C144 90 152 94 152 106Z','fig-sh2')+
   R_(20,252,240,18,'fig-floor')+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>R_(24+i*20,254,16,6,'fig-parq')+R_(34+i*20,262,16,6,'fig-parq')).join('')+
   '<path class="fig-dim" d="M8 40L8 252M3 46L8 40L13 46M3 246L8 252L13 246"/>'},
 // Roda de cores: saturado, pastel, quente, frio, complementar, análogo
 wheel:{h:290,anchors:{quente:[194,46],complementar:[182,66],'análogo':[200,244],frio:[86,233],saturado:[55,140],pastel:[91,168]},
  svg:()=>Array.from({length:12},(_,i)=>{const a=i*30-90;return '<path class="fig-wedge" fill="hsl('+i*30+' 78% 52%)" d="'+WEDGE(140,140,70,100,a-15,a+15)+'"/><path class="fig-wedge" fill="hsl('+i*30+' 55% 86%)" d="'+WEDGE(140,140,42,70,a-15,a+15)+'"/>'}).join('')+
   '<path class="fig-warm" d="'+ARC(140,140,108,-135,15)+'"/><path class="fig-cool" d="'+ARC(140,140,108,45,195)+'"/>'+
   '<path class="fig-bracket" d="'+ARC(140,140,121,15,105)+'"/>'+
   (()=>{const A=POL(140,140,86,-60),B=POL(140,140,86,120);return '<line class="fig-chord" x1="'+F1(A[0])+'" y1="'+F1(A[1])+'" x2="'+F1(B[0])+'" y2="'+F1(B[1])+'"/><circle class="fig-chord-dot" cx="'+F1(A[0])+'" cy="'+F1(A[1])+'" r="5"/><circle class="fig-chord-dot" cx="'+F1(B[0])+'" cy="'+F1(B[1])+'" r="5"/>'})()}
});

T.anatomy=function(f,opts){
 const sh=SHAPES[f.shape];if(!sh)return ['',100];
 const X0=100,labels=(f.labels||[]).filter(l=>sh.anchors[l.part]);
 const place=side=>{
  const arr=labels.filter(l=>(l.side||(sh.anchors[l.part][0]<140?'left':'right'))===side).map(l=>({l,a:sh.anchors[l.part],y:sh.anchors[l.part][1]+14}));
  arr.sort((a,b)=>a.y-b.y);
  arr.forEach((o,i)=>{o.y=Math.max(o.y,i?arr[i-1].y+40:24)});
  const over=arr.length&&arr[arr.length-1].y-(sh.h+10);if(over>0)arr.forEach(o=>o.y=Math.max(24,o.y-over));
  for(let i=1;i<arr.length;i++)arr[i].y=Math.max(arr[i].y,arr[i-1].y+40);
  return arr;
 };
 let out='<g transform="translate('+X0+' 14)">'+sh.svg()+'</g>',h=sh.h+28;
 [['left',place('left')],['right',place('right')]].forEach(([side,arr])=>arr.forEach(o=>{
  const ax=X0+o.a[0],ay=14+o.a[1],ex=side==='left'?96:W-96,tx=side==='left'?ex-6:ex+6,ly=o.y+14;
  const on=opts&&opts.active&&opts.active===o.l.t;
  out+='<line class="fig-lead'+(on?' fig-lead-on':'')+'" x1="'+ax+'" y1="'+ay+'" x2="'+ex+'" y2="'+ly+'"/><circle class="fig-pin'+(on?' fig-pin-on':'')+'" cx="'+ax+'" cy="'+ay+'" r="4"/>'+
   text(o.l.t,tx,ly,{max:12,size:o.l.t.split(' ').some(w=>w.length>=12)?12:o.l.t.split(' ').some(w=>w.length>=10)?13:14,lh:16,anchor:side==='left'?'end':'start',weight:on?800:700,cls:on?'fig-t fig-on':'fig-t'});
  h=Math.max(h,ly+30);
 }));
 return [out,h];
};

// ── Painéis: rostos (expressões), figuras (posturas) e densidade ──
const CELL=(i,cols,cw,ch)=>[(i%cols)*cw+cw/2,Math.floor(i/cols)*ch];
function faceSvg(cx,cy,r,p){
 const e=r*0.34,ey=cy-r*0.1;let o='<circle class="fig-sh" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>';
 const brow={flat:[[-.52,-.34,-.16,-.34],[.16,-.34,.52,-.34]],furrow:[[-.52,-.44,-.14,-.28],[.14,-.28,.52,-.44]],arch:[[-.52,-.30,-.14,-.50],[.14,-.50,.52,-.30]]}[p.brow||'flat'];
 brow.forEach(b=>{o+='<line class="fig-brow" x1="'+F1(cx+b[0]*r)+'" y1="'+F1(cy+b[1]*r)+'" x2="'+F1(cx+b[2]*r)+'" y2="'+F1(cy+b[3]*r)+'"/>'});
 if(p.brow==='furrow')o+='<path class="fig-fine" d="M'+F1(cx-r*.06)+' '+F1(cy-r*.46)+'l0 '+F1(r*.14)+'M'+F1(cx+r*.06)+' '+F1(cy-r*.46)+'l0 '+F1(r*.14)+'"/>';
 [-1,1].forEach(sg=>{const x=cx+sg*e;
  if(p.eyes==='narrow')o+='<line class="fig-brow" x1="'+F1(x-r*.14)+'" y1="'+F1(ey)+'" x2="'+F1(x+r*.14)+'" y2="'+F1(ey)+'"/>';
  else if(p.eyes==='wide')o+='<circle class="fig-sh" cx="'+F1(x)+'" cy="'+F1(ey)+'" r="'+F1(r*.14)+'"/><circle class="fig-dark" cx="'+F1(x)+'" cy="'+F1(ey)+'" r="'+F1(r*.06)+'"/>';
  else o+='<circle class="fig-dark" cx="'+F1(x)+'" cy="'+F1(ey)+'" r="'+F1(r*(p.eyes==='dot'?.05:.08))+'"/>';});
 const m={flat:'M'+F1(cx-r*.28)+' '+F1(cy+r*.42)+'L'+F1(cx+r*.28)+' '+F1(cy+r*.42),
  smirk:'M'+F1(cx-r*.26)+' '+F1(cy+r*.42)+'Q'+F1(cx+r*.02)+' '+F1(cy+r*.5)+' '+F1(cx+r*.3)+' '+F1(cy+r*.32),
  grimace:'M'+F1(cx-r*.32)+' '+F1(cy+r*.44)+'L'+F1(cx-r*.12)+' '+F1(cy+r*.34)+'L'+F1(cx+r*.08)+' '+F1(cy+r*.48)+'L'+F1(cx+r*.3)+' '+F1(cy+r*.3)}[p.mouth||'flat'];
 return o+'<path class="fig-brow" d="'+m+'"/>';
}
T.faces=function(f,opts){
 const L=f.faces||[],cols=3,cw=W/cols,ch=150,r=46;let out='';
 L.forEach((fc,i)=>{const [cx,y]=CELL(i,cols,cw,ch),on=opts&&opts.active===fc.t;
  out+=faceSvg(cx,y+r+10,r,fc)+text(fc.t,cx,y+r*2+34,{size:14,max:15,lh:16,weight:on?800:700,cls:on?'fig-t fig-on':'fig-t'});});
 return [out,Math.ceil(L.length/cols)*ch+6];
};
// Figuras de palitos: cada postura é uma lista de segmentos (x1,y1,x2,y2) numa caixa 70×120
const POSES={
 ereto:[[35,26,35,72],[35,32,26,58],[35,32,44,58],[35,72,30,112],[35,72,40,112]],
 curvado:[[40,28,30,72],[40,34,50,62],[40,34,56,60],[30,72,26,112],[30,72,38,112]],
 'debruçado':[[26,70,60,42],[60,42,64,40],[60,44,70,60],[26,70,22,112],[26,70,32,112]],
 recostado:[[22,30,16,72],[22,36,32,60],[16,72,34,112],[16,72,22,112]],
 'de cócoras':[[36,68,34,92],[34,70,54,92],[34,92,58,94],[58,94,48,112],[34,92,20,112],[34,72,56,92]],
 'passada larga':[[40,28,36,72],[38,34,56,54],[38,34,20,56],[36,72,10,112],[36,72,62,112]]
};
const HEAD={ereto:[35,14],curvado:[46,18],'debruçado':[70,34],recostado:[24,16],'de cócoras':[38,56],'passada larga':[42,16]};
T.poses=function(f,opts){
 const L=f.poses||[],cols=3,cw=W/cols,ch=170;let out='';
 L.forEach((ps,i)=>{const [cx,y]=CELL(i,cols,cw,ch),on=opts&&opts.active===ps.t,seg=POSES[ps.pose]||[],hd=HEAD[ps.pose]||[35,14];
  out+='<g transform="translate('+F1(cx-35)+' '+(y+10)+')">'+(ps.pose==='recostado'?L_(8,0,8,120,'fig-wall'):'')+(ps.pose==='debruçado'?L_(58,56,70,56,'fig-wall')+L_(58,56,58,112,'fig-wall'):'')+
   L_(0,114,70,114,'fig-ground')+seg.map(a=>'<line class="fig-body" x1="'+a[0]+'" y1="'+a[1]+'" x2="'+a[2]+'" y2="'+a[3]+'"/>').join('')+'<circle class="fig-headc" cx="'+hd[0]+'" cy="'+hd[1]+'" r="10"/></g>'+
   text(ps.t,cx,y+148,{size:14,max:15,lh:16,weight:on?800:700,cls:on?'fig-t fig-on':'fig-t'});});
 return [out,Math.ceil(L.length/cols)*ch+6];
};
T.density=function(f,opts){
 const L=f.panels||[],n=L.length,cw=(W-20)/n,box=Math.min(cw-16,140);let out='';
 L.forEach((pn,i)=>{const x=10+i*cw+(cw-box)/2,y=14,on=opts&&opts.active===pn.t,N=pn.n,g=Math.ceil(Math.sqrt(N)),sp=box/g;
  out+=box_(x,y,box,box,'fig-frame '+tone(i))+Array.from({length:N},(_,k)=>{const cxi=k%g,cyi=Math.floor(k/g),j=((k*37)%11)/11-.5,j2=((k*53)%13)/13-.5;return '<circle class="fig-person" cx="'+F1(x+sp*(cxi+.5)+j*sp*.4)+'" cy="'+F1(y+sp*(cyi+.5)+j2*sp*.4)+'" r="'+F1(Math.min(6,sp*.3))+'"/>'}).join('')+
   text(pn.t,x+box/2,y+box+22,{size:14,max:14,lh:16,weight:on?800:700,cls:on?'fig-t fig-on':'fig-t'});});
 return [out,box+62];
};
const box_=(x,y,w,h,c)=>box(x,y,w,h,c,8);

const TYPES=Object.keys(T);

// Termos que o esquema nomeia (rótulos, marcas, rostos, figuras, painéis): servem ao leitor de tela e à busca
function names(f){return [...(f.labels||[]),...(f.marks||[]),...(f.faces||[]),...(f.poses||[]),...(f.panels||[]),...(f.steps||[]),...(f.events||[]),...(f.points||[]).filter(p=>!p.free)].map(x=>x.t).filter(Boolean)}
let figureSerial=0;
function svg(f,opts){
 const draw=T[f&&f.type];if(!draw)return '';
 const [body,h]=draw(f,opts),nm=names(f);
 const serial=++figureSerial,arrowId='fig-arrow-'+serial,titleId='fig-title-'+serial,descId='fig-desc-'+serial;
 const alt=f.title+(nm.length?'. Termos no esquema: '+nm.join(', ')+'.':'');
 const help=(f.caption||'')+(f.type==='spectrum'?' Progressão conceitual qualitativa; espaçamentos não são medidas.':'');
 const scopedDefs=DEFS.replace('id="fig-arrow"','id="'+arrowId+'"');
 const scopedBody=body.replaceAll('url(#fig-arrow)','url(#'+arrowId+')');
 return '<svg class="fig-svg" viewBox="0 0 '+W+' '+Math.ceil(h)+'" role="img" aria-labelledby="'+titleId+' '+descId+'" aria-label="'+esc(alt)+'" xmlns="http://www.w3.org/2000/svg">'+
  '<title id="'+titleId+'">'+esc(f.title)+'</title><desc id="'+descId+'">'+esc(help)+'</desc>'+scopedDefs+scopedBody+'</svg>';
}
function render(f,opts){
 const s=svg(f,opts);if(!s)return '';
 return '<figure class="fig"><div class="fig-head"><span class="eyebrow">ESQUEMA</span><strong>'+esc(f.title)+'</strong><button type="button" class="fig-zoom-btn" data-fig-zoom aria-label="Ampliar o esquema">Ampliar</button></div>'+s+(f.caption?'<figcaption>'+esc(f.caption)+'</figcaption>':'')+'</figure>';
}
// Ampliação: o esquema abre numa janela rolável e com zoom por pinça, para ler os rótulos no celular
let zoomEl=null;
function closeZoom(){if(zoomEl){zoomEl.remove();zoomEl=null;document.documentElement.classList.remove('fig-locked')}}
function openZoom(fig){
 closeZoom();
 zoomEl=document.createElement('div');zoomEl.className='fig-zoom';zoomEl.setAttribute('role','dialog');zoomEl.setAttribute('aria-modal','true');zoomEl.setAttribute('aria-label','Esquema ampliado');
 const clone=fig.cloneNode(true);const b=clone.querySelector('[data-fig-zoom]');if(b)b.remove();
 zoomEl.innerHTML='<button type="button" class="btn accent sm fig-zoom-close" data-fig-close>Fechar</button><span class="fig-zoom-hint">Deslize para os lados ou gire o aparelho para ver inteiro.</span><div class="fig-zoom-body"></div>';
 zoomEl.querySelector('.fig-zoom-body').appendChild(clone);
 document.body.appendChild(zoomEl);document.documentElement.classList.add('fig-locked');zoomEl.scrollLeft=Math.max(0,(zoomEl.scrollWidth-zoomEl.clientWidth)/2);zoomEl.querySelector('[data-fig-close]').focus({preventScroll:true});
}
if(typeof document!=='undefined'){
 document.addEventListener('click',e=>{
  const t=e.target;if(!t||!t.closest)return;
  if(t.closest('[data-fig-close]')){closeZoom();return}
  const inZoom=t.closest('.fig-zoom');
  const btn=t.closest('[data-fig-zoom]');
  if(btn){e.preventDefault();openZoom(btn.closest('.fig'));return}
  const sv=t.closest('.fig-svg');if(sv&&!inZoom){openZoom(sv.closest('.fig'))}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&zoomEl){e.preventDefault();closeZoom()}});
}
return {render,svg,wrap,names,TYPES,closeZoom,zoomOpen:()=>!!zoomEl};
})();
