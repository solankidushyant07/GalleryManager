(function(G){
  function mediaTile(item, cls=''){
    return `<button type="button" class="gm-photo-tile ${cls}" data-media-id="${G.escape(item.id)}" aria-label="${G.escape(item.name)}">
      <img src="${G.escape(item.uri)}" alt="${G.escape(item.name)}" loading="lazy">
      ${item.type==='video'?'<span class="gm-photo-video">▶</span>':''}
    </button>`;
  }
  function daysAgo(date){
    const d=new Date(date); const now=new Date();
    const a=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const b=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    return Math.round((a-b)/86400000);
  }
  function wire(el){
    el.querySelectorAll('[data-media-id]').forEach(btn=>{
      btn.onclick=()=>G.router.go('viewer',{id:btn.dataset.mediaId});
    });
  }
  function filterItems(items,filter){
    const now=new Date(); const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    return items.filter(item=>{
      const age=daysAgo(item.date);
      if(filter==='today') return age===0;
      if(filter==='yesterday') return age===1;
      if(filter==='7days') return age>=0 && age<7;
      if(filter==='30days') return age>=0 && age<30;
      return true;
    });
  }
  function filterLabel(filter){
    return ({all:'All time',today:'Today',yesterday:'Yesterday','7days':'Last 7 days','30days':'Last 30 days'})[filter]||'All time';
  }
  G.RecentScreen={
    async render(el,p={}){
      const filter=p.filter||'all';
      const all=await G.services.media.list({});
      const items=filterItems(all,filter).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const groups={today:[],yesterday:[],earlier:[]};
      items.forEach(x=>{const age=daysAgo(x.date); if(age===0)groups.today.push(x); else if(age===1)groups.yesterday.push(x); else groups.earlier.push(x);});
      const section=(title,arr)=>arr.length?`<section class="recent-date-group"><h2>${title}</h2><div class="recent-grid">${arr.map(x=>mediaTile(x)).join('')}</div></section>`:'';
      const content=items.length
        ? `${section('Today',groups.today)}${section('Yesterday',groups.yesterday)}${section('Earlier',groups.earlier)}`
        : `<section class="recent-empty"><div class="recent-empty-icon"><span></span><span></span><span></span></div><h2>No recent photos</h2><p>Photos and videos you've recently added will appear here.</p></section>`;
      el.innerHTML=`<div class="gm-special-page recent-page">
        <header class="gm-special-header">
          <button class="gm-back" type="button" aria-label="Go back">${G.homeIcon('browse').replace('viewBox','viewBox')}</button>
          <div><h1>Recent</h1><p>${items.length.toLocaleString()} ${items.length===1?'item':'items'}</p></div>
        </header>
        <div class="gm-filter-wrap">
          <button type="button" class="gm-filter-pill" id="recent-filter">${filterLabel(filter)} <span>⌄</span></button>
          <div class="gm-filter-menu hidden" id="recent-filter-menu">
            ${[['all','All time'],['today','Today'],['yesterday','Yesterday'],['7days','Last 7 days'],['30days','Last 30 days']].map(([v,l])=>`<button type="button" data-filter="${v}" class="${filter===v?'active':''}">${l}</button>`).join('')}
          </div>
        </div>
        <main class="gm-special-content">${content}</main>
      </div>`;
      const back=el.querySelector('.gm-back');
      back.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      back.onclick=()=>G.router.back();
      const fb=el.querySelector('#recent-filter'), menu=el.querySelector('#recent-filter-menu');
      fb.onclick=()=>menu.classList.toggle('hidden');
      menu.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>G.router.go('recent',{filter:b.dataset.filter}));
      wire(el);
    }
  };
})(window.GalleryManager=window.GalleryManager||{});
