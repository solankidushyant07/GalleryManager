package com.coconutshell.gallerymanager.core.albums

class AlbumService(private val repository: AlbumRepository) {
    suspend fun createAlbum(name: String): Long = repository.create(name)
    suspend fun renameAlbum(id: Long, name: String) = repository.rename(id, name)
    suspend fun deleteAlbum(id: Long) = repository.delete(id)
    suspend fun addToAlbum(albumId: Long, mediaIds: List<Long>) =
        repository.addMedia(albumId, mediaIds)
    suspend fun removeFromAlbum(albumId: Long, mediaIds: List<Long>) =
        repository.removeMedia(albumId, mediaIds)
    suspend fun pinAlbum(id: Long) = repository.setPinned(id, true)
    suspend fun unpinAlbum(id: Long) = repository.setPinned(id, false)
}
