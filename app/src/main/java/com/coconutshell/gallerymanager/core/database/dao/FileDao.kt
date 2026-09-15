package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FileDao {
    @Query("SELECT * FROM files ORDER BY dateModifiedEpochSeconds DESC")
    fun observeAll(): Flow<List<FileRecordEntity>>

    @Query("SELECT * FROM files ORDER BY dateModifiedEpochSeconds DESC LIMIT :limit")
    fun observeRecent(limit: Int): Flow<List<FileRecordEntity>>

    @Query("SELECT * FROM files WHERE id=:id LIMIT 1")
    suspend fun get(id: Long): FileRecordEntity?

    @Query("SELECT * FROM files WHERE name LIKE '%' || :query || '%' OR mimeType LIKE '%' || :query || '%' OR CAST(sizeBytes AS TEXT) LIKE '%' || :query || '%' OR CAST(dateModifiedEpochSeconds AS TEXT) LIKE '%' || :query || '%' ORDER BY dateModifiedEpochSeconds DESC")
    suspend fun search(query: String): List<FileRecordEntity>

    @Query("DELETE FROM files WHERE id NOT IN (:ids)")
    suspend fun deleteMissing(ids: List<Long>)

    @Query("DELETE FROM files")
    suspend fun deleteAll()

    @Upsert
    suspend fun upsertAll(items: List<FileRecordEntity>)

    suspend fun reconcile(items: List<FileRecordEntity>, ids: List<Long>) {
        if (ids.isEmpty()) deleteAll() else deleteMissing(ids)
        if (items.isNotEmpty()) upsertAll(items)
    }
}
