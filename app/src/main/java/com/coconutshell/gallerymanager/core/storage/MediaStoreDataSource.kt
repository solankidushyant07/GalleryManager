package com.coconutshell.gallerymanager.core.storage

import android.content.ContentResolver
import android.content.ContentUris
import android.os.Build
import android.provider.MediaStore
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import com.coconutshell.gallerymanager.core.database.entity.FolderRecordEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MediaStoreDataSource(private val resolver: ContentResolver) {
    suspend fun scan(): Pair<List<FileRecordEntity>, List<FolderRecordEntity>> = withContext(Dispatchers.IO) {
        val files=mutableListOf<FileRecordEntity>()
        val folders=linkedMapOf<Long,MutableList<FileRecordEntity>>()
        val folderNames=mutableMapOf<Long,String>()
        val projection=buildList{
            add(MediaStore.Files.FileColumns._ID);add(MediaStore.Files.FileColumns.DISPLAY_NAME)
            add(MediaStore.Files.FileColumns.MIME_TYPE);add(MediaStore.Files.FileColumns.SIZE)
            add(MediaStore.Files.FileColumns.DATE_MODIFIED);add(MediaStore.Files.FileColumns.WIDTH)
            add(MediaStore.Files.FileColumns.HEIGHT);add(MediaStore.Files.FileColumns.BUCKET_ID)
            add(MediaStore.Files.FileColumns.BUCKET_DISPLAY_NAME)
            if(Build.VERSION.SDK_INT>=29)add(MediaStore.MediaColumns.RELATIVE_PATH)
        }.toTypedArray()
        val collection=MediaStore.Files.getContentUri("external")
        val selectionParts=mutableListOf("${MediaStore.Files.FileColumns.MEDIA_TYPE} IN (?, ?)")
        val args=mutableListOf(
            MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE.toString(),
            MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO.toString()
        )
        if(Build.VERSION.SDK_INT>=30){selectionParts+="(${MediaStore.MediaColumns.IS_TRASHED}=0 OR ${MediaStore.MediaColumns.IS_TRASHED} IS NULL)"}
        if(Build.VERSION.SDK_INT>=29){selectionParts+="(${MediaStore.MediaColumns.IS_PENDING}=0 OR ${MediaStore.MediaColumns.IS_PENDING} IS NULL)"}
        resolver.query(collection,projection,selectionParts.joinToString(" AND "),args.toTypedArray(),"${MediaStore.Files.FileColumns.DATE_MODIFIED} DESC")?.use{cursor->
            val id=cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns._ID)
            val name=cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DISPLAY_NAME)
            val mime=cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.MIME_TYPE)
            val size=cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.SIZE)
            val modified=cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATE_MODIFIED)
            val width=cursor.getColumnIndex(MediaStore.Files.FileColumns.WIDTH)
            val height=cursor.getColumnIndex(MediaStore.Files.FileColumns.HEIGHT)
            val bucketId=cursor.getColumnIndex(MediaStore.Files.FileColumns.BUCKET_ID)
            val bucketName=cursor.getColumnIndex(MediaStore.Files.FileColumns.BUCKET_DISPLAY_NAME)
            val relative=if(Build.VERSION.SDK_INT>=29)cursor.getColumnIndex(MediaStore.MediaColumns.RELATIVE_PATH) else -1
            if(cursor.moveToFirst()) do {
                val mediaId=cursor.getLong(id); val mediaMime=cursor.getString(mime).orEmpty()
                if(mediaMime.startsWith("image/")||mediaMime.startsWith("video/")){
                    val uri=ContentUris.withAppendedId(collection,mediaId).toString()
                    val folder=if(bucketId>=0&&!cursor.isNull(bucketId))cursor.getLong(bucketId) else (relative.takeIf{it>=0&&!cursor.isNull(it)}?.let{cursor.getString(it)}?.hashCode()?.toLong() ?: -1L)
                    val item=FileRecordEntity(mediaId,uri,cursor.getString(name).orEmpty(),mediaMime,cursor.getLong(size),
                        width.takeIf{it>=0&&!cursor.isNull(it)}?.let(cursor::getInt),
                        height.takeIf{it>=0&&!cursor.isNull(it)}?.let(cursor::getInt),
                        cursor.getLong(modified),folder.takeIf{it>=0},mediaMime.startsWith("video/"))
                    files+=item
                    if(folder>=0){
                        folders.getOrPut(folder){mutableListOf()}.add(item)
                        val human=if(bucketName>=0&&!cursor.isNull(bucketName))cursor.getString(bucketName) else relative.takeIf{it>=0&&!cursor.isNull(it)}?.let{cursor.getString(it)?.trimEnd('/')?.substringAfterLast('/')}
                        if(!human.isNullOrBlank()) folderNames[folder]=human
                    }
                }
            } while(cursor.moveToNext())
        }
        val entities=folders.map{(id,items)->
            val rel=if(Build.VERSION.SDK_INT>=29)resolver.query(UriFor(items.first()),arrayOf(MediaStore.MediaColumns.RELATIVE_PATH),null,null,null)?.use{c->if(c.moveToFirst())c.getString(0)else null}else null
            FolderRecordEntity(id,rel ?: folderNames[id] ?: "Folder $id",folderNames[id] ?: "Folder $id",items.size,items.first().uri,false)
        }
        files to entities
    }

    private fun UriFor(item:FileRecordEntity)=android.net.Uri.parse(item.uri)
}
