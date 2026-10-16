/* StoryLab v2.20 · regressão do português como núcleo expressivo. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const doc={listeners:[],addEventListener(type,fn){this.listeners.push({type,fn})}};
const sandbox={window:{confirm:()=>true},document:doc};
for(const path of ['./trade-data.js','./trade-object-data.js','./trade-academy-data.js',
 './trade-precision-data.js','./trade-precision.js','./trade-language-data.js','./trade-tools.js',
 './trade-academy.js','./trade-object.js','./trade-field.js','./trade-hub.js']){
 vm.runInNewContext(read(path),sandbox,{filename:path,timeout:4000});
}
const D=sandbox.window.STORYLAB_PRECISION_DATA;
const P=sandbox.window.StoryLabPrecision;
const hub=sandbox.window.StoryLabTrade;
const languages=sandbox.window.STORYLAB_TRADE_LANGUAGE;
assert.equal(D.verbs.length,5,'cinco famílias semânticas');
assert.equal(D.verbs.reduce((sum,g)=>sum+g[2].length,0),20,'vinte verbos/regências');
assert.equal(D.scales.length,7);
assert.equal(D.scales.every(s=>s.steps.length===5),true);
assert.equal(new Set(D.scales.map(s=>s.id)).size,D.scales.length);
assert.equal(new Set(D.verbs.flatMap(g=>g[2].map(v=>v[0]))).size,20);
for(const g of D.verbs)for(const v of g[2]){
 assert.equal(v.length,10,'cada verbo exige 10 campos em ordem');
 assert.match(v[2],/[\u3400-\u9fff]/);
 assert.ok(v[9].length>25&&v[8].length>55);
}
const firmness=D.scales.find(s=>s.id==='firmeza');
assert.ok(firmness.steps.some(x=>x[0]==='macio'));
assert.ok(!firmness.steps.some(x=>x[0]==='maciço'));
const size=D.scales.find(s=>s.id==='dimensao');
assert.ok(!size.steps.some(x=>x[0]==='compacto'));
const shine=D.scales.find(s=>s.id==='brilho');
assert.ok(!shine.steps.some(x=>x[0]==='opaco'));
const mass=D.scales.find(s=>s.id==='massa');
assert.ok(!mass.steps.some(x=>x[0]==='equilibrado'||x[0]==='denso'));
assert.equal(languages.patterns.length,20);
for(const p of languages.patterns){assert.ok(p.titlePt);assert.equal(p.framePt.length,3)}
assert.equal(languages.patterns[0].titlePt,'Ser composto por');
let renders=0;const spoken=[],copied=[];
const store={tradeSaved:[],tradeSeen:[],tradeFieldNotes:[],tradeAcademyDone:[],tradeAcademyAnswers:[],tradeObjectDraft:{}};
const api={getStore:()=>store,save(){},render(){renders++},copy:s=>copied.push(s),
 say:(s,lang)=>spoken.push([s,lang]),header:(topic,title)=>'<h1>'+title+'</h1>'};
hub.init(api);
const action=(act,id)=>{for(const h of doc.listeners.filter(x=>x.type==='click'))
 h.fn({target:{closest:q=>q==='[data-precision]'?{dataset:{precision:act,id}}:null},preventDefault(){}});
};
assert.match(hub.render(),/PERCURSO PRINCIPAL/);
assert.match(hub.render(),/Adjetivos &amp; escalas|Adjetivos & escalas/);
hub.openTab('verbos');
let html=hub.render();
assert.match(html,/O objeto ganha vida com os verbos/);
assert.match(html,/Ser composto por/i);
assert.match(html,/REGRA DE CONSTRUÇÃO/);
assert.match(html,/REGÊNCIA EM PORTUGUÊS/);
assert.match(html,/é composto por/);
action('family','geometria');action('verb','0');
html=P.verbs();assert.match(html,/circundar/i);
action('copy','geometria:0');
assert.match(copied.at(-1),/circundar/i);
action('speak','geometria:0:zh');
assert.equal(spoken.at(-1)[1],'zh-CN');
hub.openTab('escalas');
assert.match(hub.render(),/Escalas que não confundem conceitos/);
action('scale','firmeza');action('step','4');
html=P.scales();assert.match(html,/muito duro/);assert.match(html,/Rígido descreve/);
action('scale','brilho');
html=P.scales();assert.match(html,/Opaco/);
hub.openTab('medidas');
html=hub.render();
assert.match(html,/Medidas ilustradas/);
assert.match(html,/role="img"/);
assert.match(html,/Massa é outra propriedade/);
action('shape','veiculo');action('measure','massa');
html=P.measurements();assert.match(html,/MASSA \(g, kg\)/);
assert.match(html,/não é distância no espaço/);
action('measure','largura');html=P.measurements();
assert.match(html,/Largura exige vista frontal/);
action('shape','caixa');action('measure','profundidade');
assert.match(P.measurements(),/PROFUNDIDADE/);
hub.openTab('linguagem');
html=hub.render();
assert.match(html,/<h3>Ser composto por<\/h3>/);
assert.match(html,/REGÊNCIA EM INGLÊS/);
assert.match(html,/The assembly consists of/);
assert.doesNotMatch(html,/<h3>Consist of<\/h3>/);
hub.openTab('roteiro');
html=hub.render();
assert.match(html,/Onde medimos cada coisa/);
assert.match(html,/to-measure-grid/);
assert.ok(renders>9);
const index=read('./index.html'),build=read('./build_standalone.py');
assert.ok(index.indexOf('trade-precision-data.js')<index.indexOf('trade-precision.js'));
assert.ok(index.indexOf('trade-precision.js')<index.indexOf('trade-hub.js'));
assert.match(build,/trade_precision_data=/);
assert.match(read('./generate_service_worker.py'),/'trade-precision-data.js', 'trade-precision.js'/);
console.log('v2.20: 20 verbos PT, 7 escalas homogêneas, ilustrações em 4 geometrias, tradução secundária, Studio e backup PWA — OK');
