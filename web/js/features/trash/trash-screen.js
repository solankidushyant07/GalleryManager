(function(G){
  const trashIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function daysLeft(item){
    const raw=item.trashed;
    const when=typeof raw==='number'?raw:Date.parse(raw||'');
    if(!when)return 30;
    return Math.max(1,Math.ceil((30*86400000-(Date.now()-when))/86400000));
  }
  function size(items){return G.formatBytes(items.reduce((n,x)=>n+(Number(x.size)||0),0));}
  function tile(item){
    const selected=G.Selection.isSelected(item.id,'trash');
    return `<button type="button" class="trash-tile" data-trash-id="${G.escape(item.id)}" aria-label="${G.escape(item.name)}">
      <img src="${G.escape(item.uri)}" alt="${G.escape(item.name)}" loading="lazy">
      ${G.Selection.active()&&G.Selection.kind()==='trash'?`<span class="collection-select-badge ${selected?'is-selected':'is-unselected'}">${selected?'✓':''}</span>`:''}
      <span>${daysLeft(item)} days</span>
    </button>`;
  }

  function renderDialog(el){
    const overlay=document.createElement('div');
    overlay.className='trash-dialog-overlay';
    overlay.innerHTML=`<div class="trash-dialog" role="dialog" aria-modal="true" aria-labelledby="trash-dialog-title">
      <div class="trash-dialog-icon">${trashIcon}</div>
      <h2 id="trash-dialog-title">Clear trash?</h2>
      <p>This will permanently delete all items in Trash. This action can't be undone.</p>
      <div class="trash-dialog-actions"><button type="button" id="trash-dialog-cancel">Cancel</button><button type="button" id="trash-dialog-confirm">Delete all</button></div>
    </div>`;
    G.overlayRoot().appendChild(overlay);
    overlay.querySelector('#trash-dialog-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#trash-dialog-confirm').onclick=async()=>{
      const btn=overlay.querySelector('#trash-dialog-confirm'); btn.disabled=true;
      await G.services.trash.empty(); overlay.remove(); G.Selection.clear(); G.toast('Trash emptied.'); G.renderScreen();
    };
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
  }
  G.TrashScreen={async render(el){
    const items=await G.services.trash.list();
    const has=items.length>0;
    el.innerHTML=`<div class="gm-special-page trash-page ${G.Selection.active()&&G.Selection.kind()==='trash'?'selection-page-active':''}">
      ${G.SelectionHeader(items.map(x=>x.id),'trash')}
      <header class="gm-special-header">
        <button class="gm-back" type="button" aria-label="Go back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div><h1>Deleted items</h1><p>${items.length} ${items.length===1?'item':'items'} • ${size(items)}</p></div>
        <button type="button" class="trash-empty-button ${has?'':'disabled'}" id="trash-empty-button" aria-label="Clear all trash">${trashIcon}</button>
      </header>
      <main class="gm-special-content trash-content">
        <section class="trash-notice"><span class="trash-clock">◷</span><div><strong>Items in Trash will be permanently deleted after 30 days.</strong><small>You can restore them before that.</small></div></section>
        ${has?`${G.SelectionBar(G.appState.selected.size,'trash') }<div class="trash-grid">${items.map(x=>{const selected=G.Selection.isSelected(x.id,'trash');return tile(x).replace('class="trash-tile"',`class="trash-tile ${selected?'selected-collection':''}"`)}).join('')}</div>`:`<section class="trash-empty-state"><div class="trash-empty-icon">${trashIcon}</div><h2>Trash is empty</h2><p>Deleted media will appear here before permanent removal.</p></section>`}
      </main>
    </div>`;
    el.querySelector('.gm-back').onclick=()=>G.router.back();
    G.wireSelectionChrome(el,items.map(x=>x.id),'trash');
    if(has){
      el.querySelector('#trash-empty-button').onclick=()=>renderDialog(el);
      G.wireSelectionTiles(el,'[data-trash-id]',items,{kind:'trash',open:id=>G.router.go('viewer',{id,trashed:'1'})});
    }
  }};
})(window.GalleryManager=window.GalleryManager||{});
