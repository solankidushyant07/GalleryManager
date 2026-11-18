(function (G) {
  G.MediaModel = {
    create(raw) {
      return Object.freeze({
        id: String(raw.id), name: raw.name, uri: raw.uri, type: raw.type || 'image',
        mime: raw.mime || (raw.type === 'video' ? 'video/mp4' : 'image/svg+xml'),
        size: Number(raw.size || 0), width: Number(raw.width || 0), height: Number(raw.height || 0),
        date: raw.date, folderId: raw.folderId, folder: raw.folder || '',
        favorite: !!raw.favorite, albumIds: [...(raw.albumIds || [])], trashed: !!raw.trashed, archived: !!raw.archived,
        duration: raw.duration || null, source: raw.source || 'sample'
      });
    }
  };
})(window.GalleryManager = window.GalleryManager || {});
