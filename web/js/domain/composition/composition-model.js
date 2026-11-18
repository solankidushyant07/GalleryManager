(function (G) {
  G.CompositionModel = { create(raw={}) {
    return { id: raw.id || `project-${Date.now()}`, name: raw.name || 'Composition',
      mediaIds: [...(raw.mediaIds || [])], layout: Number(raw.layout || Math.min(3, Math.max(2,(raw.mediaIds||[]).length))) };
  }};
})(window.GalleryManager = window.GalleryManager || {});
