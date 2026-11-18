(function(G){
  const searchSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.5-4.5" stroke-linecap="round"/></svg>';
  const backSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const closeSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>';

  G.SearchBar=function(value=''){
    return `<div class="searchbar"><span>${G.icon('search')}</span><input id="global-search-input" value="${G.escape(value)}" placeholder="Search photos, folders, albums..." autocomplete="off"><button id="clear-search" class="${value?'':'hidden'}" aria-label="Clear search">${G.icon('close')}</button></div>`;
  };

  /*
   * Search activation is an inline page state, not a separate fixed overlay.
   * The current route is replaced with _search=1, so the page stays mounted
   * conceptually and the page's own three-dot action remains the page action.
   *
   * The router gives the Back key special handling for this state:
   * active search -> normal page, rather than leaving the page.
   */
  G.isInlineSearchActive=function(params){
    return String(params?._search||'')==='1';
  };

  G.activateInlineSearch=function(){
    const current=G.appState.route||{name:'home',params:{}};
    if(current.name==='search') return;
    const params={...(current.params||{}),_search:'1'};
    delete params.q;
    G.router.replace(current.name,params);
  };

  G.closeInlineSearch=function(){
    const current=G.appState.route||{name:'home',params:{}};
    if(!G.isInlineSearchActive(current.params)) return;
    const params={...(current.params||{})};
    delete params._search;
    G.router.replace(current.name,params);
  };

  G.submitInlineSearch=function(value){
    const q=String(value||'').trim();
    if(!q) return false;
    const current=G.appState.route||{name:'home',params:{}};
    const nav=current.params?._nav;
    G.router.go('search',nav?{q,_nav:nav}:{q});
    return true;
  };

  G.wireInlineSearchInput=function(root,inputSelector='.inline-search-input'){
    const input=root.querySelector(inputSelector);
    if(!input) return null;
    requestAnimationFrame(()=>{
      input.focus();
      try{input.setSelectionRange(input.value.length,input.value.length)}catch{}
    });
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        e.preventDefault();
        G.submitInlineSearch(input.value);
      }
    });
    input.addEventListener('input',()=>{
      const clear=root.querySelector('[data-inline-search-clear]');
      if(clear) clear.classList.toggle('hidden',!input.value);
    });
    root.querySelector('[data-inline-search-submit]')?.addEventListener('click',()=>{
      G.submitInlineSearch(input.value);
    });
    root.querySelector('[data-inline-search-clear]')?.addEventListener('click',()=>{
      input.value='';
      input.focus();
    });
    return input;
  };

  /*
   * Kept as a compatibility alias for existing callers. It now changes the
   * current page into its inline search state instead of creating a modal.
   */
  G.openSearchOverlay=function(){
    G.activateInlineSearch();
  };

  G.searchInlineMarkup=function(backLabel='Back'){
    return `<button class="inline-search-back" type="button" aria-label="${G.escape(backLabel)}">${backSvg}</button>
      <div class="inline-search-pill">
        <span class="inline-search-cursor" aria-hidden="true"></span>
        <input class="inline-search-input" type="search" placeholder="Search photos, albums..." autocomplete="off" aria-label="Search photos, albums">
        <button class="inline-search-submit" data-inline-search-submit type="button" aria-label="Submit search">${searchSvg}</button>
        <button class="inline-search-clear hidden" data-inline-search-clear type="button" aria-label="Clear search">${closeSvg}</button>
      </div>`;
  };
})(window.GalleryManager=window.GalleryManager||{});
