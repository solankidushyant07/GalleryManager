package com.coconutshell.gallerymanager.feature.albums

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.MoreVert
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.database.entity.AlbumEntity
import com.coconutshell.gallerymanager.shared.ui.components.GalleryBottomBar
import com.coconutshell.gallerymanager.shared.ui.components.GlassCard
import com.coconutshell.gallerymanager.shared.ui.components.PrimaryDestination
import com.coconutshell.gallerymanager.shared.ui.components.SectionHeader
import androidx.compose.ui.platform.LocalContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlbumsScreen(
    onHome: () -> Unit,
    onBrowse: () -> Unit,
    onOpenAlbum: (Long) -> Unit = {},
    vm: AlbumsViewModel = viewModel(factory = AlbumsViewModelFactory())
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    var showCreate by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<AlbumEntity?>(null) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showCreate = true }) {
                Icon(Icons.Rounded.Add, contentDescription = "Add album")
            }
        },
        bottomBar = {
            GalleryBottomBar(
                selected = PrimaryDestination.ALBUMS,
                onSelected = {
                    when (it) {
                        PrimaryDestination.HOME -> onHome()
                        PrimaryDestination.BROWSE -> onBrowse()
                        else -> Unit
                    }
                },
                modifier = Modifier.navigationBarsPadding()
            )
        }
    ) { padding ->
        LazyColumn(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item { Text("Albums", style = MaterialTheme.typography.headlineMedium) }
            item { SectionHeader("Device Albums") }

            if (state.deviceFolders.isEmpty()) {
                item {
                    Text(
                        "No device folders indexed yet.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                items(state.deviceFolders, key = { "folder-${it.id}" }) { folder ->
                    GlassCard(
                        Modifier.fillMaxWidth(),
                        onClick = { onOpenAlbum(folder.id) }
                    ) {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(folder.name, style = MaterialTheme.typography.titleMedium)
                                Text(
                                    "${folder.itemCount} items",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            item { SectionHeader("My Albums") }

            if (state.myAlbums.isEmpty()) {
                item {
                    Text(
                        "Create an album to organize your memories. My Albums are app-managed collections and do not move your files.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                items(state.myAlbums, key = { "album-${it.id}" }) { album ->
                    GlassCard(
                        Modifier.fillMaxWidth(),
                        onClick = { onOpenAlbum(album.id) }
                    ) {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(album.name, style = MaterialTheme.typography.titleMedium)
                                Text(
                                    if (album.isPinned) "Pinned album" else "App-managed album",
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            IconButton(onClick = { editing = album }) {
                                Icon(Icons.Rounded.MoreVert, contentDescription = "Album actions")
                            }
                        }
                    }
                }
            }

            state.error?.let { message ->
                item { Text(message, color = MaterialTheme.colorScheme.error) }
            }
        }
    }

    if (showCreate) {
        AlbumNameDialog(
            title = "Create album",
            initial = "",
            confirmLabel = "Create",
            onDismiss = { showCreate = false },
            onConfirm = {
                vm.createAlbum(it)
                showCreate = false
            }
        )
    }

    editing?.let { album ->
        AlbumActionsDialog(
            album = album,
            onDismiss = { editing = null },
            onRename = {
                editing = null
                vm.renameAlbum(album.id, it)
            },
            onDelete = {
                editing = null
                vm.deleteAlbum(album.id)
            },
            onTogglePin = {
                editing = null
                vm.togglePinned(album)
            }
        )
    }
}

@Composable
private fun AlbumNameDialog(
    title: String,
    initial: String,
    confirmLabel: String,
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit
) {
    var name by remember(initial) { mutableStateOf(initial) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                singleLine = true,
                label = { Text("Album name") }
            )
        },
        confirmButton = {
            TextButton(
                onClick = { if (name.isNotBlank()) onConfirm(name) },
                enabled = name.isNotBlank()
            ) { Text(confirmLabel) }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}

@Composable
private fun AlbumActionsDialog(
    album: AlbumEntity,
    onDismiss: () -> Unit,
    onRename: (String) -> Unit,
    onDelete: () -> Unit,
    onTogglePin: () -> Unit
) {
    var rename by remember { mutableStateOf(false) }

    if (rename) {
        AlbumNameDialog(
            title = "Rename album",
            initial = album.name,
            confirmLabel = "Save",
            onDismiss = onDismiss,
            onConfirm = onRename
        )
        return
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(album.name) },
        text = { Text("Album actions") },
        confirmButton = {
            TextButton(onClick = onTogglePin) {
                Text(if (album.isPinned) "Unpin" else "Pin")
            }
        },
        dismissButton = {
            Row {
                TextButton(onClick = { rename = true }) { Text("Rename") }
                TextButton(onClick = onDelete) { Text("Delete") }
            }
        }
    )
}

@Composable
private fun AlbumsViewModelFactory(): androidx.lifecycle.ViewModelProvider.Factory {
    val context = LocalContext.current
    val app = context.applicationContext as GalleryManagerApplication
    return object : androidx.lifecycle.ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T =
            AlbumsViewModel(app.container.storageRepository, app.container.albumService) as T
    }
}
