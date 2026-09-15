package com.coconutshell.gallerymanager.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "folders")
data class FolderRecordEntity(
    @PrimaryKey val id: Long,
    val path: String,
    val name: String,
    val itemCount: Int,
    val coverUri: String?,
    val isPinned: Boolean
)
