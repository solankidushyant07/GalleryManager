package com.coconutshell.gallerymanager.feature.browser

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import com.coconutshell.gallerymanager.core.storage.MediaSort
import com.coconutshell.gallerymanager.core.storage.sortedAs
import com.coconutshell.gallerymanager.shared.ui.components.*
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrowserScreen(
    onHome: () -> Unit,
    onAlbums: () -> Unit,
    onOpen: (String) -> Unit = {},
    onFolder: (Long) -> Unit = {},
    vm: BrowserViewModel = viewModel(factory = BrowserFactory())
) {
    val context = LocalContext.current
    val app = context.applicationContext as GalleryManagerApplication
    val files by vm.files.collectAsStateWithLifecycle()
    val albums by app.container.albumService.observeAlbums().collectAsStateWithLifecycle(emptyList())
    val folders by app.container.storageRepository.observeFolders().collectAsStateWithLifecycle(emptyList())
    var sort by remember { mutableStateOf(MediaSort.NEWEST) }
    var columns by remember { mutableIntStateOf(3) }
    var scope by remember { mutableStateOf("All") }
    var selecting by remember { mutableStateOf(false) }
    var showAlbums by remember { mutableStateOf(false) }
    var pendingDelete by remember { mutableStateOf(false) }
    val selected = remember { mutableStateListOf<Long>() }

    val visible = files.sortedAs(sort)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Browse") },
                actions = {
                    IconButton(onClick = { columns = if (columns >= 5) 2 else columns + 1 }) {
                        Icon(Icons.Rounded.GridView, "Grid size")
                    }
                    IconButton(
                        onClick = {
                            sort = when (sort) {
                                MediaSort.NEWEST -> MediaSort.NAME
                                MediaSort.NAME -> MediaSort.SIZE
                                MediaSort.SIZE -> MediaSort.TYPE
                                MediaSort.TYPE -> MediaSort.OLDEST
                                MediaSort.OLDEST -> MediaSort.NEWEST
                            }
                        }
                    ) {
                        Icon(Icons.Rounded.Sort, "Sort")
                    }
                    IconButton(
                        onClick = {
                            selecting = !selecting
                            selected.clear()
                        }
                    ) {
                        Icon(
                            if (selecting) Icons.Rounded.Close else Icons.Rounded.Checklist,
                            "Select"
                        )
                    }
                }
            )
        },
        bottomBar = {
            GalleryBottomBar(
                PrimaryDestination.BROWSE,
                {
                    when (it) {
                        PrimaryDestination.HOME -> onHome()
                        PrimaryDestination.ALBUMS -> onAlbums()
                        else -> Unit
                    }
                },
                Modifier.navigationBarsPadding()
            )
        }
    ) { pad ->
        Column(Modifier.fillMaxSize().padding(pad)) {
            val scopes = listOf("All", "My Albums", "Device Folders")
            ScrollableTabRow(
                selectedTabIndex = scopes.indexOf(scope).coerceAtLeast(0)
            ) {
                scopes.forEachIndexed { index, label ->
                    Tab(
                        selected = index == scopes.indexOf(scope),
                        onClick = { scope = label },
                        text = { Text(label) }
                    )
                }
            }

            if (scope == "Device Folders") {
                LazyColumn(
                    Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(folders, key = { it.id }) { folder ->
                        Card(
                            Modifier
                                .fillMaxWidth()
                                .clickable { onFolder(folder.id) }
                        ) {
                            Row(
                                Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(folder.name)
                                Text("${folder.itemCount}")
                            }
                        }
                    }
                }
            } else {
                if (selecting && selected.isNotEmpty()) {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text("${selected.size} selected", Modifier.weight(1f))
                        TextButton(onClick = { showAlbums = true }) { Text("Album") }
                        TextButton(onClick = { pendingDelete = true }) { Text("Trash") }
                        TextButton(
                            onClick = {
                                selected.clear()
                                selecting = false
                            }
                        ) { Text("Done") }
                    }
                }

                LazyVerticalGrid(
                    columns = GridCells.Fixed(columns.coerceIn(2, 5)),
                    contentPadding = PaddingValues(8.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(visible, key = { it.id }) { item ->
                        Box(
                            Modifier.clickable {
                                if (selecting) {
                                    if (!selected.remove(item.id)) selected.add(item.id)
                                } else {
                                    onOpen(item.uri)
                                }
                            }
                        ) {
                            MediaThumbnail(
                                uri = item.uri,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .aspectRatio(1f),
                                isVideo = item.isVideo
                            )
                            if (selecting && item.id in selected) {
                                Surface(
                                    Modifier.padding(8.dp),
                                    shape = androidx.compose.foundation.shape.CircleShape
                                ) {
                                    Text("✓", Modifier.padding(7.dp))
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAlbums) {
        AlertDialog(
            onDismissRequest = { showAlbums = false },
            title = { Text("Add to Album") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    albums.forEach { album ->
                        TextButton(
                            onClick = {
                                vm.addToAlbum(album.id, selected.toList())
                                showAlbums = false
                                selecting = false
                                selected.clear()
                            }
                        ) { Text(album.name) }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAlbums = false }) { Text("Cancel") }
            }
        )
    }

    if (pendingDelete) {
        AlertDialog(
            onDismissRequest = { pendingDelete = false },
            title = { Text("Move to Trash?") },
            text = { Text("${selected.size} item(s) will be kept for 30 days.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        vm.trash(
                            selected.mapNotNull { id ->
                                files.firstOrNull { it.id == id }
                            }
                        )
                        pendingDelete = false
                        selected.clear()
                        selecting = false
                    }
                ) { Text("Trash") }
            },
            dismissButton = {
                TextButton(onClick = { pendingDelete = false }) { Text("Cancel") }
            }
        )
    }
}

class BrowserViewModel(
    private val repo: com.coconutshell.gallerymanager.core.storage.StorageRepository,
    private val albums: com.coconutshell.gallerymanager.core.albums.AlbumService,
    private val trash: com.coconutshell.gallerymanager.core.trash.TrashService
) : ViewModel() {
    val files = repo.observeFiles()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addToAlbum(albumId: Long, ids: List<Long>) {
        viewModelScope.launch {
            albums.addToAlbum(albumId, ids)
        }
    }

    fun trash(items: List<FileRecordEntity>) {
        viewModelScope.launch {
            items.forEach {
                trash.moveToTrash(
                    com.coconutshell.gallerymanager.core.trash.TrashCandidate(
                        it.uri,
                        it.name,
                        it.mimeType,
                        null,
                        it.sizeBytes
                    )
                )
            }
            repo.rescan()
        }
    }
}

@Composable
private fun BrowserFactory(): androidx.lifecycle.ViewModelProvider.Factory {
    val app = LocalContext.current.applicationContext as GalleryManagerApplication
    return object : androidx.lifecycle.ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(c: Class<T>): T =
            BrowserViewModel(
                app.container.storageRepository,
                app.container.albumService,
                app.container.trashService
            ) as T
    }
}
