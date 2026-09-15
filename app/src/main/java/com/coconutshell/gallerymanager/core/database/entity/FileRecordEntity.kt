package com.coconutshell.gallerymanager.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "files")
data class FileRecordEntity(
    @PrimaryKey val id: Long,
    val uri: String,
    val name: String,
    val mimeType: String,
    val sizeBytes: Long,
    val width: Int?,
    val height: Int?,
    val dateModifiedEpochSeconds: Long,
    val folderId: Long?,
    val isVideo: Boolean
)
