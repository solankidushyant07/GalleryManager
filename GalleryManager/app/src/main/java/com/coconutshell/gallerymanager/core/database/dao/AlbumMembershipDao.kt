package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.coconutshell.gallerymanager.core.database.entity.AlbumMembershipEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AlbumMembershipDao {
    @Query("SELECT mediaId FROM album_memberships WHERE albumId=:albumId ORDER BY mediaId")
    fun observeMediaIds(albumId: Long): Flow<List<Long>>
    @Insert(onConflict=OnConflictStrategy.IGNORE) suspend fun addAll(memberships: List<AlbumMembershipEntity>)
    @Query("DELETE FROM album_memberships WHERE albumId=:albumId AND mediaId IN (:mediaIds)")
    suspend fun remove(albumId: Long, mediaIds: List<Long>)
    @Query("DELETE FROM album_memberships WHERE albumId=:albumId") suspend fun removeAll(albumId: Long)
}
