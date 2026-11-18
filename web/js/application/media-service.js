(function(G){G.MediaService=class{
 constructor(repo){this.repo=repo}
 async list(o={}){return this.listWithImports(o)}
 async listWithImports(o={}){const base=await this.repo.list(o);const imported=G.importedItems.filter(x=>o.includeTrash===true||!x.trashed).filter(x=>!o.folderId||x.folderId===o.folderId).filter(x=>!o.albumId||x.albumIds.includes(o.albumId)).filter(x=>!o.favorites||x.favorite);return [...base,...imported]}
 async get(id){return (await this.repo.get(id))||G.importedItems.find(x=>x.id===String(id))||null}
};})(window.GalleryManager=window.GalleryManager||{});
