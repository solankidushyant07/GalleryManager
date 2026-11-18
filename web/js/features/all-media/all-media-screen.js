(function(G){
  const svg={
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5" stroke-linecap="round"/></svg>',
    more:'<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="10" cy="16" r="1.7"/></svg>',
    sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5M21 16.5 16.5 21m0 0L12 16.5m4.5 4.5V7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const icon=n=>svg[n]||'';

  G.AllMediaScreen={async render(el,p){
    const items=(await G.services.media.list({})).filter(x=>!x.trashed);
    let pullStartY=0, pulling=false, pullHideTimer=null;

    const render=()=>{
      const columns=G.appState.gridColumns||3;
      const showSubtitle=G.appState.allMediaShowSubtitle===true && columns===3;
      el.innerHTML=`<div class="all-media-page ${G.Selection.active()&&G.Selection.kind()==='media'?'selection-page-active':''}">
        <header class="all-media-header">
          <div class="all-media-nav ${G.isInlineSearchActive(p)?'all-media-inline-search':''}">
            ${G.isInlineSearchActive(p)
              ? `${G.searchInlineMarkup('Exit search state')}<button class="all-media-more inline-search-page-more" aria-label="More options" aria-expanded="false">${icon('more')}</button>`
              : `<button class="all-media-round" id="all-media-back" aria-label="Back">${icon('back')}</button>
                 <h1>All Media</h1>
                 <div class="all-media-actions"><button class="all-media-round" id="all-media-search" aria-label="Search">${icon('search')}</button><button class="all-media-round" id="all-media-more" aria-label="More options" aria-expanded="false">${icon('more')}</button></div>`}
          </div>
          ${showSubtitle?`<div class="all-media-subtitle">${countSummary(items)}</div>`:''}
          <div class="all-media-sort"><button id="all-media-sort">${icon('sort')}<span>Sort by</span><b>⌄</b></button></div>
          ${columns===3&&!showSubtitle?'<div class="all-media-pull-hint" aria-hidden="true">Pull down for count</div>':''}
        </header>
        ${G.SelectionHeader(items.map(x=>x.id),'media')}
        <main class="all-media-scroll" id="all-media-scroll">
          ${G.SelectionBar(G.appState.selected.size,'media')}
          ${G.AdaptiveMediaTimeline(items,{columns,selected:G.appState.selected,subtitle:showSubtitle})}
        </main>
      </div>`;

      if(G.isInlineSearchActive(p)){
        el.querySelector('.inline-search-back').onclick=()=>G.router.back();
        G.wireInlineSearchInput(el);
      }else{
        el.querySelector('#all-media-back').onclick=()=>G.router.back();
        el.querySelector('#all-media-search').onclick=()=>G.activateInlineSearch();
      }

      el.querySelector('#all-media-sort').onclick=()=>{
        const d=G.dialog({
          title:'Sort media',
          body:`<div class="choice-list">
            ${G.Sorting.OPTIONS.map(o=>`<button data-sort-choice="${o.value}" class="${G.Sorting.normalize(G.appState.sort)===o.value?'chosen':''}">${o.label}<span>${G.Sorting.normalize(G.appState.sort)===o.value?'✓':''}</span></button>`).join('')}
          </div>`,confirm:'Done',onConfirm:()=>{}
        });
        d.querySelectorAll('[data-sort-choice]').forEach(b=>b.onclick=()=>{G.appState.patch({sort:b.dataset.sortChoice});d.remove()});
      };

      G.wireSelectionChrome(el,items.map(x=>x.id),'media');
      G.wireAdaptiveMedia(el,items);
      const scroll=el.querySelector('#all-media-scroll');
      scroll?.addEventListener('touchstart',e=>{
        if(e.touches.length===1 && scroll.scrollTop<=0){pullStartY=e.touches[0].clientY;pulling=true}
      },{passive:true});
      scroll?.addEventListener('touchmove',e=>{
        if(!pulling||e.touches.length!==1)return;
        const dy=e.touches[0].clientY-pullStartY;
        if(dy>48 && columns===3){
          G.appState.patch({allMediaShowSubtitle:true});
          clearTimeout(pullHideTimer);
          pullHideTimer=setTimeout(()=>G.appState.patch({allMediaShowSubtitle:false}),1200);
          pulling=false;
        }
      },{passive:true});
      scroll?.addEventListener('touchend',()=>{pulling=false},{passive:true});
    };

    function countSummary(xs){
      const photos=xs.filter(x=>x.type!=='video').length, videos=xs.filter(x=>x.type==='video').length;
      return `${photos} photos${videos?' and '+videos+' videos':''}`;
    }
    render();
  }};
})(window.GalleryManager=window.GalleryManager||{});
