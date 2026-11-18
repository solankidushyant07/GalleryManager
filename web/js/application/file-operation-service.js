(function(G){G.FileOperationService=class{
 constructor(a){this.a=a;this.history=[]}
 async rename(id,name){const old=await G.services.media.get(id);const r=await this.a.rename(id,name);this.history.push({type:'rename',id,old:old?.name,newName:name});return r}
 async renameFolder(id,name){return this.a.renameFolder?.(id,name)}
 async move(ids,destination){const r=await this.a.move(ids,destination);this.history.push({type:'move',ids:[...ids],destination});return r}
 async copy(ids,destination){return this.a.copy(ids,destination)}
 async trash(ids){const r=await this.a.trash(ids);this.history.push({type:'trash',ids:[...ids]});return r}
 async undo(){const x=this.history.pop();if(!x)return false;if(x.type==='trash')await this.a.restore(x.ids);else if(x.type==='rename')await this.a.rename(x.id,x.old);return true}
};})(window.GalleryManager=window.GalleryManager||{});
