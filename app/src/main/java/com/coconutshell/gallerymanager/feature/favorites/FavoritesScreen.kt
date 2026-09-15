package com.coconutshell.gallerymanager.feature.favorites

import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail

@Composable
fun FavoritesScreen(onBack:()->Unit,onOpen:(String)->Unit){
    val app=LocalContext.current.applicationContext as GalleryManagerApplication
    val ids by app.container.favoritesService.observeIds().collectAsStateWithLifecycle(emptyList())
    val files by app.container.storageRepository.observeFiles().collectAsStateWithLifecycle(emptyList())
    val media=files.filter{it.id in ids}
    Scaffold(topBar={TopAppBar(title={Text("Favorites")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        LazyVerticalGrid(GridCells.Fixed(3),Modifier.fillMaxSize().padding(pad),contentPadding=PaddingValues(8.dp),horizontalArrangement=Arrangement.spacedBy(5.dp),verticalArrangement=Arrangement.spacedBy(5.dp)){
            items(media,key={it.id}){item->MediaThumbnail(Uri.parse(item.uri),Modifier.fillMaxWidth().aspectRatio(1f),onClick={onOpen(item.uri)})}
        }
    }
}
