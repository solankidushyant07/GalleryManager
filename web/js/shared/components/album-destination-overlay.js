(function(G){
  const icon={
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2zM14 8h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14M5 8a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-9 4h4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 10V7a6 6 0 0 1 12 0v3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm3 0h6V7a3 3 0 0 0-6 0z"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    move:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M2 6c0-1.1.9-2 2-2h4l2.5 3H20c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6z"/><path d="M9.5 13.5h6M13 11l2.5 2.5L13 16" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plusImage:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/><path d="M17 10h6m-3-3v6" stroke-linecap="round"/></svg>'
  };
  const esc=s=>G.escape(s);
  function foldersFromMedia(media){
    const seed=window.GalleryManagerSample?.folders||[];
    const out=seed.map(x=>({...x}));
    const seen=new Set(out.map(x=>String(x.id)));
    for(const m of media){
      if(!m.folderId&&!m.folder)return;
      const id=String(m.folderId||m.folder);
      if(!seen.has(id)){out.push({id,name:m.folder||id});seen.add(id)}
    }
    return out;
  }
  function selectedPreview(ids,media){
    const picked=ids.map(id=>media.find(m=>String(m.id)===String(id))).filter(Boolean);
    const thumbs=picked.slice(0,2);
    return `<div class="album-overlay-preview"><div class="album-preview-stack">
      ${thumbs[0]?`<img class="album-preview-back" src="${esc(thumbs[0].uri)}" alt="">`:''}
      ${thumbs[1]?`<img class="album-preview-front" src="${esc(thumbs[1].uri)}" alt="">`:thumbs[0]?`<img class="album-preview-front" src="${esc(thumbs[0].uri)}" alt="">`:''}
      <span class="album-preview-count">${ids.length}</span>
    </div></div>`;
  }
  function removeOverlay(id){document.getElementById(id)?.remove()}
  function actionDialog(ids,dest,media,mode='choose'){
    const id='media-action-'+Date.now();
    const thumb=selectedPreview(ids,media);
    const isAlbum=dest.kind==='album';
    G.overlayRoot().insertAdjacentHTML('beforeend',`<div class="album-modal-backdrop" id="${id}">
      <main class="album-action-modal" role="dialog" aria-modal="true">
        <header class="album-action-head"><h2>Adding photos</h2><p>to “${esc(dest.name)}”</p></header>
        ${thumb}
        ${mode==='choose'?`<section class="album-action-choices" aria-label="Copy or move">
          <button data-choice="copy"><span class="album-action-icon">${icon.copy}</span><strong>Copy</strong><small>Keep a copy in this album</small></button>
          <button data-choice="move"><span class="album-action-icon">${icon.move}</span><strong>Move</strong><small>Move to this album</small></button>
        </section>`:''}
        <button class="album-action-cancel" data-cancel>Cancel</button>
      </main>
    </div>`);
    const root=document.getElementById(id);
    const finish=()=>removeOverlay(id);
    root.querySelector('[data-cancel]').onclick=finish;
    root.onclick=e=>{if(e.target===root)finish()};
    const complete=async chosenMode=>{
      try{
        if(isAlbum){
          await G.services.albums.addMembers(dest.id,ids);
          if(chosenMode==='move'){
            const albums=await G.services.albums.list();
            for(const a of albums.filter(a=>a.id!==dest.id)) await G.services.albums.removeMembers(a.id,ids);
          }
        }else{
          await G.services.files[chosenMode](ids,dest.name);
        }
        G.toast(chosenMode==='copy'?'Copied to '+dest.name+'.':'Moved to '+dest.name+'.');
        G.Selection.clear(); finish(); G.renderScreen();
      }catch(err){G.toast('Could not complete the operation.','error')}
    };
    if(mode==='add'||mode==='move'){
      root.querySelector('.album-action-modal')?.classList.add('album-action-auto');
      complete(mode==='add'?'copy':'move');
    }
    root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>complete(b.dataset.choice));
  }
  G.openAlbumDestinationPicker=async function(ids,opts={}){
    if(!ids?.length)return;
    const mode=opts.mode||'choose';
    const media=await G.services.media.list();
    const albums=await G.services.albums.list();
    const folders=foldersFromMedia(media);
    const id='album-picker-'+Date.now();
    G.overlayRoot().insertAdjacentHTML('beforeend',`<div class="album-sheet-backdrop" id="${id}">
      <section class="album-picker-sheet" role="dialog" aria-modal="true" aria-label="Add to album">
        <div class="album-sheet-handle"></div>
        <button class="album-sheet-close" data-close aria-label="Close">${icon.close}</button>
        <header class="album-picker-header">${selectedPreview(ids,media)}<h2>${mode==='move'?'Move to':'Add to album'}</h2><p>${ids.length} ${ids.length===1?'photo':'photos'} selected</p></header>
        ${mode==='choose'?`<section class="album-quick-actions">
          <button data-quick="archive"><span class="quick-tone archive">${icon.archive}</span><span><strong>Archive</strong><small>Move to archive</small></span></button>
          <button data-quick="private"><span class="quick-tone private">${icon.lock}</span><span><strong>Private album</strong><small>Keep it private</small></span></button>
        </section>`:''}
        <section class="album-picker-section"><h3>Device albums</h3><div class="album-picker-grid">
          ${folders.filter(f=>String(f.name).toLowerCase()!=='all media').map(f=>{
            const count=media.filter(m=>m.folderId===f.id&&!m.trashed).length;
            const cover=media.find(m=>m.folderId===f.id&&!m.trashed);
            return `<button class="album-picker-tile" data-dest-kind="folder" data-dest-id="${esc(f.id)}" data-dest-name="${esc(f.name)}"><span class="album-picker-cover">${cover?`<img src="${esc(cover.uri)}" alt="">`:icon.folder}</span><strong>${esc(f.name)}</strong><small>${count}</small></button>`;
          }).join('')}
        </div></section>
        <section class="album-picker-section"><div class="album-picker-section-head"><div><h3>My albums</h3><small>${albums.length} items</small></div></div><div class="album-picker-grid">
          ${albums.map(a=>{const cover=media.find(m=>m.albumIds?.includes(a.id));return `<button class="album-picker-tile" data-dest-kind="album" data-dest-id="${esc(a.id)}" data-dest-name="${esc(a.name)}"><span class="album-picker-cover">${cover?`<img src="${esc(cover.uri)}" alt="">`:icon.folder}</span><strong>${esc(a.name)}</strong><small>${a.count}</small></button>`}).join('')}
        </div></section>
        <button class="album-picker-new" id="picker-new">${icon.plusImage}<span>Create new album</span></button>
      </section>
    </div>`);
    const root=document.getElementById(id);
    const close=()=>removeOverlay(id);
    root.querySelector('[data-close]').onclick=close;
    root.onclick=e=>{if(e.target===root)close()};
    root.querySelectorAll('[data-dest-kind]').forEach(b=>b.onclick=()=>{
      close();
      actionDialog(ids,{kind:b.dataset.destKind,id:b.dataset.destId,name:b.dataset.destName},media,mode);
    });
    root.querySelectorAll('[data-quick]').forEach(b=>b.onclick=async()=>{
      if(b.dataset.quick==='private'){
        close();
        try{
          const state=await G.services.privateVault?.state?.();
          if(state?.unlocked){
            const picked=(await G.services.media.list({includeArchived:true,includeTrash:true})).filter(x=>ids.includes(x.id));
            await G.services.privateVault.import(picked.map(x=>({id:x.id,name:x.name,uri:x.uri,type:x.type,mime:x.mime,size:x.size,width:x.width,height:x.height})));
            G.Selection.clear();G.toast(`${picked.length} item(s) added to Private.`);
            G.renderScreen();
          }else{
            G.router.go('private',{pending:ids.join(',')});
          }
        }catch(err){G.toast(err?.message||'Could not add the selected media to Private.','error')}
        return;
      }
      try{await G.services.archive.archiveMedia(ids);G.toast('Archived selected media.');G.Selection.clear();close();G.renderScreen()}catch(err){G.toast('Could not archive the selected media.','error');close()}
    });
    root.querySelector('#picker-new').onclick=()=>{
      close();
      G.dialog({title:'New album',body:'<input class="modal-input" id="new-album-name" placeholder="Album name">',confirm:'Create',onConfirm:async()=>{
        const n=document.getElementById('new-album-name')?.value.trim();
        if(n){await G.services.albums.create(n);G.toast('Album created.');G.openAlbumDestinationPicker(ids)}
      }});
    };
  };
})(window.GalleryManager=window.GalleryManager||{});
