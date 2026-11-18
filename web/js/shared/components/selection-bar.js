(function(G){
  const icons={
    share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M12 16V3m0 0-4 4m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rename:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M12 20h9M16.86 3.49a2.25 2.25 0 0 1 3.18 3.18L7.5 19.21l-4.5 1-1-4.5L16.86 3.49z" stroke-linejoin="round"/></svg>',
    delete:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    album:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-linejoin="round"/><path d="M12 12v5m-2.5-2.5h5" stroke-linecap="round"/></svg>',
    move:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 13h6m-2.5-2.5L15 13l-2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/></svg>',
    favorite:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M20.8 8.6c0 5-8.8 10.1-8.8 10.1S3.2 13.6 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5z" stroke-linejoin="round"/></svg>',
    archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 7h16l-1 13H5L4 7zm2-3h12l2 3H4l2-3zM9 11h6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" stroke-linecap="round"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round"/></svg>',
    creativity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" stroke-linejoin="round"/></svg>',
    restore:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 10a8 8 0 1 1 2.3 5.7M4 10V4m0 6h6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const doubleCheck=`<svg viewBox="0 0 512 512" fill="none" aria-hidden="true">
    <rect x="36" y="36" width="440" height="440" rx="110" stroke="currentColor" stroke-width="40" stroke-linejoin="round"/>
    <path d="M148 252 216 320M252 248l66-66M204 250l56 56 112-112" stroke="currentColor" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  const action=(name,label,icon,danger=false)=>`<button type="button" class="selection-action-button${danger?' danger':''}" data-selection-action="${name}"><span class="selection-action-icon">${icons[icon]||''}</span><span>${label}</span></button>`;
  const moreAction=(name,label,icon,danger=false)=>`<button type="button" class="selection-more-action${danger?' danger':''}" data-selection-action="${name}"><span class="selection-more-icon">${icons[icon]||''}</span><span>${label}</span></button>`;

  const state=()=>{
    if(!G.appState.selectionMode) return {active:false,kind:'media',ids:G.appState.selected};
    return {active:true,kind:G.appState.selectionKind||'media',ids:G.appState.selected};
  };

  G.Selection={
    enter(kind='media'){ G.appState.patch({selectionMode:true,selectionKind:kind}); },
    clear(){ G.appState.patch({selected:new Set(),selectionMode:false}); },
    toggle(id,kind){
      kind=kind||G.appState.selectionKind||'media';
      const next=new Set(G.appState.selected), key=String(id);
      next.has(key)?next.delete(key):next.add(key);
      G.appState.patch({selected:next,selectionMode:true,selectionKind:kind});
    },
    add(id,kind){
      kind=kind||G.appState.selectionKind||'media';
      const next=new Set(G.appState.selected); next.add(String(id));
      G.appState.patch({selected:next,selectionMode:true,selectionKind:kind});
    },
    selectAll(ids,kind){
      kind=kind||G.appState.selectionKind||'media';
      G.appState.patch({selected:new Set((ids||[]).map(String)),selectionMode:true,selectionKind:kind});
    },
    deselectAll(kind){
      kind=kind||G.appState.selectionKind||'media';
      G.appState.patch({selected:new Set(),selectionMode:true,selectionKind:kind});
    },
    isSelected(id,kind){
      const s=state();
      return s.active && (!kind || s.kind===kind) && s.ids.has(String(id));
    },
    active(){return state().active;},
    kind(){return state().kind;},
    count(){return state().ids.size;}
  };

  G.SelectionHeader=function(totalIds=[],kind='media'){
    if(!G.Selection.active() || G.Selection.kind()!==kind)return '';
    const count=G.Selection.count();
    const all=totalIds.length>0 && totalIds.every(id=>G.Selection.isSelected(id,kind));
    return `<section class="selection-mode-header" data-selection-chrome data-selection-kind="${G.escape(kind)}">
      <div class="selection-mode-row">
        <button type="button" class="selection-double-check" data-selection-select-all aria-label="${all?'Deselect all':'Select all'}">${doubleCheck}</button>
        <strong aria-live="polite">${count} selected</strong>
        <button type="button" class="selection-cancel" data-selection-cancel>Cancel</button>
      </div>
      <div class="selection-mode-subrow">
        <button type="button" class="selection-all-pill" data-selection-select-all>${all?'Deselect all':'Select all'}</button>
      </div>
    </section>`;
  };

  G.SelectionBar=function(count,kind='media'){
    if(!G.Selection.active() || !count || G.Selection.kind()!==kind)return '';
    let buttons=[];
    if(kind==='album'){
      if(count===1) buttons.push(action('rename-selected','Rename','rename'));
      buttons.push(action('private-selected','Make private','lock'));
      buttons.push(action('delete-selected','Delete','delete',true));
      return `<div class="selection-action-sheet" data-selection-chrome>
        <div class="selection-action-row selection-action-row-${count===1?'album-single':'album-multi'}">
          ${buttons.join('')}
          ${count===1?action('more','More','more'):action('more','More','more')}
        </div>
      </div>`;
    }
    if(kind==='folder'){
      buttons=[action('rename-selected','Rename','rename'),action('more','More','more')];
      return `<div class="selection-action-sheet" data-selection-chrome><div class="selection-action-row">${buttons.join('')}</div></div>`;
    }
    if(kind==='trash'){
      return `<div class="selection-action-sheet" data-selection-chrome><div class="selection-action-row selection-action-row-compact">
        ${action('restore-selected','Restore','restore')}${action('delete-permanent-selected','Delete','delete',true)}${action('more','More','more')}
      </div></div>`;
    }
    if(kind==='private'){
      return `<div class="selection-action-sheet" data-selection-chrome><div class="selection-action-row selection-action-row-compact">
        ${action('share-selected','Share','share')}${action('more','More','more')}
      </div></div>`;
    }
    // Media selection follows the supplied single/multiple selection states.
    if(count===1){
      buttons=[
        action('share-selected','Share','share'),
        action('rename-selected','Rename','rename'),
        action('trash-selected','Delete','delete',true),
        action('album-selected','Add to album','album'),
        action('more','More','more')
      ];
    }else{
      buttons=[
        action('share-selected','Share','share'),
        action('creativity-selected','Creativity','creativity'),
        action('trash-selected','Delete','delete',true),
        action('album-selected','Add to album','album'),
        action('more','More','more')
      ];
    }
    return `<div class="selection-action-sheet" data-selection-chrome><div class="selection-action-row selection-action-row-media">${buttons.join('')}</div></div>`;
  };

  G.openSelectionMore=function(kind){
    document.getElementById('selection-more-sheet')?.remove();
    const ids=[...G.appState.selected].map(String);
    if(!ids.length)return;
    let actions=[];
    if(kind==='media'){
      actions=[
        ['favorite-selected','Favorite','favorite'],
        ['copy-selected','Copy','copy'],
        ['move-selected','Move to','move'],
        ['archive-selected','Archive','archive'],
        ['private-selected','Make private','lock']
      ];
    }else if(kind==='album'){
      const moreSet=G.appState.moreAlbumIds||new Set();
      const inMore=ids.filter(id=>moreSet.has(String(id)));
      const moveLabel=inMore.length===ids.length?'Move to My Albums':'Move to Other Albums';
      const moveAction=inMore.length===ids.length?'move-to-my-albums-selected':'move-to-other-albums-selected';
      actions=[['share-selected','Share','share'],['rename-selected','Rename','rename'],[moveAction,moveLabel,'move']];
    }else if(kind==='folder'){
      actions=[['share-selected','Share','share'],['rename-selected','Rename','rename']];
    }else if(kind==='trash'){
      actions=[['clear-selection','Clear selection','delete']];
    }else{
      actions=[['clear-selection','Clear selection','delete']];
    }
    const id='selection-more-sheet';
    G.overlayRoot().insertAdjacentHTML('beforeend',`<div class="selection-more-backdrop" id="${id}">
      <section class="selection-more-sheet" role="dialog" aria-modal="true" aria-label="More selection actions">
        <div class="selection-more-handle"></div>
        <div class="selection-more-title"><strong>More</strong><button type="button" data-more-close aria-label="Close">×</button></div>
        <div class="selection-more-list">${actions.map(a=>moreAction(...a)).join('')}</div>
      </section>
    </div>`);
    const root=document.getElementById(id);
    const close=()=>root?.remove();
    root.querySelector('[data-more-close]').onclick=close;
    root.onclick=e=>{if(e.target===root)close()};
    root.querySelectorAll('[data-selection-action]').forEach(btn=>btn.onclick=async()=>{
      const a=btn.dataset.selectionAction;
      close();
      await G.handleSelectionAction(a,kind);
    });
  };

  G.wireSelectionChrome=function(root,totalIds,kind='media'){
    const ids=(totalIds||[]).map(String);
    root.querySelectorAll('[data-selection-select-all]').forEach(btn=>btn.onclick=()=>{
      const all=ids.length>0 && ids.every(id=>G.Selection.isSelected(id,kind));
      all?G.Selection.deselectAll(kind):G.Selection.selectAll(ids,kind);
    });
    root.querySelectorAll('[data-selection-cancel]').forEach(btn=>btn.onclick=()=>G.Selection.clear());
    root.querySelectorAll('[data-selection-action]').forEach(btn=>btn.onclick=()=>{
      const action=btn.dataset.selectionAction;
      if(action==='more'){G.openSelectionMore(kind);return}
      G.handleSelectionAction(action,kind);
    });
  };

  G.wireSelectionTiles=function(root,selector,items,{kind='media',open}={}){
    const list=items||[];
    root.querySelectorAll(selector).forEach(tile=>{
      let timer=null,longPressed=false,moved=false,startX=0,startY=0;
      const LONG_PRESS_MS=360,MOVE_TOLERANCE=22;
      const clear=()=>{if(timer){clearTimeout(timer);timer=null}};
      const feedback=()=>{
        tile.classList.add('selection-longpressing');
        setTimeout(()=>tile.classList.remove('selection-longpressing'),140);
        try{navigator.vibrate?.(8)}catch{}
      };
      tile.classList.add('selection-touch-target');
      tile.addEventListener('contextmenu',e=>e.preventDefault());
      tile.onpointerdown=e=>{
        if(e.pointerType==='mouse'&&e.button!==0)return;
        clear();longPressed=false;moved=false;startX=e.clientX;startY=e.clientY;
        tile.setPointerCapture?.(e.pointerId);
        timer=setTimeout(()=>{
          timer=null;if(moved)return;
          longPressed=true;feedback();
          G.Selection.add(tile.dataset.selectionId||tile.dataset.mediaId,kind);
        },LONG_PRESS_MS);
      };
      tile.onpointermove=e=>{
        if(!timer)return;
        if(Math.hypot(e.clientX-startX,e.clientY-startY)>MOVE_TOLERANCE){moved=true;clear();}
      };
      tile.onpointerup=e=>{clear();tile.releasePointerCapture?.(e.pointerId)};
      tile.onpointercancel=e=>{clear();tile.releasePointerCapture?.(e.pointerId)};
      tile.onclick=e=>{
        clear();
        if(longPressed){longPressed=false;return}
        if(moved)return;
        const id=tile.dataset.selectionId||tile.dataset.mediaId;
        if(G.Selection.active()&&G.Selection.kind()===kind){G.Selection.toggle(id,kind);return}
        if(open)open(id,e,tile);
      };
    });
  };

  G.handleSelectionAction=async function(action,kind){
    const ids=[...G.appState.selected].map(String);
    if(!ids.length)return;

    if(action==='private-selected'){
      let mediaIds=ids;
      if(kind==='album'){
        const media=await G.services.media.list({includeArchived:true,includeTrash:true});
        mediaIds=[...new Set(media.filter(m=>(m.albumIds||[]).some(a=>ids.includes(String(a)))).map(m=>String(m.id)))];
      }
      if(!mediaIds.length){G.toast('There is nothing to make private.');return}
      try{
        const state=await G.services.privateVault?.state?.();
        if(state?.unlocked){
          const media=await G.services.media.list({includeArchived:true,includeTrash:true});
          const picked=media.filter(x=>mediaIds.includes(String(x.id)));
          await G.services.privateVault.import(picked.map(x=>({id:x.id,name:x.name,uri:x.uri,type:x.type,mime:x.mime,size:x.size,width:x.width,height:x.height})));
          G.Selection.clear();G.toast(`${picked.length} item(s) made private.`);G.renderScreen();
        }else{
          G.Selection.clear();
          G.router.go('private',{pending:mediaIds.join(',')});
        }
      }catch(err){G.toast(err?.message||'Could not make the selected items private.','error')}
      return;
    }

    if(action==='share-selected'){
      const media=await G.services.media.list({includeArchived:true,includeTrash:true});
      const picked=media.filter(x=>ids.includes(String(x.id)));
      if(navigator.share){
        try{
          await navigator.share({
            title:picked.length===1?picked[0]?.name:`${picked.length} selected items`,
            text:picked.length===1?(picked[0]?.name||'Selected item'):`${picked.length} photos selected`
          });
          return;
        }catch(err){ if(err?.name==='AbortError')return; }
      }
      G.toast(`${picked.length} item(s) ready to share.`);
      return;
    }

    if(action==='creativity-selected'){
      if(ids.length===1){
        const item=await G.services.media.get(ids[0]);
        if(item?.type==='image'){G.Selection.clear();G.router.go('editor',{id:ids[0]});return}
        G.toast('Creativity editing is available for images.','error');return;
      }
      G.Selection.clear();
      G.router.go('composition',{mediaIds:ids.join(',')});
      return;
    }

    if(kind==='album' || kind==='folder'){
      if(action==='rename-selected'){
        if(ids.length!==1){G.toast('Select one album to rename.');return}
        const id=ids[0];
        const album=await G.services.albums.get(id).catch(()=>null);
        if(kind==='folder'){
          const f=(window.GalleryManagerSample?.folders||[]).find(x=>String(x.id)===id);
          if(!f){G.toast('Folder not found.','error');return}
          G.dialog({
            title:'Rename folder',
            body:`<input class="modal-input" id="selection-folder-rename" value="${G.escape(f.name)}" placeholder="Folder name">`,
            confirm:'Save',
            onConfirm:async()=>{
              const name=document.getElementById('selection-folder-rename')?.value.trim();
              if(name&&G.services.files.renameFolder){await G.services.files.renameFolder(id,name);G.Selection.clear();G.toast('Folder renamed.');G.renderScreen();}
            }
          });
          return;
        }
        if(!album){G.toast('Only user albums can be renamed here.','error');return}
        G.dialog({
          title:'Rename album',
          body:`<input class="modal-input" id="selection-album-rename" value="${G.escape(album.name)}" placeholder="Album name">`,
          confirm:'Save',
          onConfirm:async()=>{
            const name=document.getElementById('selection-album-rename')?.value.trim();
            if(name){await G.services.albums.rename(id,name);G.Selection.clear();G.toast('Album renamed.');G.renderScreen();}
          }
        });
        return;
      }
      if(action==='move-to-other-albums-selected'){
        const albums=await G.services.albums.list();
        const valid=ids.filter(id=>albums.some(a=>String(a.id)===String(id)));
        await G.services.albums.moveToOther(valid);
        G.Selection.clear();G.toast('Moved selected albums to Other Albums.');G.renderScreen();return;
      }
      if(action==='move-to-my-albums-selected'){
        const albums=await G.services.albums.list();
        const valid=ids.filter(id=>albums.some(a=>String(a.id)===String(id)));
        await G.services.albums.moveToMy(valid);
        G.Selection.clear();G.toast('Moved selected albums to My Albums.');G.renderScreen();return;
      }
      if(action==='delete-selected'){
        const albums=await G.services.albums.list();
        const valid=ids.filter(id=>albums.some(a=>String(a.id)===id));
        if(!valid.length){G.toast('Device folders and system collections cannot be deleted.');return}
        G.dialog({
          title:'Delete selected albums?',
          body:`${valid.length} album${valid.length===1?'':'s'} will be deleted.`,
          confirm:'Delete',
          onConfirm:async()=>{
            for(const id of valid)await G.services.albums.delete(id);
            G.Selection.clear();G.toast('Selected albums deleted.');G.renderScreen();
          }
        });
        return;
      }
      if(action==='share-selected'){G.toast('Sharing selected collections is not available in this runtime.');return}
      return;
    }

    if(action==='rename-selected'){
      if(ids.length!==1){G.toast('Select one item to rename.');return}
      const item=await G.services.media.get(ids[0]);
      if(!item){G.toast('Selected item not found.','error');return}
      G.dialog({
        title:'Rename media',
        body:`<input class="modal-input" id="selection-media-rename" value="${G.escape(item.name)}" placeholder="File name">`,
        confirm:'Save',
        onConfirm:async()=>{
          const name=document.getElementById('selection-media-rename')?.value.trim();
          if(name&&G.validateName(name)){await G.services.files.rename(ids[0],name);G.Selection.clear();G.toast('Media renamed.');G.renderScreen();}
        }
      });
      return;
    }
    if(action==='archive-selected'){
      await G.services.archive.archiveMedia(ids);G.Selection.clear();G.toast('Archived selected media.');G.renderScreen();return;
    }
    if(action==='album-selected'){G.openAlbumDestinationPicker(ids,{mode:'add'});return}
    if(action==='move-selected'){G.openAlbumDestinationPicker(ids,{mode:'move'});return}
    if(action==='copy-selected'){G.openAlbumDestinationPicker(ids,{mode:'choose'});return}
    if(action==='clear-selection'){G.Selection.clear();return}
    if(action==='favorite-selected'){
      const current=await Promise.all(ids.map(id=>G.services.media.get(id)));
      await G.services.favorites.toggle(ids,!current.every(x=>x?.favorite));
      G.Selection.clear();G.toast('Favorites updated.');G.renderScreen();return;
    }
    if(action==='restore-selected'){
      await G.services.trash.restore(ids);G.Selection.clear();G.toast('Restored selected items.');G.renderScreen();return;
    }
    if(action==='delete-permanent-selected'){
      G.dialog({title:'Delete permanently?',body:'This cannot be undone.',confirm:'Delete permanently',onConfirm:async()=>{await G.services.trash.permanentDelete(ids);G.Selection.clear();G.toast('Deleted permanently.');G.renderScreen()}});return;
    }
    if(action==='trash-selected'){
      G.dialog({title:'Move to Trash?',body:`${ids.length} item(s) will be kept in Trash for 30 days.`,confirm:'Move to Trash',onConfirm:async()=>{await G.services.files.trash(ids);G.Selection.clear();G.toast('Moved to Trash.');G.renderScreen()}});return;
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
