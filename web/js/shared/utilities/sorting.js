(function(G){
  const OPTIONS=[
    {value:'newest',label:'Newest'},
    {value:'oldest',label:'Oldest'},
    {value:'name-asc',label:'Name (A to Z)'},
    {value:'name-desc',label:'Name (Z to A)'},
    {value:'size-desc',label:'Size (highest)'},
    {value:'size-asc',label:'Size (lowest)'}
  ];
  const LEGACY={name:'name-asc','name-asc':'name-asc','name-desc':'name-desc',size:'size-desc'};
  const normalize=mode=>LEGACY[mode]||OPTIONS.some(x=>x.value===mode)?(LEGACY[mode]||mode):'newest';
  const label=mode=>OPTIONS.find(x=>x.value===normalize(mode))?.label||'Newest';
  const isDateSort=mode=>['newest','oldest'].includes(normalize(mode));

  function compare(a,b,mode,metrics){
    const m=normalize(mode);
    const ma=metrics?.(a,m)||a, mb=metrics?.(b,m)||b;
    let result=0;
    if(m==='name-asc'||m==='name-desc'){
      result=String(ma.name??'').localeCompare(String(mb.name??''),undefined,{numeric:true,sensitivity:'base'});
      if(m==='name-desc')result=-result;
    }else if(m==='size-desc'||m==='size-asc'){
      result=(Number(mb.size)||0)-(Number(ma.size)||0);
      if(m==='size-asc')result=-result;
    }else{
      const da=Date.parse((m==='oldest'?(ma.oldestDate||ma.date):ma.date)||'')||0;
      const db=Date.parse((m==='oldest'?(mb.oldestDate||mb.date):mb.date)||'')||0;
      result=db-da;
      if(m==='oldest')result=-result;
    }
    if(result===0 && m!=='name-asc' && m!=='name-desc'){
      result=String(ma.name??'').localeCompare(String(mb.name??''),undefined,{numeric:true,sensitivity:'base'});
    }
    return result;
  }

  function sort(items,mode,metrics){
    return [...items].map((item,index)=>({item,index})).sort((a,b)=>{
      const result=compare(a.item,b.item,mode,metrics);
      return result||a.index-b.index;
    }).map(x=>x.item);
  }

  function metricsForMedia(items){
    const xs=items||[];
    const dates=xs.map(x=>Date.parse(x.date||'')||0).filter(Boolean);
    return {
      name: xs[0]?.name||'',
      size: xs.reduce((n,x)=>n+(Number(x.size)||0),0),
      date: dates.length ? new Date(Math.max(...dates)).toISOString() : '',
      oldestDate: dates.length ? new Date(Math.min(...dates)).toISOString() : ''
    };
  }

  G.Sorting={OPTIONS,normalize,label,isDateSort,compare,sort,metricsForMedia};
})(window.GalleryManager=window.GalleryManager||{});
