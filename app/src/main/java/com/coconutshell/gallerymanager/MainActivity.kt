package com.coconutshell.gallerymanager

import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import androidx.activity.compose.setContent
import com.coconutshell.gallerymanager.shared.navigation.AppNavHost
import com.coconutshell.gallerymanager.shared.ui.theme.GalleryManagerTheme

class MainActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val start = when (intent?.action) {
            android.content.Intent.ACTION_SEND, android.content.Intent.ACTION_SEND_MULTIPLE -> "import"
            else -> "home"
        }
        setContent { GalleryManagerTheme { AppNavHost(startDestination = start) } }
    }
}
