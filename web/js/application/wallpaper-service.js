(function(G){
  G.WallpaperService=class{
    constructor(a){this.a=a}
    async set(item){return this.a.setWallpaper(item)}
    async get(){return this.a.getWallpaper?.()}
  };
})(window.GalleryManager=window.GalleryManager||{});
