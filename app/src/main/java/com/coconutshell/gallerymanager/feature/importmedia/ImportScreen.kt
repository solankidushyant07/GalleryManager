package com.coconutshell.gallerymanager.feature.importmedia

import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.coconutshell.gallerymanager.GalleryManagerApplication
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Composable
fun ImportScreen(onDone:()->Unit){
    val context=LocalContext.current
    val app=context.applicationContext as GalleryManagerApplication
    val intent=(context as? android.app.Activity)?.intent
    val uris=remember(intent){mutableListOf<Uri>().apply{
        intent?.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)?.let(::add)
        intent?.getParcelableArrayListExtra<Uri>(Intent.EXTRA_STREAM)?.let{addAll(it)}
    }.distinct()}
    var message by remember{mutableStateOf(if(uris.isEmpty())"No shared media found." else "${uris.size} item(s) ready to import.")}
    var importing by remember{mutableStateOf(false)}
    Scaffold(topBar={TopAppBar(title={Text("Import")},navigationIcon={IconButton(onDone){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        Column(Modifier.fillMaxSize().padding(pad).padding(20.dp),verticalArrangement=Arrangement.spacedBy(16.dp)){
            Text(message,style=MaterialTheme.typography.titleLarge)
            Text("Gallery Manager will copy shared images/videos into public MediaStore storage and preserve their original names.",color=MaterialTheme.colorScheme.onSurfaceVariant)
            Button(onClick={
                importing=true
            },enabled=uris.isNotEmpty()&&!importing){Text(if(importing)"Importing…" else "Import")}
        }
    }
    LaunchedEffect(importing){
        if(importing){
            val result=withContext(Dispatchers.IO){
                uris.count{uri->
                    runCatching{
                        val mime=context.contentResolver.getType(uri) ?: "image/*"
                        val name=context.contentResolver.query(uri,arrayOf(MediaStore.MediaColumns.DISPLAY_NAME),null,null,null)?.use{c->if(c.moveToFirst())c.getString(0) else null} ?: "Imported_${System.currentTimeMillis()}"
                        val collection=if(mime.startsWith("video/"))MediaStore.Video.Media.EXTERNAL_CONTENT_URI else MediaStore.Images.Media.EXTERNAL_CONTENT_URI
                        val values=android.content.ContentValues().apply{
                            put(MediaStore.MediaColumns.DISPLAY_NAME,name);put(MediaStore.MediaColumns.MIME_TYPE,mime)
                            if(android.os.Build.VERSION.SDK_INT>=29)put(MediaStore.MediaColumns.IS_PENDING,1)
                        }
                        val target=context.contentResolver.insert(collection,values) ?: error("insert")
                        context.contentResolver.openInputStream(uri).use{input->context.contentResolver.openOutputStream(target).use{out->requireNotNull(input);requireNotNull(out);input.copyTo(out)}}
                        if(android.os.Build.VERSION.SDK_INT>=29)context.contentResolver.update(target,android.content.ContentValues().apply{put(MediaStore.MediaColumns.IS_PENDING,0)},null,null)
                    }.isSuccess
                }
            }
            message="$result of ${uris.size} item(s) imported."
            importing=false
            app.container.storageScanner.refresh()
        }
    }
}
