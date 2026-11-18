(function(G){
  /*
   * One cover policy for every album/folder surface.
   * A user-chosen cover always wins when it is still a valid member.
   * Otherwise every surface falls back to the newest live media item.
   */
  const live=(media)=> (media||[]).filter(m=>!m?.trashed);
  const newest=(items)=> [...items].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0))[0]||null;
  const mediaForFolder=(media,id)=>live(media).filter(m=>String(m.folderId)===String(id));
  const mediaForAlbum=(media,id)=>live(media).filter(m=>Array.isArray(m.albumIds)&&m.albumIds.some(x=>String(x)===String(id)));

  G.CoverPolicy={
    folder(folderId,media){
      const items=mediaForFolder(media,folderId);
      const chosen=G.appState.folderCoverIds?.get(String(folderId));
      if(chosen){
        const custom=items.find(m=>String(m.id)===String(chosen));
        if(custom)return custom;
      }
      return newest(items);
    },
    album(album,media){
      const items=mediaForAlbum(media,album?.id);
      const chosen=album?.coverId;
      if(chosen){
        const custom=items.find(m=>String(m.id)===String(chosen));
        if(custom)return custom;
      }
      return newest(items);
    },
    forEntity(entity,media,type){
      return type==='album'?this.album(entity,media):this.folder(entity?.id??entity,media);
    }
  };
})(window.GalleryManager=window.GalleryManager||{});

(function(G){
  G.openCoverPicker=G.openCoverPicker||function({type,id,items,title,coverId}){
    const liveItems=(items||[]).filter(m=>!m?.trashed);
    if(!liveItems.length){G.toast('There are no photos to use as a cover.','error');return null;}
    const current=type==='album'
      ? G.CoverPolicy.album({id,coverId},liveItems)
      : G.CoverPolicy.folder(id,liveItems);
    const dialog=G.dialog({
      title:title||(type==='album'?'Change album cover':'Change folder cover'),
      body:`<div class="cover-choice-grid">${liveItems.slice(0,36).map(x=>`<button type="button" data-cover-id="${G.escape(x.id)}" class="${current&&String(current.id)===String(x.id)?'chosen':''}"><img src="${G.escape(x.uri)}" alt="${G.escape(x.name)}"></button>`).join('')}</div>`,
      confirm:'Done',
      onConfirm:()=>{}
    });
    dialog.querySelectorAll('[data-cover-id]').forEach(b=>b.onclick=async()=>{
      const mid=String(b.dataset.coverId);
      try{
        if(type==='folder'){
          const next=new Map(G.appState.folderCoverIds||[]);
          next.set(String(id),mid);
          G.appState.patch({folderCoverIds:next});
          G.toast('Folder cover updated.');
        }else{
          if(!G.services.albums.setCover)throw Object.assign(new Error('Album cover changes are unavailable in this runtime.'),{code:'unsupported'});
          await G.services.albums.setCover(String(id),mid);
          G.toast('Album cover updated.');
        }
        dialog.remove();
        G.renderScreen();
      }catch(err){
        G.toast(err?.message||'Cover changes are unavailable in this runtime.','error');
      }
    });
    return dialog;
  };
})(window.GalleryManager=window.GalleryManager||{});
