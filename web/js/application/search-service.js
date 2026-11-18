(function(G){
  G.SearchService=class{
    constructor(media,albums){this.media=media;this.albums=albums}
    async search(q){
      const media=await this.media.search(q);
      const albums=await this.albums.list();
      const s=String(q||'').toLowerCase();
      return {media,albums:albums.filter(a=>a.name.toLowerCase().includes(s))};
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
