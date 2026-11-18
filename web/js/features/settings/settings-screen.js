(function(G){
  G.SettingsScreen={render(el){
    const s=G.services.settings.get();
    el.innerHTML=`<div class="page narrow"><button class="back-btn" id="back">‹ Back</button><span class="eyebrow">PREFERENCES</span><h1>Settings</h1>
    <div class="settings-group"><h3>Appearance</h3>
      <label class="setting-row"><span>Theme<small>Gallery Manager uses a focused dark surface.</small></span><select id="theme"><option value="dark">Dark</option></select></label>
      <label class="setting-row"><span>Grid density<small>Choose 2–5 columns.</small></span><select id="grid">${[2,3,4,5].map(n=>`<option value="${n}" ${s.gridColumns===n?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="setting-row"><span>Default sorting</span><select id="sort">${G.Sorting.OPTIONS.map(o=>`<option value="${o.value}" ${G.Sorting.normalize(s.sort)===o.value?'selected':''}>${o.label}</option>`).join('')}</select></label>
    </div>
    <div class="settings-group"><h3>Behavior</h3>
      <label class="setting-row"><span>Confirm delete<small>Ask before moving media to Trash.</small></span><input type="checkbox" id="confirm" ${s.confirmDelete?'checked':''}></label>
      <label class="setting-row"><span>Trash retention</span><select id="retention">${[7,30,60].map(n=>`<option value="${n}" ${s.trashRetention===n?'selected':''}>${n} days</option>`).join('')}</select></label>
      <label class="setting-row"><span>Auto scan on launch<small>Android controls the real scan policy.</small></span><input type="checkbox" id="scan" ${s.autoScan?'checked':''}></label>
    </div>
    <div class="settings-group"><h3>Development</h3><button class="secondary full" id="reset">Reset sample state</button><p class="hint">Browser development runs the sample runtime. Production Private security and native storage remain Android-owned.</p></div></div>`;
    el.querySelector('#back').onclick=()=>G.router.back();
    const save=(k,v)=>{G.services.settings.set(k,v);G.toast('Setting saved.')};
    el.querySelector('#theme').onchange=e=>save('theme',e.target.value);el.querySelector('#grid').onchange=e=>save('gridColumns',Number(e.target.value));el.querySelector('#sort').onchange=e=>save('sort',e.target.value);el.querySelector('#confirm').onchange=e=>save('confirmDelete',e.target.checked);el.querySelector('#retention').onchange=e=>save('trashRetention',Number(e.target.value));el.querySelector('#scan').onchange=e=>save('autoScan',e.target.checked);
    el.querySelector('#reset').onclick=()=>G.dialog({title:'Reset sample data?',body:'Favorites, album membership, renames and Trash state will be reset.',confirm:'Reset',onConfirm:()=>{G.sampleState.reset();localStorage.removeItem('gallerymanager.sample.private.v1');localStorage.removeItem('gallerymanager.pinned.v1');localStorage.removeItem('gallerymanager.pinnedFolders.v1');localStorage.removeItem('gallerymanager.pinnedFolders.initialized.v1');localStorage.removeItem('gallerymanager.folderCovers.v1');G.appState.pinnedIds=new Set();G.appState.pinnedFolderIds=new Set();G.appState.folderCoverIds=new Map();G.toast('Sample state reset.');G.router.go('home')}})
  }};
})(window.GalleryManager=window.GalleryManager||{});
