package com.coconutshell.gallerymanager.core.storage

class StorageScanner(private val repository: StorageRepository) {
    suspend fun refresh() = repository.rescan()
}
