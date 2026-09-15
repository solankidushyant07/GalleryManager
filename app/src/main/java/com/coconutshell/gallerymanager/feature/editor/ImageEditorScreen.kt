package com.coconutshell.gallerymanager.feature.editor

import android.graphics.*
import android.net.Uri
import android.provider.MediaStore
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ImageEditorScreen(uriString: String, onBack: () -> Unit) {
    val context = LocalContext.current
    val uri = remember(uriString) { Uri.parse(uriString) }

    var bitmap by remember { mutableStateOf<Bitmap?>(null) }
    var rotation by remember { mutableFloatStateOf(0f) }
    var brightness by remember { mutableFloatStateOf(0f) }
    var contrast by remember { mutableFloatStateOf(1f) }
    var saturation by remember { mutableFloatStateOf(1f) }

    LaunchedEffect(uri) {
        bitmap = withContext(Dispatchers.IO) {
            context.contentResolver.openInputStream(uri)?.use(BitmapFactory::decodeStream)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Rounded.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(
                        onClick = {
                            val source = bitmap ?: return@TextButton
                            val edited = applyAdjustments(
                                source, rotation, brightness, contrast, saturation
                            )
                            exportCopy(
                                context,
                                edited,
                                "Edited_${System.currentTimeMillis()}.jpg"
                            )
                        }
                    ) { Text("Save copy") }
                }
            )
        }
    ) { pad ->
        Column(
            Modifier.fillMaxSize().padding(pad).padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            bitmap?.let {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = "Image preview",
                    modifier = Modifier.fillMaxWidth().weight(1f)
                )
            }

            Text("Brightness")
            Slider(
                value = brightness,
                onValueChange = { brightness = it },
                valueRange = -1f..1f
            )

            Text("Contrast")
            Slider(
                value = contrast,
                onValueChange = { contrast = it },
                valueRange = 0.5f..1.8f
            )

            Text("Saturation")
            Slider(
                value = saturation,
                onValueChange = { saturation = it },
                valueRange = 0f..2f
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { rotation = (rotation + 90f) % 360f }) {
                    Text("Rotate")
                }
                Button(onClick = { rotation = (rotation + 180f) % 360f }) {
                    Text("Flip/Rotate")
                }
            }
        }
    }
}

private fun applyAdjustments(
    src: Bitmap,
    rotation: Float,
    brightness: Float,
    contrast: Float,
    saturation: Float
): Bitmap {
    val matrix = ColorMatrix().apply {
        setSaturation(saturation)
        val b = brightness * 255f
        val c = contrast
        val t = (1f - c) * 128f
        postConcat(
            ColorMatrix(
                floatArrayOf(
                    c, 0f, 0f, 0f, b + t,
                    0f, c, 0f, 0f, b + t,
                    0f, 0f, c, 0f, b + t,
                    0f, 0f, 0f, 1f, 0f
                )
            )
        )
    }

    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        colorFilter = ColorMatrixColorFilter(matrix)
    }

    val rotated = Bitmap.createBitmap(
        src, 0, 0, src.width, src.height,
        Matrix().apply { postRotate(rotation) },
        true
    )

    return Bitmap.createBitmap(
        rotated, 0, 0, rotated.width, rotated.height, Matrix(), true
    ).also { output ->
        Canvas(output).drawBitmap(rotated, 0f, 0f, paint)
    }
}

private fun exportCopy(context: android.content.Context, bitmap: Bitmap, name: String) {
    val values = android.content.ContentValues().apply {
        put(MediaStore.Images.Media.DISPLAY_NAME, name)
        put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
        if (android.os.Build.VERSION.SDK_INT >= 29) {
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }
    }

    val uri = context.contentResolver.insert(
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
        values
    ) ?: return

    try {
        context.contentResolver.openOutputStream(uri)?.use {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 95, it)
        } ?: error("Unable to open output stream")

        if (android.os.Build.VERSION.SDK_INT >= 29) {
            context.contentResolver.update(
                uri,
                android.content.ContentValues().apply {
                    put(MediaStore.Images.Media.IS_PENDING, 0)
                },
                null,
                null
            )
        }
    } catch (t: Throwable) {
        context.contentResolver.delete(uri, null, null)
    }
}
