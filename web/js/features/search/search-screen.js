(function(G){
  let renderToken=0;

  function stateFor(result){
    if(!result) return 'loading';
    return result.media.length || result.albums.length ? 'results' : 'empty';
  }

  function searchIcon(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5" stroke-linecap="round"/></svg>';
  }
  function clearIcon(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>';
  }
  function backIcon(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function header(q){
    return `<div class="search-page-head">
      <button class="search-back" id="search-back" aria-label="Back" type="button">${backIcon()}</button>
      <h1>Search</h1>
    </div>
    <div class="search-active-bar">
      ${searchIcon()}
      <input id="global-search-input" value="${G.escape(q)}" placeholder="Search photos, albums..." autocomplete="off" aria-label="Search">
      <button id="clear-search" class="${q?'':'hidden'}" aria-label="Clear search" type="button">${clearIcon()}</button>
    </div>`;
  }

  function loading(){
    return `<section class="search-loading-state" aria-live="polite">
      <div class="search-skeleton-grid">${Array.from({length:12},()=>`<div class="search-skeleton-item"><div class="search-spinner"></div><span></span></div>`).join('')}</div>
    </section>`;
  }

  function empty(q){
    return `<section class="search-empty search-empty-reference">
      <div class="search-empty-disc">${searchIcon()}</div>
      <h2>No results found</h2>
      <p>No photos, albums or files match<br><span>“${G.escape(q)}”</span></p>
    </section>`;
  }

  function initial(){
    return `<section class="search-initial-reference">
      <div class="search-initial-disc">${searchIcon()}</div>
      <h2>Search something</h2>
      <p>Find your photos, albums and more</p>
    </section>`;
  }

  function results(result){
    return `<section class="search-results-reference ${G.Selection.active()&&G.Selection.kind()==='media'?'selection-page-active':''}">
      ${G.SelectionHeader(result.media.map(x=>x.id),'media')}
      ${G.SelectionBar(G.appState.selected.size,'media')}
      ${result.albums.length?`<div class="search-result-albums">${result.albums.map(a=>`<button type="button" data-album="${G.escape(a.id)}">${G.icon('albums')} ${G.escape(a.name)}</button>`).join('')}</div>`:''}
      ${result.media.length
        ? `<div class="search-results-grid">${result.media.map(x=>`<button type="button" class="search-result-card ${G.Selection.isSelected(x.id,'media')?'selected-collection':''}" data-media-id="${G.escape(x.id)}">
              <span class="search-result-image"><img src="${G.escape(x.uri)}" alt="${G.escape(x.name)}" loading="lazy">${x.type==='video'?'<span class="search-result-video">▶</span>':''}${G.Selection.active()&&G.Selection.kind()==='media'?`<span class="collection-select-badge ${G.Selection.isSelected(x.id,'media')?'is-selected':'is-unselected'}">${G.Selection.isSelected(x.id,'media')?'✓':''}</span>`:''}</span>
              <span>${G.escape(x.name)}</span>
            </button>`).join('')}</div>`
        : `<div class="search-results-no-media"><strong>Matching albums found</strong><span>Open an album above to view its contents.</span></div>`}
    </section>`;
  }

  async function runSearch(el,q,token){
    let result;
    try{
      result=await G.services.search.search(q);
    }catch(err){
      if(token!==renderToken)return;
      el.querySelector('.search-body').innerHTML=G.ErrorState('Search unavailable',err?.message||'Try again.');
      return;
    }
    if(token!==renderToken)return;
    if(!document.body.contains(el))return;
    const body=el.querySelector('.search-body');
    if(body) body.innerHTML=stateFor(result)==='empty'?empty(q):results(result);
    wireResults(el,result);
  }

  function wireInput(el){
    const input=el.querySelector('#global-search-input');
    const clear=el.querySelector('#clear-search');
    input?.focus();
    input?.setSelectionRange(input.value.length,input.value.length);
    input?.addEventListener('input',e=>clear?.classList.toggle('hidden',!e.target.value));
    input?.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        e.preventDefault();
        const value=e.target.value.trim();
        G.router.go('search',value?{q:value}:{});
      }
    });
    clear?.addEventListener('click',()=>{
      input.value='';
      input.focus();
      G.router.go('search');
    });
  }

  function wireResults(el,result){
    const media=result?.media||[];
    G.wireSelectionChrome(el,media.map(x=>x.id),'media');
    G.wireSelectionTiles(el,'[data-media-id]',media,{kind:'media',open:id=>G.router.go('viewer',{id})});
    el.querySelectorAll('[data-album]').forEach(b=>b.onclick=()=>G.router.go('album',{id:b.dataset.album}));
  }

  G.SearchScreen={
    async render(el,p={}){
      const q=String(p.q||'').trim();
      const token=++renderToken;
      el.innerHTML=`<div class="page search-page ${G.Selection.active()&&G.Selection.kind()==='media'?'selection-page-active':''}">${header(q)}<div class="search-body">${q?loading():initial()}</div></div>`;
      el.querySelector('#search-back').onclick=()=>G.router.back();
      wireInput(el);
      if(q) await runSearch(el,q,token);
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
