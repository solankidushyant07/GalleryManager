(function(G){
  const icons={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5M21 16.5 16.5 21m0 0L12 16.5m4.5 4.5V7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grid:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6.5v6.5H4V4zm9.5 0H20v6.5h-6.5V4zM4 13.5h6.5V20H4v-6.5zm9.5 0H20V20h-6.5v-6.5z"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h3.38c.46 0 .9-.18 1.23-.51l1.29-1.29c.32-.33.76-.51 1.22-.51H19.5a2.25 2.25 0 0 1 2.25 2.25v3m-19.5 0A2.25 2.25 0 0 1 4.5 15h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0v5.25A2.25 2.25 0 0 0 4.5 20.25h15a2.25 2.25 0 0 0 2.25-2.25v-5.25"/></svg>',
    restore:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 5v6h6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const icon=n=>icons[n]||'';
  const sortItems=(items,mode)=>G.Sorting.sort(items,mode);

  const photoTile=(item,selected)=>`<button type="button" class="archive-photo-card ${selected?'selected':''}" data-archive-media="${G.escape(item.id)}" aria-label="${G.escape(item.name)}">
    <img src="${G.escape(item.uri)}" alt="${G.escape(item.name)}" loading="lazy">
    ${item.type==='video'?'<span class="archive-video-badge">▶</span>':''}
    ${selected?'<span class="archive-select-badge">✓</span>':''}
  </button>`;
  const albumCard=(album,cover,selected)=>`<button type="button" class="archive-album-card ${selected?'selected':''}" data-archive-album="${G.escape(album.id)}">
    <span class="archive-album-cover">${cover?`<img src="${G.escape(cover.uri)}" alt="" loading="lazy">`:icon('folder')}</span>
    <strong>${G.escape(album.name)}</strong><small>${album.count} items</small>
    ${selected?'<span class="archive-select-badge">✓</span>':''}
  </button>`;

  G.ArchiveScreen={async render(el,p={}){
    const view=p.view==='photos'?'photos':'albums';
    let media=[],albums=[];
    try{
      [media,albums]=await Promise.all([G.services.archive.listMedia(),G.services.archive.listAlbums()]);
    }catch(err){
      el.innerHTML=G.ErrorState('Archive unavailable',err?.message||'');
      return;
    }
    const selectedMedia=new Set();
    const selectedAlbums=new Set();
    const sort=G.appState.archiveSort||'newest';
    const render=async()=>{
      const sortedMedia=sortItems(media,sort);
      const coverMedia=view==='albums' ? (await G.services.media.list({includeArchived:true,includeTrash:true})) : media;
      const albumMetrics=a=>G.Sorting.metricsForMedia(coverMedia.filter(m=>m.albumIds?.includes(a.id)&&!m.trashed));
      const sortedAlbums=G.Sorting.sort(albums,sort,albumMetrics);
      const count=view==='photos'?media.length:albums.length;
      const isEmpty=count===0;
      const content=view==='photos'
        ? (isEmpty
          ? `<section class="archive-empty-state"><div class="archive-empty-icon">${icon('restore')}</div><h2>No archived items</h2><p>Archived photos and albums will appear here. They will be kept safe until you restore them.</p></section>`
          : `<section class="archive-photo-grid">${sortedMedia.map(x=>photoTile(x,selectedMedia.has(String(x.id)))).join('')}</section>`)
        : (isEmpty
          ? `<section class="archive-empty-state"><div class="archive-empty-icon">${icon('folder')}</div><h2>No archived items</h2><p>Archived photos and albums will appear here. They will be kept safe until you restore them.</p></section>`
          : `<section class="archive-album-grid">${awaitAlbumCards(sortedAlbums,coverMedia,selectedAlbums)}</section>`);
      el.innerHTML=`<div class="gm-special-page archive-page">
        <header class="gm-special-header archive-header">
          <button class="gm-back" id="archive-back" type="button" aria-label="Go back">${icon('back')}</button>
          <div><h1>Archive</h1><p>${count} ${view==='albums'?(count===1?'album':'albums'):(count===1?'item':'items')}</p></div>
        </header>
        <section class="archive-controls">
          <button class="archive-sort-btn" id="archive-sort">${icon('sort')}<span>Sort by</span><b>⌄</b></button>
          <div class="archive-view-toggle" role="group" aria-label="Archive view">
            <button type="button" data-archive-view="photos" aria-label="Grid view" class="${view==='photos'?'active':''}">${icon('grid')}</button>
            <button type="button" data-archive-view="albums" aria-label="Folder view" class="${view==='albums'?'active':''}">${icon('folder')}</button>
          </div>
        </section>
        <main class="gm-special-content archive-content">${content}</main>
        ${view==='photos'&&selectedMedia.size?`<div class="archive-selection"><strong>${selectedMedia.size} selected</strong><button id="archive-restore-media">${icon('restore')} Restore</button><button id="archive-clear-media">Clear</button></div>`:''}
        ${view==='albums'&&selectedAlbums.size?`<div class="archive-selection"><strong>${selectedAlbums.size} selected</strong><button id="archive-restore-albums">${icon('restore')} Restore</button><button id="archive-clear-albums">Clear</button></div>`:''}
      </div>`;

      el.querySelector('#archive-back').onclick=()=>G.router.back();
      el.querySelectorAll('[data-archive-view]').forEach(b=>b.onclick=()=>G.router.replace('archive',{view:b.dataset.archiveView}));
      el.querySelector('#archive-sort').onclick=()=>{
        G.dialog({
          title:'Sort archive',
          body:`<div class="choice-list">
            ${G.Sorting.OPTIONS.map(o=>`<button data-archive-sort="${o.value}" class="${G.Sorting.normalize(sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(sort)===o.value?'✓':''}</span></button>`).join('')}
          </div>`,
          confirm:'Done',
          onConfirm:()=>{}
        });
        setTimeout(()=>{
          const dialogs=[...document.querySelectorAll('.modal-backdrop')],d=dialogs[dialogs.length-1];
          d?.querySelectorAll('[data-archive-sort]').forEach(b=>b.onclick=()=>{G.appState.archiveSort=b.dataset.archiveSort;d.remove();render()});
        },0);
      };

      if(view==='photos'){
        el.querySelectorAll('[data-archive-media]').forEach(btn=>{
          let timer;
          btn.onpointerdown=()=>{timer=setTimeout(()=>{selectedMedia.add(String(btn.dataset.archiveMedia));render()},500)};
          btn.onpointerup=()=>clearTimeout(timer);btn.onpointerleave=()=>clearTimeout(timer);
          btn.onclick=()=>{
            clearTimeout(timer);
            const id=String(btn.dataset.archiveMedia);
            if(selectedMedia.size){selectedMedia.has(id)?selectedMedia.delete(id):selectedMedia.add(id);render();}
            else G.router.go('viewer',{id,archived:'1'});
          };
        });
        el.querySelector('#archive-restore-media')?.addEventListener('click',async()=>{await G.services.archive.restoreMedia([...selectedMedia]);G.toast('Restored from Archive.');selectedMedia.clear();media=await G.services.archive.listMedia();render()});
        el.querySelector('#archive-clear-media')?.addEventListener('click',()=>{selectedMedia.clear();render()});
      }else{
        el.querySelectorAll('[data-archive-album]').forEach(btn=>{
          let timer;
          btn.onpointerdown=()=>{timer=setTimeout(()=>{selectedAlbums.add(String(btn.dataset.archiveAlbum));render()},500)};
          btn.onpointerup=()=>clearTimeout(timer);btn.onpointerleave=()=>clearTimeout(timer);
          btn.onclick=()=>{
            clearTimeout(timer);
            const id=String(btn.dataset.archiveAlbum);
            if(selectedAlbums.size){selectedAlbums.has(id)?selectedAlbums.delete(id):selectedAlbums.add(id);render();}
            else G.router.go('album',{id,archived:'1'});
          };
        });
        el.querySelector('#archive-restore-albums')?.addEventListener('click',async()=>{for(const id of selectedAlbums)await G.services.archive.restoreAlbum(id);G.toast('Restored from Archive.');selectedAlbums.clear();albums=await G.services.archive.listAlbums();render()});
        el.querySelector('#archive-clear-albums')?.addEventListener('click',()=>{selectedAlbums.clear();render()});
      }
    };
    async function awaitAlbumCards(arr,med,sel){
      return arr.map(a=>{
        const cover=G.CoverPolicy?.album(a,med);
        return albumCard(a,cover,sel.has(String(a.id)));
      }).join('');
    }
    // The renderer is async because album cards need the archive media list for covers.
    render();
  }};
})(window.GalleryManager=window.GalleryManager||{});
