(function(G){
  const seed=window.GalleryManagerSample;
  G.SampleAlbumRepository={
    async list(opts={}){const state=G.sampleState.get();const albums=G.sampleState.ensureAlbums(seed.albums).filter(a=>opts.includeArchived===true || !(state.archivedAlbums||[]).includes(a.id)),media=await G.SampleMediaRepository.list({includeTrash:true,includeArchived:true});return albums.map(a=>G.AlbumModel.create({...a,count:media.filter(m=>m.albumIds.includes(a.id)&&!m.trashed).length}))},
    async get(id,opts={}){return (await this.list(opts)).find(a=>a.id===String(id))||null},
    async create(name){const id=`a-${Date.now()}`;G.sampleState.update(s=>{s.albums=s.albums||seed.albums.map(a=>({...a}));s.albums.push({id,name,coverId:null,kind:'my',pinned:false});s.albumMembers[id]=[]});return this.get(id)},
    async rename(id,name){G.sampleState.update(s=>{const a=(s.albums||[]).find(x=>x.id===String(id));if(a)a.name=name});return this.get(id)},
    async delete(id){G.sampleState.update(s=>{s.albums=(s.albums||[]).filter(x=>x.id!==String(id));delete s.albumMembers[id]})},
    async addMembers(id,ids){G.sampleState.update(s=>{s.albumMembers[id]=[...new Set([...(s.albumMembers[id]||[]),...ids])]})},
    async removeMembers(id,ids){G.sampleState.update(s=>{s.albumMembers[id]=(s.albumMembers[id]||[]).filter(x=>!ids.includes(x))})},
    async togglePin(id){G.sampleState.update(s=>{const a=(s.albums||[]).find(x=>x.id===String(id));if(a)a.pinned=!a.pinned});return this.get(id)},
    async archive(id){G.sampleState.update(s=>{s.archivedAlbums=s.archivedAlbums||[];if(!s.archivedAlbums.includes(String(id)))s.archivedAlbums.push(String(id))})},
    async restoreArchived(id){G.sampleState.update(s=>{s.archivedAlbums=(s.archivedAlbums||[]).filter(x=>x!==String(id))})},
    async listArchived(){const state=G.sampleState.get(),media=await G.SampleMediaRepository.list({includeTrash:true,includeArchived:true});return G.sampleState.ensureAlbums(seed.albums).filter(a=>(state.archivedAlbums||[]).includes(a.id)).map(a=>G.AlbumModel.create({...a,count:media.filter(m=>m.albumIds.includes(a.id)&&!m.trashed).length}))},
    async setCover(id,mediaId){G.sampleState.update(s=>{const a=(s.albums||[]).find(x=>x.id===String(id));if(a)a.coverId=mediaId});return this.get(id)}
  };
})(window.GalleryManager=window.GalleryManager||{});
