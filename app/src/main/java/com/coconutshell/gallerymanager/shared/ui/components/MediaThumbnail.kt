package com.coconutshell.gallerymanager.shared.ui.components

import android.net.Uri
import androidx.compose.foundation.background
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
fun MediaThumbnail(uri: String, modifier: Modifier = Modifier, isVideo: Boolean = false) {
    Box(modifier = modifier.clip(RoundedCornerShape(14.dp))) {
        AsyncImage(
            model = Uri.parse(uri),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        if (isVideo) {
            Icon(
                Icons.Rounded.PlayArrow,
                contentDescription = "Video",
                modifier = Modifier.align(Alignment.BottomEnd)
                    .background(MaterialTheme.colorScheme.surface.copy(alpha = .72f), RoundedCornerShape(12.dp))
            )
        }
    }
}
