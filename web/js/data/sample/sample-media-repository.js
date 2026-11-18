(function (G) {
  function repo() {
    const seed=window.GalleryManagerSample;
    function all() {
      const state=G.sampleState.get();
      const albums=G.sampleState.ensureAlbums(seed.albums);
      const base=seed.items.concat(state.copies||[]);
      return base.map(x=>G.MediaModel.create({
        ...x,
        name: state.renamed[x.id] || x.name,
        folder: state.folderNames[x.id] || state.folderNamesById?.[x.folderId] || x.folder,
        folderId: state.folderIds?.[x.id] || x.folderId,
        favorite: state.favoriteIds.includes(x.id) || x.favorite,
        albumIds: albums.filter(a => (state.albumMembers[a.id] || x.albumIds.includes(a.id) ? (state.albumMembers[a.id] || []).includes(x.id) || (state.albumMembers[a.id] === undefined && x.albumIds.includes(a.id)) : false)).map(a=>a.id),
        trashed: !!state.trashed[x.id],
        archived: state.archivedIds.includes(x.id) || false
      }));
    }
    function deleteArchived(state,id){state.archivedIds=(state.archivedIds||[]).filter(x=>x!==id)}
    return {
      async list(opts={}) { let out=all(); if(opts.includeTrash!==true) out=out.filter(x=>!x.trashed); if(opts.includeArchived!==true) out=out.filter(x=>!x.archived); if(opts.folderId)out=out.filter(x=>x.folderId===opts.folderId); if(opts.albumId)out=out.filter(x=>x.albumIds.includes(opts.albumId)); if(opts.favorites)out=out.filter(x=>x.favorite); return out; },
      async get(id){return all().find(x=>x.id===String(id))||null;},
      async search(q){const s=String(q||'').trim().toLowerCase(); const base=await this.list(); if(!s)return base; return base.filter(x=>[x.name,x.folder,x.mime,x.date,x.type].join(' ').toLowerCase().includes(s));},
      async refresh(){return this.list();},
      async setFavorite(ids,value){G.sampleState.update(s=>{s.favoriteIds=s.favoriteIds.filter(id=>!ids.includes(id)); if(value) s.favoriteIds.push(...ids);}); return this.list({includeTrash:true});},
      async rename(id,name){G.sampleState.update(s=>{s.renamed[id]=name}); return this.get(id);},
      async archive(ids){G.sampleState.update(s=>ids.forEach(id=>{if(!s.archivedIds.includes(id))s.archivedIds.push(id)}));},
      async copyToFolder(ids,destination){
        const originals=ids.map(id=>all().find(x=>x.id===String(id))).filter(Boolean);
        const folder=seed.folders.find(x=>x.name===destination);
        G.sampleState.update(s=>{
          s.copies=s.copies||[];
          originals.forEach((x,idx)=>{
            const copyId=`${x.id}-copy-${Date.now()}-${idx}`;
            s.copies.push({...x,id:copyId,name:`Copy of ${x.name}`,folder:destination,folderId:folder?.id||x.folderId,date:new Date().toISOString(),albumIds:[]});
          });
        });
        return {ok:true,copied:originals.length,destination};
      },
      async restoreArchived(ids){G.sampleState.update(s=>{s.archivedIds=s.archivedIds.filter(id=>!ids.includes(id))});},
      async listArchived(){return all().filter(x=>x.archived&&!x.trashed)},
      async trash(ids){G.sampleState.update(s=>ids.forEach(id=>{deleteArchived(s,id);s.trashed[id]=Date.now()}));},
      async restore(ids){G.sampleState.update(s=>ids.forEach(id=>delete s.trashed[id]));},
      async permanentDelete(ids){G.sampleState.update(s=>ids.forEach(id=>{delete s.trashed[id];deleteArchived(s,id);delete s.renamed[id];s.copies=(s.copies||[]).filter(c=>c.id!==id);s.favoriteIds=s.favoriteIds.filter(x=>x!==id); Object.keys(s.albumMembers).forEach(a=>s.albumMembers[a]=(s.albumMembers[a]||[]).filter(x=>x!==id));}));},
      async allForSearch(){return all();}
    };
  }
  G.SampleMediaRepository=repo();
})(window.GalleryManager = window.GalleryManager || {});
