package com.coconutshell.gallerymanager.shared.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.coconutshell.gallerymanager.core.model.FileItem

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MediaGrid(
    items: List<FileItem>,
    modifier: Modifier = Modifier,
    columns: Int = 3,
    onItemClick: (FileItem) -> Unit = {}
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        modifier = modifier,
        contentPadding = PaddingValues(4.dp)
    ) {
        items(items, key = { it.id }) { item ->
            MediaThumbnail(
                uri = item.uri,
                isVideo = item.mediaType == com.coconutshell.gallerymanager.core.model.MediaType.VIDEO,
                modifier = Modifier
            )
        }
    }
}
