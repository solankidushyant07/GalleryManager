package com.coconutshell.gallerymanager.core.composition
import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.net.Uri
import android.provider.MediaStore
import com.coconutshell.gallerymanager.core.database.dao.CompositionProjectDao
import com.coconutshell.gallerymanager.core.database.entity.CompositionProjectEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.UUID
class CompositionService(private val context:Context,private val dao:CompositionProjectDao){
    suspend fun save(name:String,sources:List<Uri>,layout:Int)=withContext(Dispatchers.IO){
        val now=System.currentTimeMillis()
        dao.insert(CompositionProjectEntity(name=name.ifBlank{"Composition"},sourceUris=sources.joinToString("|"),layout=layout,createdAtEpochMillis=now,updatedAtEpochMillis=now))
    }
    suspend fun export(context:Context,sources:List<Uri>,layout:Int,name:String):Uri?=withContext(Dispatchers.IO){
        val bitmaps=sources.take(9).mapNotNull{context.contentResolver.openInputStream(it)?.use(BitmapFactory::decodeStream)}
        if(bitmaps.size<2)return@withContext null
        val out=Bitmap.createBitmap(1600,1600,Bitmap.Config.ARGB_8888);val canvas=Canvas(out);canvas.drawColor(android.graphics.Color.BLACK)
        val cols=if(layout<=2)2 else 3;val rows=(layout+cols-1)/cols;val cw=1600/cols;val ch=1600/rows;val paint=Paint(Paint.ANTI_ALIAS_FLAG)
        bitmaps.take(layout).forEachIndexed{i,b->val dst=android.graphics.Rect((i%cols)*cw,(i/cols)*ch,(i%cols+1)*cw,(i/cols+1)*ch);canvas.drawBitmap(b,null,dst,paint)}
        val values=ContentValues().apply{put(MediaStore.Images.Media.DISPLAY_NAME,"${name.ifBlank{"Composition"}}_${System.currentTimeMillis()}.jpg");put(MediaStore.Images.Media.MIME_TYPE,"image/jpeg");if(android.os.Build.VERSION.SDK_INT>=29)put(MediaStore.Images.Media.IS_PENDING,1)}
        val uri=context.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,values)?:return@withContext null
        try{context.contentResolver.openOutputStream(uri)?.use{out.compress(Bitmap.CompressFormat.JPEG,95,it)}?:error("output")
            if(android.os.Build.VERSION.SDK_INT>=29)context.contentResolver.update(uri,ContentValues().apply{put(MediaStore.Images.Media.IS_PENDING,0)},null,null)
            uri
        }catch(t:Throwable){context.contentResolver.delete(uri,null,null);null}
    }
}
