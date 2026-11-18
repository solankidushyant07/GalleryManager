(function(G){G.MediaGrid=function(items,opts={}){if(!items.length)return `<div class="empty-state"><div class="empty-icon">⌁</div><h3>${G.escape(opts.emptyTitle||'Nothing here yet')}</h3><p>${G.escape(opts.emptyText||'Your media will appear here.')}</p></div>`;return `<div class="media-grid cols-${opts.columns||G.appState.gridColumns}">${items.map(x=>G.MediaThumbnail(x,opts.selected?.has(x.id),opts.selectionMode)).join('')}</div>`}})(window.GalleryManager=window.GalleryManager||{});

(function(G){G.wireMediaGrid=function(root,items,{selectable=true,open=true,kind='media'}={}){
 const list=items||[];
 root.querySelectorAll('.media-thumb').forEach(el=>{
   let press=null,longPressed=false,moved=false,startX=0,startY=0;
   const LONG_PRESS_MS=340, MOVE_TOLERANCE=14;
   const clear=()=>{if(press){clearTimeout(press);press=null}};
   const feedback=()=>{
     el.classList.add('selection-longpressing');
     setTimeout(()=>el.classList.remove('selection-longpressing'),140);
     try{navigator.vibrate?.(8)}catch{}
   };
   el.classList.add('selection-touch-target');
   el.addEventListener('contextmenu',e=>e.preventDefault());
   el.onpointerdown=e=>{
     if(!selectable || (e.pointerType==='mouse' && e.button!==0))return;
     clear();longPressed=false;moved=false;startX=e.clientX;startY=e.clientY;
     el.setPointerCapture?.(e.pointerId);
     press=setTimeout(()=>{
       press=null;if(moved)return;
       longPressed=true;feedback();
       G.Selection.add(el.dataset.mediaId,kind);
     },LONG_PRESS_MS);
   };
   el.onpointermove=e=>{
     if(!press)return;
     if(Math.hypot(e.clientX-startX,e.clientY-startY)>MOVE_TOLERANCE){moved=true;clear();}
   };
   el.onpointerup=e=>{clear();el.releasePointerCapture?.(e.pointerId)};
   el.onpointercancel=e=>{clear();el.releasePointerCapture?.(e.pointerId)};
   el.onclick=e=>{
     clear();
     if(longPressed){longPressed=false;return}
     if(moved)return;
     const id=String(el.dataset.mediaId);
     if(G.Selection.active() && G.Selection.kind()===kind){G.Selection.toggle(id,kind);return}
     if(open)G.router.go('viewer',{id});
   };
 });
}})(window.GalleryManager=window.GalleryManager||{});
