package com.coconutshell.gallerymanager.core.fileoperations

import java.util.UUID
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

class InMemoryUndoStore : UndoStore {
    private val actions = mutableMapOf<String, suspend () -> Unit>()
    private val mutex = Mutex()
    override suspend fun save(action: suspend () -> Unit): UndoToken {
        val id = UUID.randomUUID().toString()
        mutex.withLock { actions[id] = action }
        return UndoToken(id)
    }
    suspend fun undo(token: UndoToken): Boolean = mutex.withLock {
        val action = actions.remove(token.id) ?: return@withLock false
        action()
        true
    }
}
