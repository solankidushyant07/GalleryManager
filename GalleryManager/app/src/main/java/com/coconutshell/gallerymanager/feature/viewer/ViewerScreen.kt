package com.coconutshell.gallerymanager.feature.viewer

import android.net.Uri
import android.view.ViewGroup
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.material.icons.rounded.FavoriteBorder
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import coil.compose.AsyncImage

@Composable
fun ViewerScreen(uriString:String,onBack:()->Unit,onInfo:()->Unit){
    val context=androidx.compose.ui.platform.LocalContext.current
    val app=(context.applicationContext as com.coconutshell.gallerymanager.GalleryManagerApplication)
    val mediaId=uriString.substringAfterLast('/').toLongOrNull()
    var favorite by remember{mutableStateOf(false)}
    LaunchedEffect(mediaId){ if(mediaId!=null) favorite=app.container.favoritesService.isFavorite(mediaId) }
    LaunchedEffect(favorite, mediaId){ if(mediaId!=null) app.container.favoritesService.set(mediaId, favorite) }
    val uri=Uri.parse(uriString)
    val isVideo=uri.toString().contains("video",true) || uriString.endsWith(".mp4",true) || uriString.endsWith(".mov",true)
    Scaffold(topBar={TopAppBar(title={Text("Viewer")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}},actions={
            if(mediaId!=null) IconButton({favorite=!favorite}){
                Icon(if(favorite) Icons.Rounded.Favorite else Icons.Rounded.FavoriteBorder,"Favorite")
            }
            IconButton(onInfo){Icon(Icons.Rounded.Info,"File info")}
        })}){pad->
        Box(Modifier.fillMaxSize().padding(pad).background(MaterialTheme.colorScheme.background).pointerInput(Unit){
            detectTransformGestures{_,pan,zoom,_ -> }
        }){
            if(isVideo) VideoPlayer(uri) else ZoomableImage(uri)
        }
    }
}
@Composable private fun ZoomableImage(uri:Uri){
    var scale by remember{mutableFloatStateOf(1f)}; var offsetX by remember{mutableFloatStateOf(0f)}; var offsetY by remember{mutableFloatStateOf(0f)}
    AsyncImage(model=uri,contentDescription=null,modifier=Modifier.fillMaxSize()
        .graphicsLayer{scaleX=scale;scaleY=scale;translationX=offsetX;translationY=offsetY}
        .pointerInput(Unit){detectTapGestures(onDoubleTap={scale=if(scale>1f)1f else 2.5f})}
        .pointerInput(Unit){detectTransformGestures{_,pan,zoom,_ -> scale=(scale*zoom).coerceIn(1f,5f);offsetX+=pan.x;offsetY+=pan.y}})
}
@Composable private fun VideoPlayer(uri:Uri){
    val context=androidx.compose.ui.platform.LocalContext.current
    val player=remember{ExoPlayer.Builder(context).build().apply{setMediaItem(MediaItem.fromUri(uri));prepare();playWhenReady=false}}
    DisposableEffect(Unit){onDispose{player.release()}}
    AndroidView(factory={PlayerView(it).apply{this.player=player;layoutParams=ViewGroup.LayoutParams(-1,-1)}},Modifier.fillMaxSize())
}
