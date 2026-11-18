(function(G){
  const svg={
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    settings:"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065\" /><path d=\"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" /></svg>",
    media:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>'
  };
  function icon(name){return svg[name]||'';}
  function getGreeting(){
    const hour=new Date().getHours();
    if(hour<12) return ['Good morning','☀️'];
    if(hour<18) return ['Good afternoon','☀️'];
    return ['Good evening','🌙'];
  }
  function folderCover(folderId,media){
    return G.CoverPolicy?.folder(folderId,media)||null;
  }
  function quickCard(route,iconName,title,count,tone){
    return `<button class="home-quick-card ${tone||''}" data-home-nav="${route}">
      <span class="quick-icon">${icon(iconName)}</span>
      <span class="quick-copy"><strong>${G.escape(title)}</strong><small>${G.escape(String(count))}</small></span>
      <span class="quick-chevron">${icon('chevron')}</span>
    </button>`;
  }
  G.HomeScreen={
    async render(el){
      const media=await G.services.media.listWithImports({});
      const folders=window.GalleryManagerSample.folders||[];
      const favoriteCount=media.filter(x=>x.favorite&&!x.trashed).length;
      const trashCount=(await G.services.media.list({includeTrash:true})).filter(x=>x.trashed).length;
      const [greeting,mark]=getGreeting();
      const archivedCount=G.services.archive? (await G.services.archive.listMedia()).length : 0;
      const pinnedSet=G.appState.pinnedFolderIds||new Set();
      const pinnedBase=pinnedSet.size?folders.filter(f=>pinnedSet.has(String(f.id))):folders.slice(0,8);
      const pinnedFolders=pinnedBase.slice(0,8).map(folder=>({...folder,cover:folderCover(folder.id,media)}));
      const recent=[...media].filter(x=>!x.trashed).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,12);
      el.innerHTML=`
        <div class="home-page">
          <section class="home-hero">
            <div class="home-greeting">
              <h1>${greeting} <span class="greeting-mark">${mark}</span></h1>
              <p>Your memories, always with you.</p>
            </div>
            <button class="home-settings" data-home-nav="settings" aria-label="Settings">${icon('settings')}</button>
          </section>
          <label class="home-search" aria-label="Search photos, folders and albums">
            <span class="home-search-icon">${icon('search')}</span>
            <input id="home-search-input" type="search" placeholder="Search photos, albums..." autocomplete="off">
            <button id="home-search-clear" class="hidden" type="button" aria-label="Clear search">${icon('close')}</button>
          </label>
          <section class="home-quick-grid" aria-label="Quick access">
            ${quickCard('all-media','media','All Media',media.filter(x=>!x.trashed).length,'all-media')}
            ${quickCard('favorites','heart','Favorites',favoriteCount,'favorites')}
            ${quickCard('archive','archive','Archive',archivedCount,'archive')}
            ${quickCard('trash','trash','Trash',trashCount,'trash')}
          </section>
          <section class="home-section">
            <div class="home-section-head">
              <h2>Pinned Folders</h2>
              <button class="home-see-all" data-home-nav="browse">See all ${icon('chevron')}</button>
            </div>
            <div class="home-horizontal home-folder-scroller" aria-label="Pinned folders">
              ${pinnedFolders.map(folder=>`
                <button class="home-folder-card" data-folder-id="${G.escape(folder.id)}">
                  <span class="home-folder-image">${folder.cover
                    ? `<img src="${G.escape(folder.cover.uri)}" alt="${G.escape(folder.name)}" loading="lazy">`
                    : `<span class="home-folder-placeholder">${icon('folder')}</span>`}</span>
                  <span class="home-folder-name">${G.escape(folder.name)}</span>
                </button>`).join('')}
            </div>
          </section>
          <section class="home-section home-recent-section">
            <div class="home-section-head">
              <h2>Recent Media</h2>
              <button class="home-see-all" data-home-nav="recent">See all ${icon('chevron')}</button>
            </div>
            <div class="home-horizontal home-recent-scroller" aria-label="Recent media">
              ${recent.map(item=>`
                <button class="home-recent-card" data-media-id="${G.escape(item.id)}" aria-label="${G.escape(item.name)}">
                  <img src="${G.escape(item.uri)}" alt="${G.escape(item.name)}" loading="lazy">
                  ${item.type==='video'?`<span class="home-video-badge">${icon('play')}</span>`:''}
                  ${item.favorite?`<span class="home-favorite-badge">${icon('heart')}</span>`:''}
                </button>`).join('')}
            </div>
          </section>
        </div>`;
      el.querySelectorAll('[data-home-nav]').forEach(button=>{
        button.onclick=()=>{
          const route=button.dataset.homeNav;
          if(route==='archive') G.router.go('archive',{view:'albums'});
          else if(route==='browse') G.router.go('pinned-folders',{_nav:'home'});
          else if(route==='all-media') G.router.go('all-media',{_nav:'home'});
          else G.router.go(route);
        };
      });
      el.querySelectorAll('[data-folder-id]').forEach(button=>button.onclick=()=>G.router.go('folder',{id:button.dataset.folderId}));
      el.querySelectorAll('[data-media-id]').forEach(button=>button.onclick=()=>G.router.go('viewer',{id:button.dataset.mediaId}));
      const input=el.querySelector('#home-search-input'),clear=el.querySelector('#home-search-clear');
      input?.addEventListener('input',()=>clear?.classList.toggle('hidden',!input.value));
      input?.addEventListener('keydown',event=>{
        if(event.key==='Enter'&&input.value.trim()) G.router.go('search',{q:input.value.trim()});
      });
      clear?.addEventListener('click',()=>{input.value='';clear.classList.add('hidden');input.focus();});
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
