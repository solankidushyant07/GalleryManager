package com.coconutshell.gallerymanager.feature.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.preferences.GalleryPreferences
import com.coconutshell.gallerymanager.core.preferences.PreferencesRepository

@Composable
fun SettingsScreen(onBack:()->Unit){
    val app=LocalContext.current.applicationContext as GalleryManagerApplication
    val repo=app.container.preferences
    val prefs by repo.state.collectAsStateWithLifecycle()
    var grid by remember(prefs.gridColumns){mutableIntStateOf(prefs.gridColumns)}
    Scaffold(topBar={TopAppBar(title={Text("Settings")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        Column(Modifier.fillMaxSize().padding(pad).padding(20.dp),verticalArrangement=Arrangement.spacedBy(18.dp)){
            Text("Appearance",style=MaterialTheme.typography.titleLarge)
            Text("Grid columns: $grid")
            Slider(grid.toFloat(),{grid=it.toInt().coerceIn(2,5);repo.update{it.copy(gridColumns=grid)}},valueRange=2f..5f,steps=2)
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.SpaceBetween){Text("Auto scan");Switch(prefs.autoScan,{repo.update{it.copy(autoScan=!prefs.autoScan)}})}
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.SpaceBetween){Text("Biometric unlock");Switch(prefs.biometricUnlockEnabled,{repo.update{it.copy(biometricUnlockEnabled=!prefs.biometricUnlockEnabled)}})}
            Text("Default sort: Newest first",color=MaterialTheme.colorScheme.onSurfaceVariant)
            Text("Trash retention: 30 days",color=MaterialTheme.colorScheme.onSurfaceVariant)
            Text("Theme: System",color=MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
