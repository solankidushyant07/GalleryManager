package com.coconutshell.gallerymanager.feature.albums

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.coconutshell.gallerymanager.core.albums.AlbumService
import com.coconutshell.gallerymanager.core.database.entity.AlbumEntity
import com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity
import com.coconutshell.gallerymanager.core.storage.StorageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AlbumsUiState(
    val deviceFolders: List<FolderRecordEntity> = emptyList(),
    val myAlbums: List<AlbumEntity> = emptyList(),
    val isCreating: Boolean = false,
    val error: String? = null
)

class AlbumsViewModel(
    storageRepository: StorageRepository,
    private val albumService: AlbumService
) : ViewModel() {
    private val error = MutableStateFlow<String?>(null)
    private val creating = MutableStateFlow(false)

    val uiState = combine(
        storageRepository.observeFolders(),
        albumService.observeAlbums(),
        creating,
        error
    ) { folders, albums, isCreating, message ->
        AlbumsUiState(folders, albums, isCreating, message)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AlbumsUiState())

    fun createAlbum(name: String) {
        viewModelScope.launch {
            creating.value = true
            error.value = null
            runCatching { albumService.createAlbum(name) }
                .onFailure { error.value = it.message ?: "Unable to create album" }
            creating.value = false
        }
    }

    fun renameAlbum(id: Long, name: String) {
        viewModelScope.launch {
            runCatching { albumService.renameAlbum(id, name) }
                .onFailure { error.value = it.message ?: "Unable to rename album" }
        }
    }

    fun deleteAlbum(id: Long) {
        viewModelScope.launch {
            runCatching { albumService.deleteAlbum(id) }
                .onFailure { error.value = it.message ?: "Unable to delete album" }
        }
    }

    fun togglePinned(album: AlbumEntity) {
        viewModelScope.launch {
            runCatching {
                if (album.isPinned) albumService.unpinAlbum(album.id)
                else albumService.pinAlbum(album.id)
            }.onFailure { error.value = it.message ?: "Unable to update album" }
        }
    }

    fun clearError() { error.value = null }
}
