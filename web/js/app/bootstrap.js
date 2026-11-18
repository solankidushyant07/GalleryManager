(function (G) {
  G.importedItems = [];
  G.services = {}; G.runtimeMode = new URLSearchParams(location.search).get('runtime') || window.GALLERY_RUNTIME || 'sample';
  G.toast = function(message, type='info'){
    G.appState.toast={message,type}; G.appState.emit();
    clearTimeout(G.toast.timer); G.toast.timer=setTimeout(()=>{G.appState.toast=null;G.appState.emit()},3200);
  };
  G.escape = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  G.formatBytes = n => {if(n<1024)return `${n} B`; if(n<1048576)return `${(n/1024).toFixed(0)} KB`; if(n<1073741824)return `${(n/1048576).toFixed(1)} MB`; return `${(n/1073741824).toFixed(1)} GB`};
  G.formatDate = d=>new Date(d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  G.icon = (name)=>({
    home:'⌂',albums:'▦',browse:'▤',search:'⌕',heart:'♡',trash:'♲',lock:'●',settings:'⚙',
    back:'‹',more:'⋮',play:'▶',info:'ⓘ',edit:'✎',share:'↗',add:'＋',refresh:'↻',close:'×',
    check:'✓',folder:'▰',video:'▶',undo:'↶',redo:'↷',grid:'▦',sort:'⇅',filter:'☷'
  }[name]||'•');
  G.homeIcon = (name)=>({
    home:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    albums:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect height="14" rx="2" stroke-linejoin="round" width="14" x="3" y="3"/><path d="M7 21h12a2 2 0 002-2V7" stroke-linecap="round"/><path d="M6 13l3-3 4 4 2-2 2 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    browse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }[name]||'');
  /*
   * All transient UI belongs to the in-app Android viewport. Keeping this
   * root inside #app prevents dialogs, sheets and menus from escaping onto
   * the browser/desktop page around the simulated device screen.
   */
  G.overlayRoot = function(){
    return document.getElementById('app') || document.body;
  };
  G.renderShell = function(){
    const root=document.getElementById('app');
    const route=G.appState.route||{name:'home',params:{}};
    const r=route.name;
    const primary=route.params && route.params._nav ? route.params._nav : '';
    const active=['home','albums','browse'].includes(primary)
      ? primary
      : (['home','albums','browse'].includes(r)?r:'');
    const isHome=r==='home'; const isAlbums=r==='albums'; const isBrowse=r==='browse';
    const selectableRoutes=new Set(['all-media','allmedia','albums','other-albums','album','folder','browse','search','favorites','trash','private','recent','archive','pinned-folders']);
    const selectionActive=!!G.appState.selectionMode && selectableRoutes.has(r);
    if(G.appState.selectionMode && !selectionActive){
      G.appState.selected=new Set();
      G.appState.selectionMode=false;
    }
    root.innerHTML=`
      <div class="app-shell ${isHome?'home-shell':(isAlbums?'albums-shell':'')} ${selectionActive?'selection-state-active':''}">

        <main id="screen" class="screen"></main>
        ${selectionActive?'':`<nav class="bottom-nav">
          ${[['home','Home','home'],['albums','Albums','albums'],['browse','Browse','browse']].map(([r,l,i])=>`<button class="nav-item ${active===r?'active':''}" data-nav="${r}"><span class="nav-icon ${active===r?'nav-icon-active':''}">${G.homeIcon(i)}</span><small>${l}</small><span class="nav-active-dot ${active===r?'visible':''}"></span></button>`).join('')}
        </nav>`}
        <div id="toast-root"></div>
      </div>`;
    document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>G.router.go(b.dataset.nav));
    G.renderScreen();
  };
  G.renderToast=()=>{const el=document.getElementById('toast-root');if(!el)return;const t=G.appState.toast;el.innerHTML=t?`<div class="toast ${t.type}">${G.escape(t.message)}</div>`:''};
  G.renderScreen=function(){
    const s=document.getElementById('screen'); if(!s)return;
    const n=G.appState.route.name,p=G.appState.route.params||{};
    const screens={home:G.HomeScreen,albums:G.AlbumsScreen,album:G.AlbumDetailScreen,browse:G.BrowseScreen,folder:G.FolderDetailScreen,viewer:G.ViewerScreen,search:G.SearchScreen,recent:G.RecentScreen,favorites:G.FavoritesScreen,trash:G.TrashScreen,archive:G.ArchiveScreen,'pinned-folders':G.PinnedFoldersScreen,'other-albums':G.AlbumsScreen,private:G.PrivateVaultScreen,'all-media':G.AllMediaScreen,allmedia:G.AllMediaScreen,editor:G.EditorScreen,composition:G.CompositionScreen,import:G.ImportScreen,fileinfo:G.FileInfoScreen,settings:G.SettingsScreen};
    (screens[n]||G.HomeScreen).render(s,p);
    G.renderToast();
  };
  G.appState.on(()=>{if(G.appState.ready)G.renderShell();});
  document.addEventListener('DOMContentLoaded',()=>{
    const rt=G.createRuntime(G.runtimeMode);
    G.services.media=new G.MediaService(rt.media);
    G.services.albums=new G.AlbumService(rt.albums);
    G.services.favorites=new G.FavoriteService(rt.favorites);
    G.services.search=new G.SearchService(rt.media,rt.albums);
    G.services.files=new G.FileOperationService(rt.files);
    G.services.trash=new G.TrashService(rt.trash);
    G.services.archive=new G.ArchiveService(rt.archive);
    G.services.import=new G.ImportService(rt.import);
    G.services.composition=new G.CompositionService(rt.composition);
    G.services.settings=new G.SettingsService(rt.settings);
    G.services.privateVault=rt.privateVault;
    G.services.wallpaper=new G.WallpaperService(rt.wallpaper);
    G.runtime=rt;
    G.router.start();
  });
})(window.GalleryManager = window.GalleryManager || {});
