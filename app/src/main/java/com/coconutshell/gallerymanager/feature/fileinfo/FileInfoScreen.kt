package com.coconutshell.gallerymanager.feature.fileinfo

import android.net.Uri
import android.provider.OpenableColumns
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

@Composable
fun FileInfoScreen(uriString:String,onBack:()->Unit){
    val context=LocalContext.current; val uri=Uri.parse(uriString)
    var name by remember{mutableStateOf(uri.lastPathSegment ?: "Media")}; var size by remember{mutableStateOf("Unknown")}
    LaunchedEffect(uri){context.contentResolver.query(uri,arrayOf(OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE),null,null,null)?.use{c->if(c.moveToFirst()){name=c.getString(0)?:name;val s=c.getLong(1);size=if(s>=0) "${s/1024} KB" else "Unknown"}}}
    Scaffold(topBar={TopAppBar(title={Text("File Info")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        Column(Modifier.fillMaxSize().padding(pad).padding(20.dp),verticalArrangement=Arrangement.spacedBy(14.dp)){
            Text(name,style=MaterialTheme.typography.headlineSmall);Text("Size: $size");Text("URI: $uri",color=MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
