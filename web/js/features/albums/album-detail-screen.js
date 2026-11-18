(function(G){
  const svg={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5" stroke-linecap="round"/></svg>',
    more:'<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="10" cy="16" r="1.7"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m2.25 12 8.95-8.95a1.13 1.13 0 0 1 1.6 0L21.75 12M4.5 9.75v10.13c0 .62.5 1.12 1.13 1.12h4.12v-4.88c0-.62.5-1.12 1.13-1.12h2.25c.62 0 1.12.5 1.12 1.12V21h4.13c.62 0 1.12-.5 1.12-1.12V9.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grid:'<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01" stroke-width="3" stroke-linecap="round"/></svg>',
    large:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5M21 16.5 16.5 21m0 0L12 16.5m4.5 4.5V7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cover:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
    rename:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke-linejoin="round"/></svg>',
    move:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="m12 11-3 3 3 3M9 14h7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-2l-3-3V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7l-3 3v2z"/></svg>'
  };
  const icon=n=>svg[n]||'';
  const coverFor=(items,id,isAlbum)=>items.find(m=>isAlbum?m.albumIds?.includes(id):m.folderId===id);
  function mediaView(items,view,selected){
    if(view==='grid') return G.AdaptiveMediaTimeline(items,{columns:G.appState.gridColumns||3,selected});
    if(!items.length)return '<div class="album-universal-empty"><h3>Nothing here yet</h3><p>Your media will appear here.</p></div>';
    return `<div class="album-media-view album-media-${view}">${items.map(x=>`<article class="album-media-tile media-thumb ${selected.has(x.id)?'selected':''}" data-media-id="${G.escape(x.id)}"><img src="${G.escape(x.uri)}" alt="${G.escape(x.name)}" loading="lazy">${x.type==='video'?'<span class="video-badge">'+G.icon('play')+'</span>':''}${G.Selection.active()&&G.Selection.kind()==='media'?`<span class="select-badge ${selected.has(x.id)?'is-selected':'is-unselected'}">${selected.has(x.id)?'✓':''}</span>`:''}<div class="album-media-meta"><strong>${G.escape(x.name)}</strong><small>${G.formatDate(x.date)}</small></div></article>`).join('')}</div>`;
  }
  G.AlbumDetailScreen={async render(el,p){
    const isFolder=p.scope==='folder'||p.folderId;
    const id=String(isFolder?(p.folderId||p.id):p.id);
    const archived=String(p.archived||'')==='1';
    const inMore=!isFolder && G.appState.moreAlbumIds?.has(id);
    let view=G.appState.albumView||'grid';
    const items=await G.services.media.list(isFolder?{folderId:id}:{albumId:id,includeArchived:archived});
    const folderSeed=(window.GalleryManagerSample?.folders||[]).find(f=>String(f.id)===id);
    const folderMedia=items.find(m=>m.folderId===id);
    const entity=isFolder
      ? (folderSeed || {id,name:folderMedia?.folder||id})
      : await G.services.albums.get(id,{includeArchived:archived});
    if(!entity){el.innerHTML=G.ErrorState(isFolder?'Folder not found':'Album not found','');return}
    const render=()=>{
      const sorted=G.Sorting.sort(items,G.appState.sort);
      el.innerHTML=`<div class="album-universal-page ${G.Selection.active()&&G.Selection.kind()==='media'?'selection-page-active':''}">
        <div class="album-universal-atmosphere"></div>
        <header class="album-universal-header">
          <div class="album-nav-row ${G.isInlineSearchActive(p)?'album-inline-search-row':''}">
            ${G.isInlineSearchActive(p)
              ? `${G.searchInlineMarkup('Exit search state')}<button class="album-round-btn inline-search-page-more" id="album-more" aria-label="More options" aria-expanded="false">${icon('more')}</button>`
              : `<button class="album-round-btn" id="album-back" aria-label="Back">${icon('back')}</button>
                 <div></div>
                 <div class="album-nav-actions"><button class="album-round-btn" id="album-search" aria-label="Search">${icon('search')}</button><button class="album-round-btn" id="album-more" aria-label="More options" aria-expanded="false">${icon('more')}</button></div>`}
          </div>
          <div class="screen-overflow-menu album-detail-overflow-menu" id="album-detail-overflow-menu" hidden>
            <button type="button" data-menu-action="cover">${icon('cover')}<span>${isFolder?'Change folder cover':'Change album cover'}</span></button>
            <button type="button" data-menu-action="rename">${icon('rename')}<span>Rename</span></button>
            <button type="button" data-menu-action="move">${icon('move')}<span>Move to other albums</span></button>
            <button type="button" data-menu-action="other-albums">${icon('move')}<span>${(!isFolder && G.appState.moreAlbumIds?.has(String(id)))?'Move to My Albums':'Move to Other Albums'}</span></button>
             ${isFolder?'':`<button type="button" data-menu-action="pin">${icon('pin')}<span>Pin album</span></button>`}
            <button type="button" data-menu-action="${archived?'restore-archive':'archive'}">${icon('move')}<span>${archived?'Restore album':'Archive album'}</span></button>
          </div>
          <section class="album-title-block">
            <h1>${G.escape(entity.name)}</h1>
            <p>${items.length} items</p>
            <div class="album-breadcrumb"><button data-root>${icon(archived?'folder':(isFolder?'folder':'home'))}<span>${archived?'Archive':(isFolder?'Device Folders':(inMore?'Other Albums':'My Albums'))}</span></button><b>›</b><strong>${G.escape(entity.name)}</strong></div>
          </section>
          <section class="album-view-controls">
            <button id="album-sort" class="album-sort-btn">${icon('sort')}<span>${G.Sorting.label(G.appState.sort)}</span><b>⌄</b></button>
            <div class="album-view-switcher">
              <button class="${view==='grid'?'active':''}" data-view="grid" aria-label="Grid view">${icon('grid')}</button>
              <button class="${view==='list'?'active':''}" data-view="list" aria-label="List view">${icon('list')}</button>
              <button class="${view==='large'?'active':''}" data-view="large" aria-label="Large card view">${icon('large')}</button>
            </div>
          </section>
        </header>
        <main class="album-universal-content">
          ${G.SelectionHeader(items.map(x=>x.id),'media')}
          ${G.SelectionBar(G.appState.selected.size,'media')}
          ${mediaView(sorted,view,G.appState.selected)}
        </main>
      </div>`;
      if(G.isInlineSearchActive(p)){
        el.querySelector('.inline-search-back').onclick=()=>G.router.back();
        G.wireInlineSearchInput(el);
      }else{
        el.querySelector('#album-back').onclick=()=>G.router.back();
        el.querySelector('#album-search').onclick=()=>G.activateInlineSearch();
      }
      el.querySelector('[data-root]').onclick=()=>archived?G.router.go('archive',{view:'albums'}):isFolder?G.router.go('browse',{mode:'folders',_nav:p._nav}):G.router.go('albums',{_nav:p._nav});
      const menu=el.querySelector('#album-detail-overflow-menu');
      const more=el.querySelector('#album-more');
      const closeMenu=()=>{menu.hidden=true;more.setAttribute('aria-expanded','false')};
      more.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden))};
      menu.onclick=async e=>{
        const button=e.target.closest('[data-menu-action]'); if(!button)return;
        e.stopPropagation(); const action=button.dataset.menuAction; closeMenu();
        if(action==='cover'){
          return G.openCoverPicker?.({
            type:isFolder?'folder':'album',
            id,
            items,
            coverId:entity.coverId,
            title:isFolder?'Change folder cover':'Change album cover'
          });
        }
        if(action==='rename'){
          return G.dialog({
            title:isFolder?'Rename folder':'Rename album',
            body:`<input class="modal-input" id="album-rename-input" value="${G.escape(entity.name)}" placeholder="${isFolder?'Folder':'Album'} name">`,
            confirm:'Save',
            onConfirm:async()=>{
              const n=document.getElementById('album-rename-input')?.value.trim();
              if(!n)return;
              if(isFolder){
                if(G.services.files.renameFolder){await G.services.files.renameFolder(id,n);G.toast('Folder renamed.');G.renderScreen();}
                else G.toast('Folder rename is unavailable in this runtime.','error');
              }else{
                await G.services.albums.rename(id,n);G.toast('Album renamed.');G.renderScreen();
              }
            }
          });
        }
        if(action==='move'){
          return G.openAlbumDestinationPicker(items.map(x=>x.id));
        }
        if(action==='other-albums' && !isFolder){
          const inMore=G.appState.moreAlbumIds?.has(String(id));
          if(inMore) await G.services.albums.moveToMy(id);
          else await G.services.albums.moveToMore(id);
          G.toast(inMore?'Moved to My Albums.':'Moved to Other Albums.');
          G.renderScreen();
          return;
        }
        if(action==='pin'){
          if(isFolder){
            const next=new Set(G.appState.pinnedFolderIds||[]);
            next.has(id)?next.delete(id):next.add(id);
            G.appState.patch({pinnedFolderIds:next});
            try{localStorage.setItem('gallerymanager.pinnedFolders.initialized.v1','1')}catch{}
            G.toast(next.has(id)?'Folder pinned.':'Folder unpinned.');
            return;
          }
          await G.services.albums.togglePin(id);G.toast('Album pin updated.');G.renderScreen();
        }
        if(action==='archive'){
          if(isFolder) return G.toast('Device folders cannot be archived.');
          await G.services.archive.archiveAlbum(id);G.toast('Album archived.');G.router.back();
        }
        if(action==='restore-archive'){
          await G.services.archive.restoreAlbum(id);G.toast('Album restored.');G.router.back();
        }
      };
      el.onclick=function albumDetailMenuOutside(e){
        if(!menu.hidden && !e.target.closest('#album-more') && !e.target.closest('#album-detail-overflow-menu')) closeMenu();
      };
      el.querySelector('#album-sort').onclick=()=>{
        const d=G.dialog({title:'Sort media',body:`<div class="choice-list">${G.Sorting.OPTIONS.map(o=>`<button data-sort-choice="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}</div>`,confirm:'Done',onConfirm:()=>{}});
        d.querySelectorAll('[data-sort-choice]').forEach(b=>b.onclick=()=>{G.appState.patch({sort:b.dataset.sortChoice});d.remove()});
      };
      el.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;G.appState.albumView=view;render()});
      G.wireSelectionChrome(el,sorted.map(x=>x.id),'media');
      if(view==='grid'){
        G.wireAdaptiveMedia(el,sorted);
      }else{
        G.wireSelectionTiles(el,'.album-media-tile',sorted,{kind:'media',open:mid=>G.router.go('viewer',{id:mid,_nav:p._nav,...(archived?{archived:'1'}:{})})});
      }
    };
    render();
  }};
})(window.GalleryManager=window.GalleryManager||{});
