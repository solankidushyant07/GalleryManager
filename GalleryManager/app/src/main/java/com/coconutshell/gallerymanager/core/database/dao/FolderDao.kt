package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface FolderDao {
    @Query("SELECT * FROM folders ORDER BY name COLLATE NOCASE")
    fun observeAll(): Flow<List<FolderRecordEntity>>

    @Query("SELECT * FROM folders")
    suspend fun getAll(): List<FolderRecordEntity>

    @Query("DELETE FROM folders WHERE id NOT IN (:ids)")
    suspend fun deleteMissing(ids: List<Long>)

    @Query("DELETE FROM folders")
    suspend fun deleteAll()

    @Upsert
    suspend fun upsertAll(items: List<FolderRecordEntity>)

    suspend fun reconcile(items: List<FolderRecordEntity>, ids: List<Long>) {
        if (ids.isEmpty()) deleteAll() else deleteMissing(ids)
        if (items.isNotEmpty()) upsertAll(items)
    }
}
