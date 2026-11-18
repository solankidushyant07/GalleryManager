(function (G) {
  G.AlbumModel = { create(raw) {
    return Object.freeze({ id: String(raw.id), name: raw.name, coverId: raw.coverId || null,
      count: Number(raw.count || 0), pinned: !!raw.pinned, kind: raw.kind || 'my' });
  }};
})(window.GalleryManager = window.GalleryManager || {});
