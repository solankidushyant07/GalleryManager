package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.coconutshell.gallerymanager.core.database.entity.AlbumEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AlbumDao {
    @Query("SELECT * FROM albums ORDER BY isPinned DESC, name COLLATE NOCASE")
    fun observeAll(): Flow<List<AlbumEntity>>

    @Insert
    suspend fun insert(album: AlbumEntity): Long

    @Query("UPDATE albums SET name = :name WHERE id = :id")
    suspend fun rename(id: Long, name: String)

    @Query("UPDATE albums SET isPinned = :pinned WHERE id = :id")
    suspend fun setPinned(id: Long, pinned: Boolean)

    @Query("DELETE FROM albums WHERE id = :id")
    suspend fun delete(id: Long)
}
