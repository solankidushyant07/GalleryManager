package com.coconutshell.gallerymanager.core.fileoperations

import android.content.ContentResolver
import android.content.ContentUris
import android.content.ContentValues
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException
import java.util.UUID

class FileOperationService(
    private val resolver: ContentResolver,
    private val undoStore: UndoStore
) {
    suspend fun rename(uri: Uri, newName: String): FileOperationResult = withContext(Dispatchers.IO) {
        try {
            val oldName = queryName(uri)
            require(newName.isNotBlank()) { "Name cannot be empty." }
            val values = ContentValues().apply { put(MediaStore.MediaColumns.DISPLAY_NAME, newName.trim()) }
            if (resolver.update(uri, values, null, null) == 0) return@withContext FileOperationResult.Failure("The media item no longer exists.")
            val token = undoStore.save {
                resolver.update(uri, ContentValues().apply { put(MediaStore.MediaColumns.DISPLAY_NAME, oldName) }, null, null)
            }
            FileOperationResult.Success(listOf(uri.toString()), token)
        } catch (t: Throwable) { FileOperationResult.Failure("Unable to rename media.", t) }
    }

    suspend fun copy(
        source: Uri,
        displayName: String,
        mimeType: String,
        relativePath: String?,
        conflictAction: FileConflictAction
    ): FileOperationResult = withContext(Dispatchers.IO) {
        try {
            val existing = findExisting(displayName, mimeType, relativePath)
            val finalName = when {
                existing == null -> displayName
                conflictAction == FileConflictAction.SKIP -> return@withContext FileOperationResult.Success(emptyList(), null)
                conflictAction == FileConflictAction.REPLACE -> {
                    resolver.delete(existing, null, null)
                    displayName
                }
                else -> uniqueName(displayName, mimeType, relativePath)
            }
            val target = insertTarget(finalName, mimeType, relativePath)
            try {
                resolver.openInputStream(source)?.use { input ->
                    resolver.openOutputStream(target)?.use { output -> input.copyTo(output) }
                        ?: throw IOException("Unable to open destination.")
                } ?: throw IOException("Unable to read source.")
                publish(target)
            } catch (t: Throwable) {
                resolver.delete(target, null, null)
                throw t
            }
            val token = undoStore.save { resolver.delete(target, null, null) }
            FileOperationResult.Success(listOf(target.toString()), token)
        } catch (t: Throwable) { FileOperationResult.Failure("Unable to copy media.", t) }
    }

    suspend fun move(
        source: Uri,
        displayName: String,
        mimeType: String,
        relativePath: String?,
        conflictAction: FileConflictAction
    ): FileOperationResult = withContext(Dispatchers.IO) {
        try {
            val originalPath = queryRelativePath(source)
            val existing = findExisting(displayName, mimeType, relativePath)
            val finalName = when {
                existing == null -> displayName
                conflictAction == FileConflictAction.SKIP -> return@withContext FileOperationResult.Success(emptyList(), null)
                conflictAction == FileConflictAction.REPLACE -> { resolver.delete(existing, null, null); displayName }
                else -> uniqueName(displayName, mimeType, relativePath)
            }
            val target = insertTarget(finalName, mimeType, relativePath)
            try {
                resolver.openInputStream(source)?.use { input ->
                    resolver.openOutputStream(target)?.use { output -> input.copyTo(output) }
                        ?: throw IOException("Unable to open destination.")
                } ?: throw IOException("Unable to read source.")
                publish(target)
                if (resolver.delete(source, null, null) == 0) throw IOException("Unable to remove the original after copy.")
            } catch (t: Throwable) {
                resolver.delete(target, null, null)
                throw t
            }
            val token = undoStore.save {
                val restored = insertTarget(displayName, mimeType, originalPath)
                try {
                    resolver.openInputStream(target)?.use { input ->
                        resolver.openOutputStream(restored)?.use { output -> input.copyTo(output) }
                            ?: throw IOException("Unable to restore original.")
                    } ?: throw IOException("Unable to read moved media.")
                    publish(restored)
                    resolver.delete(target, null, null)
                } catch (t: Throwable) {
                    resolver.delete(restored, null, null)
                    throw t
                }
            }
            FileOperationResult.Success(listOf(target.toString()), token)
        } catch (t: Throwable) { FileOperationResult.Failure("Unable to move media.", t) }
    }

    private fun insertTarget(name: String, mimeType: String, relativePath: String?): Uri {
        val collection = if (mimeType.startsWith("video/")) MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        else MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
            if (Build.VERSION.SDK_INT >= 29 && relativePath != null) put(MediaStore.MediaColumns.RELATIVE_PATH, relativePath)
            if (Build.VERSION.SDK_INT >= 29) put(MediaStore.MediaColumns.IS_PENDING, 1)
        }
        return resolver.insert(collection, values) ?: error("Unable to create destination media.")
    }

    private fun publish(uri: Uri) {
        if (Build.VERSION.SDK_INT >= 29)
            resolver.update(uri, ContentValues().apply { put(MediaStore.MediaColumns.IS_PENDING, 0) }, null, null)
    }

    private fun queryRelativePath(uri: Uri): String? =
        if (Build.VERSION.SDK_INT >= 29) resolver.query(uri, arrayOf(MediaStore.MediaColumns.RELATIVE_PATH), null, null, null)?.use {
            if (it.moveToFirst()) it.getString(0) else null
        } else null

    private fun queryName(uri: Uri): String =
        resolver.query(uri, arrayOf(MediaStore.MediaColumns.DISPLAY_NAME), null, null, null)?.use {
            if (it.moveToFirst()) it.getString(0) else "media"
        } ?: "media"

    private fun findExisting(name: String, mimeType: String, relativePath: String?): Uri? {
        val collection = if (mimeType.startsWith("video/")) MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        else MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        val projection = arrayOf(MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DISPLAY_NAME)
        val selection = buildString {
            append("${MediaStore.MediaColumns.DISPLAY_NAME}=?")
            if (Build.VERSION.SDK_INT >= 29 && relativePath != null) append(" AND ${MediaStore.MediaColumns.RELATIVE_PATH}=?")
        }
        val args = if (Build.VERSION.SDK_INT >= 29 && relativePath != null) arrayOf(name, relativePath) else arrayOf(name)
        return resolver.query(collection, projection, selection, args, null)?.use { c ->
            if (c.moveToFirst()) ContentUris.withAppendedId(collection, c.getLong(0)) else null
        }
    }

    private fun uniqueName(name: String, mimeType: String, relativePath: String?): String {
        val dot = name.lastIndexOf('.')
        val stem = if (dot > 0) name.substring(0,dot) else name
        val ext = if (dot > 0) name.substring(dot) else ""
        var i=1
        var candidate=name
        while(findExisting(candidate,mimeType,relativePath)!=null) candidate="${stem} (${i++})$ext"
        return candidate
    }
}

data class TrashMetadata(val originalUri: String, val originalName: String, val mimeType: String, val relativePath: String?, val sizeBytes: Long)
interface UndoStore { suspend fun save(action: suspend () -> Unit): UndoToken }
