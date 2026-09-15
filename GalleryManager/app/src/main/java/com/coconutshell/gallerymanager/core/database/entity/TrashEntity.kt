package com.coconutshell.gallerymanager.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "trash")
data class TrashEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val originalUri: String,
    val originalName: String,
    val mimeType: String,
    val originalRelativePath: String?,
    val backupPath: String,
    val sizeBytes: Long,
    val deletedAtEpochMillis: Long
)
