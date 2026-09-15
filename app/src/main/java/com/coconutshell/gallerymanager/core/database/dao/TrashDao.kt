package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import com.coconutshell.gallerymanager.core.database.entity.TrashEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface TrashDao {
    @Query("SELECT * FROM trash ORDER BY deletedAtEpochMillis DESC")
    fun observeAll(): Flow<List<TrashEntity>>
    @Upsert suspend fun upsert(item: TrashEntity)
    @Query("SELECT * FROM trash") suspend fun getAllOnce(): List<TrashEntity>\n    @Query("DELETE FROM trash WHERE id=:id") suspend fun delete(id: Long)
    @Query("DELETE FROM trash WHERE deletedAtEpochMillis < :cutoff") suspend fun deleteOlderThan(cutoff: Long)
}
