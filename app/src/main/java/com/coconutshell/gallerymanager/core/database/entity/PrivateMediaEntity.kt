package com.coconutshell.gallerymanager.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "private_media")
data class PrivateMediaEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val displayName: String,
    val mimeType: String,
    val encryptedPath: String,
    val sizeBytes: Long,
    val createdAtEpochMillis: Long
)
