(function (G) {
  G.FileOperationModel = { create(type, ids, payload={}) {
    return { id: `op-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, ids:[...ids], ...payload };
  }};
})(window.GalleryManager = window.GalleryManager || {});
