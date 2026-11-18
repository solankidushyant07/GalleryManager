(function (G) {
  const KEY='gallerymanager.settings.v1';
  const defaults={gridColumns:3,sort:'newest',theme:'dark',confirmDelete:true,trashRetention:30,autoScan:false,biometricUnlock:true};
  G.SettingsRepository={
    get(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}},
    set(k,v){const s=this.get();s[k]=v;localStorage.setItem(KEY,JSON.stringify(s));return s;},
    reset(){localStorage.setItem(KEY,JSON.stringify(defaults));return {...defaults}}
  };
})(window.GalleryManager = window.GalleryManager || {});
