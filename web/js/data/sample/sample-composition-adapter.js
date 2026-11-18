(function (G) {
  const KEY='gallerymanager.sample.compositions.v1';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  G.SampleCompositionAdapter={
    async list(){return load();},
    async save(project){const a=load();const i=a.findIndex(x=>x.id===project.id);if(i>=0)a[i]=project;else a.push(project);localStorage.setItem(KEY,JSON.stringify(a));return project;}
  };
})(window.GalleryManager = window.GalleryManager || {});
