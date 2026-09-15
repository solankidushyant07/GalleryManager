package com.coconutshell.gallerymanager.core.privatevault

import android.content.Context
import android.net.Uri
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import com.coconutshell.gallerymanager.core.database.dao.PrivateMediaDao
import com.coconutshell.gallerymanager.core.database.entity.PrivateMediaEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.io.File
import java.security.KeyStore
import java.util.UUID
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.CipherOutputStream
import javax.crypto.CipherInputStream

class PrivateVaultService(
    private val context: Context,
    private val dao: PrivateMediaDao
) {
    private val vaultDir = File(context.filesDir, "private_vault").apply { mkdirs() }
    private val alias = "gallery_manager_private_v1"

    fun observe(): Flow<List<PrivateMediaEntity>> = dao.observeAll()

    suspend fun import(uri: Uri, displayName: String, mimeType: String): Result<Long> = withContext(Dispatchers.IO) {
        runCatching {
            val source = context.contentResolver.openInputStream(uri) ?: error("Unable to read media.")
            val target = File(vaultDir, "${UUID.randomUUID()}.gmprivate")
            val iv = ByteArray(12).also { java.security.SecureRandom().nextBytes(it) }
            val cipher = Cipher.getInstance("AES/GCM/NoPadding").apply {
                init(Cipher.ENCRYPT_MODE, getOrCreateKey(), GCMParameterSpec(128, iv))
            }
            target.outputStream().use { raw ->
                raw.write(iv)
                CipherOutputStream(raw, cipher).use { encrypted -> source.copyTo(encrypted) }
            }
            source.close()
            dao.insert(PrivateMediaEntity(displayName=displayName, mimeType=mimeType, encryptedPath=target.absolutePath, sizeBytes=target.length(), createdAtEpochMillis=System.currentTimeMillis()))
        }
    }

    suspend fun decryptToCache(item: PrivateMediaEntity): Result<Uri> = withContext(Dispatchers.IO) {
        runCatching {
            val input = File(item.encryptedPath).inputStream()
            val iv = ByteArray(12).also { input.read(it) }
            val cipher = Cipher.getInstance("AES/GCM/NoPadding").apply {
                init(Cipher.DECRYPT_MODE, getOrCreateKey(), GCMParameterSpec(128, iv))
            }
            val output = File.createTempFile("gm_view_", ".bin", context.cacheDir)
            CipherInputStream(input, cipher).use { decrypted ->
                output.outputStream().use { out -> decrypted.copyTo(out) }
            }
            Uri.fromFile(output)
        }
    }

    suspend fun delete(item: PrivateMediaEntity) = withContext(Dispatchers.IO) {
        File(item.encryptedPath).delete()
        dao.delete(item.id)
    }

    private fun getOrCreateKey(): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getKey(alias, null) as? SecretKey)?.let { return it }
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        generator.init(KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setUserAuthenticationRequired(false)
            .build())
        return generator.generateKey()
    }
}
