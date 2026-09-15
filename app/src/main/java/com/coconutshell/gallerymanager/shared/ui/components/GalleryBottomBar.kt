package com.coconutshell.gallerymanager.shared.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Collections
import androidx.compose.material.icons.rounded.FolderOpen
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

enum class PrimaryDestination { HOME, ALBUMS, BROWSE }

@Composable
fun GalleryBottomBar(
    selected: PrimaryDestination,
    onSelected: (PrimaryDestination) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(modifier = modifier) {
        NavigationBarItem(
            selected = selected == PrimaryDestination.HOME,
            onClick = { onSelected(PrimaryDestination.HOME) },
            icon = { Icon(Icons.Rounded.Home, null) },
            label = { Text("Home") }
        )
        NavigationBarItem(
            selected = selected == PrimaryDestination.ALBUMS,
            onClick = { onSelected(PrimaryDestination.ALBUMS) },
            icon = { Icon(Icons.Rounded.Collections, null) },
            label = { Text("Albums") }
        )
        NavigationBarItem(
            selected = selected == PrimaryDestination.BROWSE,
            onClick = { onSelected(PrimaryDestination.BROWSE) },
            icon = { Icon(Icons.Rounded.FolderOpen, null) },
            label = { Text("Browse") }
        )
    }
}
