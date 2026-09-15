package com.coconutshell.gallerymanager

import android.app.Application
import com.coconutshell.gallerymanager.di.AppContainer

class GalleryManagerApplication : Application() {
    val container: AppContainer by lazy { AppContainer(this) }
}
