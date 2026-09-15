package com.coconutshell.gallerymanager.shared.selection

data class SelectionState(
    val selectedIds: Set<Long> = emptySet(),
    val isSelecting: Boolean = false
) {
    fun isSelected(id: Long): Boolean = id in selectedIds
    fun toggle(id: Long): SelectionState {
        val next = selectedIds.toMutableSet().apply {
            if (!add(id)) remove(id)
        }
        return copy(selectedIds = next)
    }
    fun selectAll(ids: Collection<Long>): SelectionState =
        copy(selectedIds = ids.toSet(), isSelecting = true)
    fun clear(): SelectionState = SelectionState()
}
