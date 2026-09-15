package com.coconutshell.gallerymanager.di

import android.content.Context
import java.io.File
import com.coconutshell.gallerymanager.core.albums.*
import com.coconutshell.gallerymanager.core.composition.CompositionService
import com.coconutshell.gallerymanager.core.database.GalleryDatabase
import com.coconutshell.gallerymanager.core.favorites.FavoritesService
import com.coconutshell.gallerymanager.core.fileoperations.FileOperationService
import com.coconutshell.gallerymanager.core.fileoperations.InMemoryUndoStore
import com.coconutshell.gallerymanager.core.permissions.MediaPermissionManager
import com.coconutshell.gallerymanager.core.preferences.PreferencesRepository
import com.coconutshell.gallerymanager.core.privatevault.PrivateCredentialStore
import com.coconutshell.gallerymanager.core.privatevault.PrivateVaultService
import com.coconutshell.gallerymanager.core.search.SearchRepository
import com.coconutshell.gallerymanager.core.storage.*
import com.coconutshell.gallerymanager.core.trash.TrashService

class AppContainer(context: Context) {
    private val appContext = context.applicationContext
    private val database = GalleryDatabase.create(appContext)

    val mediaPermissionManager = MediaPermissionManager(appContext)
    val preferences = PreferencesRepository(appContext)
    val storageRepository = StorageRepository(
        MediaStoreDataSource(appContext.contentResolver),
        database.fileDao(),
        database.folderDao()
    )
    val storageScanner = StorageScanner(storageRepository)

    val albumRepository = AlbumRepository(database.albumDao(), database.albumMembershipDao())
    val albumService = AlbumService(albumRepository)

    val favoritesService = FavoritesService(database.favoriteDao())
    val undoStore = InMemoryUndoStore()
    val fileOperationService = FileOperationService(appContext.contentResolver, undoStore)
    val trashService = TrashService(appContext.contentResolver, database.trashDao(), File(appContext.filesDir, "trash"))
    val privateCredentialStore = PrivateCredentialStore(appContext)
    val privateVaultService = PrivateVaultService(appContext, database.privateMediaDao())
    val searchRepository = SearchRepository(database.fileDao())
    val compositionService = CompositionService(appContext, database.compositionProjectDao())
}
