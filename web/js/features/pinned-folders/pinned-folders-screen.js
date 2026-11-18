(function(G){
  const svg={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    more:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 4v4l2 2v2h-5v8l-1 1-1-1v-8H6v-2l2-2V4h8zM10 2h4v2h-4V2z"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/></svg>',
    select:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L21 5"/><path d="M3 12a9 9 0 0 0 15.2 6.5"/><path d="M21 12a9 9 0 0 0-15.2-6.5"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    album:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15.5 15.5 10 4 21"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'
  };
  function icon(n){return svg[n]||'';}

  function foldersFromMedia(media){
    const seed=(window.GalleryManagerSample?.folders||[]).map(f=>({...f}));
    const seen=new Set(seed.map(f=>String(f.id)));
    (media||[]).forEach(m=>{
      const id=String(m.folderId||m.folder||'');
      if(id&&!seen.has(id)){seed.push({id,name:m.folder||id});seen.add(id);}
    });
    return seed.filter(f=>String(f.name||'').toLowerCase()!=='all media');
  }
  function cover(folder,media){
    return G.CoverPolicy?.folder(folder.id,media)||null;
  }
  function folderMetrics(media,f){
    return G.Sorting.metricsForMedia((media||[]).filter(m=>String(m.folderId)===String(f.id)&&!m.trashed));
  }

  G.PinnedFoldersScreen={
    async render(el,p){
      const media=await G.services.media.list({});
      const allFolders=foldersFromMedia(media);
      /*
       * First-run compatibility: Home historically exposed the first device
       * folders as its pinned strip before this dedicated screen existed.
       * Materialize that legacy visible state once. An explicit empty pin set
       * remains empty and is never repopulated.
       */
      /*
       * The original Home pinned strip existed before this screen.  An empty
       * v1 value can therefore be an old, auto-persisted default rather than
       * an intentional user choice.  Seed it once from the same folders Home
       * historically exposed, then mark the state as user-initialized.
       */
      const initialized=localStorage.getItem('gallerymanager.pinnedFolders.initialized.v1')==='1';
      if(!initialized){
        let stored=[];
        try{stored=JSON.parse(localStorage.getItem('gallerymanager.pinnedFolders.v1')||'[]')}catch{}
        const storedIds=Array.isArray(stored)?stored.map(String).filter(id=>allFolders.some(f=>String(f.id)===id)):[];
        const legacyPinned=allFolders.filter(f=>f.pinned===true);
        const ids=storedIds.length
          ? storedIds
          : (legacyPinned.length?legacyPinned:allFolders).slice(0,8).map(f=>String(f.id));
        G.appState.pinnedFolderIds=new Set(ids);
        try{
          localStorage.setItem('gallerymanager.pinnedFolders.v1',JSON.stringify(ids));
          localStorage.setItem('gallerymanager.pinnedFolders.initialized.v1','1');
        }catch{}
      }
      const pinned=new Set([...G.appState.pinnedFolderIds||[]].map(String));
      let folders=allFolders.filter(f=>pinned.has(String(f.id)));
      folders=G.Sorting.sort(folders,G.appState.sort,f=>folderMetrics(media,f));
      const count=folders.length;
      const active=G.Selection.active()&&G.Selection.kind()==='folder';
      const selectedIds=folders.map(f=>String(f.id));

      el.innerHTML=`<div class="pinned-folders-page ${active?'selection-page-active':''}">
        <header class="pinned-folders-header">
          <div class="pinned-folders-title-group">
            <button type="button" class="pinned-folders-back" id="pinned-folders-back" aria-label="Go back">${icon('back')}</button>
            <div>
              <h1>Pinned Folders</h1>
              <p>${count} ${count===1?'folder':'folders'}</p>
            </div>
          </div>
          <button type="button" class="pinned-folders-more" id="pinned-folders-more" aria-label="More options" aria-expanded="false">${icon('more')}</button>
          <div class="screen-overflow-menu pinned-folders-overflow-menu" id="pinned-folders-overflow" hidden aria-label="Pinned folders options"></div>
        </header>
        <main class="pinned-folders-content">
          ${G.SelectionHeader(selectedIds,'folder')}
          ${G.SelectionBar(G.appState.selected.size,'folder')}
          ${folders.length?`
            <section class="pinned-folders-grid" aria-label="Pinned folders">
              ${folders.map(f=>{
                const id=String(f.id), selected=G.Selection.isSelected(id,'folder'), c=cover(f,media);
                return `<button type="button" class="pinned-folder-card ${selected?'selected-collection':''}" data-folder-id="${G.escape(id)}" data-selection-id="${G.escape(id)}" data-selection-kind="folder">
                  <span class="pinned-folder-cover">${c?`<img src="${G.escape(c.uri)}" alt="">`:icon('folder')}
                    <span class="pinned-folder-pin">${icon('pin')}</span>
                    ${active?`<span class="pinned-folder-select ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}
                  </span>
                  <span class="pinned-folder-copy"><strong>${G.escape(f.name)}</strong><small>${G.escape(String((media||[]).filter(m=>String(m.folderId)===id&&!m.trashed).length))} items</small></span>
                </button>`;
              }).join('')}
            </section>
          `:`
            <section class="pinned-folders-empty" aria-label="No pinned folders">
              <div class="pinned-empty-badge">${icon('folder')}${icon('pin')}</div>
              <h2>No pinned folders</h2>
              <p>Pin your favorite folders to access them quickly from here.</p>
            </section>
          `}
        </main>
      </div>`;

      el.querySelector('#pinned-folders-back')?.addEventListener('click',()=>G.router.back());
      const more=el.querySelector('#pinned-folders-more');
      const menu=el.querySelector('#pinned-folders-overflow');
      const closeMenu=()=>{if(!menu)return;menu.hidden=true;more?.setAttribute('aria-expanded','false');};
      const renderMenu=(sortOpen=false)=>{
        if(!menu)return;
        if(sortOpen){
          menu.innerHTML=`<div class="pinned-menu-title"><button type="button" data-pinned-menu-back>${icon('back')}</button><strong>Sort by</strong></div>
            ${G.Sorting.OPTIONS.map(o=>`<button type="button" data-pinned-sort="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}"><span>${G.escape(o.label)}</span><span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}`;
          menu.querySelector('[data-pinned-menu-back]').onclick=()=>renderMenu(false);
          menu.querySelectorAll('[data-pinned-sort]').forEach(b=>b.onclick=()=>{closeMenu();G.appState.patch({sort:b.dataset.pinnedSort});});
          return;
        }
        menu.innerHTML=`
          <button type="button" data-pinned-action="select">${icon('select')}<span>Select</span></button>
          <button type="button" data-pinned-action="sort">${icon('sort')}<span>Sort by</span><span class="menu-chevron">${icon('chevron')}</span></button>
          <button type="button" data-pinned-action="new-album">${icon('plus')}<span>New album</span></button>
          <button type="button" data-pinned-action="add-album">${icon('album')}<span>Add an album</span></button>`;
        menu.querySelector('[data-pinned-action="select"]').onclick=()=>{
          closeMenu();
          if(folders.length)G.Selection.enter('folder');
        };
        menu.querySelector('[data-pinned-action="sort"]').onclick=()=>renderMenu(true);
        menu.querySelector('[data-pinned-action="new-album"]').onclick=()=>{
          closeMenu();
          G.dialog({title:'New album',body:'<input class="modal-input" id="pinned-new-album-name" placeholder="Album name" maxlength="80">',confirm:'Create',onConfirm:async()=>{
            const name=document.getElementById('pinned-new-album-name')?.value.trim();
            if(!name)return;
            await G.services.albums.create(name);
            G.toast('Album created.');
            G.renderScreen();
          }});
        };
        menu.querySelector('[data-pinned-action="add-album"]').onclick=()=>{
          closeMenu();
          G.router.go('albums',{_nav:p._nav||'home'});
        };
      };
      more?.addEventListener('click',e=>{
        e.stopPropagation();
        if(menu.hidden){menu.hidden=false;more.setAttribute('aria-expanded','true');renderMenu(false);}
        else closeMenu();
      });
      el.addEventListener('click',e=>{
        if(menu && !menu.hidden && !e.target.closest('#pinned-folders-more') && !e.target.closest('#pinned-folders-overflow'))closeMenu();
      });

      G.wireSelectionTiles(el,'[data-selection-id]',folders,{kind:'folder',open:id=>G.router.go('folder',{id,_nav:p._nav||'home'})});
      G.wireSelectionChrome(el,selectedIds,'folder');
      el.querySelectorAll('[data-folder-id]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          if(G.Selection.active()&&G.Selection.kind()==='folder')return;
          G.router.go('folder',{id:btn.dataset.folderId,_nav:p._nav||'home'});
        });
      });
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
