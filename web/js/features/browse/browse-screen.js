(function(G){
  const icon={
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5" stroke-linecap="round"/></svg>',
    more:'<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
    select:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="4 3"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1-1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10.5 3h3A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9H21a2 2 0 0 1 0 4h-1.6a1.65 1.65 0 0 0-1.51 1z"/></svg>'
  };
  const foldersFromMedia=(media)=>{
    const seed=window.GalleryManagerSample?.folders||[];
    const out=seed.map(x=>({...x})); const seen=new Set(out.map(x=>String(x.id)));
    media.forEach(m=>{const id=String(m.folderId||m.folder||'');if(id&&!seen.has(id)){out.push({id,name:m.folder||id});seen.add(id)}});
    return out.filter(f=>f.name.toLowerCase()!=='all media');
  };
  const cover=(items,key,album)=>album
    ? G.CoverPolicy?.album({id:key},items)
    : G.CoverPolicy?.folder(key,items);
  G.BrowseScreen={async render(el,p){
    const mode=p.mode==='folders'?'folders':'albums';
    const albums=await G.services.albums.list();
    const media=await G.services.media.list();
    const folders=foldersFromMedia(media);
    const folderCount=f=>media.filter(m=>m.folderId===f.id&&!m.trashed).length;
    const albumMetrics=a=>G.Sorting.metricsForMedia(media.filter(m=>m.albumIds?.includes(a.id)&&!m.trashed));
    const folderMetrics=f=>G.Sorting.metricsForMedia(media.filter(m=>m.folderId===f.id&&!m.trashed));
    const shownAlbums=G.Sorting.sort(albums,G.appState.sort,albumMetrics);
    const shownFolders=G.Sorting.sort(folders,G.appState.sort,folderMetrics);
    el.innerHTML=`<div class="browse-page">
      <header class="browse-header">
        <div class="${G.isInlineSearchActive(p)?'browse-inline-search-row':'browse-title-row'}">
          ${G.isInlineSearchActive(p)
            ? `${G.searchInlineMarkup('Exit search state')}<button id="browse-more" class="inline-search-page-more" aria-label="More options" aria-expanded="false">${icon.more}</button>`
            : `<h1>Browse</h1><div class="browse-header-actions"><button id="browse-search" aria-label="Search">${icon.search}</button><button id="browse-more" aria-label="More options" aria-expanded="false">${icon.more}</button></div>`}
        </div>
        <div class="screen-overflow-menu browse-overflow-menu" id="browse-overflow-menu" hidden>
          <button type="button" data-menu-action="create">${icon.plus}<span>Create an album</span></button>
          <button type="button" data-menu-action="select">${icon.select}<span>Select</span></button>
          <button type="button" data-menu-action="sort">${icon.sort}<span>Sort</span></button>
          <button type="button" data-menu-action="settings">${icon.settings}<span>Settings</span></button>
        </div>
        <nav class="browse-segmented" aria-label="Browse categories">
          <button class="${mode==='albums'?'active':''}" data-mode="albums">My Albums</button>
          <button class="${mode==='folders'?'active':''}" data-mode="folders">Device Folders</button>
        </nav>
      </header>
      <main class="browse-content">
        ${G.SelectionHeader((mode==='albums'?shownAlbums:shownFolders).map(x=>x.id),mode==='albums'?'album':'folder')}
        ${G.SelectionBar(G.appState.selected.size,mode==='albums'?'album':'folder')}
        ${mode==='albums'?`
          <section class="browse-album-grid">
            ${shownAlbums.map(a=>{const c=cover(media,a.id,true);const selected=G.Selection.isSelected(a.id,'album');return `<button class="browse-album-tile ${selected?'selected-collection':''}" data-album="${G.escape(a.id)}" data-selection-id="${G.escape(a.id)}" data-selection-kind="album"><span class="browse-album-cover">${c?`<img src="${G.escape(c.uri)}" alt="">`:icon.folder}${G.Selection.active()&&G.Selection.kind()==='album'?`<span class="collection-select-badge ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}</span><strong>${G.escape(a.name)}</strong><small>${a.count} items</small></button>`}).join('')}
          </section>
          ${albums.length?'':'<div class="albums-empty">Create your first album to see it here.</div>'}
        `:`
          <section class="browse-folder-list">
            ${shownFolders.map(f=>{const c=cover(media,f.id,false);const selected=G.Selection.isSelected(f.id,'folder');return `<button class="browse-folder-row ${selected?'selected-collection':''}" data-folder="${G.escape(f.id)}" data-selection-id="${G.escape(f.id)}" data-selection-kind="folder"><span class="browse-folder-thumb">${c?`<img src="${G.escape(c.uri)}" alt="">`:icon.folder}${G.Selection.active()&&G.Selection.kind()==='folder'?`<span class="collection-select-badge ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}</span><span class="browse-folder-copy"><strong>${G.escape(f.name)}</strong><small>${folderCount(f)} items</small></span><span class="browse-folder-chevron">${icon.chevron}</span></button>`}).join('')}
          </section>
          ${folders.length?'':'<div class="albums-empty">No device folders are available.</div>'}
        `}
      </main>
    </div>`;
    el.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>G.router.go('browse',{mode:b.dataset.mode,_nav:p._nav}));
    const selectionKind=mode==='albums'?'album':'folder';
    const visibleCollections=(mode==='albums'?shownAlbums:shownFolders).map(x=>x.id);
    G.wireSelectionChrome(el,visibleCollections,selectionKind);
    G.wireSelectionTiles(el,'[data-selection-id]',mode==='albums'?shownAlbums:shownFolders,{kind:selectionKind,open:id=>mode==='albums'?G.router.go('album',{id,_nav:p._nav}):G.router.go('folder',{id,_nav:p._nav})});


    if(G.isInlineSearchActive(p)){
      el.querySelector('.inline-search-back').onclick=()=>G.router.back();
      G.wireInlineSearchInput(el);
    }else{
      el.querySelector('#browse-search').onclick=()=>G.activateInlineSearch();
    }

    const menu=el.querySelector('#browse-overflow-menu');
    const more=el.querySelector('#browse-more');
    const closeMenu=()=>{menu.hidden=true;more.setAttribute('aria-expanded','false')};
    more.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden))};
    menu.onclick=e=>{
      const button=e.target.closest('[data-menu-action]'); if(!button)return;
      e.stopPropagation(); const action=button.dataset.menuAction; closeMenu();
      if(action==='create'){
        return G.dialog({
          title:'New album',
          body:'<input class="modal-input" id="browse-new-album-name" placeholder="Album name">',
          confirm:'Create',
          onConfirm:async()=>{
            const n=document.getElementById('browse-new-album-name')?.value.trim();
            if(n){await G.services.albums.create(n);G.toast('Album created.');G.renderScreen();}
          }
        });
      }
      if(action==='settings') return G.router.go('settings');
      if(action==='select'){
        const ids=(mode==='albums'?shownAlbums:shownFolders).map(x=>x.id);
        if(ids.length)G.Selection.selectAll(ids,mode==='albums'?'album':'folder');
        else G.toast('There are no items to select.');
        return;
      }
      if(action==='sort'){
        const d=G.dialog({
          title:'Sort',
          body:`<div class="choice-list">
            ${G.Sorting.OPTIONS.map(o=>`<button data-browse-sort="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}
          </div>`,
          confirm:'Done',
          onConfirm:()=>{}
        });
        d.querySelectorAll('[data-browse-sort]').forEach(b=>b.onclick=()=>{G.appState.patch({sort:b.dataset.browseSort});d.remove()});
        return;
      }
    };
    el.onclick=function browseMenuOutside(e){
      if(!menu.hidden && !e.target.closest('#browse-more') && !e.target.closest('#browse-overflow-menu')) closeMenu();
    };
  }};

})(window.GalleryManager=window.GalleryManager||{});
