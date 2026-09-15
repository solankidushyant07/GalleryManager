package com.coconutshell.gallerymanager.feature.privatevault

import android.net.Uri
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.clickable
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.database.entity.PrivateMediaEntity
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail

@Composable
fun PrivateScreen(onBack:()->Unit){
    val context=LocalContext.current
    val app=context.applicationContext as GalleryManagerApplication
    val configured=remember{app.container.privateCredentialStore.isConfigured()}
    var unlocked by remember{mutableStateOf(false)}
    var showSetup by remember{mutableStateOf(!configured)}
    var showUnlock by remember{mutableStateOf(false)}
    val items by app.container.privateVaultService.observe().collectAsStateWithLifecycle(emptyList())

    LaunchedEffect(configured){if(configured) showUnlock=true}
    Scaffold(topBar={TopAppBar(title={Text("Private")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}},actions={
        if(unlocked) IconButton({unlocked=false}){Icon(Icons.Rounded.Lock,"Lock")}
    })}){pad->
        if(!unlocked) Box(Modifier.fillMaxSize().padding(pad),contentAlignment=androidx.compose.ui.Alignment.Center){
            Column(horizontalAlignment=androidx.compose.ui.Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(12.dp)){
                Icon(Icons.Rounded.Lock, null, modifier=Modifier.size(48.dp))
                Text(if(showSetup)"Set up your Private vault" else "Private is locked",style=MaterialTheme.typography.headlineSmall)
                Button({if(showSetup)showSetup=true else showUnlock=true}){Text(if(showSetup)"Set up" else "Unlock")}
                if(!showSetup) OutlinedButton({authenticate(context){unlocked=true}}){Text("Use device authentication")}
            }
        } else {
            LazyVerticalGrid(GridCells.Fixed(3),contentPadding=PaddingValues(8.dp),horizontalArrangement=Arrangement.spacedBy(5.dp),verticalArrangement=Arrangement.spacedBy(5.dp)){
                items(items,key={it.id}){item->
                    // Private files are app-internal encrypted blobs; preview is only produced after vault unlock.
                    var preview by remember(item.id){mutableStateOf<Uri?>(null)}
                    LaunchedEffect(item.id){preview=app.container.privateVaultService.decryptToCache(item).getOrNull()}
                    preview?.let{MediaThumbnail(it,Modifier.fillMaxWidth().aspectRatio(1f))}
                }
            }
        }
    }
    if(showSetup) SetupDialog(onDone={showSetup=false;showUnlock=false;unlocked=true})
    if(showUnlock && !showSetup) UnlockDialog(
        verifyPin={app.container.privateCredentialStore.verifyPin(it)},
        verifyPattern={app.container.privateCredentialStore.verifyPattern(it)},
        onSuccess={unlocked=true;showUnlock=false},
        onDevice={authenticate(context){unlocked=true;showUnlock=false}}
    )
}
private fun authenticate(context:android.content.Context,onSuccess:()->Unit){
    val activity=context as? FragmentActivity ?: return
    val manager=BiometricManager.from(activity)
    val can=manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
    if(can!=BiometricManager.BIOMETRIC_SUCCESS)return
    BiometricPrompt(activity,object:BiometricPrompt.AuthenticationCallback(){
        override fun onAuthenticationSucceeded(result:BiometricPrompt.AuthenticationResult){onSuccess()}
    }).authenticate(BiometricPrompt.PromptInfo.Builder().setTitle("Unlock Private").setSubtitle("Authenticate to access protected media").setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL).build())
}
@Composable private fun SetupDialog(onDone:()->Unit){
    val context=LocalContext.current; val app=context.applicationContext as GalleryManagerApplication
    var pin by remember{mutableStateOf("")};var pattern by remember{mutableStateOf("")}
    AlertDialog(onDismissRequest={},title={Text("Set up Private")},text={
        Column(verticalArrangement=Arrangement.spacedBy(10.dp)){
            Text("Create a PIN and a pattern. Device authentication can be used for recovery.")
            OutlinedTextField(pin,{if(it.length<=8)pin=it},singleLine=true,label={Text("PIN (4–8 digits)")})
            Text("Pattern")
            PatternPad(pattern){ pattern=it }
            Text("Pattern sequence: ${if(pattern.isEmpty()) "—" else pattern}",color=MaterialTheme.colorScheme.onSurfaceVariant)
        }
    },confirmButton={TextButton(onClick={app.container.privateCredentialStore.setPin(pin);app.container.privateCredentialStore.setPattern(pattern);onDone()},enabled=pin.length in 4..8&&pattern.length>=4){Text("Save")}})
}
@Composable private fun UnlockDialog(verifyPin:(String)->Boolean,verifyPattern:(String)->Boolean,onSuccess:()->Unit,onDevice:()->Unit){
    var pin by remember{mutableStateOf("")};var pattern by remember{mutableStateOf("")};var error by remember{mutableStateOf(false)}
    AlertDialog(onDismissRequest={},title={Text("Unlock Private")},text={
        Column(verticalArrangement=Arrangement.spacedBy(10.dp)){
            OutlinedTextField(pin,{pin=it},singleLine=true,label={Text("PIN")})
            Text("Pattern")
            PatternPad(pattern){ pattern=it }
            if(error)Text("Incorrect credential",color=MaterialTheme.colorScheme.error)
        }
    },confirmButton={TextButton({if(verifyPin(pin)||verifyPattern(pattern))onSuccess()else error=true}){Text("Unlock")}},dismissButton={TextButton(onDevice){Text("Device authentication")}})
}

@Composable
private fun PatternPad(value:String,onChange:(String)->Unit){
    Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
        for(row in 0..2){
            Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){
                for(col in 0..2){
                    val n=row*3+col+1
                    val active=value.contains(n.toString())
                    Surface(
                        modifier=Modifier.size(52.dp).clickable(enabled=!active){onChange((value+n.toString()).take(9))},
                        shape=CircleShape,
                        tonalElevation=if(active) 6.dp else 1.dp
                    ){Box(Modifier.fillMaxSize(),contentAlignment=androidx.compose.ui.Alignment.Center){Text(n.toString())}}
                }
            }
        }
        if(value.isNotEmpty())TextButton({onChange("")}){Text("Clear pattern")}
    }
}
