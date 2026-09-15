package com.coconutshell.gallerymanager.feature.albums

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.aspectRatio
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
fun AlbumDetailScreen(
    albumId: Long,
    onBack: () -> Unit,
    onOpen: (String) -> Unit
) {
    val app = LocalContext.current.applicationContext as GalleryManagerApplication
    val ids by app.container.albumRepository
        .observeMediaIds(albumId)
        .collectAsStateWithLifecycle(emptyList())
    val files by app.container.storageRepository
        .observeFiles()
        .collectAsStateWithLifecycle(emptyList())
    val albums by app.container.albumService
        .observeAlbums()
        .collectAsStateWithLifecycle(emptyList())

    val media = files.filter { it.id in ids }
    val album = albums.firstOrNull { it.id == albumId }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(album?.name ?: "Album") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Rounded.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { pad ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            modifier = Modifier
                .fillMaxSize()
                .padding(pad),
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
