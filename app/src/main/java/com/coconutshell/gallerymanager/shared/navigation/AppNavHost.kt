package com.coconutshell.gallerymanager.shared.navigation

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.coconutshell.gallerymanager.feature.albums.*
import com.coconutshell.gallerymanager.feature.browser.BrowserScreen
import com.coconutshell.gallerymanager.feature.browser.FolderDetailScreen
import com.coconutshell.gallerymanager.feature.composition.CompositionScreen
import com.coconutshell.gallerymanager.feature.editor.ImageEditorScreen
import com.coconutshell.gallerymanager.feature.favorites.FavoritesScreen
import com.coconutshell.gallerymanager.feature.fileinfo.FileInfoScreen
import com.coconutshell.gallerymanager.feature.home.HomeScreen
import com.coconutshell.gallerymanager.feature.importmedia.ImportScreen
import com.coconutshell.gallerymanager.feature.privatevault.PrivateScreen
import com.coconutshell.gallerymanager.feature.search.SearchScreen
import com.coconutshell.gallerymanager.feature.settings.SettingsScreen
import com.coconutshell.gallerymanager.feature.trash.TrashScreen
import com.coconutshell.gallerymanager.feature.viewer.ViewerScreen

@Composable
fun AppNavHost(startDestination: String = "home") {
    val nav = rememberNavController()

    fun openViewer(uri: String) {
        nav.navigate("viewer/${Uri.encode(uri)}")
    }

    NavHost(navController = nav, startDestination = startDestination) {
        composable("home") {
            HomeScreen(
                onAlbums = { nav.navigate("albums") },
                onBrowse = { nav.navigate("browse") },
                onSearch = { nav.navigate("search") },
                onFavorites = { nav.navigate("favorites") },
                onPrivate = { nav.navigate("private") },
                onSettings = { nav.navigate("settings") }
            )
        }

        composable("albums") {
            AlbumsScreen(
                onHome = { nav.navigate("home") { popUpTo("home") } },
                onBrowse = { nav.navigate("browse") },
                onOpenAlbum = { nav.navigate("album/$it") }
            )
        }

        composable("browse") {
            BrowserScreen(
                onHome = { nav.navigate("home") { popUpTo("home") } },
                onAlbums = { nav.navigate("albums") },
                onOpen = ::openViewer,
                onFolder = { nav.navigate("folder/$it") }
            )
        }

        composable(
            "folder/{id}",
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { backStackEntry ->
            FolderDetailScreen(
                backStackEntry.arguments!!.getLong("id"),
                { nav.popBackStack() },
                ::openViewer
            )
        }

        composable(
            "album/{id}",
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { backStackEntry ->
            AlbumDetailScreen(
                backStackEntry.arguments!!.getLong("id"),
                { nav.popBackStack() },
                ::openViewer
            )
        }

        composable(
            "viewer/{uri}",
            arguments = listOf(navArgument("uri") { type = NavType.StringType })
        ) { backStackEntry ->
            val uri = Uri.decode(backStackEntry.arguments!!.getString("uri")!!)
            ViewerScreen(
                uri,
                { nav.popBackStack() },
                { nav.navigate("info/${Uri.encode(uri)}") }
            )
        }

        composable(
            "info/{uri}",
            arguments = listOf(navArgument("uri") { type = NavType.StringType })
        ) { backStackEntry ->
            FileInfoScreen(
                Uri.decode(backStackEntry.arguments!!.getString("uri")!!),
                { nav.popBackStack() }
            )
        }

        composable("search") { SearchScreen({ nav.popBackStack() }, ::openViewer) }
        composable("favorites") { FavoritesScreen({ nav.popBackStack() }, ::openViewer) }
        composable("trash") { TrashScreen { nav.popBackStack() } }
        composable("private") { PrivateScreen { nav.popBackStack() } }
        composable("settings") { SettingsScreen { nav.popBackStack() } }
        composable("import") { ImportScreen { nav.navigate("home") { popUpTo("home") } } }
        composable(
            "editor/{uri}",
            arguments = listOf(navArgument("uri") { type = NavType.StringType })
        ) { backStackEntry ->
            ImageEditorScreen(
                Uri.decode(backStackEntry.arguments!!.getString("uri")!!),
                { nav.popBackStack() }
            )
        }
        composable("composition") { CompositionScreen { nav.popBackStack() } }
    }
}
