package com.coconutshell.gallerymanager.feature.search

import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.coconutshell.gallerymanager.GalleryManagerApplication
import com.coconutshell.gallerymanager.core.database.entity.FileRecordEntity
import com.coconutshell.gallerymanager.shared.ui.components.MediaThumbnail
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

@Composable
fun SearchScreen(onBack:()->Unit,onOpen:(String)->Unit,vm:SearchViewModel=viewModel(factory=SearchFactory())) {
    val results by vm.results.collectAsStateWithLifecycle()
    var q by remember { mutableStateOf("") }
    Scaffold(topBar={TopAppBar(title={Text("Search")},navigationIcon={IconButton(onBack){Icon(Icons.Rounded.ArrowBack,"Back")}})}){pad->
        Column(Modifier.fillMaxSize().padding(pad).padding(16.dp)) {
            OutlinedTextField(q,{q=it;vm.search(it)},Modifier.fillMaxWidth(),singleLine=true,label={Text("Search photos and videos")})
            Spacer(Modifier.height(12.dp))
            if(q.isBlank()) Text("Search by file name, folder, album, date, size, or type.",color=MaterialTheme.colorScheme.onSurfaceVariant)
            LazyVerticalGrid(GridCells.Fixed(3),contentPadding=PaddingValues(2.dp),horizontalArrangement=Arrangement.spacedBy(4.dp),verticalArrangement=Arrangement.spacedBy(4.dp)){
                items(results,key={it.id}){item->MediaThumbnail(Uri.parse(item.uri),Modifier.fillMaxWidth().aspectRatio(1f),onClick={onOpen(item.uri)})}
            }
        }
    }
}
class SearchViewModel(private val repo:com.coconutshell.gallerymanager.core.search.SearchRepository):ViewModel(){
    private val _results=MutableStateFlow<List<FileRecordEntity>>(emptyList()); val results=_results.asStateFlow()
    fun search(q:String){viewModelScope.launch{_results.value=repo.search(q)}}
}
@Composable private fun SearchFactory():androidx.lifecycle.ViewModelProvider.Factory{
    val app=LocalContext.current.applicationContext as GalleryManagerApplication
    return object:androidx.lifecycle.ViewModelProvider.Factory{@Suppress("UNCHECKED_CAST") override fun<T:ViewModel>create(c:Class<T>):T=SearchViewModel(app.container.searchRepository) as T}
}
