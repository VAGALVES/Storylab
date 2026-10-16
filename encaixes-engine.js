/* StoryLab · Fraseoteca / Encaixes — prática editorial de construções abertas.
   Cenários são exemplos hipotéticos; nenhuma informação factual é verificada. */
window.StoryLabEncaixes=(()=>{
  'use strict';
  const corpus=()=>window.STORYLAB_ENCAIXES?.optionsByPhrase||{};
  let api=null;
  const state={openId:null};
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ellipsis=/\.{3}|…/g;
  const countSlots=phrase=>(String(phrase||'').match(/\.{3}|…/g)||[]).length;
  const eligible=p=>!!(p&&countSlots(p.pt)&&corpus()[p.id]);
  function normalizeSlots(slots,count){return Array.from({length:count},(_,i)=>typeof slots?.[i]==='string'?slots[i].slice(0,240):'')}
  function compose(phrase,slots){
    const parts=normalizeSlots(slots,countSlots(phrase));
    let i=0;
    let completed=String(phrase).replace(ellipsis,(token,offset)=>{
      const value=parts[i++].trim()||'_____';
      const before=String(phrase)[offset-1]||'';
      const join=/[\p{L}\p{N}]/u.test(before)&&/^[\p{L}\p{N}]/u.test(value)?' ':'';
      return join+value;
    });
    completed=completed.replace(/ +([,.;!?])/g,'$1').trim();
    if(!/[.!?]$/.test(completed))completed+='.';
    return completed;
  }
  function current(p){
    const choices=corpus()[p.id]||[];
    const record=api?.getStore().phraseEncaixes?.[p.id];
    const selected=record?.selected==='custom'?'custom':Number.isInteger(record?.selected)&&record.selected>=0&&record.selected<choices.length?record.selected:0;
    const slots=selected==='custom'?normalizeSlots(record?.slots,countSlots(p.pt)):choices[selected]?.slots||[];
    return {selected,slots,preview:compose(p.pt,slots),ready:slots.length===countSlots(p.pt)&&slots.every(x=>typeof x==='string'&&x.trim().length>=2)};
  }
  function button(action,label,id,cls='btn secondary sm',attributes=''){
    return '<button type="button" class="'+cls+'" data-encaixe-action="'+action+'" data-phrase-id="'+escape(id)+'" '+attributes+'>'+label+'</button>';
  }
  function card(p,lang='pt'){
    if(lang!=='pt'||!eligible(p))return '';
    const open=state.openId===p.id;
    const opts=corpus()[p.id],saved=current(p),slots=countSlots(p.pt);
    if(!open)return '<div class="encaixe-teaser">'+button('toggle','✳ Explorar encaixes <span class="encaixe-num">'+opts.length+' contextos</span>',p.id,'encaixe-trigger','aria-expanded="false"')+'</div>';
    const selector='<div class="encaixe-options" role="group" aria-label="Sugestões de encaixe para esta frase">'+
      opts.map((o,i)=>button('select','<span class="encaixe-select-dot" aria-hidden="true"></span><span><strong>'+escape(o.label)+'</strong><small>'+escape(o.slots.join(' / '))+'</small></span>',p.id,'encaixe-option '+(saved.selected===i?'active':''),'data-option="'+i+'" aria-pressed="'+(saved.selected===i)+'"')).join('')+
      button('select','<span class="encaixe-select-dot" aria-hidden="true"></span><span><strong>Meu encaixe</strong><small>Escrever a minha própria versão</small></span>',p.id,'encaixe-option '+(saved.selected==='custom'?'active':''),'data-option="custom" aria-pressed="'+(saved.selected==='custom')+'"')+
      '</div>';
    const fields=saved.selected==='custom'?'<div class="encaixe-custom">'+saved.slots.map((value,i)=>'<div><label for="encaixe-slot-'+p.id+'-'+i+'">Complemento '+(i+1)+' de '+slots+'</label><input id="encaixe-slot-'+p.id+'-'+i+'" type="text" maxlength="240" autocomplete="off" data-encaixe-slot="'+i+'" data-phrase-id="'+escape(p.id)+'" placeholder="Descreva algo que você observou ou investigou" value="'+escape(value)+'"></div>').join('')+'</div>':'';
    const html='<div class="encaixe-lab" data-encaixe-panel="'+escape(p.id)+'">'+
      '<div class="encaixe-header"><div><span class="eyebrow">LABORATÓRIO SINTÁTICO · ENCAIXES</span><h4>Uma estrutura, diferentes sentidos</h4></div>'+button('toggle','Fechar',p.id,'encaixe-close','aria-expanded="true"')+'</div>'+
      '<p class="encaixe-intro">Escolha uma situação ou preencha as '+(slots===1?'lacuna':'lacunas')+'. Cada opção respeita a estrutura original. Os cenários são hipotéticos.</p>'+
      selector+fields+
      '<div class="encaixe-result"><span class="eyebrow">SUA FRASE COMPLETA</span><p data-encaixe-preview="'+escape(p.id)+'" aria-live="polite">'+escape(saved.preview)+'</p></div>'+
      '<div class="encaixe-actions">'+
       button('copy','Copiar frase',p.id,'btn accent sm')+
       button('listen','Ouvir',p.id,'btn secondary sm')+
       button('tele','Levar ao teleprompter',p.id,'btn secondary sm')+
      '</div><p class="encaixe-disclaimer">Compare as escolhas de complemento, regência e precisão. Antes de usar em reportagem, confira fatos, datas, nomes e fontes.</p>'+
      '</div>';
    return html;
  }
  function getPhrase(id){return api?.D.phrases.find(p=>p.id===id)}
  function setSelected(id,selected){
    const p=getPhrase(id),opts=corpus()[id];if(!p||!opts)return;
    const stored=api.getStore();stored.phraseEncaixes=stored.phraseEncaixes||{};
    const previous=stored.phraseEncaixes[id]||{};
    const record=selected==='custom'?
      {selected:'custom',slots:normalizeSlots(previous.slots,countSlots(p.pt))}:
      {selected:Number(selected),slots:normalizeSlots(previous.slots,countSlots(p.pt))};
    stored.phraseEncaixes[id]=record;api.save();
    api.render();
  }
  function usable(id){const p=getPhrase(id);if(!eligible(p))return null;const x=current(p);if(!x.ready){api.toast('Complete todas as lacunas antes de usar a frase.');return null}return x.preview}
  function init(context){
    api=context;
    document.addEventListener('click',event=>{
      const btn=event.target.closest('[data-encaixe-action]');
      if(!btn)return;
      event.preventDefault();
      const id=btn.dataset.phraseId,action=btn.dataset.encaixeAction;
      if(!eligible(getPhrase(id)))return;
      if(action==='toggle'){state.openId=state.openId===id?null:id;api.render();return}
      if(action==='select'){const val=btn.dataset.option;const opts=corpus()[id];if(val!=='custom'&&(!/^\d+$/.test(val)||Number(val)>=opts.length))return;state.openId=id;setSelected(id,val==='custom'?'custom':Number(val));return}
      const text=usable(id);if(!text)return;
      if(action==='copy'){api.copy(text);return}
      if(action==='listen'){api.say(text,'pt-BR');return}
      if(action==='tele'){api.toTele(text);return}
    });
    document.addEventListener('input',event=>{
      const t=event.target;
      if(!t.matches('[data-encaixe-slot]'))return;
      const id=t.dataset.phraseId,index=Number(t.dataset.encaixeSlot),p=getPhrase(id);
      if(!eligible(p)||!Number.isInteger(index)||index<0||index>=countSlots(p.pt))return;
      const stored=api.getStore();stored.phraseEncaixes=stored.phraseEncaixes||{};
      const existing=stored.phraseEncaixes[id]||{selected:'custom',slots:[]};
      const slots=normalizeSlots(existing.slots,countSlots(p.pt));slots[index]=t.value.slice(0,240);
      stored.phraseEncaixes[id]={selected:'custom',slots};api.save();
      const preview=document.querySelector('[data-encaixe-preview="'+id+'"]');if(preview)preview.textContent=compose(p.pt,slots);
    });
  }
  return {init,card,compose,eligible,current,countSlots};
})();