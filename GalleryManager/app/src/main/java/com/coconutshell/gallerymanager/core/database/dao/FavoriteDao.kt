package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import com.coconutshell.gallerymanager.core.database.entity.FavoriteEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FavoriteDao {
    @Query("SELECT mediaId FROM favorites")
    fun observeIds(): Flow<List<Long>>
    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE mediaId=:mediaId)")
    suspend fun isFavorite(mediaId: Long): Boolean
    @Upsert suspend fun add(item: FavoriteEntity)
    @Query("DELETE FROM favorites WHERE mediaId=:mediaId") suspend fun remove(mediaId: Long)
    @Query("DELETE FROM favorites WHERE mediaId IN (:ids)") suspend fun removeAll(ids: List<Long>)
}
