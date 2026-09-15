package com.coconutshell.gallerymanager.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.coconutshell.gallerymanager.core.database.dao.*
import com.coconutshell.gallerymanager.core.database.entity.*

@Database(
    entities = [
        FileRecordEntity::class, FolderRecordEntity::class, AlbumEntity::class,
        AlbumMembershipEntity::class, FavoriteEntity::class, TrashEntity::class,
        PrivateMediaEntity::class, FolderPreferenceEntity::class, CompositionProjectEntity::class
    ],
    version = 4,
    exportSchema = false
)
abstract class GalleryDatabase : RoomDatabase() {
    abstract fun fileDao(): FileDao
    abstract fun folderDao(): FolderDao
    abstract fun albumDao(): AlbumDao
    abstract fun albumMembershipDao(): AlbumMembershipDao
    abstract fun favoriteDao(): FavoriteDao
    abstract fun trashDao(): TrashDao
    abstract fun privateMediaDao(): PrivateMediaDao
    abstract fun folderPreferenceDao(): FolderPreferenceDao
    abstract fun compositionProjectDao(): CompositionProjectDao

    companion object {
        private val MIGRATION_1_2 = object : Migration(1,2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("CREATE TABLE IF NOT EXISTS album_memberships (albumId INTEGER NOT NULL, mediaId INTEGER NOT NULL, PRIMARY KEY(albumId,mediaId), FOREIGN KEY(albumId) REFERENCES albums(id) ON DELETE CASCADE)")
                db.execSQL("CREATE INDEX IF NOT EXISTS index_album_memberships_mediaId ON album_memberships(mediaId)")
            }
        }
        private val MIGRATION_3_4 = object : Migration(3,4) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("CREATE TABLE IF NOT EXISTS composition_projects (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, sourceUris TEXT NOT NULL, layout INTEGER NOT NULL, createdAtEpochMillis INTEGER NOT NULL, updatedAtEpochMillis INTEGER NOT NULL)")
            }
        }
        private val MIGRATION_2_3 = object : Migration(2,3) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("CREATE TABLE IF NOT EXISTS favorites (mediaId INTEGER NOT NULL PRIMARY KEY)")
                db.execSQL("CREATE TABLE IF NOT EXISTS trash (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, originalUri TEXT NOT NULL, originalName TEXT NOT NULL, mimeType TEXT NOT NULL, originalRelativePath TEXT, backupPath TEXT NOT NULL, sizeBytes INTEGER NOT NULL, deletedAtEpochMillis INTEGER NOT NULL)")
                db.execSQL("CREATE TABLE IF NOT EXISTS private_media (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, displayName TEXT NOT NULL, mimeType TEXT NOT NULL, encryptedPath TEXT NOT NULL, sizeBytes INTEGER NOT NULL, createdAtEpochMillis INTEGER NOT NULL)")
                db.execSQL("CREATE TABLE IF NOT EXISTS folder_preferences (folderId INTEGER NOT NULL PRIMARY KEY, isPinned INTEGER NOT NULL)")
            }
        }
        fun create(context: Context): GalleryDatabase =
            Room.databaseBuilder(context, GalleryDatabase::class.java, "gallery_manager.db")
                .addMigrations(MIGRATION_1_2, MIGRATION_2_3, MIGRATION_3_4)
                .build()
    }
}
