(function(G){
  const icons={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h11a5 5 0 0 1 0 10H8m-5-10 4-4M3 9l4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 9H10a5 5 0 0 0 0 10h6m5-10-4-4m4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg>',
    crop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    adjust:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h10m4 0h4M3 12h4m4 0h10M3 18h12m4 0h2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8.5" r="4.5"/><circle cx="8.5" cy="14.5" r="4.5"/><circle cx="15.5" cy="14.5" r="4.5"/></svg>',
    smile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.5 2.2 2 3.5 2s2.5-.5 3.5-2" stroke-linecap="round"/></svg>',
    frame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><rect x="7" y="7" width="10" height="10" rx=".5" stroke-dasharray="1 1"/></svg>'
  };
  const icon=n=>icons[n]||'';

  G.EditorScreen={async render(el,p){
    const x=await G.services.media.get(p.id);
    if(!x||x.type!=='image'){el.innerHTML=G.ErrorState('Image unavailable','Only images can be edited.');return}
    el.innerHTML=`<div class="editor">
      <section class="editor-preview"><canvas id="canvas"></canvas><div class="editor-vignette editor-vignette-top"></div><div class="editor-vignette editor-vignette-bottom"></div></section>
      <header class="editor-top"><button class="editor-back" id="back" aria-label="Back">${icon('back')}</button>
        <div class="editor-history"><button id="undo" aria-label="Undo">${icon('undo')}</button><i></i><button id="redo" aria-label="Redo">${icon('redo')}</button></div>
        <button class="editor-save" id="save">Save</button></header>
      <footer class="editor-dock"><div class="editor-main-tools"><button class="editor-original" id="original" aria-label="View original">${icon('eye')}</button>
        <div class="editor-tool-scroll">
          <button class="editor-tool active" data-tool="crop"><span>${icon('crop')}</span><label>Crop</label></button>
          <button class="editor-tool" data-tool="filter"><span>${icon('filter')}</span><label>Filter</label></button>
          <button class="editor-tool" data-tool="adjust"><span>${icon('adjust')}</span><label>Adjust</label></button>
          <button class="editor-tool" data-tool="text"><span class="editor-letter">T</span><label>Text</label></button>
          <button class="editor-tool" data-tool="sticker"><span>${icon('smile')}</span><label>Sticker</label></button>
          <button class="editor-tool" data-tool="frame"><span>${icon('frame')}</span><label>Frame</label></button>
        </div></div><div class="editor-controls" id="controls"></div><div class="editor-home-indicator"></div></footer>
    </div>`;

    const canvas=el.querySelector('#canvas'),ctx=canvas.getContext('2d'),img=new Image();img.src=x.uri;
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject});
    const initial={brightness:0,contrast:1,saturation:1,exposure:0,crop:false,filter:'none',text:'',sticker:'',frame:'none'};
    let vals={...initial},undoStack=[],redoStack=[];
    const snapshot=()=>JSON.parse(JSON.stringify(vals));
    const restore=s=>{vals={...s};draw();controls(document.querySelector('.editor-tool.active')?.dataset.tool||'crop');syncHistory()};
    const pushHistory=()=>{undoStack.push(snapshot());if(undoStack.length>40)undoStack.shift();redoStack=[];syncHistory()};
    const syncHistory=()=>{el.querySelector('#undo').disabled=!undoStack.length;el.querySelector('#redo').disabled=!redoStack.length};

    function draw(){
      const w=img.naturalWidth||640,h=img.naturalHeight||420,s=vals.crop?Math.min(w,h):null;
      canvas.width=s||w;canvas.height=s||h;ctx.save();
      ctx.filter=`brightness(${1+vals.brightness+vals.exposure}) contrast(${vals.contrast}) saturate(${vals.saturation})`;
      if(vals.filter==='grayscale')ctx.filter+=' grayscale(1)';
      if(vals.filter==='sepia')ctx.filter+=' sepia(.75)';
      if(vals.filter==='warm')ctx.filter+=' saturate(1.25) brightness(1.06)';
      if(s)ctx.drawImage(img,(w-s)/-2,(h-s)/-2,w,h);else ctx.drawImage(img,0,0,w,h);
      ctx.filter='none';
      if(vals.text){ctx.fillStyle='white';ctx.textAlign='center';ctx.font=`bold ${Math.max(22,canvas.width*.045)}px system-ui`;ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=6;ctx.fillText(vals.text,canvas.width/2,canvas.height-Math.max(28,canvas.height*.08));}
      if(vals.sticker){ctx.font=`${Math.max(40,canvas.width*.12)}px system-ui`;ctx.textAlign='center';ctx.fillText(vals.sticker,canvas.width/2,canvas.height*.18);}
      if(vals.frame!=='none'){ctx.strokeStyle=vals.frame==='double'?'white':'rgba(255,255,255,.75)';ctx.lineWidth=vals.frame==='double'?Math.max(8,canvas.width*.018):Math.max(4,canvas.width*.01);ctx.strokeRect(ctx.lineWidth/2,ctx.lineWidth/2,canvas.width-ctx.lineWidth,canvas.height-ctx.lineWidth);if(vals.frame==='double'){ctx.lineWidth=Math.max(2,canvas.width*.006);ctx.strokeRect(ctx.lineWidth*3,ctx.lineWidth*3,canvas.width-ctx.lineWidth*6,canvas.height-ctx.lineWidth*6);}}
      ctx.restore();
    }

    function controls(tool){
      const c=el.querySelector('#controls');
      if(tool==='adjust') c.innerHTML=[['brightness',-1,1,.01],['contrast',.5,1.8,.01],['saturation',0,2,.01],['exposure',-.5,.5,.01]].map(v=>`<label>${v[0]}<input type="range" min="${v[1]}" max="${v[2]}" step="${v[3]}" value="${vals[v[0]]}" data-v="${v[0]}"></label>`).join('');
      else if(tool==='crop') c.innerHTML=`<button class="editor-control-button" id="cropSquare">${vals.crop?'Square crop enabled':'Square crop'}</button>`;
      else if(tool==='filter') c.innerHTML=`<div class="choice-list editor-choice-list">${[['none','Original'],['grayscale','Mono'],['sepia','Sepia'],['warm','Warm']].map(([v,l])=>`<button type="button" data-filter="${v}" class="${vals.filter===v?'chosen':''}">${l}<span>${vals.filter===v?'✓':''}</span></button>`).join('')}</div>`;
      else if(tool==='text') c.innerHTML=`<div class="editor-inline-form"><input class="modal-input" id="editor-text" maxlength="80" value="${G.escape(vals.text)}" placeholder="Text on photo"><button class="editor-control-button" id="apply-text">Apply</button></div>`;
      else if(tool==='sticker') c.innerHTML=`<div class="editor-sticker-row">${['❤️','⭐','✨','😊','🌿','🔥'].map(v=>`<button type="button" data-sticker="${v}" class="${vals.sticker===v?'chosen':''}">${v}</button>`).join('')}</div>`;
      else if(tool==='frame') c.innerHTML=`<div class="choice-list editor-choice-list">${[['none','None'],['single','Single'],['double','Double']].map(([v,l])=>`<button type="button" data-frame="${v}" class="${vals.frame===v?'chosen':''}">${l}<span>${vals.frame===v?'✓':''}</span></button>`).join('')}</div>`;
      c.querySelectorAll('[data-v]').forEach(i=>i.oninput=()=>{pushHistory();vals[i.dataset.v]=Number(i.value);draw()});
      c.querySelector('#cropSquare')?.addEventListener('click',()=>{pushHistory();vals.crop=!vals.crop;draw();controls('crop')});
      c.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{pushHistory();vals.filter=b.dataset.filter;draw();controls('filter')});
      c.querySelector('#apply-text')?.addEventListener('click',()=>{pushHistory();vals.text=c.querySelector('#editor-text').value.trim();draw();G.toast(vals.text?'Text added.':'Text cleared.')});
      c.querySelectorAll('[data-sticker]').forEach(b=>b.onclick=()=>{pushHistory();vals.sticker=b.dataset.sticker;draw();controls('sticker')});
      c.querySelectorAll('[data-frame]').forEach(b=>b.onclick=()=>{pushHistory();vals.frame=b.dataset.frame;draw();controls('frame')});
    }

    el.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{el.querySelectorAll('.editor-tool').forEach(t=>t.classList.remove('active'));b.classList.add('active');controls(b.dataset.tool)});
    el.querySelector('#back').onclick=()=>G.router.back();
    el.querySelector('#undo').onclick=()=>{if(!undoStack.length)return;redoStack.push(snapshot());restore(undoStack.pop());};
    el.querySelector('#redo').onclick=()=>{if(!redoStack.length)return;undoStack.push(snapshot());restore(redoStack.pop());};
    el.querySelector('#original').onclick=()=>{const saved=snapshot();vals={...initial};draw();G.toast('Showing original.');setTimeout(()=>{vals=saved;draw();},1200)};
    el.querySelector('#save').onclick=()=>{const a=document.createElement('a');a.download=`Edited_${Date.now()}.png`;a.href=canvas.toDataURL('image/png');a.click();G.toast('Edited copy saved locally. Original remains unchanged.')};
    draw();controls('crop');syncHistory();
  }};
})(window.GalleryManager=window.GalleryManager||{});
