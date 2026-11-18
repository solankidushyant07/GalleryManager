(function (G) {
  const KEY='gallerymanager.sample.private.v1';
  let s; try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch{s=null}
  s=s||{configured:false,pin:'',pattern:'',unlocked:false,items:[]};
  const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
  G.SamplePrivateVaultAdapter={
    async state(){return {configured:s.configured,unlocked:s.unlocked};},
    async setup(pin,pattern){s={...s,configured:true,pin,pattern,unlocked:true};save();return true;},
    async unlockPin(pin){s.unlocked=s.configured && s.pin===pin;save();return s.unlocked;},
    async unlockPattern(pattern){s.unlocked=s.configured && s.pattern===pattern;save();return s.unlocked;},
    async unlockDevice(){s.unlocked=s.configured;save();return s.unlocked},
    async lock(){s.unlocked=false;save();},
    async list(){if(!s.unlocked)throw Object.assign(new Error('Private is locked.'),{code:'permission-denied'});return s.items;},
    async import(items){if(!s.unlocked)throw Object.assign(new Error('Private is locked.'),{code:'permission-denied'});s.items.push(...items);save();return s.items;}
  };
})(window.GalleryManager = window.GalleryManager || {});
