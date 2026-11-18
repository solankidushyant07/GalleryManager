(function (G) {
  G.createRuntime = function(mode) {
    if(mode==='android') {
      const a=G.AndroidRuntimeAdapter;
      const mediaRepo={
        async list(opts={}){const all=await a.list(opts);if(opts.includeArchived===true)return all;const archived=new Set(G.LocalArchiveAdapter.archivedIds());return all.filter(x=>!archived.has(String(x.id)));},
        async get(id){return a.get(id)},
        async search(q){const all=await a.search(q);const archived=new Set(G.LocalArchiveAdapter.archivedIds());return all.filter(x=>!archived.has(String(x.id)));},
        refresh:()=>mediaRepo.list(),
        setFavorite:a.setFavorite
      };
      const albumRepo={
        async list(opts={}){const all=await a.listAlbums();if(opts.includeArchived===true)return all;return all.filter(x=>!G.LocalArchiveAdapter.archivedAlbumIds().includes(String(x.id)));},
        async get(id,opts={}){const all=await this.list(opts);return all.find(x=>String(x.id)===String(id))||null},
        create:a.createAlbum,rename:a.renameAlbum,delete:a.deleteAlbum,addMembers:a.addMembers,removeMembers:a.removeMembers,togglePin:a.toggleAlbumPin,setCover:a.setAlbumCover
      };
      return {
        media:mediaRepo,
        albums:albumRepo,
        favorites:{list:async()=> (await mediaRepo.list()).filter(x=>x.favorite),setFavorite:a.setFavorite},
        trash:{list:async()=> (await a.list()).filter(x=>x.trashed),trash:a.trash,restore:a.restore,permanentDelete:a.permanentDelete,empty:a.emptyTrash},
        files:{move:a.move,copy:a.copy,rename:a.rename,trash:a.trash,restore:a.restore},
        archive:{
          listMedia:()=>G.LocalArchiveAdapter.listMedia(a.list),
          archiveMedia:ids=>G.LocalArchiveAdapter.archiveMedia(a.list,ids),
          restoreMedia:ids=>G.LocalArchiveAdapter.restoreMedia(ids),
          listAlbums:()=>G.LocalArchiveAdapter.listAlbums(a.listAlbums),
          archiveAlbum:id=>G.LocalArchiveAdapter.archiveAlbum(id),
          restoreAlbum:id=>G.LocalArchiveAdapter.restoreAlbum(id)
        },
        settings:{get:async()=>G.SettingsRepository.get(),set:async(k,v)=>G.SettingsRepository.set(k,v)},
        privateVault:{state:async()=>({configured:false,unlocked:false}),list:a.privateList,unlockPin:p=>a.privateUnlock({pin:p}),unlockPattern:p=>a.privateUnlock({pattern:p}),unlockDevice:a.privateUnlockDevice,lock:a.privateLock,setup:a.privateSetup},
        import:{import:a.importFiles}, composition:{list:async()=>[],save:a.saveComposition}, wallpaper:{set:a.setWallpaper,get:async()=>null}
      };
    }
    return {
      media:G.SampleMediaRepository, albums:G.SampleAlbumRepository, files:G.SampleFileOperationAdapter,
      archive:{listMedia:G.SampleMediaRepository.listArchived.bind(G.SampleMediaRepository),archiveMedia:G.SampleMediaRepository.archive.bind(G.SampleMediaRepository),restoreMedia:G.SampleMediaRepository.restoreArchived.bind(G.SampleMediaRepository),listAlbums:G.SampleAlbumRepository.listArchived.bind(G.SampleAlbumRepository),archiveAlbum:G.SampleAlbumRepository.archive.bind(G.SampleAlbumRepository),restoreAlbum:G.SampleAlbumRepository.restoreArchived.bind(G.SampleAlbumRepository)},
      favorites:G.SampleMediaRepository, trash:G.SampleMediaRepository,
      settings:{get:async()=>G.SettingsRepository.get(),set:async(k,v)=>G.SettingsRepository.set(k,v)},
      privateVault:G.SamplePrivateVaultAdapter, import:G.SampleImportAdapter, composition:G.SampleCompositionAdapter, wallpaper:G.SampleWallpaperAdapter
    };
  };
})(window.GalleryManager = window.GalleryManager || {});
