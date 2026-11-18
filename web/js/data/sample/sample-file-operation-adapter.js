(function(G){
  G.SampleFileOperationAdapter={
    async move(ids,destination){const f=window.GalleryManagerSample.folders.find(x=>x.name===destination);G.sampleState.update(s=>ids.forEach(id=>{s.folderNames[id]=destination;if(f)s.folderIds=s.folderIds||{},s.folderIds[id]=f.id;}));return {ok:true}},
    async copy(ids,destination){return G.SampleMediaRepository.copyToFolder(ids,destination)},
    async rename(id,name){return G.SampleMediaRepository.rename(id,name)},
    async renameFolder(id,name){
      const folder=window.GalleryManagerSample.folders.find(x=>String(x.id)===String(id));
      if(!folder)return {ok:false};
      const old=folder.name;
      folder.name=name;
      G.sampleState.update(s=>{s.folderNamesById=s.folderNamesById||{};s.folderNamesById[id]=name;});
      return {ok:true,old,name};
    },
    async trash(ids){return G.SampleMediaRepository.trash(ids)},
    async restore(ids){return G.SampleMediaRepository.restore(ids)}
  };
})(window.GalleryManager=window.GalleryManager||{});