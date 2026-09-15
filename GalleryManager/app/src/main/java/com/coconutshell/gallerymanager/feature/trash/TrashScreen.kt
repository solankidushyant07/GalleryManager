package com.coconutshell.gallerymanager.feature.trash

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.database.entity.TrashEntity

@Composable
fun TrashScreen(onBack:()->Unit){
    val app=LocalContext.current.applicationContext as GalleryManagerApplication
    val items by app.container.trashService.observe().collectAsStateWithLifecycle(emptyList())
    Scaffold(topBar={TopAppBar(title={Text("Trash")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        LazyColumn(Modifier.fillMaxSize().padding(pad),contentPadding=PaddingValues(16.dp),verticalArrangement=Arrangement.spacedBy(10.dp)){
            item{Text("Items are kept for 30 days, then permanently removed.",color=MaterialTheme.colorScheme.onSurfaceVariant)}
            items(items,key={it.id}){item->TrashRow(item,{app.container.trashService.restore(item.id)},{app.container.trashService.permanentlyDelete(item.id)})}
        }
    }
}
@Composable private fun TrashRow(item:TrashEntity,onRestore:suspend()->Unit,onDelete:suspend()->Unit){
    var action by remember{mutableStateOf<String?>(null)}
    Card(Modifier.fillMaxWidth()){Row(Modifier.fillMaxWidth().padding(14.dp),horizontalArrangement=Arrangement.SpaceBetween){
        Column(Modifier.weight(1f)){Text(item.originalName,style=MaterialTheme.typography.titleMedium);Text("Deleted ${java.util.Date(item.deletedAtEpochMillis)}",color=MaterialTheme.colorScheme.onSurfaceVariant)}
        TextButton({action="restore"}){Text("Restore")}
        TextButton({action="delete"}){Text("Delete")}
    }}
    action?.let { selected -> LaunchedEffect(selected){ if(selected=="restore") runCatching{onRestore()} else runCatching{onDelete()}; action=null } }
}
