(function(G){
  G.ArchiveService=class{
    constructor(r){this.r=r}
    listMedia(){return this.r.listMedia?this.r.listMedia():this.r.listArchived()}
    archiveMedia(ids){return this.r.archiveMedia?this.r.archiveMedia(ids):this.r.archive(ids)}
    restoreMedia(ids){return this.r.restoreMedia?this.r.restoreMedia(ids):this.r.restoreArchived(ids)}
    listAlbums(){return this.r.listAlbums?this.r.listAlbums():this.r.listArchivedAlbums()}
    archiveAlbum(id){return this.r.archiveAlbum?this.r.archiveAlbum(id):this.r.archive(id)}
    restoreAlbum(id){return this.r.restoreAlbum?this.r.restoreAlbum(id):this.r.restoreArchivedAlbum(id)}
  };
})(window.GalleryManager=window.GalleryManager||{});
