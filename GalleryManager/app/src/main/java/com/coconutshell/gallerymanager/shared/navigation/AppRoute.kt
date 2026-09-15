package com.coconutshell.gallerymanager.shared.navigation

sealed interface AppRoute {
    data object Home : AppRoute
    data object Albums : AppRoute
    data object Browse : AppRoute
}
