package com.coconutshell.gallerymanager.core.database.dao

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import com.coconutshell.gallerymanager.core.database.entity.FolderPreferenceEntity

@Dao
interface FolderPreferenceDao {
    @Upsert suspend fun upsert(item: FolderPreferenceEntity)
    @Query("SELECT * FROM folder_preferences WHERE folderId=:id") suspend fun get(id: Long): FolderPreferenceEntity?
}
