package com.coconutshell.gallerymanager.feature.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.coconutshell.gallerymanager.core.favorites.FavoritesService
import com.coconutshell.gallerymanager.core.permissions.MediaPermissionManager
import com.coconutshell.gallerymanager.core.preferences.PreferencesRepository
import com.coconutshell.gallerymanager.core.storage.StorageRepository
import com.coconutshell.gallerymanager.core.storage.StorageScanner
import com.coconutshell.gallerymanager.core.trash.TrashService
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: StorageRepository,
    private val scanner: StorageScanner,
    private val permissionManager: MediaPermissionManager,
    preferences: PreferencesRepository,
    favoritesService: FavoritesService,
    trashService: TrashService
) : ViewModel() {

    private val refreshState = MutableStateFlow(RefreshState.IDLE)
    private val error = MutableStateFlow<String?>(null)
    private val autoScan = preferences.state.map { it.autoScan }.distinctUntilChanged()

    private val contentState: StateFlow<HomeContentState> =
        combine(
            repository.observeRecent(),
            repository.observeFolders(),
            repository.observeFiles()
        ) { recent, folders, files ->
            HomeContentState(
                recent = recent,
                pinnedFolders = folders.filter { it.isPinned },
                allMediaCount = files.size
            )
        }.combine(favoritesService.observeIds()) { content, favorites ->
            content.copy(favoriteCount = favorites.size)
        }.combine(trashService.observe()) { content, trash ->
            content.copy(trashCount = trash.size)
        }.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            HomeContentState()
        )

    val uiState: StateFlow<HomeUiState> =
        combine(contentState, refreshState, error) { content, refresh, message ->
            HomeUiState(
                recent = content.recent,
                pinnedFolders = content.pinnedFolders,
                allMediaCount = content.allMediaCount,
                favoriteCount = content.favoriteCount,
                archiveCount = 0,
                trashCount = content.trashCount,
                refreshState = refresh,
                permissionRequired = !permissionManager.hasMediaAccess(),
                errorMessage = message
            )
        }.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            HomeUiState()
        )

    init {
        viewModelScope.launch {
            autoScan.collect { enabled ->
                if (enabled && permissionManager.hasMediaAccess()) refresh()
            }
        }
    }

    fun refresh() {
        if (!permissionManager.hasMediaAccess()) return

        viewModelScope.launch {
            refreshState.value = RefreshState.REFRESHING
            error.value = null

            runCatching { scanner.refresh() }
                .onSuccess { refreshState.value = RefreshState.SUCCESS }
                .onFailure {
                    error.value = it.message ?: "Unable to refresh media"
                    refreshState.value = RefreshState.ERROR
                }
        }
    }
}

private data class HomeContentState(
    val recent: List<com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity> = emptyList(),
    val pinnedFolders: List<com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity> = emptyList(),
    val allMediaCount: Int = 0,
    val favoriteCount: Int = 0,
    val trashCount: Int = 0
)
