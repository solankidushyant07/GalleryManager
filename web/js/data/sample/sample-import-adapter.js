(function (G) {
  G.SampleImportAdapter={async import(files){
    const added=[];
    for(const file of files){
      if(!/^image\/|^video\//.test(file.type)) continue;
      const url=URL.createObjectURL(file);
      added.push(G.MediaModel.create({id:`import-${Date.now()}-${Math.random()}`,name:file.name,uri:url,type:file.type.startsWith('video/')?'video':'image',mime:file.type,size:file.size,width:0,height:0,date:new Date().toISOString().slice(0,10),folderId:'f3',folder:'Downloads',source:'import'}));
    }
    G.importedItems.push(...added); return added;
  }};
})(window.GalleryManager = window.GalleryManager || {});
