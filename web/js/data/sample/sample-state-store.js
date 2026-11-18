(function (G) {
  const KEY='gallerymanager.sample.state.v2';
  const defaults={favoriteIds:[],albumMembers:{},trashed:{},archivedIds:[],archivedAlbums:[],copies:[],wallpaperId:null,folderNamesById:{},renamed:{},folderNames:{},folderIds:{},albums:null};
  function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
  let state=load();
  if(window.GalleryManagerSample?.folders){
    for(const f of window.GalleryManagerSample.folders){
      const n=state.folderNamesById?.[f.id]; if(n) f.name=n;
    }
  }
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  G.sampleState={
    get(){return state},
    update(fn){fn(state);save();return state},
    ensureAlbums(seed){if(!state.albums){state.albums=seed.map(a=>({...a}));save()}return state.albums},
    reset(){state=JSON.parse(JSON.stringify(defaults));save();return state}
  };
})(window.GalleryManager=window.GalleryManager||{});
