(function(G){
  const icons={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.5 19.5L3 12m0 0 7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8.25 4.5l7.5 7.5-3 3-6-6 1.5-4.5zM12 12l6 6M12 18l-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more:'<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>',
    share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-3.8M8.6 13.5l6.8 3.8" stroke-linecap="round"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m16.86 4.49 1.69-1.69a1.88 1.88 0 1 1 2.65 2.65L6.83 19.82a4.5 4.5 0 0 1-1.9 1.13l-2.68.8.8-2.68a4.5 4.5 0 0 1 1.13-1.9L16.86 4.49z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.65 20.91a.75.75 0 0 0 .7 0l.03-.02.02-.01c.13-.07.26-.15.38-.22 2.3-1.31 7.54-5.24 7.54-10.41C20.32 5.33 17.85 3 14.88 3A5.5 5.5 0 0 0 12 5.05 5.5 5.5 0 0 0 9.12 3C6.15 3 3.68 5.33 3.68 6.25c0 5.17 5.24 9.1 7.54 10.41.12.07.25.15.38.22l.02.01.03.02z"/></svg>',
    heartEmpty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20.8 8.25c0 5.17-5.24 9.1-7.54 10.41-.13.07-.26.15-.38.22l-.02.01-.03.02a.75.75 0 0 1-.7 0l-.03-.02-.02-.01c-.12-.07-.25-.15-.38-.22C9.4 17.35 4.2 13.42 4.2 8.25 4.2 5.33 6.66 3 9.64 3A5.5 5.5 0 0 1 12 4.05 5.5 5.5 0 0 1 14.36 3c2.98 0 6.44 2.33 6.44 5.25z"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14.74 9l-.35 9M9.61 18l-.35-9M4.77 5.79h14.46M9 5.79V4.88c0-1.18.91-2.16 2.09-2.2a52 52 0 0 1 3.32 0c1.18.04 2.09 1.02 2.09 2.2v.91M6 5.79l1.09 13.88a2.25 2.25 0 0 0 2.24 2.08h5.34a2.25 2.25 0 0 0 2.24-2.08L18 5.79" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M12 10.5v6M12 7.5h.01" stroke-linecap="round"/></svg>',
    cover:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
    album:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m3 16 5-5c.9-.9 2.1-.9 3 0l7 7M14 14l1-1c.9-.9 2.1-.9 3 0l3 3"/></svg>',
    wallpaper:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3" stroke-linecap="round"/></svg>',
    rename:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16.86 3.49a2.25 2.25 0 1 1 3.18 3.18L7.5 19.21l-4.5 1 1-4.5L16.86 3.49z" stroke-linejoin="round"/></svg>',
    pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5.25A1.25 1.25 0 0 1 7.25 4h1.5A1.25 1.25 0 0 1 10 5.25v13.5A1.25 1.25 0 0 1 8.75 20h-1.5A1.25 1.25 0 0 1 6 18.75V5.25zm8 0A1.25 1.25 0 0 1 15.25 4h1.5A1.25 1.25 0 0 1 18 5.25v13.5A1.25 1.25 0 0 1 16.75 20h-1.5A1.25 1.25 0 0 1 14 18.75V5.25z"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7z"/></svg>'
  };
  const icon=n=>icons[n]||'';

  G.ViewerScreen={async render(el,p){
    const items=String(p.archived||'')==='1'
      ? await G.services.archive.listMedia()
      : String(p.trashed||'')==='1'
        ? (await G.services.media.listWithImports({includeTrash:true})).filter(x=>x.trashed)
        : await G.services.media.listWithImports({});
    let i=items.findIndex(x=>x.id===p.id);
    if(i<0){el.innerHTML=G.ErrorState('Media not found','');return}
    const item=items[i];
    const allAlbums=await G.services.albums.list({includeArchived:true}).catch(()=>[]);
    const relatedAlbums=allAlbums.filter(a=>Array.isArray(item.albumIds)&&item.albumIds.some(id=>String(id)===String(a.id)));
    const pinned=G.appState.pinnedIds.has(item.id);

    el.innerHTML=`<div class="viewer viewer-controls-hidden" tabindex="0">
      <div class="viewer-media" id="viewer-media">
        ${item.type==='video'
          ? `<video id="viewer-video" src="${G.escape(item.uri)}" playsinline preload="metadata"></video>`
          : `<img id="viewer-image" src="${G.escape(item.uri)}" alt="${G.escape(item.name)}">`}
      </div>
      <div class="viewer-vignette viewer-vignette-top"></div>
      <div class="viewer-vignette viewer-vignette-bottom"></div>

      <header class="viewer-top">
        <button class="viewer-back" id="close" aria-label="Go back">${icon('back')}</button>
        <div class="viewer-title">
          <b>${G.escape(item.name)}</b>
          <small>${i+1} / ${items.length}</small>
        </div>
        <div class="viewer-top-actions">
          <button class="viewer-action ${pinned?'is-active':''}" id="pin" aria-label="Pin">${icon('pin')}</button>
          <button class="viewer-more" id="vmore" aria-label="More options" aria-expanded="false">${icon('more')}</button>
        </div>
        <div class="screen-overflow-menu viewer-overflow-menu" id="viewer-overflow-menu" hidden>
          <button type="button" data-menu-action="album">${icon('album')}<span>Add to album</span></button>
          ${item.type==='image'&&relatedAlbums.length?`<button type="button" data-menu-action="cover-album">${icon('cover')}<span>Change album cover</span></button>`:''}
          ${item.type==='image'&&item.folderId?`<button type="button" data-menu-action="cover-folder">${icon('cover')}<span>Change folder cover</span></button>`:''}
          <button type="button" data-menu-action="wallpaper">${icon('wallpaper')}<span>Set as wallpaper</span></button>
          <button type="button" data-menu-action="rename">${icon('rename')}<span>Rename</span></button>
          <button type="button" data-menu-action="info">${icon('info')}<span>Info</span></button>
        </div>
      </header>

      ${item.type==='video'?`<button class="viewer-play" id="video-play" aria-label="Play or pause">${icon('play')}</button>`:''}

      <footer class="viewer-bottom">
        ${item.type==='video'?`<div class="viewer-playback">
          <span id="elapsed">00:00</span>
          <input id="scrubber" type="range" min="0" max="100" value="0" aria-label="Video progress">
          <span id="remaining">00:00</span>
        </div>`:''}
        <nav class="viewer-action-dock" aria-label="Media actions">
          <button class="viewer-dock-action" id="share">${icon('share')}<span>Share</span></button>
          <button class="viewer-dock-action" id="edit" ${item.type==='video'?'disabled':''}>${icon('edit')}<span>Edit</span></button>
          <button class="viewer-dock-action ${item.favorite?'is-active':''}" id="fav">${item.favorite?icon('heart'):icon('heartEmpty')}<span>Favourite</span></button>
          <button class="viewer-dock-action" id="delete">${icon('trash')}<span>Delete</span></button>
        </nav>
        <button class="viewer-info-row" id="info">${icon('info')}<span>View information</span></button>
        <div class="viewer-home-indicator"></div>
      </footer>
    </div>`;

    const root=el.querySelector('.viewer');
    const media=el.querySelector('#viewer-media');
    const video=el.querySelector('#viewer-video');
    const toggleControls=force=>{
      const hidden=root.classList.contains('viewer-controls-hidden');
      root.classList.toggle('viewer-controls-hidden',force===undefined?!hidden:!force);
    };

    el.querySelector('#close').onclick=e=>{e.stopPropagation();G.router.back()};
    el.querySelector('#pin').onclick=e=>{
      e.stopPropagation();
      if(G.appState.pinnedIds.has(item.id)) G.appState.pinnedIds.delete(item.id);
      else G.appState.pinnedIds.add(item.id);
      G.toast(G.appState.pinnedIds.has(item.id)?'Pinned.':'Unpinned.');
      G.renderScreen();
    };
    const menu=el.querySelector('#viewer-overflow-menu');
    const more=el.querySelector('#vmore');
    const closeMenu=()=>{menu.hidden=true;more.setAttribute('aria-expanded','false')};
    more.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden))};
    menu.onclick=async e=>{
      const button=e.target.closest('[data-menu-action]'); if(!button)return;
      e.stopPropagation(); const action=button.dataset.menuAction; closeMenu();
      if(action==='album') return G.openAlbumDestinationPicker([item.id]);
      if(action==='cover-album'){
        if(relatedAlbums.length===1){
          const a=relatedAlbums[0];
          return G.openCoverPicker?.({type:'album',id:a.id,items:await G.services.media.list({albumId:a.id,includeArchived:true}),coverId:a.coverId,title:`Change album cover · ${a.name}`});
        }
        const d=G.dialog({title:'Choose album',body:`<div class="choice-list">${relatedAlbums.map(a=>`<button type="button" data-cover-album-id="${G.escape(a.id)}">${G.escape(a.name)}<span>›</span></button>`).join('')}</div>`,confirm:'Done',onConfirm:()=>{}});
        d.querySelectorAll('[data-cover-album-id]').forEach(b=>b.onclick=async()=>{
          const a=relatedAlbums.find(x=>String(x.id)===String(b.dataset.coverAlbumId)); if(!a)return;
          d.remove();
          G.openCoverPicker?.({type:'album',id:a.id,items:await G.services.media.list({albumId:a.id,includeArchived:true}),coverId:a.coverId,title:`Change album cover · ${a.name}`});
        });
        return;
      }
      if(action==='cover-folder'){
        const folderItems=await G.services.media.list({folderId:item.folderId});
        return G.openCoverPicker?.({type:'folder',id:item.folderId,items:folderItems,title:'Change folder cover'});
      }
      if(action==='wallpaper'){return G.services.wallpaper.set(item).then(()=>G.toast('Set as wallpaper.')).catch(err=>G.toast(err?.message||'Wallpaper is unavailable in this runtime.','error'));}
      if(action==='info') return G.router.go('fileinfo',{id:item.id});
      if(action==='rename'){
        return G.dialog({
          title:'Rename media',
          body:`<input class="modal-input" id="viewer-rename-input" value="${G.escape(item.name)}" placeholder="File name">`,
          confirm:'Save',
          onConfirm:async()=>{
            const n=document.getElementById('viewer-rename-input')?.value.trim();
            if(n){await G.services.files.rename(item.id,n);G.toast('Media renamed.');G.renderScreen();}
          }
        });
      }
    };
    el.onclick=function viewerMenuOutside(e){
      if(!menu.hidden && !e.target.closest('#vmore') && !e.target.closest('#viewer-overflow-menu')) closeMenu();
    };
    el.querySelector('#fav').onclick=async e=>{e.stopPropagation();await G.services.favorites.toggle([item.id],!item.favorite);G.toast(item.favorite?'Removed from favorites.':'Added to favorites.');G.renderScreen()};
    el.querySelector('#info').onclick=e=>{e.stopPropagation();G.router.go('fileinfo',{id:item.id})};
    el.querySelector('#edit').onclick=e=>{e.stopPropagation();if(item.type==='image')G.router.go('editor',{id:item.id})};
    el.querySelector('#delete').onclick=e=>{
      e.stopPropagation();
      if(String(p.trashed||'')==='1'){
        return G.dialog({title:'Delete permanently?',body:'This item is already in Trash and will be permanently deleted.',confirm:'Delete permanently',onConfirm:async()=>{await G.services.trash.permanentDelete([item.id]);G.toast('Deleted permanently.');G.router.back()}});
      }
      G.dialog({title:'Move to Trash?',body:'The item can be restored for 30 days.',confirm:'Move to Trash',onConfirm:async()=>{await G.services.files.trash([item.id]);G.toast('Moved to Trash.');G.router.back()}});
    };
    el.querySelector('#share').onclick=async e=>{
      e.stopPropagation();
      if(navigator.share){await navigator.share({title:item.name,url:item.uri}).catch(()=>{});return}
      try{
        const a=document.createElement('a');a.href=item.uri;a.download=item.name;a.click();
        G.toast('A shareable copy was downloaded.');
      }catch(err){await navigator.clipboard?.writeText(item.name);G.toast('Sharing is unavailable in this runtime.','error')}
    };

    if(video){
      const fmt=s=>{s=Math.max(0,Math.floor(s||0));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};
      const sync=()=>{el.querySelector('#elapsed').textContent=fmt(video.currentTime);el.querySelector('#remaining').textContent=fmt((video.duration||0)-video.currentTime);el.querySelector('#scrubber').value=video.duration?(video.currentTime/video.duration*100):0;};
      const play=()=>{if(video.paused){video.play().catch(()=>{});root.classList.add('video-playing')}else{video.pause();root.classList.remove('video-playing')}};
      el.querySelector('#video-play').onclick=e=>{e.stopPropagation();play()};
      video.addEventListener('timeupdate',sync); video.addEventListener('loadedmetadata',sync);
      el.querySelector('#scrubber').oninput=e=>{if(video.duration)video.currentTime=video.duration*(Number(e.target.value)/100)};
      video.addEventListener('play',()=>root.classList.add('video-playing'));
      video.addEventListener('pause',()=>root.classList.remove('video-playing'));
    }

    let startX=0,startY=0;
    media.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY});
    media.addEventListener('pointerup',e=>{
      const dx=e.clientX-startX,dy=e.clientY-startY;
      if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)){i=Math.max(0,Math.min(items.length-1,i+(dx<0?1:-1)));G.router.replace('viewer',{id:items[i].id,...(p.archived?{archived:'1'}:{}),...(p.trashed?{trashed:'1'}:{})});return}
      if(Math.abs(dx)<12&&Math.abs(dy)<12)toggleControls();
    });
  }};
})(window.GalleryManager=window.GalleryManager||{});
