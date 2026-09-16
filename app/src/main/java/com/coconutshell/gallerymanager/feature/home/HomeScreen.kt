package com.coconutshell.gallerymanager.feature.home

import android.content.Context
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Archive
import androidx.compose.material.icons.rounded.DeleteOutline
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.Folder
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Image
import androidx.compose.material.icons.rounded.Collections
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material.icons.rounded.WbSunny
import androidx.compose.material.icons.rounded.NightsStay
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.permissions.MediaPermissionManager
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail
import java.time.LocalTime

private data class HomePalette(
    val accent: Color,
    val accentSoft: Color,
    val backgroundTop: Color,
    val backgroundBottom: Color,
    val greetingIcon: ImageVector
)

private fun paletteFor(time: LocalTime): HomePalette {
    return when (time.hour) {
        in 5..11 -> HomePalette(
            accent = Color(0xFFFFA83D),
            accentSoft = Color(0xFFFF6F61),
            backgroundTop = Color(0xFF14254A),
            backgroundBottom = Color(0xFF090C18),
            greetingIcon = Icons.Rounded.WbSunny
        )
        in 12..16 -> HomePalette(
            accent = Color(0xFF64A7FF),
            accentSoft = Color(0xFF7C86FF),
            backgroundTop = Color(0xFF1B5790),
            backgroundBottom = Color(0xFF091526),
            greetingIcon = Icons.Rounded.WbSunny
        )
        else -> HomePalette(
            accent = Color(0xFF7898FF),
            accentSoft = Color(0xFF9B5CFF),
            backgroundTop = Color(0xFF101B46),
            backgroundBottom = Color(0xFF070912),
            greetingIcon = Icons.Rounded.NightsStay
        )
    }
}

private fun greetingFor(time: LocalTime): String = when (time.hour) {
    in 5..11 -> "Good morning"
    in 12..16 -> "Good afternoon"
    else -> "Good evening"
}

@Composable
fun HomeScreen(
    onAlbums: () -> Unit,
    onBrowse: () -> Unit,
    onSearch: () -> Unit = {},
    onFavorites: () -> Unit = {},
    onPrivate: () -> Unit = {},
    onSettings: () -> Unit = {},
    onArchive: () -> Unit = {},
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

    val palette = paletteFor(LocalTime.now())
    val greeting = greetingFor(LocalTime.now())
    val backgroundUri =
        state.pinnedFolders.firstOrNull { !it.coverUri.isNullOrBlank() }?.coverUri
            ?: state.recent.firstOrNull()?.uri

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(palette.backgroundTop, palette.backgroundBottom)
                )
            )
    ) {
        if (backgroundUri != null) {
            AsyncImage(
                model = backgroundUri,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .blur(26.dp),
                alpha = 0.32f
            )
        }

        Box(
            Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        listOf(
                            Color.Black.copy(alpha = 0.18f),
                            Color(0xFF050711).copy(alpha = 0.78f)
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 118.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top
            ) {
                Column(Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = greeting,
                            color = Color.White,
                            fontSize = 29.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(Modifier.width(7.dp))
                        Icon(
                            imageVector = palette.greetingIcon,
                            contentDescription = null,
                            tint = palette.accent,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Your memories, always with you.",
                        color = Color.White.copy(alpha = 0.72f),
                        fontSize = 16.sp
                    )
                }

                GlassIconButton(
                    icon = Icons.Rounded.Settings,
                    contentDescription = "Settings",
                    onClick = onSettings,
                    tint = Color.White
                )
            }

            Spacer(Modifier.height(24.dp))

            HomeSearchBar(onClick = onSearch)

            Spacer(Modifier.height(18.dp))

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    HomeQuickCard(
                        modifier = Modifier.weight(1f),
                        title = "All Media",
                        count = state.allMediaCount,
                        icon = Icons.Rounded.Image,
                        iconTint = Color(0xFF65A7FF),
                        iconBackground = Color(0xFF1767C8).copy(alpha = 0.42f),
                        onClick = onBrowse
                    )
                    HomeQuickCard(
                        modifier = Modifier.weight(1f),
                        title = "Favorites",
                        count = state.favoriteCount,
                        icon = Icons.Rounded.Favorite,
                        iconTint = Color(0xFFFF7184),
                        iconBackground = Color(0xFFB51E46).copy(alpha = 0.42f),
                        onClick = onFavorites
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    HomeQuickCard(
                        modifier = Modifier.weight(1f),
                        title = "Archive",
                        count = state.archiveCount,
                        icon = Icons.Rounded.Archive,
                        iconTint = Color(0xFF72E6BF),
                        iconBackground = Color(0xFF167D69).copy(alpha = 0.42f),
                        onClick = onArchive
                    )
                    HomeQuickCard(
                        modifier = Modifier.weight(1f),
                        title = "Trash",
                        count = state.trashCount,
                        icon = Icons.Rounded.DeleteOutline,
                        iconTint = Color(0xFFD7DBE7),
                        iconBackground = Color(0xFF687083).copy(alpha = 0.42f),
                        onClick = {}
                    )
                }
            }

            if (state.permissionRequired) {
                Spacer(Modifier.height(14.dp))
                GlassSurface {
                    Column(
                        Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(9.dp)
                    ) {
                        Text(
                            "Allow photo and video access",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            "Gallery Manager needs media access to show your photos and videos.",
                            color = Color.White.copy(alpha = 0.68f),
                            fontSize = 13.sp
                        )
                        Text(
                            "Grant access",
                            color = palette.accent,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .clickable {
                                    launcher.launch(permissionManager.requiredPermissions())
                                }
                                .padding(vertical = 7.dp, horizontal = 4.dp)
                        )
                    }
                }
            }

            Spacer(Modifier.height(27.dp))

            HomeSectionHeader("Pinned Folders", palette.accent, onBrowse)

            Spacer(Modifier.height(10.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                state.pinnedFolders.take(8).forEach { folder ->
                    Column(
                        modifier = Modifier.width(94.dp),
                        horizontalAlignment = Alignment.Start
                    ) {
                        if (!folder.coverUri.isNullOrBlank()) {
                            MediaThumbnail(
                                folder.coverUri!!,
                                Modifier
                                    .size(94.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .border(
                                        1.dp,
                                        Color.White.copy(alpha = 0.28f),
                                        RoundedCornerShape(14.dp)
                                    )
                            )
                        } else {
                            Box(
                                Modifier
                                    .size(94.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(Color.White.copy(alpha = 0.10f))
                                    .border(
                                        1.dp,
                                        Color.White.copy(alpha = 0.22f),
                                        RoundedCornerShape(14.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Rounded.Folder,
                                    contentDescription = null,
                                    tint = Color.White.copy(alpha = 0.72f),
                                    modifier = Modifier.size(30.dp)
                                )
                            }
                        }
                        Spacer(Modifier.height(7.dp))
                        Text(
                            folder.name,
                            color = Color.White.copy(alpha = 0.90f),
                            fontSize = 14.sp,
                            maxLines = 1
                        )
                    }
                }
            }

            Spacer(Modifier.height(27.dp))

            HomeSectionHeader("Recent Media", palette.accent, onBrowse)

            Spacer(Modifier.height(10.dp))

            if (state.recent.isEmpty()) {
                Text(
                    "No public photos or videos yet.",
                    color = Color.White.copy(alpha = 0.68f),
                    fontSize = 14.sp
                )
            } else {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    state.recent.take(8).forEach { item ->
                        MediaThumbnail(
                            item.uri,
                            Modifier
                                .size(width = 94.dp, height = 126.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .border(
                                    1.dp,
                                    Color.White.copy(alpha = 0.28f),
                                    RoundedCornerShape(14.dp)
                                ),
                            item.isVideo
                        )
                    }
                }
            }

            state.errorMessage?.let {
                Spacer(Modifier.height(10.dp))
                Text(it, color = Color(0xFFFF8997), fontSize = 13.sp)
            }
        }

        HomeBottomBar(
            selectedHome = true,
            accent = palette.accent,
            onHome = {},
            onAlbums = onAlbums,
            onBrowse = onBrowse,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(horizontal = 12.dp, vertical = 10.dp)
                .navigationBarsPadding()
        )
    }
}

@Composable
private fun GlassSurface(content: @Composable () -> Unit) {
    Box(
        Modifier
            .fillMaxWidth()
            .background(
                Color(0xFF141B2C).copy(alpha = 0.62f),
                RoundedCornerShape(22.dp)
            )
            .border(
                1.dp,
                Color.White.copy(alpha = 0.16f),
                RoundedCornerShape(22.dp)
            ),
        content = { content() }
    )
}

@Composable
private fun GlassIconButton(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    tint: Color
) {
    Box(
        Modifier
            .size(62.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White.copy(alpha = 0.09f))
            .border(1.dp, Color.White.copy(alpha = 0.18f), RoundedCornerShape(20.dp))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Icon(icon, contentDescription, tint = tint, modifier = Modifier.size(30.dp))
    }
}

@Composable
private fun HomeSearchBar(onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
            .clip(RoundedCornerShape(32.dp))
            .background(Color(0xFF182033).copy(alpha = 0.64f))
            .border(1.dp, Color.White.copy(alpha = 0.18f), RoundedCornerShape(32.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 20.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            Icons.Rounded.Search,
            contentDescription = "Search",
            tint = Color.White.copy(alpha = 0.82f),
            modifier = Modifier.size(31.dp)
        )
        Spacer(Modifier.width(17.dp))
        Text(
            "Search photos, albums...",
            color = Color.White.copy(alpha = 0.50f),
            fontSize = 16.sp
        )
    }
}

@Composable
private fun HomeQuickCard(
    modifier: Modifier,
    title: String,
    count: Int,
    icon: ImageVector,
    iconTint: Color,
    iconBackground: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = modifier
            .height(112.dp)
            .clip(RoundedCornerShape(23.dp))
            .background(Color(0xFF151C2B).copy(alpha = 0.68f))
            .border(1.dp, Color.White.copy(alpha = 0.17f), RoundedCornerShape(23.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 15.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            Modifier
                .size(58.dp)
                .clip(CircleShape)
                .background(iconBackground),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = iconTint, modifier = Modifier.size(30.dp))
        }

        Spacer(Modifier.width(12.dp))

        Column(Modifier.weight(1f)) {
            Text(
                title,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "%,d".format(count),
                color = Color.White.copy(alpha = 0.64f),
                fontSize = 14.sp
            )
        }

        Text(
            "›",
            color = Color.White.copy(alpha = 0.62f),
            fontSize = 31.sp,
            fontWeight = FontWeight.Light
        )
    }
}

@Composable
private fun HomeSectionHeader(
    title: String,
    accent: Color,
    onSeeAll: () -> Unit
) {
    Row(
        Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            title,
            color = Color.White,
            fontSize = 23.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.weight(1f)
        )
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .clickable(onClick = onSeeAll)
                .padding(horizontal = 5.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "See all",
                color = accent,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
            Text(
                "›",
                color = accent,
                fontSize = 25.sp,
                modifier = Modifier.padding(start = 3.dp)
            )
        }
    }
}

@Composable
private fun HomeBottomBar(
    selectedHome: Boolean,
    accent: Color,
    onHome: () -> Unit,
    onAlbums: () -> Unit,
    onBrowse: () -> Unit,
    modifier: Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(94.dp)
            .clip(RoundedCornerShape(40.dp))
            .background(Color(0xFF121A2B).copy(alpha = 0.84f))
            .border(1.dp, Color.White.copy(alpha = 0.16f), RoundedCornerShape(40.dp))
            .padding(horizontal = 12.dp, vertical = 9.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        HomeNavItem(
            Modifier.weight(1f),
            Icons.Rounded.Home,
            "Home",
            selectedHome,
            accent,
            onHome
        )
        HomeNavItem(
            Modifier.weight(1f),
            Icons.Rounded.Collections,
            "Albums",
            false,
            accent,
            onAlbums
        )
        HomeNavItem(
            Modifier.weight(1f),
            Icons.Rounded.Folder,
            "Browse",
            false,
            accent,
            onBrowse
        )
    }
}

@Composable
private fun HomeNavItem(
    modifier: Modifier,
    icon: ImageVector,
    label: String,
    selected: Boolean,
    accent: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(24.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 5.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            icon,
            contentDescription = label,
            tint = if (selected) accent else Color.White.copy(alpha = 0.66f),
            modifier = Modifier.size(29.dp)
        )
        Text(
            label,
            color = if (selected) accent else Color.White.copy(alpha = 0.66f),
            fontSize = 13.sp
        )
        if (selected) {
            Spacer(Modifier.height(2.dp))
            Box(
                Modifier
                    .size(5.dp)
                    .clip(CircleShape)
                    .background(accent)
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
                app.container.preferences,
                app.container.favoritesService,
                app.container.trashService
            ) as T
    }
}
