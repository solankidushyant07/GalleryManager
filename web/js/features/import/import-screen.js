(function(G){
  G.ImportScreen={render(el){
    el.innerHTML=`<div class="page narrow"><button class="back-btn" id="back">‹ Back</button><div class="import-hero"><span>↥</span><h1>Import media</h1><p>Choose images or videos from this device. In the browser sample they are kept in this session; Android packaging will copy shared content into managed public storage.</p></div><label class="dropzone"><input id="files" type="file" accept="image/*,video/*" multiple><span>Choose photos & videos</span><small>JPG, PNG, WEBP, GIF, MP4 and other supported media</small></label><div id="import-status"></div></div>`;
    el.querySelector('#back').onclick=()=>G.router.back();
    el.querySelector('#files').onchange=async e=>{const files=[...e.target.files];if(!files.length)return;el.querySelector('#import-status').innerHTML=G.LoadingState('Importing…');const out=await G.services.import.import(files);G.toast(`${out.length} item(s) imported.`);G.router.go('browse')};
  }};
})(window.GalleryManager=window.GalleryManager||{});
