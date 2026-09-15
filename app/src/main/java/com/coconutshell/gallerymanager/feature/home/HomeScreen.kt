package com.coconutshell.gallerymanager.feature.home

import android.content.Intent
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.Refresh
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.permissions.MediaPermissionManager
import com.coconutshell.gallerymanager.shared.ui.components.GalleryBottomBar
import com.coconutshell.gallerymanager.shared.ui.components.GlassCard
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail
import com.coconutshell.gallerymanager.shared.ui.components.SearchBar
import com.coconutshell.gallerymanager.shared.ui.components.SectionHeader

@Composable
fun HomeScreen(
    onAlbums: () -> Unit,
    onBrowse: () -> Unit,
    onSearch: () -> Unit = {},
    onFavorites: () -> Unit = {},
    onPrivate: () -> Unit = {},
    onSettings: () -> Unit = {},
    vm: HomeViewModel = viewModel(factory = HomeViewModelFactory())
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val permissionManager = remember { MediaPermissionManager(context) }
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) {
        if (permissionManager.hasMediaAccess()) vm.refresh()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Good morning", style = MaterialTheme.typography.headlineMedium)
                Text("Your gallery", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            IconButton(onClick = vm::refresh) {
                Icon(Icons.Rounded.Refresh, contentDescription = "Refresh")
            }
            IconButton(onClick = onSettings) {
                Icon(Icons.Rounded.Settings, contentDescription = "Settings")
            }
        }

        SearchBar(
            query = "",
            onQueryChange = {},
            readOnly = true,
            modifier = Modifier.padding(vertical = 18.dp),
            onClick = onSearch
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            QuickCard("All Media", "Browse everything", Modifier.weight(1f), onClick = onBrowse)
            QuickCard("Favorites", "Saved moments", Modifier.weight(1f), Icons.Rounded.Favorite, onClick = onFavorites)
            QuickCard("Private", "Protected gallery", Modifier.weight(1f), Icons.Rounded.Lock, onClick = onPrivate)
        }

        if (state.permissionRequired) {
            GlassCard(Modifier.fillMaxWidth().padding(top = 18.dp)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Allow photo and video access", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "Gallery Manager needs media access to index your public photos and videos.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Button(onClick = { launcher.launch(permissionManager.requiredPermissions()) }) {
                        Text("Grant access")
                    }
                }
            }
        }

        SectionHeader("Pinned Folders", action = "See all", onAction = onBrowse)
        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            items(state.pinnedFolders, key = { it.id }) { folder ->
                GlassCard(Modifier.padding(vertical = 8.dp)) {
                    Column(Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        folder.coverUri?.let {
                            MediaThumbnail(it, Modifier.size(112.dp).height(112.dp))
                        }
                        Text(folder.name)
                    }
                }
            }
        }

        SectionHeader("Recent Media", action = "See all", onAction = onBrowse)
        if (state.recent.isEmpty()) {
            Text(
                "No public photos or videos yet.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        } else {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(state.recent, key = { it.id }) { item ->
                    MediaThumbnail(
                        item.uri,
                        Modifier.size(128.dp).padding(vertical = 8.dp),
                        item.isVideo
                    )
                }
            }
        }

        state.errorMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.error)
        }

        Box(Modifier.weight(1f))
        GalleryBottomBar(
            selected = com.coconutshell.gallerymanager.shared.ui.components.PrimaryDestination.HOME,
            onSelected = {
                when (it) {
                    com.coconutshell.gallerymanager.shared.ui.components.PrimaryDestination.ALBUMS -> onAlbums()
                    com.coconutshell.gallerymanager.shared.ui.components.PrimaryDestination.BROWSE -> onBrowse()
                    else -> Unit
                }
            },
            modifier = Modifier.navigationBarsPadding()
        )
    }
}

@Composable
private fun QuickCard(
    title: String,
    subtitle: String,
    modifier: Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    onClick: () -> Unit = {}
) {
    GlassCard(modifier, onClick = onClick) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            icon?.let { Icon(it, null) }
            Text(title, style = MaterialTheme.typography.titleMedium)
            Text(
                subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun HomeViewModelFactory(): androidx.lifecycle.ViewModelProvider.Factory {
    val context = LocalContext.current
    val app = context.applicationContext as GalleryManagerApplication
    return object : androidx.lifecycle.ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T =
            HomeViewModel(
                app.container.storageRepository,
                app.container.storageScanner,
                app.container.mediaPermissionManager,
                app.container.preferences
            ) as T
    }
}
