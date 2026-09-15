package com.coconutshell.gallerymanager.core.preferences

data class GalleryPreferences(
    val gridColumns: Int = 3,
    val defaultSort: String = "NEWEST",
    val autoScan: Boolean = false,
    val trashRetentionDays: Int = 30,
    val biometricUnlockEnabled: Boolean = true,
    val theme: String = "SYSTEM"
)
