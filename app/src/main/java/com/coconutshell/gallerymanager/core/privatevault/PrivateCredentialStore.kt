package com.coconutshell.gallerymanager.core.privatevault

import android.content.Context
import android.util.Base64
import java.security.MessageDigest
import java.security.SecureRandom

class PrivateCredentialStore(context: Context) {
    private val prefs = context.getSharedPreferences("private_credentials", Context.MODE_PRIVATE)
    fun isConfigured(): Boolean = prefs.getBoolean("configured", false)
    fun setPin(pin: String) = save("pin", pin)
    fun setPattern(pattern: String) = save("pattern", pattern)
    fun verifyPin(pin: String) = verify("pin", pin)
    fun verifyPattern(pattern: String) = verify("pattern", pattern)
    private fun save(kind: String, value: String) {
        val salt = ByteArray(16).also(SecureRandom()::nextBytes)
        prefs.edit().putString("${kind}_salt", Base64.encodeToString(salt, Base64.NO_WRAP))
            .putString("${kind}_hash", hash(value, salt))
            .putBoolean("configured", true).apply()
    }
    private fun verify(kind: String, value: String): Boolean {
        val salt = prefs.getString("${kind}_salt", null) ?: return false
        val expected = prefs.getString("${kind}_hash", null) ?: return false
        return hash(value, Base64.decode(salt, Base64.NO_WRAP)) == expected
    }
    private fun hash(value: String, salt: ByteArray): String =
        Base64.encodeToString(MessageDigest.getInstance("SHA-256").digest(salt + value.toByteArray()), Base64.NO_WRAP)
}
