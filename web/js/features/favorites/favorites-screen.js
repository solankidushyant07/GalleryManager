(function(G){
  function tile(item){
    const selected=G.Selection.isSelected(item.id,'media');
    return `<button type="button" class="gm-photo-tile favourite-tile" data-media-id="${G.escape(item.id)}" aria-label="${G.escape(item.name)}">
      <img src="${G.escape(item.uri)}" alt="${G.escape(item.name)}" loading="lazy">
      ${G.Selection.active()&&G.Selection.kind()==='media'?`<span class="select-badge ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}<span class="favorite-badge" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>
    </button>`;
  }
  function empty(){
    return `<section class="favourites-empty">
      <div class="favourite-dish"><div class="favourite-rays"></div><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
      <h2>No favourites yet</h2><p>Tap the heart icon on photos to add them to your favourites.</p>
    </section>`;
  }
  G.FavoritesScreen={async render(el){
    const items=await G.services.favorites.list();
    el.innerHTML=`<div class="gm-special-page favourites-page ${G.Selection.active()&&G.Selection.kind()==='media'?'selection-page-active':''}>
      ${G.SelectionHeader(items.map(x=>x.id),'media')}
      ${G.SelectionBar(G.appState.selected.size,'media')}
      <header class="gm-special-header">
        <button class="gm-back" type="button" aria-label="Go back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15.75 19.5L8.25 12l7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div><h1>Favourites</h1><p>${items.length} ${items.length===1?'photo':'photos'}</p></div>
      </header>
      <main class="gm-special-content favourites-content">${items.length?`<div class="favourites-grid">${items.map(tile).join('')}</div>`:empty()}</main>
    </div>`;
    el.querySelector('.gm-back').onclick=()=>G.router.back();
    G.wireSelectionChrome(el,items.map(x=>x.id),'media');
    G.wireSelectionTiles(el,'[data-media-id]',items,{kind:'media',open:id=>G.router.go('viewer',{id})});
  }};
})(window.GalleryManager=window.GalleryManager||{});
