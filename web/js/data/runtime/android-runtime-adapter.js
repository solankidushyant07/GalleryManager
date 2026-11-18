(function (G) {
  function normalizeError(error){ const e=new Error(error?.message||String(error||'Native operation failed')); e.code=error?.code||'operation-failed'; return e; }
  function call(name,args=[]){
    try {
      const bridge=window.GalleryManagerAndroid || window.AndroidGalleryManager;
      if(!bridge || typeof bridge[name] !== 'function') return Promise.reject(Object.assign(new Error('Android runtime bridge is not connected.'),{code:'unsupported'}));
      const result=bridge[name](...args);
      return Promise.resolve(result).catch(e=>Promise.reject(normalizeError(e)));
    } catch(e){ return Promise.reject(normalizeError(e)); }
  }
  G.AndroidRuntimeAdapter = {
    list:()=>call('mediaList'),
    get:id=>call('mediaGet',[id]),
    search:q=>call('mediaSearch',[q]),
    refresh:()=>call('mediaRefresh'),
    setFavorite:(ids,v)=>call('setFavorite',[ids,v]),
    listAlbums:()=>call('albumList'),
    createAlbum:name=>call('albumCreate',[name]),
    renameAlbum:(id,name)=>call('albumRename',[id,name]),
    deleteAlbum:id=>call('albumDelete',[id]),
    addMembers:(id,ids)=>call('albumAddMembers',[id,ids]),
    removeMembers:(id,ids)=>call('albumRemoveMembers',[id,ids]),
    toggleAlbumPin:id=>call('albumTogglePin',[id]),
    setAlbumCover:(id,mediaId)=>call('albumSetCover',[id,mediaId]),
    move:(ids,destination)=>call('fileMove',[ids,destination]),
    copy:(ids,destination)=>call('fileCopy',[ids,destination]),
    rename:(id,name)=>call('fileRename',[id,name]),
    renameFolder:(id,name)=>call('folderRename',[id,name]),
    trash:ids=>call('trash',[ids]),
    restore:ids=>call('restore',[ids]),
    permanentDelete:ids=>call('permanentDelete',[ids]),
    emptyTrash:()=>call('emptyTrash'),
    requestMediaAccess:()=>call('requestMediaAccess'),
    permissionState:()=>call('permissionState'),
    privateList:()=>call('privateList'),
    privateUnlock:payload=>call('privateUnlock',[payload]),
    privateUnlockDevice:()=>call('privateUnlockDevice'),
    privateLock:()=>call('privateLock'),
    privateSetup:payload=>call('privateSetup',[payload]),
    importFiles:files=>call('importFiles',[files]),
    saveEdited:payload=>call('saveEdited',[payload]),
    saveComposition:payload=>call('saveComposition',[payload]),
    setWallpaper:item=>call('setWallpaper',[item])
  };
})(window.GalleryManager = window.GalleryManager || {});
