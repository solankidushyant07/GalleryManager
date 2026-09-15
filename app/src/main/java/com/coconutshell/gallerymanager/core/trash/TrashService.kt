package com.coconutshell.gallerymanager.core.trash

import android.content.ContentResolver
import android.content.ContentValues
import android.net.Uri
import android.provider.MediaStore
import com.coconutshell.gallerymanager.core.database.dao.TrashDao
import com.coconutshell.gallerymanager.core.database.entity.TrashEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.io.File

class TrashService(
    private val resolver: ContentResolver,
    private val dao: TrashDao,
    private val trashDir: File
) {
    fun observe(): Flow<List<TrashEntity>> = dao.observeAll()

    suspend fun moveToTrash(item: TrashCandidate): Result<Long> = withContext(Dispatchers.IO) {
        runCatching {
            trashDir.mkdirs()
            val backup = File(trashDir, "${java.util.UUID.randomUUID()}.bin")
            resolver.openInputStream(Uri.parse(item.uri)).use { input ->
                requireNotNull(input) { "Unable to read media." }
                backup.outputStream().use { output -> input.copyTo(output) }
            }
            resolver.delete(Uri.parse(item.uri), null, null)
            val entity = TrashEntity(
                originalUri = item.uri,
                originalName = item.name,
                mimeType = item.mimeType,
                originalRelativePath = item.relativePath,
                backupPath = backup.absolutePath,
                sizeBytes = item.sizeBytes,
                deletedAtEpochMillis = System.currentTimeMillis()
            )
            dao.upsert(entity)
            entity.id
        }
    }

    suspend fun permanentlyDelete(id: Long): Result<Unit> = withContext(Dispatchers.IO) {
        runCatching {
            dao.getAllOnce().firstOrNull { it.id == id }?.let {
                File(it.backupPath).delete()
                dao.delete(id)
            }
            Unit
        }
    }

    suspend fun purgeExpired(retentionDays: Int = 30) = withContext(Dispatchers.IO) {
        val cutoff = System.currentTimeMillis() - retentionDays * 86_400_000L
        dao.getAllOnce().filter { it.deletedAtEpochMillis < cutoff }.forEach {
            File(it.backupPath).delete()
        }
        dao.deleteOlderThan(cutoff)
    }

    suspend fun restore(id: Long): Result<String> = withContext(Dispatchers.IO) {
        runCatching {
            val item = dao.getAllOnce().firstOrNull { it.id == id }
                ?: error("Trash item not found.")
            val collection =
                if (item.mimeType.startsWith("video/")) MediaStore.Video.Media.EXTERNAL_CONTENT_URI
                else MediaStore.Images.Media.EXTERNAL_CONTENT_URI

            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, item.originalName)
                put(MediaStore.MediaColumns.MIME_TYPE, item.mimeType)
                if (android.os.Build.VERSION.SDK_INT >= 29 && item.originalRelativePath != null) {
                    put(MediaStore.MediaColumns.RELATIVE_PATH, item.originalRelativePath)
                }
                if (android.os.Build.VERSION.SDK_INT >= 29) {
                    put(MediaStore.MediaColumns.IS_PENDING, 1)
                }
            }

            val uri = resolver.insert(collection, values)
                ?: error("Unable to recreate media.")

            try {
                File(item.backupPath).inputStream().use { input ->
                    resolver.openOutputStream(uri)?.use { output -> input.copyTo(output) }
                        ?: error("Unable to write restored media.")
                }
                if (android.os.Build.VERSION.SDK_INT >= 29) {
                    resolver.update(
                        uri,
                        ContentValues().apply {
                            put(MediaStore.MediaColumns.IS_PENDING, 0)
                        },
                        null,
                        null
                    )
                }
                File(item.backupPath).delete()
                dao.delete(id)
                uri.toString()
            } catch (t: Throwable) {
                resolver.delete(uri, null, null)
                throw t
            }
        }
    }
}

data class TrashCandidate(
    val uri: String,
    val name: String,
    val mimeType: String,
    val relativePath: String?,
    val sizeBytes: Long
)
