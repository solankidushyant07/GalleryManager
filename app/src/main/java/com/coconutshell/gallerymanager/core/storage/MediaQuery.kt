package com.coconutshell.gallerymanager.core.storage

import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity

enum class MediaSort { NEWEST, OLDEST, NAME, SIZE, TYPE }
fun List<FileRecordEntity>.sortedAs(sort: MediaSort): List<FileRecordEntity> = when(sort) {
    MediaSort.NEWEST -> sortedByDescending { it.dateModifiedEpochSeconds }
    MediaSort.OLDEST -> sortedBy { it.dateModifiedEpochSeconds }
    MediaSort.NAME -> sortedBy { it.name.lowercase() }
    MediaSort.SIZE -> sortedByDescending { it.sizeBytes }
    MediaSort.TYPE -> sortedWith(compareBy<FileRecordEntity> { it.mimeType }.thenBy { it.name.lowercase() })
}
