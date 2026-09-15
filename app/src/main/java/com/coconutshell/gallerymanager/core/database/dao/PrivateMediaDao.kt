package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Insert
import com.coconutshell.gallerymanager.core.database.entity.PrivateMediaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PrivateMediaDao {
    @Query("SELECT * FROM private_media ORDER BY createdAtEpochMillis DESC")
    fun observeAll(): Flow<List<PrivateMediaEntity>>
    @Insert suspend fun insert(item: PrivateMediaEntity): Long
    @Query("DELETE FROM private_media WHERE id=:id") suspend fun delete(id: Long)
    @Query("SELECT * FROM private_media WHERE id=:id") suspend fun get(id: Long): PrivateMediaEntity?
}
