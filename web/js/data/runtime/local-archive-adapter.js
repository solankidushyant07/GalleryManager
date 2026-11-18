(function(G){
  const KEY='gallerymanager.archive.v1';
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {mediaIds:Array.isArray(x.mediaIds)?x.mediaIds:[],albumIds:Array.isArray(x.albumIds)?x.albumIds:[]}}catch{return {mediaIds:[],albumIds:[]}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
  G.LocalArchiveAdapter={
    archivedIds(){return load().mediaIds.map(String)},
    archivedAlbumIds(){return load().albumIds.map(String)},
    async listMedia(baseList){
      const s=load(); const all=await baseList(); return all.filter(x=>s.mediaIds.includes(String(x.id))&&!x.trashed);
    },
    async archiveMedia(baseList,ids){const s=load();ids.map(String).forEach(id=>{if(!s.mediaIds.includes(id))s.mediaIds.push(id)});save(s)},
    async restoreMedia(ids){const s=load(),remove=new Set(ids.map(String));s.mediaIds=s.mediaIds.filter(id=>!remove.has(id));save(s)},
    async listAlbums(baseList){
      const s=load(),all=await baseList();return all.filter(x=>s.albumIds.includes(String(x.id)));
    },
    async archiveAlbum(id){const s=load(),v=String(id);if(!s.albumIds.includes(v))s.albumIds.push(v);save(s)},
    async restoreAlbum(id){const s=load(),v=String(id);s.albumIds=s.albumIds.filter(x=>x!==v);save(s)}
  };
})(window.GalleryManager=window.GalleryManager||{});
