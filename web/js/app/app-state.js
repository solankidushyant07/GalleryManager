(function (G) {
  const defaults = {
    route: { name: 'home', params: {} },
    permission: 'granted',
    ready: false,
    theme: 'dark',
    gridColumns: 3,
    allMediaShowSubtitle: false,
    sort: 'newest',
    search: '',
    selected: new Set(),
    selectionMode: false,
    selectionKind: 'media',
    viewer: null,
    albumView: 'grid',
    archiveSort: 'newest',
    pinnedIds: new Set(),
    pinnedFolderIds: new Set(),
    moreAlbumIds: new Set(),
    folderCoverIds: new Map(),
    toast: null
  };
  let persistedPinned=[];
  try{persistedPinned=JSON.parse(localStorage.getItem('gallerymanager.pinned.v1')||'[]')}catch{}
  let persistedPinnedFolders=[], persistedMoreAlbums=[], persistedFolderCovers={};
  try{persistedPinnedFolders=JSON.parse(localStorage.getItem('gallerymanager.pinnedFolders.v1')||'[]')}catch{}
  try{persistedMoreAlbums=JSON.parse(localStorage.getItem('gallerymanager.moreAlbums.v1')||'[]')}catch{}
  try{persistedFolderCovers=JSON.parse(localStorage.getItem('gallerymanager.folderCovers.v1')||'{}')}catch{}
  G.appState = {
    ...defaults,
    selected: new Set(),
    selectionMode: false,
    selectionKind: 'media',
    pinnedIds: new Set(persistedPinned.map(String)),
    pinnedFolderIds: new Set(persistedPinnedFolders.map(String)),
    moreAlbumIds: new Set(persistedMoreAlbums.map(String)),
    folderCoverIds: new Map(Object.entries(persistedFolderCovers).map(([k,v])=>[String(k),String(v)])),
    listeners: new Set(),
    patch(p) { Object.assign(this, p); if(p.pinnedIds) localStorage.setItem('gallerymanager.pinned.v1',JSON.stringify([...this.pinnedIds])); if(p.pinnedFolderIds) localStorage.setItem('gallerymanager.pinnedFolders.v1',JSON.stringify([...this.pinnedFolderIds])); if(p.moreAlbumIds) localStorage.setItem('gallerymanager.moreAlbums.v1',JSON.stringify([...this.moreAlbumIds])); if(p.folderCoverIds) localStorage.setItem('gallerymanager.folderCovers.v1',JSON.stringify(Object.fromEntries(this.folderCoverIds))); this.emit(); },
    on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
    emit() { localStorage.setItem('gallerymanager.pinned.v1',JSON.stringify([...this.pinnedIds])); localStorage.setItem('gallerymanager.pinnedFolders.v1',JSON.stringify([...this.pinnedFolderIds])); localStorage.setItem('gallerymanager.moreAlbums.v1',JSON.stringify([...this.moreAlbumIds])); localStorage.setItem('gallerymanager.folderCovers.v1',JSON.stringify(Object.fromEntries(this.folderCoverIds))); this.listeners.forEach(fn => fn(this)); }
  };
})(window.GalleryManager = window.GalleryManager || {});
