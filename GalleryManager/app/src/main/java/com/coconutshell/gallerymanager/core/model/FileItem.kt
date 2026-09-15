package com.coconutshell.gallerymanager.core.model

data class FileItem(
    val id: Long,
    val uri: String,
    val name: String,
    val mimeType: String,
    val sizeBytes: Long,
    val width: Int?,
    val height: Int?,
    val dateModifiedEpochSeconds: Long,
    val folderId: Long?,
    val mediaType: MediaType,
    val isFavorite: Boolean = false
)
