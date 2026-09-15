package com.coconutshell.gallerymanager.core.fileoperations

sealed interface FileOperationResult {
    data class Success(val affectedUris: List<String>, val undo: UndoToken?) : FileOperationResult
    data class NeedsConflict(val conflicts: List<FileConflict>) : FileOperationResult
    data class Failure(val message: String, val cause: Throwable? = null) : FileOperationResult
}
data class FileConflict(val sourceUri: String, val targetName: String, val targetCollection: String)
data class UndoToken(val id: String)
