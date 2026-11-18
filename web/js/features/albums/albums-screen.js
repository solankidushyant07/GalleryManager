(function(G){
  const icons={
    more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    image:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm3 11 3-3 2 2 3-4 3 5H7zm3-6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    camera:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 4 7.6 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.6L15 4H9zm3 4.5A4.5 4.5 0 1 1 12 17a4.5 4.5 0 0 1 0-8.5z"/></svg>',
    crop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3v12a3 3 0 0 0 3 3h12M3 6h12a3 3 0 0 1 3 3v12"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
    create:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8m-4-4h8" stroke-linecap="round"/></svg>',
    sortMenu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 3v14m0 0-3-3m3 3 3-3M17 21V7m0 0-3 3m3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    view:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    creativity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 2 2.4 5.6L20 10l-4.4 3.8 1.4 6.2-5-3-5 3 1.4-6.2L4 10l5.6-2.4L12 2z" stroke-linejoin="round"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.24.61.82 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-.69 0-1.27.39-1.51 1z"/></svg>'
  };
  const icon=name=>icons[name]||'';

  function card({key,type,title,count,uri,iconName,accent}){
    const attr=type==='album'?`data-album="${G.escape(key)}"`:type==='route'?`data-route="${G.escape(key)}"`:`data-folder="${G.escape(key)}"`;
    const selectable=type==='album';
    const selected=selectable && G.Selection?.isSelected(key,'album');
    return `<button class="albums-tile ${accent||''} ${selected?'selected-collection':''}" ${attr}${selectable?` data-selection-id="${G.escape(key)}" data-selection-kind="album"`:''}>
      <span class="albums-tile-cover">
        ${uri?`<img src="${G.escape(uri)}" alt="${G.escape(title)}" loading="lazy">`:''}
        <span class="albums-tile-badge">${icon(iconName)}</span>
        ${G.Selection.active()&&G.Selection.kind()==='album'?`<span class="collection-select-badge ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}
      </span>
      <span class="albums-tile-title">${G.escape(title)}</span>
      <span class="albums-tile-count">${G.escape(String(count))}</span>
    </button>`;
  }


  const folderList=(media)=>{
    const seed=window.GalleryManagerSample?.folders||[];
    const map=new Map(seed.map(f=>[String(f.id),{...f}]));
    media.forEach(m=>{
      const id=String(m.folderId||m.folder||'');
      if(id&&!map.has(id)) map.set(id,{id,name:m.folder||id});
    });
    return [...map.values()].filter(f=>String(f.name||'').toLowerCase()!=='all media');
  };
  const liveFolderItems=(media,f)=>media.filter(m=>String(m.folderId||m.folder||'')===String(f.id)&&!m.trashed);
  const moreFolderNamesExcluded=new Set(['camera','screenshots','documents']);
  const moreFolderCandidates=(media,folders)=>{
    return folders.filter(f=>!moreFolderNamesExcluded.has(String(f.name||'').toLowerCase()))
      .filter(f=>liveFolderItems(media,f).length);
  };
  const otherAlbumCover=(albums,media)=>{
    const ids=new Set((G.appState.moreAlbumIds||new Set()));
    return albums.filter(a=>ids.has(String(a.id))).map(a=>G.CoverPolicy?.album(a,media)).filter(Boolean).slice(0,4);
  };

  async function renderOtherAlbums(el,p,albums){
    const media=await G.services.media.list();
    const moreSet=G.appState.moreAlbumIds||new Set();
    const otherAlbums=G.Sorting.sort(
      albums.filter(a=>moreSet.has(String(a.id))),
      G.appState.sort,
      a=>G.Sorting.metricsForMedia(media.filter(m=>m.albumIds?.includes(a.id)&&!m.trashed))
    );
    const ids=otherAlbums.map(a=>String(a.id));
    const coverMap=Object.fromEntries(otherAlbums.map(a=>[a.id,G.CoverPolicy?.album(a,media)?.uri||'']));
    const view=G.appState.albumView||'grid';
    el.innerHTML=`<div class="albums-page other-albums-page ${G.Selection.active()&&G.Selection.kind()==='album'?'selection-page-active':''}">
      ${G.SelectionHeader(ids,'album')}${G.SelectionBar(G.appState.selected.size,'album')}
      <header class="albums-header other-albums-header">
        <div class="albums-title-row">
          <div class="other-albums-heading">
            <button class="albums-back-btn" id="other-albums-back" aria-label="Back">${G.icon('back')}</button>
            <div><h1>Other albums</h1><p>${otherAlbums.length} albums</p></div>
          </div>
          <button class="albums-more-btn" id="other-albums-more" aria-label="More options" aria-expanded="false">${icon('more')}</button>
        </div>
        <div class="screen-overflow-menu albums-overflow-menu" id="other-albums-menu" hidden>
          <button type="button" data-menu-action="select">${icon('sortMenu')}<span>Select</span></button>
          <button type="button" data-menu-action="sort">${icon('sortMenu')}<span>Sort</span></button>
          <button type="button" data-menu-action="create">${icon('create')}<span>New album</span></button>
        </div>
      </header>
      <main class="albums-content">
        <section class="albums-section albums-view-${view}">
          <div class="albums-grid">
            ${otherAlbums.map(a=>card({key:a.id,type:'album',title:a.name,count:a.count,uri:coverMap[a.id]||'',iconName:'folder',accent:'is-secondary-album'})).join('')}
          </div>
          ${otherAlbums.length?'':'<div class="albums-empty">No albums are in Other albums yet.</div>'}
        </section>
      </main>
    </div>`;
    G.wireSelectionChrome(el,ids,'album');
    G.wireSelectionTiles(el,'[data-selection-id]',otherAlbums,{kind:'album',open:id=>G.router.go('album',{id,_nav:'albums'})});
    el.querySelector('#other-albums-back').onclick=()=>G.router.back();

    const menu=el.querySelector('#other-albums-menu'), more=el.querySelector('#other-albums-more');
    const close=()=>{menu.hidden=true;more.setAttribute('aria-expanded','false')};
    more.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden))};
    menu.onclick=async e=>{
      const b=e.target.closest('[data-menu-action]'); if(!b)return;
      e.stopPropagation(); const action=b.dataset.menuAction; close();
      if(action==='select'){
        if(ids.length) G.Selection.selectAll(ids,'album'); else G.toast('There are no other albums to select.');
      } else if(action==='create'){
        G.dialog({title:'New album',body:'<input class="modal-input" id="other-album-name" placeholder="Album name">',confirm:'Create',
          onConfirm:async()=>{const n=document.getElementById('other-album-name')?.value.trim();if(n){const a=await G.services.albums.create(n);await G.services.albums.moveToOther(a.id);G.toast('Album created in Other albums.');G.renderScreen();}}});
      } else if(action==='sort'){
        const d=G.dialog({title:'Sort albums',body:`<div class="choice-list">${G.Sorting.OPTIONS.map(o=>`<button data-sort-other="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}</div>`,confirm:'Done',onConfirm:()=>{}});
        d.querySelectorAll('[data-sort-other]').forEach(b=>b.onclick=()=>{G.appState.patch({sort:b.dataset.sortOther});d.remove()});
      }
    };
    el.onclick=e=>{if(!menu.hidden&&!e.target.closest('#other-albums-more')&&!e.target.closest('#other-albums-menu'))close()};
  }

  G.AlbumsScreen={async render(el,p={}){
    const albums=await G.services.albums.list();
    if(String(p.view||'')==='other-albums'){
      return renderOtherAlbums(el,p,albums);
    }
    const media=await G.services.media.list();
    const folders=folderList(media);
    const coverMap=Object.fromEntries(albums.map(a=>[a.id,G.CoverPolicy?.album(a,media)?.uri||'']));
    const folderCover=folderId=>G.CoverPolicy?.folder(folderId,media)?.uri||'';
    const liveCount=items=>items.filter(x=>!x.trashed).length;
    const allCount=liveCount(media);
    const camera=folders.find(f=>f.name.toLowerCase()==='camera');
    const screenshots=folders.find(f=>f.name.toLowerCase()==='screenshots');
    const favoriteCount=media.filter(x=>x.favorite&&!x.trashed).length;
    const videoCount=media.filter(x=>x.type==='video'&&!x.trashed).length;
    const documents=folders.find(f=>f.name.toLowerCase()==='documents');

    const system=[
      {key:'all-media',type:'route',title:'All media',count:allCount,uri:media.find(x=>!x.trashed)?.uri||'',iconName:'image',accent:'system-all'},
      camera&&{key:camera.id,type:'folder',title:'Camera',count:media.filter(x=>x.folderId===camera.id&&!x.trashed).length,uri:folderCover(camera.id),iconName:'camera'},
      screenshots&&{key:screenshots.id,type:'folder',title:'Screenshots and screen recordings',count:media.filter(x=>x.folderId===screenshots.id&&!x.trashed).length,uri:folderCover(screenshots.id),iconName:'crop'},
      {key:'__videos__',type:'folder',title:'Videos',count:videoCount,uri:media.find(x=>x.type==='video'&&!x.trashed)?.uri||'',iconName:'play',accent:'system-video'},
      {key:documents?.id||'__documents__',type:'folder',title:'Documents',count:documents?media.filter(x=>x.folderId===documents.id&&!x.trashed).length:0,uri:documents?folderCover(documents.id):'',iconName:'folder',accent:'system-documents'},
      {key:'__favorites__',type:'folder',title:'Favourites',count:favoriteCount,uri:media.find(x=>x.favorite&&!x.trashed)?.uri||'',iconName:'heart',accent:'system-favorites'}
    ].filter(Boolean);

    const albumMetrics=a=>G.Sorting.metricsForMedia(media.filter(m=>m.albumIds?.includes(a.id)&&!m.trashed));
    const folderMetrics=f=>G.Sorting.metricsForMedia(media.filter(m=>m.folderId===f.id&&!m.trashed));
    const order=(items,metrics)=>G.Sorting.sort(items,G.appState.sort,metrics);

    const moreAlbumSet=G.appState.moreAlbumIds||new Set();
    const importantAlbums=albums.filter(a=>!moreAlbumSet.has(String(a.id)));
    const secondaryAlbums=albums.filter(a=>moreAlbumSet.has(String(a.id)));
    const userAlbums=order(importantAlbums,albumMetrics);
    const moreAlbums=order(secondaryAlbums,albumMetrics);
    const albumView=G.appState.albumView||'grid';
    const albumIds=userAlbums.map(a=>String(a.id));
    const selectionHeader=G.SelectionHeader(albumIds,'album');
    const selectionBar=G.SelectionBar(G.appState.selected.size,'album');
    el.innerHTML=`
      <div class="albums-page ${G.Selection.active()&&G.Selection.kind()==='album'?'selection-page-active':''}">
        ${selectionHeader}${selectionBar}
        <header class="albums-header">
          <div class="albums-title-row">
            <h1>Albums</h1>
            <button class="albums-more-btn" id="albums-more" aria-label="More options" aria-expanded="false">${icon('more')}</button>
          </div>
          <div class="screen-overflow-menu albums-overflow-menu" id="albums-overflow-menu" hidden>
            <button type="button" data-menu-action="create">${icon('create')}<span>Create an album</span></button>
            <button type="button" data-menu-action="select">${icon('sortMenu')}<span>Select</span></button>
            <button type="button" data-menu-action="sort">${icon('sortMenu')}<span>Sort</span></button>
            <button type="button" data-menu-action="view">${icon('view')}<span>View</span></button>
            <button type="button" data-menu-action="creativity">${icon('creativity')}<span>Creativity</span></button>
            <button type="button" data-menu-action="settings">${icon('settings')}<span>Settings</span></button>
          </div>
          <label class="albums-search">
            <span>${icon('search')}</span>
            <input id="albums-search-input" type="search" placeholder="Search albums..." autocomplete="off">
          </label>
        </header>

        <main class="albums-content">
          <section class="albums-system-grid" data-purpose="quick-system-albums">
            ${system.map(card).join('')}
          </section>

          <div class="albums-divider"></div>

          <section class="albums-section albums-view-${albumView}" data-section="my-albums">
            <div class="albums-section-head">
              <div class="albums-section-title"><h2>My albums</h2><span>${userAlbums.length} items</span></div>
            </div>
            <div class="albums-grid">
              ${userAlbums.map(a=>card({
                key:a.id,type:'album',title:a.name,count:a.count,uri:coverMap[a.id]||'',iconName:'folder',
                accent:a.pinned?'is-pinned':''
              })).join('')}
            </div>
            ${userAlbums.length?'':'<div class="albums-empty">Create your first album to see it here.</div>'}
          </section>

          <div class="albums-divider"></div>

          <section class="albums-section albums-view-${albumView}" data-section="more-albums">
            <div class="albums-section-head">
              <div class="albums-section-title"><h2>More albums</h2><span>${moreFolderCandidates(media,folders).length + 1} items</span></div>
            </div>
            <div class="albums-more-grid">
              ${moreFolderCandidates(media,folders).map(f=>{
                const items=liveFolderItems(media,f);
                const c=G.CoverPolicy?.folder(f.id,media);
                return `<button class="albums-more-card albums-more-folder-card" data-more-folder="${G.escape(f.id)}">
                  <span class="albums-more-card-cover">${c?`<img src="${G.escape(c.uri)}" alt="">`:icon('folder')}</span>
                  <span class="albums-more-card-title">${G.escape(f.name)}</span>
                  <span class="albums-more-card-count">${items.length} items</span>
                </button>`;
              }).join('')}
              <button class="albums-more-card albums-more-other-card" data-open-other-albums>
                <span class="albums-more-card-cover albums-more-mosaic">
                  ${otherAlbumCover(albums,media).map(c=>`<img src="${G.escape(c.uri)}" alt="">`).join('')}
                  ${otherAlbumCover(albums,media).length===0?icon('folder'):''}
                </span>
                <span class="albums-more-card-title">Other albums</span>
                <span class="albums-more-card-count">${secondaryAlbums.length} albums</span>
              </button>
            </div>
          </section>

        </main>

        <button class="albums-fab" id="add-album" aria-label="Create new album">${icon('plus')}</button>
      </div>`;

    G.wireSelectionChrome(el,albumIds,'album');
    G.wireSelectionTiles(el,'[data-selection-id]',albums,{kind:'album',open:id=>G.router.go('album',{id})});
    if(G.Selection.active() && G.Selection.kind()==='album'){
      el.querySelectorAll('[data-selection-id]').forEach(b=>b.onclick=null);
      G.wireSelectionTiles(el,'[data-selection-id]',albums,{kind:'album',open:id=>G.router.go('album',{id})});
    }

    el.querySelector('#add-album').onclick=()=>G.dialog({
      title:'New album',
      body:'<input class="modal-input" id="new-album-name" placeholder="Album name">',
      confirm:'Create',
      onConfirm:async()=>{
        const n=document.getElementById('new-album-name')?.value.trim();
        if(n){await G.services.albums.create(n);G.toast('Album created.');G.renderScreen();}
      }
    });

    const menu=el.querySelector('#albums-overflow-menu');
    const more=el.querySelector('#albums-more');
    const closeMenu=()=>{menu.hidden=true;more.setAttribute('aria-expanded','false')};
    more.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;more.setAttribute('aria-expanded',String(!menu.hidden))};
    menu.onclick=async e=>{
      const button=e.target.closest('[data-menu-action]'); if(!button)return;
      e.stopPropagation(); const action=button.dataset.menuAction; closeMenu();
      if(action==='create'){
        return el.querySelector('#add-album').click();
      }
      if(action==='settings'){
        return G.router.go('settings');
      }
      if(action==='select'){
        G.Selection.selectAll(userAlbums.map(a=>a.id),'album');
        return;
      }
      if(action==='sort'){
        const d=G.dialog({
          title:'Sort albums',
          body:`<div class="choice-list">
            ${G.Sorting.OPTIONS.map(o=>`<button data-sort-albums="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}
          </div>`,
          confirm:'Done',
          onConfirm:()=>{}
        });
        d.querySelectorAll('[data-sort-albums]').forEach(b=>b.onclick=()=>{G.appState.patch({sort:b.dataset.sortAlbums});d.remove()});
        return;
      }
      if(action==='view'){
        return G.dialog({
          title:'View',
          body:`<div class="choice-list">
            <button data-albums-view="grid">Grid view<span>${albumView==='grid'?'✓':''}</span></button>
            <button data-albums-view="list">List view<span>${albumView==='list'?'✓':''}</span></button>
            <button data-albums-view="large">Large view<span>${albumView==='large'?'✓':''}</span></button>
          </div>`,
          confirm:'Done',
          onConfirm:()=>{}
        });
        setTimeout(wireLastDialog,0);
        return;
      }
      if(action==='creativity'){
        G.toast('Creativity tools are available from media editing.');
      }
    };
    el.onclick=function albumMenuOutside(e){
      if(!menu.hidden && !e.target.closest('#albums-more') && !e.target.closest('#albums-overflow-menu')) closeMenu();
    };

    el.querySelectorAll('[data-album]').forEach(b=>b.onclick=()=>G.router.go('album',{id:b.dataset.album}));
    el.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>G.router.go(b.dataset.route,{_nav:'albums'}));
    el.querySelectorAll('[data-folder]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.folder;
      if(id==='all') return G.router.go('recent',{filter:'all'});
      if(id==='__videos__') return G.router.go('search',{q:'video'});
      if(id==='__favorites__') return G.router.go('favorites');
      G.router.go('folder',{id});
    });

    el.querySelectorAll('[data-more-folder]').forEach(b=>b.onclick=()=>{
      G.router.go('folder',{id:b.dataset.moreFolder,_nav:'albums'});
    });
    el.querySelector('[data-open-other-albums]')?.addEventListener('click',()=>G.router.go('other-albums',{_nav:'albums'}));

    const search=el.querySelector('#albums-search-input');
    search?.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        e.preventDefault();
        const q=search.value.trim();
        if(q) G.router.go('search',{q,_nav:'albums'});
      }
    });
    search?.addEventListener('input',()=>{
      const q=search.value.trim().toLowerCase();
      el.querySelectorAll('.albums-tile').forEach(tile=>{
        tile.hidden=!!q && !tile.textContent.toLowerCase().includes(q);
      });
      el.querySelectorAll('.albums-section').forEach(section=>{
        const visible=[...section.querySelectorAll('.albums-tile')].some(tile=>!tile.hidden);
        section.hidden=!!q && !visible;
      });
      const systemVisible=[...el.querySelectorAll('.albums-system-grid .albums-tile')].some(tile=>!tile.hidden);
      el.querySelector('.albums-system-grid').hidden=!!q && !systemVisible;
      el.querySelectorAll('.albums-divider').forEach(d=>d.hidden=!!q);
    });
  }};
})(window.GalleryManager=window.GalleryManager||{});
