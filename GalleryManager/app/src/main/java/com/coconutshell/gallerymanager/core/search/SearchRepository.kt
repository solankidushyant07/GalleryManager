package com.coconutshell.gallerymanager.core.search

import com.coconutshell.gallerymanager.core.database.dao.FileDao
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class SearchRepository(private val fileDao: FileDao) {
    suspend fun search(query: String): List<FileRecordEntity> = withContext(Dispatchers.IO) {
        val q = query.trim()
        if (q.isBlank()) emptyList() else fileDao.search(q)
    }
}
