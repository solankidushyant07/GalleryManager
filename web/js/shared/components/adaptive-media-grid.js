(function(G){
  const DENSITIES=[3,4,6,8,16];
  const escape=s=>G.escape(s);
  const dateKey=(d,mode)=>{
    const x=new Date(d);
    if(mode===3) return x.toISOString().slice(0,10);
    if(mode===4) return x.toISOString().slice(0,10);
    if(mode===6){
      const day=x.getDay()||7, monday=new Date(x); monday.setHours(0,0,0,0); monday.setDate(x.getDate()-day+1);
      const end=new Date(monday); end.setDate(monday.getDate()+7);
      return `${monday.getTime()}-${end.getTime()}`;
    }
    if(mode===8) return `${x.getFullYear()}-${x.getMonth()}`;
    return String(x.getFullYear());
  };
  const label=(items,key,mode)=>{
    const x=new Date(items[0].date);
    if(mode===3||mode===4){
      const today=new Date(); today.setHours(0,0,0,0);
      const y=new Date(today); y.setDate(y.getDate()-1);
      const d=new Date(x); d.setHours(0,0,0,0);
      if(d.getTime()===today.getTime()) return 'Today';
      if(d.getTime()===y.getTime()) return 'Yesterday';
      return d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
    }
    if(mode===6){
      const day=x.getDay()||7, start=new Date(x); start.setHours(0,0,0,0); start.setDate(x.getDate()-day+1);
      const end=new Date(start); end.setDate(start.getDate()+7);
      const fmt=d=>d.toLocaleDateString(undefined,{day:'numeric',month:'short'});
      return `${fmt(start)} – ${fmt(end)} ${start.getFullYear()}`;
    }
    if(mode===8) return x.toLocaleDateString(undefined,{month:'long',year:'numeric'});
    return String(x.getFullYear());
  };
  const countLabel=(items,mode)=>{
    const photos=items.filter(x=>x.type!=='video').length, videos=items.filter(x=>x.type==='video').length;
    if(mode===3) return `${photos} photos${videos?' and '+videos+' videos':''}`;
    return `${items.length} items`;
  };
  const groupItems=(items,mode,sortMode)=>{
    const ordered=G.Sorting?.sort(items,sortMode)||[...items];
    if(G.Sorting && !G.Sorting.isDateSort(sortMode)){
      return [['all-media',ordered]];
    }
    const map=new Map();
    for(const item of ordered){
      const k=dateKey(item.date,mode);
      if(!map.has(k))map.set(k,[]);
      map.get(k).push(item);
    }
    const newest=G.Sorting?.normalize(sortMode)!=='oldest';
    return [...map.entries()].sort((a,b)=>{
      const da=Date.parse(a[1][0].date||'')||0, db=Date.parse(b[1][0].date||'')||0;
      return newest?db-da:da-db;
    });
  };
  const tile=(x,selected,selectionActive=false)=>{
    const src=x.uri||'';
    return `<article class="adaptive-media-tile media-thumb ${selected.has(x.id)?'selected':''}" data-media-id="${escape(x.id)}" data-src="${escape(src)}">
      <img alt="${escape(x.name||'Media')}" data-lazy-media loading="lazy">
      ${x.type==='video'?'<span class="adaptive-video-badge">'+G.icon('play')+'</span>':''}
      ${selectionActive?`<span class="adaptive-select-badge ${selected.has(x.id)?'is-selected':'is-unselected'}">${selected.has(x.id)?'✓':''}</span>`:''}
    </article>`;
  };

  G.AdaptiveMediaTimeline=function(items,opts={}){
    const mode=Number(opts.columns||G.appState.gridColumns||3);
    const selected=opts.selected||G.appState.selected;
    const subtitle=!!opts.subtitle;
    const sortMode=G.Sorting?.normalize(opts.sort||G.appState.sort||'newest')||'newest';
    const groups=groupItems(items,mode,sortMode);
    const selectionActive=G.Selection?.active?.() && G.Selection.kind?.()==='media';
    if(!items.length)return '<div class="album-universal-empty"><h3>Nothing here yet</h3><p>Your media will appear here.</p></div>';
    return `<div class="adaptive-timeline adaptive-cols-${mode}" data-adaptive-timeline data-columns="${mode}">
      ${groups.map(([k,group])=>`<section class="adaptive-group" data-group="${escape(k)}">
        <header class="adaptive-group-header">
          <div class="adaptive-group-title"><h2>${escape(k==='all-media'?'All media':label(group,k,mode))}</h2><span>(${group.length})</span></div>
          ${mode===16?`<span class="adaptive-group-total">${group.length} items</span>`:''}
        </header>
        <div class="adaptive-grid">${group.map(x=>tile(x,selected,selectionActive)).join('')}</div>
      </section>`).join('')}
    </div>`;
  };

  G.wireAdaptiveMedia=function(root,items,{selectable=true,open=true}={}){
    const itemById=new Map(items.map(x=>[String(x.id),x]));
    root.querySelectorAll('.adaptive-media-tile').forEach(tile=>{
      let press=null,longPressed=false,moved=false,startX=0,startY=0;
      const LONG_PRESS_MS=340;
      const MOVE_TOLERANCE=14;
      const clear=()=>{if(press){clearTimeout(press);press=null}};
      const feedback=()=>{
        tile.classList.add('selection-longpressing');
        setTimeout(()=>tile.classList.remove('selection-longpressing'),140);
        try{navigator.vibrate?.(8)}catch{}
      };
      tile.classList.add('selection-touch-target');
      tile.addEventListener('contextmenu',e=>e.preventDefault());
      tile.onpointerdown=e=>{
        if(!selectable || (e.pointerType==='mouse' && e.button!==0))return;
        clear();
        longPressed=false;moved=false;
        startX=e.clientX;startY=e.clientY;
        tile.setPointerCapture?.(e.pointerId);
        press=setTimeout(()=>{
          press=null;
          if(moved)return;
          longPressed=true;
          feedback();
          G.Selection.add(tile.dataset.mediaId,'media');
        },LONG_PRESS_MS);
      };
      tile.onpointermove=e=>{
        if(!press)return;
        if(Math.hypot(e.clientX-startX,e.clientY-startY)>MOVE_TOLERANCE){
          moved=true;clear();
        }
      };
      tile.onpointerup=e=>{
        clear();tile.releasePointerCapture?.(e.pointerId);
      };
      tile.onpointercancel=e=>{
        clear();tile.releasePointerCapture?.(e.pointerId);
      };
      tile.onclick=()=>{
        clear();
        if(longPressed){longPressed=false;return}
        if(moved)return;
        const id=String(tile.dataset.mediaId);
        if(G.Selection.active() && G.Selection.kind()==='media'){
          G.Selection.toggle(id,'media'); return;
        }
        if(open)G.router.go('viewer',{id});
      };
    });


    const load=img=>{
      const tile=img.closest('.adaptive-media-tile'); if(!tile)return;
      const src=tile.dataset.src;
      if(src && img.src!==src) img.src=src;
    };
    const unload=img=>{
      if(img.dataset.loaded==='1'){
        img.removeAttribute('src');
        img.dataset.loaded='0';
      }
    };
    const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){load(e.target);e.target.dataset.loaded='1'}
        else{
          const r=e.boundingClientRect,vh=window.innerHeight||800;
          if(r.bottom < -vh || r.top > vh*2)unload(e.target);
        }
      });
    },{root:null,rootMargin:'200px 0px 200px 0px',threshold:.01}) : null;
    root.querySelectorAll('[data-lazy-media]').forEach(img=>observer?observer.observe(img):load(img));

    const timeline=root.querySelector('[data-adaptive-timeline]');
    if(timeline && 'ResizeObserver' in window){
      new ResizeObserver(()=>{}).observe(timeline);
    }

    let pinchActive=false,startDistance=0,startColumns=Number(timeline?.dataset.columns||3),lastDistance=0,pinchAnchor={x:0,y:0};
    const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    const midpoint=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
    const densityForGesture=(ratio,from)=>{
      if(ratio>1.16)return DENSITIES[Math.max(0,DENSITIES.indexOf(from)-1)];
      if(ratio<0.86)return DENSITIES[Math.min(DENSITIES.length-1,DENSITIES.indexOf(from)+1)];
      return from;
    };
    const scrollHost=()=>{
      let host=timeline;
      while(host&&host!==document.body&&host.scrollHeight<=host.clientHeight)host=host.parentElement;
      return host&&host!==document.body?host:null;
    };
    const preserveScrollAnchor=()=>{const host=scrollHost();return {top:host?host.scrollTop:window.scrollY}};
    const restoreScrollAnchor=anchor=>{
      requestAnimationFrame(()=>{
        let host=document.querySelector('[data-adaptive-timeline]');
        while(host&&host!==document.body&&host.scrollHeight<=host.clientHeight)host=host.parentElement;
        if(host&&host!==document.body)host.scrollTop=anchor.top;else window.scrollTo(0,anchor.top);
      });
    };
    const finishPinch=()=>{
      if(!pinchActive)return;
      pinchActive=false;
      const ratio=startDistance?lastDistance/startDistance:1;
      const next=densityForGesture(ratio,startColumns);
      const liveTimeline=document.querySelector('[data-adaptive-timeline]');
      if(liveTimeline){liveTimeline.classList.remove('adaptive-pinch-active');liveTimeline.style.setProperty('--adaptive-pinch-scale','1')}
      if(next===startColumns)return;
      const anchor=preserveScrollAnchor();
      G.appState.patch({gridColumns:next});
      requestAnimationFrame(()=>{
        const nextTimeline=document.querySelector('[data-adaptive-timeline]');
        if(nextTimeline){
          nextTimeline.classList.add('adaptive-density-transition');
          requestAnimationFrame(()=>nextTimeline.classList.remove('adaptive-density-transition'));
        }
        restoreScrollAnchor(anchor);
      });
    };
    root.addEventListener('touchstart',e=>{
      if(e.touches.length!==2)return;
      pinchActive=true;
      startDistance=lastDistance=distance(e.touches[0],e.touches[1]);
      startColumns=Number(document.querySelector('[data-adaptive-timeline]')?.dataset.columns||G.appState.gridColumns||3);
      pinchAnchor=midpoint(e.touches[0],e.touches[1]);
      const live=document.querySelector('[data-adaptive-timeline]');
      if(live){
        live.classList.add('adaptive-pinch-active');
        live.style.setProperty('--adaptive-pinch-origin',`${pinchAnchor.x}px ${pinchAnchor.y}px`);
        live.style.setProperty('--adaptive-pinch-scale','1');
      }
    },{passive:true});
    root.addEventListener('touchmove',e=>{
      if(!pinchActive||e.touches.length!==2)return;
      lastDistance=distance(e.touches[0],e.touches[1]);
      const ratio=startDistance?lastDistance/startDistance:1;
      const visualScale=Math.max(.94,Math.min(1.06,1+(ratio-1)*.22));
      const live=document.querySelector('[data-adaptive-timeline]');
      if(live)live.style.setProperty('--adaptive-pinch-scale',visualScale.toFixed(4));
    },{passive:true});
    root.addEventListener('touchend',e=>{if(pinchActive&&e.touches.length<2)finishPinch()},{passive:true});
    root.addEventListener('touchcancel',finishPinch,{passive:true});
  };
})(window.GalleryManager=window.GalleryManager||{});
