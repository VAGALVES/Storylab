/* StoryLab Shanghai — extensão editorial bilingue do Atlas (urbanismo).
 * Adiciona campos no FIM: índices existentes e progresso local preservados.
 * Não há chamadas de rede, rastreio ou dependências externas.
 */
(function(){
'use strict';
const D=window.STORYLAB_DATA,G=window.STORYLAB_ATLAS_GUIDES,raw=window.STORYLAB_URBANISM_FIELDS;
if(!D||!Array.isArray(D.atlas)||!Array.isArray(G)||!Array.isArray(raw))return;
if(window.STORYLAB_URBANISM?.installed)return;
if(D.atlas.length!==G.length)throw Error('Atlas urbanismo: estrutura inconsistente');
const base=D.atlas.length;
const accents=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const special={
 'movimento pendular':'My daily commute takes about 35 minutes.',
 'deslocamento reverso':'Reverse commuting can shift travel demand away from the city center.',
 'encadeamento de viagens':'Trip chaining allows people to combine school, shopping and work in one journey.',
 'horário de pico':'The metro is often crowded during rush hour.',
 'primeira e última milha':'Safe sidewalks improve first- and last-mile connections.',
 'descompasso espacial':'Poor transit connections can worsen spatial mismatch.',
 'caminhos de desejo':'People often follow desire paths across open spaces.',
 'terceiro lugar':'Coffee shops can serve as important third places.',
 'demanda induzida':'Adding more lanes can induce additional traffic.',
 'cidade-esponja':'Sponge-city measures help manage stormwater runoff.',
 'desenvolvimento orientado ao transporte':'Transit-oriented development brings homes and services closer to stations.',
 'caminhabilidade':'The neighborhood is highly walkable.',
 'transporte público':'The city has an extensive public transit network.',
 'desenvolvimento de uso misto':'Mixed-use developments combine residential and commercial spaces.',
 'infraestrutura verde':'Green infrastructure helps manage rainfall and urban heat.',
 'ilha de calor urbana':'Urban heat islands can intensify heat exposure.',
 'revitalizar um bairro':'The city wants to revitalize a neighborhood without displacing residents.',
 'melhorar a caminhabilidade':'The plan aims to improve walkability.',
 'reduzir congestionamentos':'The city is testing measures to reduce traffic congestion.',
 'preservar edifícios históricos':'The proposal would preserve historic buildings.'
};
const relationships={
 'movimento pendular':['horário de pico','descompasso espacial','mobilidade do cuidado','matriz origem–destino','integração intermodal'],
 'descompasso espacial':['equilíbrio empregos–moradias','acessibilidade econômica da moradia','movimento pendular','desenvolvimento orientado ao transporte'],
 'cidade de 15 minutos':['uso do solo','desenvolvimento de uso misto','caminhabilidade','mobilidade do cuidado'],
 'caminhos de desejo':['caminhabilidade','orientação espacial','legibilidade urbana','permeabilidade urbana'],
 'gentrificação':['deslocamento involuntário','acessibilidade econômica da moradia','regeneração urbana','justiça espacial'],
 'demanda induzida':['congestionamento','redimensionamento viário','divisão modal','mudança modal'],
 'cidade-esponja':['infraestrutura azul-verde','pavimento permeável','escoamento superficial pluvial','resiliência climática'],
 'terceiro lugar':['sentido de lugar','esfera espacial pública','criação de lugares','infraestrutura social'],
 'distrito da moda':['polo criativo','área de influência comercial','loja emblemática','corredor comercial'],
 'mobilidade do cuidado':['encadeamento de viagens','cidade de 15 minutos','desenho universal','descompasso espacial'],
 'sintaxe espacial':['permeabilidade urbana','caminhabilidade','análise espacial','índice de acessibilidade'],
 'urbanismo tático':['ruas completas','criação de lugares','recuperar espaço público','parklet']
};
const cautions={
 'movimento pendular':'Em inglês cotidiano, prefira commuting ou daily commute. Pendular commuting é uma formulação acadêmica menos habitual. Não confunda deslocamento frequente com migração residencial.',
 'gentrificação':'Uma reforma ou loja nova não demonstra gentrificação por si só; verifique alterações de preços, perfil residencial e deslocamentos.',
 'demanda induzida':'Capacidade adicional não necessariamente produz demanda induzida na mesma magnitude em todas as situações; examine dados e contexto.',
 'deserto alimentar':'Não classifique uma área como deserto alimentar somente por observação visual; requer dados de acesso, renda e oferta.',
 'ilha de calor urbana':'Para afirmar a presença de ilha de calor, compare medições em condições meteorológicas equivalentes.',
 'rua comercial principal':'High street é expressão especialmente britânica; para outros contextos, main shopping street pode ser mais natural.',
 'ciclovia':'Bike lane muitas vezes corresponde a ciclofaixa; cycle track ou protected bike lane pode ser mais preciso para ciclovia segregada.',
 'terceiro lugar':'Third place designa a função de convivência, não a natureza pública da propriedade.',
 'densidade versus aglomeração':'Em inglês crowding não equivale necessariamente a aglomeração no sentido estatístico; density é uma taxa, crowding é condição de ocupação intensa.'
};
const all=[],meta={},lookup={};
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
for(let i=0;i<raw.length;i++){
 const [name,discipline,records]=raw[i],index=base+i,rows=records.trim().split('\n').map(line=>line.trim().split('|'));
 const terms=[],seen=new Set();meta[index]={};
 for(let j=0;j<rows.length;j++){
  const [pt,en,definition,example]=rows[j];
  if(rows[j].length!==4||![pt,en,definition,example].every(x=>x&&x.trim()))throw Error('Entrada inválida: '+name+' '+j);
  if(seen.has(pt))throw Error('Termo duplicado em '+name+': '+pt);seen.add(pt);
  const pattern=new RegExp(escRe(pt),'i');
  if(!pattern.test(example))throw Error('Exemplo sem termo: '+pt);
  const blank=example.replace(pattern,'_____');
  const scene=blank.length>=60?blank:(blank+' A equipe registra o contexto antes de tirar conclusões sobre o bairro.');
  const caution=cautions[pt]||'Evite generalizações e não atribua intenções, causas ou medições sem dados ou fontes identificadas.';
  terms.push([pt,definition,example,caution,scene]);
  meta[index][pt]={en,englishSentence:special[pt]||'',relations:[]};
  all.push({term:pt,topic:index,english:en});
  if(!lookup[accents(pt)])lookup[accents(pt)]={term:pt,topic:index};
 }
 const model=[
  'Nesta cena urbana hipotética, descrevo primeiro a distribuição dos espaços e os elementos que podem ser diretamente observados.',
  'A análise pode começar por '+terms[0][0]+' e '+terms[1][0]+', conceitos relacionados mas não necessariamente equivalentes.',
  'Comparo a experiência dos diferentes usuários e identifico quais relações exigem entrevistas, medições ou documentos.',
  'Por fim, interpreto as possíveis consequências para a vida urbana, deixando claro o que é hipótese e o que está efetivamente confirmado.'
 ];
 G.push({scene:'Cena hipotética de estudo: '+name.toLowerCase()+' em uma área de Xangai, com diferentes atividades e usuários.',focus:discipline+'. Compare português e inglês e separe observação de inferência.',terms,model,swaps:[]});
 D.atlas.push({title:name,terms:terms.map(t=>t[0]),prompt:'Descreva esta cena utilizando três conceitos de '+name.toLowerCase()+' e apresente seus equivalentes em inglês.'});
}
for(const [topic,entries] of Object.entries(meta))for(const [term,item] of Object.entries(entries)){
 const related=relationships[term]||[];
 item.relations=related.map(word=>lookup[accents(word)]).filter(Boolean);
}
window.STORYLAB_URBANISM={installed:true,base,count:raw.length,terms:all.length,byField:meta,entries:all,distinctions:raw.find(x=>x[0]==='Distinções entre conceitos próximos')?.[2],collocations:raw.find(x=>x[0]==='Expressões e combinações urbanas')?.[2]};
delete window.STORYLAB_URBANISM_FIELDS;
})();
