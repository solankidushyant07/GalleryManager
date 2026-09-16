package com.coconutshell.gallerymanager.feature.home

import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity

enum class RefreshState { IDLE, REFRESHING, SUCCESS, ERROR }

data class HomeUiState(
    val recent: List<FileRecordEntity> = emptyList(),
    val pinnedFolders: List<FolderRecordEntity> = emptyList(),
    val allMediaCount: Int = 0,
    val favoriteCount: Int = 0,
    val archiveCount: Int = 0,
    val trashCount: Int = 0,
    val refreshState: RefreshState = RefreshState.IDLE,
    val permissionRequired: Boolean = false,
    val errorMessage: String? = null
)
