(function (G) {
  const parse=()=>{
    const raw=location.hash.replace(/^#/,'')||'home';
    const [path,q]=raw.split('?');
    const params={};
    new URLSearchParams(q||'').forEach((v,k)=>params[k]=v);
    return {name:path||'home',params};
  };

  /*
   * Primary navigation context is intentionally independent from the
   * currently rendered screen.
   *
   * Example:
   *   Home -> Album A -> primary = home
   *   Albums -> Album A -> primary = albums
   *   Browse -> Folder A -> primary = browse
   *
   * Child screens inherit the context of the screen that opened them.
   * The context is serialized in the route so refresh/deep-link navigation
   * does not silently change the active primary destination.
   */
  const PRIMARY_ROUTES=new Set(['home','albums','browse']);
  const DEFAULT_PRIMARY={
    home:'home',
    albums:'albums',
    browse:'browse',
    'all-media':'home',
    archive:'home',
    'pinned-folders':'home',
    'other-albums':'albums',
    recent:'home',
    favorites:'home',
    trash:'home',
    private:'home',
    settings:'home',
    search:'home',
    album:'albums',
    folder:'browse',
    viewer:'home',
    editor:'home',
    composition:'home',
    import:'home',
    fileinfo:'home'
  };

  const normalizePrimary=(value,fallback='home')=>{
    return PRIMARY_ROUTES.has(value)?value:fallback;
  };

  const currentPrimary=()=>{
    const current=stack[stack.length-1] || parse();
    return normalizePrimary(current.params && current.params._nav, DEFAULT_PRIMARY[current.name]||'home');
  };

  const routeKey=r=>r.name+'?'+new URLSearchParams(r.params||{}).toString();

  let stack=[];
  let started=false;
  let waitingForGo=false;
  let waitingForBack=false;

  const buildRoute=(name,params={})=>{
    const supplied=params && params._nav;
    const primary=normalizePrimary(
      supplied,
      PRIMARY_ROUTES.has(name) ? name : currentPrimary()
    );
    return {name,params:{...params,_nav:primary}};
  };

  const writeHash=(route,replace=false)=>{
    const q=new URLSearchParams(route.params||{}).toString();
    const hash='#'+route.name+(q?'?'+q:'');
    if(replace) history.replaceState(null,'',hash);
    else location.hash=hash;
  };

  G.router={
    go(name,params={}){
      const route=buildRoute(name,params);
      if(stack.length && routeKey(stack[stack.length-1])===routeKey(route)) return;
      /* Selection is a transient state of the current collection. Leaving that
         collection must restore normal navigation/chrome immediately. */
      if(G.appState.selectionMode){
        G.appState.selected=new Set();
        G.appState.selectionMode=false;
      }
      stack.push(route);
      waitingForGo=true;
      writeHash(route,false);
    },

    replace(name,params={}){
      const route=buildRoute(name,params);
      if(stack.length) stack[stack.length-1]=route; else stack=[route];
      writeHash(route,true);
      G.appState.patch({route,selected:new Set(),selectionMode:false});
    },

    back(){
      const overlays=[...document.querySelectorAll('.modal-backdrop,.album-sheet-backdrop,.album-modal-backdrop,.trash-dialog-overlay')];
      if(overlays.length){overlays[overlays.length-1].remove();return;}

      document.querySelectorAll('[aria-expanded="true"]').forEach(b=>{
        b.setAttribute('aria-expanded','false');
        const menu=b.parentElement?.querySelector('.screen-overflow-menu');
        if(menu)menu.hidden=true;
      });

      // Inline search is a state of the current page. The same physical
      // Back button therefore exits search first, without navigating away.
      const currentRoute=stack[stack.length-1] || parse();
      if(String(currentRoute.params?._search||'')==='1'){
        const params={...(currentRoute.params||{})};
        delete params._search;
        G.router.replace(currentRoute.name,params);
        return;
      }

      if(stack.length>1){
        waitingForBack=true;
        history.back();
        return;
      }

      const current=parse();
      if(current.name!=='home'){
        const home={name:'home',params:{_nav:'home'}};
        stack=[home];
        waitingForGo=true;
        writeHash(home,false);
      }
    },

    start(){
      if(started)return;
      started=true;

      let initial=parse();
      if(!initial.params._nav){
        initial=buildRoute(initial.name,initial.params);
        history.replaceState(null,'','#'+initial.name+'?'+new URLSearchParams(initial.params).toString());
      }
      stack=[initial];

      window.addEventListener('hashchange',()=>{
        let next=parse();

        // A hash created outside router.go (e.g. browser/system navigation)
        // still needs a stable primary context.
        if(!next.params._nav){
          next=buildRoute(next.name,next.params);
        }

        if(waitingForGo){
          waitingForGo=false;
        }else if(waitingForBack){
          waitingForBack=false;
          stack.pop();
        }else if(stack.length>1){
          // Browser/system back: mirror the browser history in the app route stack.
          stack.pop();
        }else{
          stack=[next];
        }

        G.appState.patch({route:next,selected:new Set(),selectionMode:false});
      });

      G.appState.patch({route:initial,ready:true});
    }
  };
})(window.GalleryManager = window.GalleryManager || {});
