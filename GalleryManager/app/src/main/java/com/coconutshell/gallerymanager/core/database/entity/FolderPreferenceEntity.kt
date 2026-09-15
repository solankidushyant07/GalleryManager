package com.coconutshell.gallerymanager.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "folder_preferences")
data class FolderPreferenceEntity(
    @PrimaryKey val folderId: Long,
    val isPinned: Boolean = false
)
