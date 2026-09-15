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
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.coconutshell.gallerymanager.GalleryManagerApplication
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CompositionScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val app = context.applicationContext as GalleryManagerApplication
    val scope = rememberCoroutineScope()

    var sources by remember { mutableStateOf<List<Uri>>(emptyList()) }
    var layout by remember { mutableIntStateOf(2) }
    var name by remember { mutableStateOf("Composition") }
    var status by remember { mutableStateOf("") }

    val picker = rememberLauncherForActivityResult(
        ActivityResultContracts.GetMultipleContents()
    ) { picked ->
        sources = picked.take(9)
        if (sources.size < 2) status = "Choose at least 2 photos."
        else status = ""
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
                    ) { Text("Save project") }
                }
            )
        }
    ) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(16.dp),
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
                OutlinedButton(onClick = { layout = (layout % 9) + 2 }) {
                    Text("Layout: $layout")
                }
            }
            if (status.isNotBlank()) {
                Text(status, color = MaterialTheme.colorScheme.primary)
            }
            CompositionPreview(sources, layout, Modifier.fillMaxWidth().aspectRatio(1f))
            Button(
                enabled = sources.size >= 2,
                onClick = {
                    scope.launch {
                        val result = app.container.compositionService.export(
                            context, sources, layout, name
                        )
                        status = if (result != null) "Exported to Photos." else "Export failed."
                        app.container.storageScanner.refresh()
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Export flattened image") }
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
    val bitmaps by produceState<List<Bitmap>>(emptyList(), sources) {
        value = withContext(Dispatchers.IO) {
            sources.mapNotNull {
                context.contentResolver.openInputStream(it)?.use(BitmapFactory::decodeStream)
            }
        }
    }

    Box(modifier) {
        if (bitmaps.isNotEmpty()) {
            Canvas(Modifier.fillMaxSize()) {
                val count = layout.coerceIn(2, 9)
                val cols = if (count <= 2) 2 else 3
                val rows = (count + cols - 1) / cols
                val cw = size.width / cols
                val ch = size.height / rows

                bitmaps.take(count).forEachIndexed { index, bitmap ->
                    val left = (index % cols) * cw
                    val top = (index / cols) * ch
                    drawImage(
                        bitmap.asImageBitmap(),
                        dstSize = IntSize(cw.toInt(), ch.toInt()),
                        dstOffset = IntOffset(left.toInt(), top.toInt())
                    )
                }
            }
        }
    }
}
