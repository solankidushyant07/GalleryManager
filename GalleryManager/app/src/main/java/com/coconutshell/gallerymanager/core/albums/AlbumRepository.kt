package com.coconutshell.gallerymanager.core.albums

import com.coconutshell.gallerymanager.core.database.dao.AlbumDao
import com.coconutshell.gallerymanager.core.database.dao.AlbumMembershipDao
import com.coconutshell.gallerymanager.core.database.entity.AlbumEntity
import com.coconutshell.gallerymanager.core.database.entity.AlbumMembershipEntity
import kotlinx.coroutines.flow.Flow

class AlbumRepository(
    private val albumDao: AlbumDao,
    private val membershipDao: AlbumMembershipDao
) {
    fun observeAlbums(): Flow<List<AlbumEntity>> = albumDao.observeAll()

    fun observeMediaIds(albumId: Long): Flow<List<Long>> =
        membershipDao.observeMediaIds(albumId)

    suspend fun create(name: String): Long {
        val trimmed = name.trim()
        require(trimmed.isNotEmpty()) { "Album name cannot be empty" }
        return albumDao.insert(
            AlbumEntity(name = trimmed, coverUri = null)
        )
    }

    suspend fun rename(id: Long, name: String) {
        val trimmed = name.trim()
        require(trimmed.isNotEmpty()) { "Album name cannot be empty" }
        albumDao.rename(id, trimmed)
    }

    suspend fun delete(id: Long) {
        albumDao.delete(id)
    }

    suspend fun setPinned(id: Long, pinned: Boolean) {
        albumDao.setPinned(id, pinned)
    }

    suspend fun addMedia(albumId: Long, mediaIds: List<Long>) {
        if (mediaIds.isEmpty()) return
        membershipDao.addAll(mediaIds.distinct().map { AlbumMembershipEntity(albumId, it) })
    }

    suspend fun removeMedia(albumId: Long, mediaIds: List<Long>) {
        if (mediaIds.isEmpty()) return
        membershipDao.remove(albumId, mediaIds.distinct())
    }
}
