package com.coconutshell.gallerymanager.core.model

data class FolderItem(
    val id: Long,
    val path: String,
    val name: String,
    val itemCount: Int,
    val coverUri: String? = null,
    val isPinned: Boolean = false
)
