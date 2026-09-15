package com.coconutshell.gallerymanager.feature.browser

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FolderDetailScreen(
    folderId: Long,
    onBack: () -> Unit,
    onOpen: (String) -> Unit
) {
    val app = LocalContext.current.applicationContext as GalleryManagerApplication
    val folders by app.container.storageRepository
        .observeFolders()
        .collectAsStateWithLifecycle(emptyList())
    val files by app.container.storageRepository
        .observeFiles()
        .collectAsStateWithLifecycle(emptyList())

    val folder = folders.firstOrNull { it.id == folderId }
    val media = files.filter { it.folderId == folderId }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(folder?.name ?: "Folder") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Rounded.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { pad ->
        Column(Modifier.fillMaxSize().padding(pad)) {
            folder?.let {
                Text(
                    "${it.itemCount} items",
                    Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                contentPadding = PaddingValues(8.dp),
                horizontalArrangement = Arrangement.spacedBy(5.dp),
                verticalArrangement = Arrangement.spacedBy(5.dp)
            ) {
                items(media, key = { it.id }) { item ->
                    MediaThumbnail(
                        uri = item.uri,
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(1f),
                        isVideo = item.isVideo,
                        onClick = { onOpen(item.uri) }
                    )
                }
            }
        }
    }
}
