package com.coconutshell.gallerymanager.core.database.dao
import androidx.room.*
import com.coconutshell.gallerymanager.core.database.entity.CompositionProjectEntity
import kotlinx.coroutines.flow.Flow
@Dao interface CompositionProjectDao {
    @Query("SELECT * FROM composition_projects ORDER BY updatedAtEpochMillis DESC")
    fun observeAll():Flow<List<CompositionProjectEntity>>
    @Insert suspend fun insert(item:CompositionProjectEntity):Long
    @Update suspend fun update(item:CompositionProjectEntity)
    @Delete suspend fun delete(item:CompositionProjectEntity)
}
