package com.coconutshell.gallerymanager.core.favorites

import com.coconutshell.gallerymanager.core.database.dao.FavoriteDao
import com.coconutshell.gallerymanager.core.database.entity.FavoriteEntity
import kotlinx.coroutines.flow.Flow

class FavoritesService(private val dao: FavoriteDao) {
    fun observeIds(): Flow<List<Long>> = dao.observeIds()
    suspend fun isFavorite(mediaId: Long): Boolean = dao.isFavorite(mediaId)
    suspend fun add(mediaId: Long) = dao.add(FavoriteEntity(mediaId))
    suspend fun remove(mediaId: Long) = dao.remove(mediaId)
    suspend fun set(mediaId: Long, favorite: Boolean) {
        if (favorite) add(mediaId) else remove(mediaId)
    }
}
