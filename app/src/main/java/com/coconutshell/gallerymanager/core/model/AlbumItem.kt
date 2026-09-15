package com.coconutshell.gallerymanager.core.model

enum class AlbumKind { DEVICE, MY_ALBUM }

data class AlbumItem(
    val id: Long,
    val name: String,
    val itemCount: Int,
    val coverUri: String?,
    val kind: AlbumKind,
    val isPinned: Boolean = false
)
