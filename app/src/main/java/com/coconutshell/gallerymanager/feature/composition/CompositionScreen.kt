package com.coconutshell.gallerymanager.feature.composition

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.coconutshell.gallerymanager.GalleryManagerApplication
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun CompositionScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val app = context.applicationContext as GalleryManagerApplication
    var sources by remember { mutableStateOf<List<Uri>>(emptyList()) }
    var layout by remember { mutableIntStateOf(2) }
    var name by remember { mutableStateOf("Composition") }
    var status by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    val picker = rememberLauncherForActivityResult(
        ActivityResultContracts.GetMultipleContents()
    ) { picked ->
        sources = picked.take(9)
        if (sources.size < 2) status = "Choose at least 2 photos."
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Composition") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Rounded.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(
                        enabled = sources.size >= 2,
                        onClick = {
                            scope.launch {
                                app.container.compositionService.save(name, sources, layout)
                                status = "Project saved."
                            }
                        }
                    ) {
                        Text("Save project")
                    }
                }
            )
        }
    ) { pad ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(pad)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                singleLine = true,
                label = { Text("Project name") },
                modifier = Modifier.fillMaxWidth()
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { picker.launch("image/*") }) {
                    Text(if (sources.isEmpty()) "Choose photos" else "${sources.size} photos")
                }
                OutlinedButton(onClick = { layout = (layout % 4) + 2 }) {
                    Text("Layout: $layout")
                }
            }
            if (status.isNotBlank()) {
                Text(status, color = MaterialTheme.colorScheme.primary)
            }
            CompositionPreview(
                sources = sources,
                layout = layout,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
            )
            Button(
                enabled = sources.size >= 2,
                onClick = {
                    scope.launch {
                        val out = app.container.compositionService.export(
                            context,
                            sources,
                            layout,
                            name
                        )
                        status = if (out != null) "Exported to Photos." else "Export failed."
                        app.container.storageScanner.refresh()
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Export flattened image")
            }
        }
    }
}

@Composable
private fun CompositionPreview(
    sources: List<Uri>,
    layout: Int,
    modifier: Modifier
) {
    val context = LocalContext.current
    val bitmaps by produceState<List<Bitmap>>(
        initialValue = emptyList(),
        key1 = sources
    ) {
        value = withContext(Dispatchers.IO) {
            sources.mapNotNull { uri ->
                context.contentResolver.openInputStream(uri)?.use(BitmapFactory::decodeStream)
            }
        }
    }

    Box(modifier) {
        if (bitmaps.isNotEmpty()) {
            Canvas(Modifier.fillMaxSize()) {
                val cols = if (layout <= 2) 2 else 3
                val rows = (layout + cols - 1) / cols
                val cw = size.width / cols
                val ch = size.height / rows
                bitmaps.take(layout).forEachIndexed { index, bitmap ->
                    val left = (index % cols) * cw
                    val top = (index / cols) * ch
                    drawImage(
                        bitmap.asImageBitmap(),
                        dstSize = androidx.compose.ui.unit.IntSize(cw.toInt(), ch.toInt()),
                        dstOffset = androidx.compose.ui.unit.IntOffset(left.toInt(), top.toInt())
                    )
                }
            }
        }
    }
}
