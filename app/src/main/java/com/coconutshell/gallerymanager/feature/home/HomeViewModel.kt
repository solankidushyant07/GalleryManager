package com.coconutshell.gallerymanager.feature.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.coconutshell.gallerymanager.core.permissions.MediaPermissionManager
import com.coconutshell.gallerymanager.core.preferences.PreferencesRepository
import com.coconutshell.gallerymanager.core.storage.StorageRepository
import com.coconutshell.gallerymanager.core.storage.StorageScanner
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: StorageRepository,
    private val scanner: StorageScanner,
    private val permissionManager: MediaPermissionManager,
    preferences: PreferencesRepository
) : ViewModel() {
    private val refreshState=MutableStateFlow(RefreshState.IDLE)
    private val error=MutableStateFlow<String?>(null)
    private val autoScan=preferences.state.map{it.autoScan}.distinctUntilChanged()
    val uiState=combine(repository.observeRecent(),repository.observeFolders(),refreshState,error){recent,folders,refresh,message->
        HomeUiState(recent,folders.filter{it.isPinned},refresh,!permissionManager.hasMediaAccess(),message)
    }.stateIn(viewModelScope,SharingStarted.WhileSubscribed(5000),HomeUiState())

    init {
        viewModelScope.launch { autoScan.collect { enabled -> if(enabled && permissionManager.hasMediaAccess()) refresh() } }
    }
    fun refresh(){
        if(!permissionManager.hasMediaAccess())return
        viewModelScope.launch{
            refreshState.value=RefreshState.REFRESHING;error.value=null
            runCatching{scanner.refresh()}.onSuccess{refreshState.value=RefreshState.SUCCESS}.onFailure{
                error.value=it.message?:"Unable to refresh media";refreshState.value=RefreshState.ERROR
            }
        }
    }
}
