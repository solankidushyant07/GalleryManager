package com.coconutshell.gallerymanager.core.preferences

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class PreferencesRepository(context: Context) {
    private val prefs = context.getSharedPreferences("gallery_preferences", Context.MODE_PRIVATE)
    private val _state = MutableStateFlow(read())
    val state: StateFlow<GalleryPreferences> = _state
    fun update(transform: (GalleryPreferences) -> GalleryPreferences) {
        val next = transform(_state.value)
        prefs.edit()
            .putInt("grid", next.gridColumns)
            .putString("sort", next.defaultSort)
            .putBoolean("autoScan", next.autoScan)
            .putInt("trashDays", next.trashRetentionDays)
            .putBoolean("biometric", next.biometricUnlockEnabled)
            .putString("theme", next.theme).apply()
        _state.value = next
    }
    private fun read() = GalleryPreferences(
        gridColumns=prefs.getInt("grid",3),
        defaultSort=prefs.getString("sort","NEWEST") ?: "NEWEST",
        autoScan=prefs.getBoolean("autoScan",false),
        trashRetentionDays=prefs.getInt("trashDays",30),
        biometricUnlockEnabled=prefs.getBoolean("biometric",true),
        theme=prefs.getString("theme","SYSTEM") ?: "SYSTEM"
    )
}
