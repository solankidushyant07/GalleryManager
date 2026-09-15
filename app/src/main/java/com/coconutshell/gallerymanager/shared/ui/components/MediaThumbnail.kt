package com.coconutshell.gallerymanager.shared.ui.components

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage

@Composable
fun MediaThumbnail(
    uri: String,
    modifier: Modifier = Modifier,
    isVideo: Boolean = false,
    onClick: (() -> Unit)? = null
) {
    MediaThumbnailContent(Uri.parse(uri), modifier, isVideo, onClick)
}

@Composable
fun MediaThumbnail(
    uri: Uri,
    modifier: Modifier = Modifier,
    isVideo: Boolean = false,
    onClick: (() -> Unit)? = null
) {
    MediaThumbnailContent(uri, modifier, isVideo, onClick)
}

@Composable
private fun MediaThumbnailContent(
    uri: Uri,
    modifier: Modifier,
    isVideo: Boolean,
    onClick: (() -> Unit)?
) {
    val clickableModifier = if (onClick != null) {
        modifier.clickable(onClick = onClick)
    } else {
        modifier
    }

    Box(
        modifier = clickableModifier.clip(RoundedCornerShape(14.dp))
    ) {
        AsyncImage(
            model = uri,
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        if (isVideo) {
            Icon(
                Icons.Rounded.PlayArrow,
                contentDescription = "Video",
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .background(
                        MaterialTheme.colorScheme.surface.copy(alpha = .72f),
                        RoundedCornerShape(12.dp)
                    )
            )
        }
    }
}
