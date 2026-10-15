/** Integração real do menu principal com a Academia da Linguagem.
 *  Executa os scripts de produção e simula clique no menu mobile.
 *  Este teste previne regressão: "api.header is not a function".
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const read = name => readFileSync(new URL(name,import.meta.url),'utf8');
const handlers = new Map();
const screen = {innerHTML:''};
const document = {
  activeElement:null,
  documentElement:{dataset:{}},
  addEventListener(type,fn,capture=false){
    const listeners = handlers.get(type)||[];
    listeners.push({fn,capture:!!capture});
    handlers.set(type,listeners);
  },
  getElementById(id){return id==='app'?screen:null},
  querySelector(){return null},
  createElement(){return {setAttribute(){},querySelector(){return {addEventListener(){}}}}},
  body:{appendChild(){}}
};
let scrollCount=0;
const window={
  addEventListener(){},
  scrollTo(){scrollCount++}
};
const sandbox=vm.createContext({
  window,document,
  navigator:{onLine:true},
  location:{protocol:'file:',hostname:'local.test'},
  localStorage:{getItem(){return null},setItem(){}},
  confirm(){return true},
  setTimeout(){return 0},
  clearTimeout(){},
  requestAnimationFrame(){return 0},
  console
});
for(const name of ['./data.js','./linguistics-data.js','./linguistics-lab.js','./app.js']){
  vm.runInContext(read(name),sandbox,{filename:name,timeout:2000});
}
assert.match(screen.innerHTML,/data-page="linguistics"/);
assert.match(screen.innerHTML,/Every street/);

async function click(dataset){
  const target={
    dataset,
    closest(selector){
      if(selector==='[data-action]'&&'action' in dataset)return this;
      if(selector==='[data-ling-action]'&&'lingAction' in dataset)return this;
      if(selector==='[data-ling-action="jump"]'&&dataset.lingAction==='jump')return this;
      return null;
    }
  };
  let stopped=false;
  const event={
    target,
    preventDefault(){},
    stopPropagation(){},
    stopImmediatePropagation(){stopped=true}
  };
  const listeners=[...(handlers.get('click')||[])].sort((a,b)=>Number(b.capture)-Number(a.capture));
  for(const listener of listeners){
    if(stopped)break;
    // A navegação original usa handler async; uma rejeição não pode passar em silêncio.
    await listener.fn(event);
  }
}
// Abrir menu hamburguer de um smartphone e escolher a entrada.
await click({action:'menu'});
assert.match(screen.innerHTML,/class="layout menu-open"/,'Menu mobile deve abrir');
await click({action:'navigate',page:'linguistics'});
assert.doesNotMatch(screen.innerHTML,/class="layout menu-open"/,'Menu mobile deve fechar');
assert.match(screen.innerHTML,/ESQUEMA VISUAL EXPLICADO/,'A rota deve mostrar seu conteúdo');
assert.match(screen.innerHTML,/CAMADA TEÓRICA/,'O capítulo precisa ser exibido');
assert.match(screen.innerHTML,/Fonética e fonologia/);
assert.match(screen.innerHTML,/data-page="linguistics" aria-current="page"/);
assert.equal((screen.innerHTML.match(/data-ling-action="chapter"/g)||[]).length,8);
assert.ok(scrollCount>=1,'A navegação deve retornar ao topo');

// Selecionar outro capítulo usa o mesmo DOM da página, sem reinicializar o app.
await click({lingAction:'chapter',index:'3'});
assert.match(screen.innerHTML,/Pragmática: o que a frase diz e o que sugere/);
await click({lingAction:'tab',tab:'practice'});
assert.match(screen.innerHTML,/CHECAGEM DE COMPREENSÃO/);

// Alternar outros menus não pode quebrar a entrada acadêmica.
await click({action:'navigate',page:'home'});
assert.match(screen.innerHTML,/Every street/);
await click({action:'navigate',page:'linguistics'});
assert.match(screen.innerHTML,/ESQUEMA VISUAL EXPLICADO/);

console.log('Navegação Linguística: menu mobile, fechamento, conteúdo, capítulos, exercícios e reentrada OK');
