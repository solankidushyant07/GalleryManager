package com.coconutshell.gallerymanager.core.database.entity
import androidx.room.Entity
import androidx.room.PrimaryKey
@Entity(tableName="composition_projects")
data class CompositionProjectEntity(
    @PrimaryKey(autoGenerate=true) val id:Long=0,
    val name:String,
    val sourceUris:String,
    val layout:Int,
    val createdAtEpochMillis:Long,
    val updatedAtEpochMillis:Long
)
