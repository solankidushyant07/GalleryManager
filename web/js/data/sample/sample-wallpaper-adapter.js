(function(G){
  G.SampleWallpaperAdapter={
    async setWallpaper(item){G.sampleState.update(s=>{s.wallpaperId=String(item.id)});return {ok:true,id:item.id}},
    async getWallpaper(){return G.sampleState.get().wallpaperId||null}
  };
})(window.GalleryManager=window.GalleryManager||{});
