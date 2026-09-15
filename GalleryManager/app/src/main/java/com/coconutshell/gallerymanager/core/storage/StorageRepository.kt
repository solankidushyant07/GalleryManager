package com.coconutshell.gallerymanager.core.storage

import androidx.room.withTransaction
import com.coconutshell.gallerymanager.core.database.GalleryDatabase
import com.coconutshell.gallerymanager.core.database.dao.FileDao
import com.coconutshell.gallerymanager.core.database.dao.FolderDao
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity
import kotlinx.coroutines.flow.Flow

class StorageRepository(
    private val dataSource: MediaStoreDataSource,
    private val fileDao: FileDao,
    private val folderDao: FolderDao
) {
    fun observeFiles(): Flow<List<FileRecordEntity>> = fileDao.observeAll()
    fun observeRecent(limit: Int = 12): Flow<List<FileRecordEntity>> = fileDao.observeRecent(limit)
    fun observeFolders(): Flow<List<FolderRecordEntity>> = folderDao.observeAll()

    suspend fun rescan() {
        val (files, scannedFolders) = dataSource.scan()
        val existingFolders = folderDao.getAll().associateBy { it.id }
        val mergedFolders = scannedFolders.map { scanned ->
            scanned.copy(isPinned = existingFolders[scanned.id]?.isPinned ?: false)
        }
        val scannedIds = files.map { it.id }.toSet()
        val scannedFolderIds = mergedFolders.map { it.id }.toSet()

        // Reconciliation is deliberately keyed to the current MediaStore snapshot.
        // User-owned album membership is separate and is not touched by a public rescan.
        fileDao.reconcile(files, scannedIds.toList())
        folderDao.reconcile(mergedFolders, scannedFolderIds.toList())
    }
}
