/* StoryLab — diagramas semânticos próprios de cada verbo (Percurso e travessia).
   SVGs vetoriais, escaláveis e acessíveis; sem imagens externas.
   O catálogo permanece independente da estrutura de famílias para crescer sem duplicar a UI. */
window.StoryLabVerbIcons=(()=>{
 'use strict';
 const artwork={
  "atravessar": "<rect x=\"23\" y=\"29\" width=\"214\" height=\"57\" rx=\"9\" class=\"vl-core\"/><path d=\"M28 57H232\" class=\"vl-outline\"/><path d=\"M130 10V104\" class=\"vl-edge\"/><path d=\"M121 91L130 104L139 91\" class=\"vl-stroke\"/><circle cx=\"130\" cy=\"10\" r=\"5\" class=\"vl-focus\"/>",
  "cruzar": "<path d=\"M22 57H236\" class=\"vl-outline\"/><path d=\"M130 10V105\" class=\"vl-outline\"/><path d=\"M28 57H229\" class=\"vl-edge\"/><path d=\"M218 49L230 57L218 65\" class=\"vl-stroke\"/><path d=\"M130 13V102\" class=\"vl-edge\"/><path d=\"M122 90L130 103L138 90\" class=\"vl-stroke\"/><circle cx=\"130\" cy=\"57\" r=\"6\" class=\"vl-focus\"/>",
  "transpor": "<rect x=\"115\" y=\"27\" width=\"30\" height=\"63\" rx=\"5\" class=\"vl-core\"/><path d=\"M130 22V95\" class=\"vl-outline\"/><path d=\"M26 88C65 88 77 23 130 23S192 88 229 88\" class=\"vl-edge\"/><path d=\"M218 79L231 88L218 97\" class=\"vl-stroke\"/><circle cx=\"26\" cy=\"88\" r=\"5\" class=\"vl-focus\"/>",
  "percorrer": "<path d=\"M28 85C65 85 70 31 111 31S160 84 198 70L231 53\" class=\"vl-outline\"/><path d=\"M28 85C65 85 70 31 111 31S160 84 198 70L231 53\" class=\"vl-edge\"/><path d=\"M217 49L232 53L225 67\" class=\"vl-stroke\"/><circle cx=\"28\" cy=\"85\" r=\"5\" class=\"vl-focus\"/><circle cx=\"103\" cy=\"32\" r=\"3.5\" class=\"vl-focus\"/><circle cx=\"191\" cy=\"73\" r=\"3.5\" class=\"vl-focus\"/>",
  "desviar": "<path d=\"M20 72H240\" class=\"vl-outline\"/><circle cx=\"133\" cy=\"72\" r=\"22\" class=\"vl-core\"/><path d=\"M20 72H68C88 72 90 28 129 28S168 72 194 72H232\" class=\"vl-edge\"/><path d=\"M220 63L234 72L220 81\" class=\"vl-stroke\"/><circle cx=\"20\" cy=\"72\" r=\"5\" class=\"vl-focus\"/>",
  "serpentear": "<circle cx=\"19\" cy=\"57\" r=\"5\" class=\"vl-focus\"/><path d=\"M24 57C49 13 71 101 96 57S144 13 169 57S213 101 237 57\" class=\"vl-edge\"/><path d=\"M223 51L237 57L224 66\" class=\"vl-stroke\"/>",
  "bifurcar-se": "<circle cx=\"25\" cy=\"58\" r=\"6\" class=\"vl-focus\"/><path d=\"M31 58H111C139 58 148 31 208 26\" class=\"vl-edge\"/><path d=\"M111 58C139 58 148 85 208 90\" class=\"vl-edge\"/><path d=\"M194 18L210 26L196 36M195 81L210 90L194 99\" class=\"vl-stroke\"/>",
  "convergir": "<circle cx=\"25\" cy=\"24\" r=\"5\" class=\"vl-focus\"/><circle cx=\"25\" cy=\"91\" r=\"5\" class=\"vl-focus\"/><path d=\"M30 24C79 24 99 57 137 57H233\" class=\"vl-edge\"/><path d=\"M30 91C79 91 99 57 137 57\" class=\"vl-edge\"/><path d=\"M220 49L234 57L220 65\" class=\"vl-stroke\"/>"
};
 const descriptions={
 'atravessar':'Um caminho cruza uma faixa ou área de uma borda até a outra.',
 'cruzar':'Dois eixos se interceptam em um ponto.',
 'transpor':'A trajetória ultrapassa um obstáculo ou barreira.',
 'percorrer':'Um percurso contínuo é acompanhado do início ao fim.',
 'desviar':'A rota contorna um obstáculo e retorna ao rumo principal.',
 'serpentear':'O traçado se desenvolve em curvas sucessivas.',
 'bifurcar-se':'Um percurso único se divide em dois ramos.',
 'convergir':'Duas trajetórias se encontram e seguem em uma direção comum.'
 };
 function register(entries){
  for(const [key,entry] of Object.entries(entries)){
   if(!key||Object.prototype.hasOwnProperty.call(artwork,key))throw Error('Diagrama duplicado: '+key);
   if(!entry||typeof entry.svg!=='string'||!entry.svg.startsWith('<')||typeof entry.description!=='string'||!entry.description.trim())throw Error('Diagrama incompleto: '+key);
   artwork[key]=entry.svg;
   descriptions[key]=entry.description;
  }
 }
 function caption(key){return Object.prototype.hasOwnProperty.call(descriptions,key)?descriptions[key]:'';}
 function escape(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
 function has(key){return Object.prototype.hasOwnProperty.call(artwork,key);}
 function render(key,label,{mini=false}={}){
  if(!has(key))return '';
  const name=String(label||key);
  const attrs=mini?'class="vl-mini-diagram" aria-hidden="true" focusable="false"':'class="vl-diagram" role="img" aria-label="'+escape('Diagrama do verbo '+name)+'"';
  return '<svg '+attrs+' viewBox="0 0 260 115" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">'+(mini?'':'<desc>'+escape(caption(key))+'</desc>')+artwork[key]+'</svg>';
 }
 return {render,has,keys:()=>Object.keys(artwork),caption,register};
})();
