# Gallery Manager — UI-Reconciled Implementation Plan
## Architecture and Coder Handoff Based on the UI Design Reference

**Status:** Planning only — no production implementation is included in this document.

**Source of truth for behavior:** the supplied UI design reference is treated as the primary description of how the user expects the gallery to work. The earlier implementation plan remains the architectural baseline, but this document supersedes it wherever the UI design establishes a more specific navigation, screen, overlay, state, or interaction.

**Important scope rule:** this is a gallery/media manager. PDF, TXT, EPUB, Office/document viewing, ebook viewing, and generic arbitrary-file preview remain out of scope.

---

# 1. Objective

Build the Android Gallery Manager so that its implementation follows the supplied UI design rather than forcing the UI into the earlier architecture.

The application should provide:

- a personalized Home dashboard
- All Media browsing
- My Albums
- Device Folders / device albums
- folder/album browsing
- full-screen image/video viewing
- selection and bulk actions
- favorites
- trash
- protected Private Gallery
- image editing
- composition editing
- Android Share import
- search
- refresh/rescan
- settings
- persistent folder/album display preferences

The visual direction shown by the UI reference is also part of the product design contract:

- dark, immersive gallery presentation
- image-forward cards and grids
- rounded surfaces/cards
- translucent/soft elevated surfaces
- blue/purple accent treatment
- photographic/atmospheric backgrounds in major surfaces
- compact bottom navigation
- contextual top-bar actions
- bottom sheets/dialogs for secondary actions
- large visual previews where the feature benefits from them

The exact visual values (colors, blur strength, corner radii, typography sizes, spacing, etc.) should be extracted/standardized during UI implementation rather than scattered across feature screens.

---

# 2. Source Reconciliation

## Confirmed from the UI reference

The supplied designs establish several behaviors that were not explicit enough in the earlier Markdown plan.

### 2.1 Primary navigation is not the earlier four-item model

The designs show a compact bottom navigation centered around:

```text
Home
Albums
Browse
```

Private is accessed from Home/quick access and is not treated as a permanent bottom-navigation destination.

Settings is accessed from the app-level controls and is not a bottom-navigation destination.

Therefore the earlier:

```text
Home
Browse
Private
Settings
```

primary-navigation model is replaced by:

```text
Home
Albums
Browse
```

with:

```text
Private
Settings
```

as secondary destinations.

### 2.2 Home is a dashboard, not merely a launcher

The Home designs show:

```text
Greeting / time-aware header
        ↓
Search
        ↓
Quick-access cards
    ├── All Media
    ├── Favorites
    ├── Albums / relevant collection
    └── Trash
        ↓
Pinned Folders
        ↓
Recent Media
        ↓
Bottom navigation
```

The exact number/content of quick-access cards can remain configurable during implementation, but Home must be treated as a real content dashboard.

The UI also shows a refresh/control affordance, so refresh/rescan belongs in the Home experience as a first-class action rather than only as an internal service.

### 2.3 Albums is a distinct destination

The designs show a dedicated Albums experience containing sections such as:

```text
Albums
├── Device Albums
└── My Albums
```

with visual album cards/thumbnails and an add-album action.

Therefore Albums needs its own feature boundary rather than being treated only as a Browser tab.

### 2.4 Browse has scope tabs

The Browse designs show a segmented/tabbed scope such as:

```text
All
My Albums
Device Folders
```

The exact labels should follow the final UI copy, but the architectural distinction is important:

- All = all indexed public supported media
- My Albums = user-created album/folder content
- Device Folders = discovered physical media folders

This is a browsing scope selector, not a second copy of the Albums feature.

### 2.5 Empty Browse state is intentional

The design includes a Browse empty state with a folder illustration and explanatory text.

The implementation must distinguish:

- no permission
- scanning/loading
- genuinely empty scope
- error

Do not collapse these into one empty screen.

### 2.6 Folder detail is image-first

The designs show a folder/album detail screen with:

- cover/background imagery
- title
- item count / contextual metadata
- grid of media
- top actions
- overflow menu
- bottom navigation retained

Therefore folder/album detail is more than the generic file browser described in the earlier plan.

### 2.7 Folder overflow actions are part of the UI contract

The designs show contextual menus on folder/album screens.

The architecture must support actions such as the ones visibly designed, including:

- add/create album/folder
- rename
- pin
- other folder-specific actions shown by the final design

The exact action list should be taken from the final approved UI reference.

### 2.8 Viewer has media-specific controls

The designs show:

- image viewer
- video viewer with playback controls
- image/video actions along the bottom
- favorite/share/edit/delete-type actions depending on media/workflow

Viewer actions should therefore be modeled as a reusable action set with media-specific availability.

### 2.9 File Info is a dedicated sheet/page

The File Info design is a compact information surface showing a preview and metadata such as:

- name
- type
- size
- resolution
- date
- location/path

It also has navigation back to the containing location.

This remains a distinct feature boundary.

### 2.10 Private has a first-run security setup flow

The UI reference adds a substantial Private onboarding flow:

```text
Private entry
    ↓
Unlock Private Gallery
    ├── biometric/device authentication
    └── PIN fallback
    ↓
If security is not configured:
    Create new PIN
        ↓
    Confirm new PIN
        ↓
    Optionally/alternatively create pattern
```

The designs also show a pattern-based unlock flow and a "Forgot pattern?" path.

This means Private is not simply an authentication gate. It has:

- setup
- unlock
- PIN
- pattern
- biometric/device authentication
- confirmation
- recovery/fallback UX

The exact recovery mechanism must be treated as a security decision before implementation.

### 2.11 Private has its own protected gallery UI

The designs show an actual Private Gallery after authentication, with media displayed separately from normal gallery content.

Private content must remain isolated from:

- normal Home recent media
- normal Browse
- Albums
- normal search
- ordinary favorites unless explicitly allowed
- normal device-folder discovery

### 2.12 Image editor is a real editing workspace

The designs show an editor with:

- large image canvas/preview
- undo/redo controls
- save
- bottom editing tools
- crop workflow
- adjustment workflow

The editor is therefore not just a metadata action or simple dialog.

### 2.13 Crop is an overlay/workflow

The crop designs show a focused crop interaction with a preview and controls.

Crop should be modeled as editor state, not implemented as an unrelated screen with its own persistence.

### 2.14 Add-to-album has a dedicated destination surface

The designs show an "Add to album" flow with album choices and the ability to create/add an album.

This is important because "Add to album" is not identical to physical Move/Copy.

The architecture must distinguish:

```text
Add to Album
```

from:

```text
Move physical media
Copy physical media
```

The correct implementation depends on the final album model.

### 2.15 Favorites has an explicit empty state

The designs show a Favorites collection with a heart/empty-state treatment.

Favorites therefore needs:

- populated state
- empty state
- selection/action behavior
- media removal from favorites without deleting the file

### 2.16 Trash has an explicit destructive confirmation

The designs show a Trash screen and a destructive empty/clear confirmation.

Trash must therefore support:

- normal Trash browsing
- restore
- permanent delete
- empty trash
- destructive confirmation
- bulk selection where designed

### 2.17 Settings is a focused settings screen

The design shows settings rows/cards for categories such as:

- appearance/theme
- grid
- sorting
- delete confirmation
- trash behavior

The final implementation should keep the settings architecture aligned with the visual grouping instead of creating unrelated configuration screens.

### 2.18 Visual design needs a centralized design-system layer

The earlier structure had reusable UI components but no explicit design-system boundary.

Because the supplied UI consistently uses a distinctive visual language, introduce:

```text
shared/ui/theme/
shared/ui/components/
```

rather than putting colors, typography, surfaces, cards, and reusable controls inside individual feature packages.

---

# 3. Requirements

## 3.1 Media scope

Supported gallery media:

- JPG/JPEG
- PNG
- WEBP
- GIF
- SVG where the chosen rendering path supports it
- other common Android-decodable image formats
- MP4
- other common Android-playable video formats

Out of scope:

- PDF
- TXT
- EPUB
- Office/document formats
- ebook viewers
- generic document viewers
- generic arbitrary-file previewers

Non-gallery files discovered on storage must not appear as ordinary gallery items.

---

# 4. Revised Information Architecture

The UI design requires the application hierarchy to be:

```text
App
│
├── Home
│   ├── Search
│   ├── Refresh / Rescan
│   ├── All Media
│   ├── Favorites
│   ├── Private
│   ├── Trash
│   ├── Pinned Folders
│   └── Recent Media
│
├── Albums
│   ├── Device Albums
│   ├── My Albums
│   ├── Add Album
│   └── Album Detail
│
├── Browse
│   ├── All
│   ├── My Albums
│   └── Device Folders
│       └── Folder Detail
│
└── Secondary
    ├── Search Results
    ├── Media Viewer
    ├── File Info
    ├── Selection Mode
    ├── Move Destination
    ├── Bulk Rename
    ├── Add to Album
    ├── Trash
    ├── Private Setup / Unlock
    ├── Private Gallery
    ├── Image Editor
    ├── Composition Editor
    └── Settings
```

---

# 5. Proposed Architecture

The revised architecture is still layered, but the UI feature boundaries now reflect the actual designed experiences.

```text
                    Android UI
                        │
        ┌───────────────┴────────────────┐
        │                                │
 Feature Screens                   Shared UI System
        │                                │
        └───────────────┬────────────────┘
                        ↓
                    ViewModels
                        ↓
             Application/domain services
                        ↓
       ┌────────────────┼────────────────┐
       ↓                ↓                ↓
   Storage          Metadata         Preferences
       ↓                ↓                ↓
 MediaStore /     Room/index      DataStore/Room
 DocumentFile
```

Private adds an isolated security/storage boundary:

```text
Private UI
   ↓
PrivateViewModel
   ↓
PrivateMediaService
   ↓
Protected storage implementation
   ↓
Protected media
```

Normal gallery storage must not accidentally read the protected storage as ordinary media.

---

# 6. Revised Project Structure

Use this as the new implementation starting point.

```text
app/
└── src/
    └── main/
        ├── AndroidManifest.xml
        ├── java/com/example/gallerymanager/
        │
        ├── GalleryManagerApplication.kt
        ├── MainActivity.kt
        │
        ├── core/
        │   ├── database/
        │   │   ├── GalleryDatabase.kt
        │   │   ├── dao/
        │   │   │   ├── FileDao.kt
        │   │   │   ├── FolderDao.kt
        │   │   │   ├── AlbumDao.kt
        │   │   │   ├── FavoriteDao.kt
        │   │   │   ├── TrashDao.kt
        │   │   │   ├── CompositionProjectDao.kt
        │   │   │   └── FolderPreferenceDao.kt
        │   │   └── entity/
        │   │       ├── FileRecordEntity.kt
        │   │       ├── FolderRecordEntity.kt
        │   │       ├── AlbumEntity.kt
        │   │       ├── FavoriteEntity.kt
        │   │       ├── TrashRecordEntity.kt
        │   │       ├── CompositionProjectEntity.kt
        │   │       └── FolderPreferenceEntity.kt
        │   │
        │   ├── model/
        │   │   ├── FileItem.kt
        │   │   ├── FolderItem.kt
        │   │   ├── AlbumItem.kt
        │   │   ├── MediaType.kt
        │   │   ├── FileMetadata.kt
        │   │   ├── SortOption.kt
        │   │   ├── MediaFilter.kt
        │   │   └── GalleryScope.kt
        │   │
        │   ├── storage/
        │   │   ├── StorageRepository.kt
        │   │   ├── MediaStoreDataSource.kt
        │   │   ├── DocumentFileDataSource.kt
        │   │   └── StorageScanner.kt
        │   │
        │   ├── private/
        │   │   ├── PrivateMediaRepository.kt
        │   │   ├── ProtectedStorage.kt
        │   │   └── PrivateSessionManager.kt
        │   │
        │   ├── permissions/
        │   │   ├── PermissionManager.kt
        │   │   └── PermissionState.kt
        │   │
        │   ├── authentication/
        │   │   ├── DeviceAuthenticationManager.kt
        │   │   ├── PrivateCredentialManager.kt
        │   │   └── AuthenticationResult.kt
        │   │
        │   ├── fileoperations/
        │   │   ├── FileOperationService.kt
        │   │   ├── FileOperation.kt
        │   │   ├── FileOperationResult.kt
        │   │   ├── ConflictResolution.kt
        │   │   └── UndoOperationManager.kt
        │   │
        │   ├── albums/
        │   │   ├── AlbumRepository.kt
        │   │   ├── AlbumService.kt
        │   │   └── AlbumMembershipRepository.kt
        │   │
        │   ├── search/
        │   │   ├── SearchRepository.kt
        │   │   └── SearchQuery.kt
        │   │
        │   ├── preferences/
        │   │   ├── AppPreferences.kt
        │   │   └── FolderPreferencesRepository.kt
        │   │
        │   └── media/
        │       ├── MediaMetadataReader.kt
        │       └── MediaThumbnailRepository.kt
        │
        ├── feature/
        │   ├── home/
        │   │   ├── HomeScreen.kt
        │   │   ├── HomeViewModel.kt
        │   │   └── HomeUiState.kt
        │   │
        │   ├── albums/
        │   │   ├── AlbumsScreen.kt
        │   │   ├── AlbumsViewModel.kt
        │   │   ├── AlbumDetailScreen.kt
        │   │   ├── AlbumDetailViewModel.kt
        │   │   ├── AddAlbumSheet.kt
        │   │   └── AlbumUiState.kt
        │   │
        │   ├── browser/
        │   │   ├── BrowserScreen.kt
        │   │   ├── BrowserViewModel.kt
        │   │   ├── BrowserUiState.kt
        │   │   └── BrowseScope.kt
        │   │
        │   ├── search/
        │   │   ├── SearchScreen.kt
        │   │   ├── SearchViewModel.kt
        │   │   └── SearchUiState.kt
        │   │
        │   ├── viewer/
        │   │   ├── MediaViewerScreen.kt
        │   │   ├── MediaViewerViewModel.kt
        │   │   └── ViewerUiState.kt
        │   │
        │   ├── fileinfo/
        │   │   ├── FileInfoSheet.kt
        │   │   └── FileInfoViewModel.kt
        │   │
        │   ├── favorites/
        │   │   ├── FavoritesScreen.kt
        │   │   └── FavoritesViewModel.kt
        │   │
        │   ├── trash/
        │   │   ├── TrashScreen.kt
        │   │   ├── TrashViewModel.kt
        │   │   └── TrashUiState.kt
        │   │
        │   ├── private/
        │   │   ├── PrivateEntryScreen.kt
        │   │   ├── PrivateSetupScreen.kt
        │   │   ├── PrivateUnlockScreen.kt
        │   │   ├── PrivateGalleryScreen.kt
        │   │   ├── PrivateViewModel.kt
        │   │   └── PrivateUiState.kt
        │   │
        │   ├── import/
        │   │   ├── ShareImportActivity.kt
        │   │   ├── ImportDestinationScreen.kt
        │   │   └── ImportViewModel.kt
        │   │
        │   ├── move/
        │   │   ├── MoveDestinationScreen.kt
        │   │   └── MoveDestinationViewModel.kt
        │   │
        │   ├── albumactions/
        │   │   ├── AddToAlbumSheet.kt
        │   │   └── AddToAlbumViewModel.kt
        │   │
        │   ├── rename/
        │   │   ├── BulkRenameScreen.kt
        │   │   └── BulkRenameViewModel.kt
        │   │
        │   ├── editor/
        │   │   ├── ImageEditorScreen.kt
        │   │   ├── ImageEditorViewModel.kt
        │   │   ├── ImageEditState.kt
        │   │   └── ImageEditOperation.kt
        │   │
        │   ├── composition/
        │   │   ├── CompositionEditorScreen.kt
        │   │   ├── CompositionEditorViewModel.kt
        │   │   ├── CompositionState.kt
        │   │   ├── CompositionObject.kt
        │   │   └── CompositionRenderer.kt
        │   │
        │   └── settings/
        │       ├── SettingsScreen.kt
        │       └── SettingsViewModel.kt
        │
        ├── shared/
        │   ├── navigation/
        │   │   ├── AppNavHost.kt
        │   │   └── AppRoute.kt
        │   │
        │   ├── selection/
        │   │   ├── SelectionManager.kt
        │   │   └── SelectionState.kt
        │   │
        │   └── ui/
        │       ├── theme/
        │       │   ├── Color.kt
        │       │   ├── Theme.kt
        │       │   ├── Type.kt
        │       │   └── Dimensions.kt
        │       │
        │       ├── components/
        │       │   ├── GalleryBottomBar.kt
        │       │   ├── GalleryTopBar.kt
        │       │   ├── GlassCard.kt
        │       │   ├── MediaGrid.kt
        │       │   ├── FolderGrid.kt
        │       │   ├── MediaThumbnail.kt
        │       │   ├── FolderThumbnail.kt
        │       │   ├── AlbumCard.kt
        │       │   ├── Breadcrumbs.kt
        │       │   ├── QuickAccessCard.kt
        │       │   ├── SectionHeader.kt
        │       │   ├── SearchBar.kt
        │       │   ├── FilterChipRow.kt
        │       │   ├── EmptyState.kt
        │       │   ├── LoadingState.kt
        │       │   ├── ErrorState.kt
        │       │   ├── ContextActionSheet.kt
        │       │   ├── ConfirmationDialog.kt
        │       │   ├── PinEntryPad.kt
        │       │   ├── PatternLockInput.kt
        │       │   └── UndoSnackbar.kt
        │       │
        │       └── interaction/
        │           ├── GridZoomState.kt
        │           └── MediaSelectionOverlay.kt
        │
        └── di/
            └── AppModule.kt

res/
├── drawable/
├── mipmap/
├── values/
│   ├── strings.xml
│   ├── themes.xml
│   └── colors.xml
└── xml/
```

---

# 7. File and Module Planning

## Root

### `GalleryManagerApplication.kt`
**Action:** CREATE

Responsibility:
- application startup
- dependency graph initialization
- application-level lifecycle

Do not place gallery behavior here.

### `MainActivity.kt`
**Action:** CREATE

Responsibility:
- Compose host
- Android entry point
- incoming system intent handoff

Do not place screen business logic here.

---

# 8. Domain Model Changes

## `core/model/AlbumItem.kt`
**Action:** CREATE

Responsibility:
- represent a user-visible album
- album identity
- name
- cover media reference
- item count
- user-created/device-derived classification
- pinned state reference where applicable

This is required because the UI distinguishes Albums from raw physical folders.

## `core/model/GalleryScope.kt`
**Action:** CREATE

Responsibility:
- All
- My Albums
- Device Folders

Used by Browse.

## `core/model/MediaFilter.kt`
**Action:** CREATE

Responsibility:
- photos/images
- videos
- GIFs
- large files
- other supported gallery filters shown by the final UI

## Existing `FileItem.kt`
**Action:** MODIFY

Preserve its existing media identity/metadata role.

Add only fields needed to support the UI/domain behavior, not presentation-only state.

## Existing `FolderItem.kt`
**Action:** MODIFY

Preserve its role for physical/discovered folders.

Do not overload it to represent every user-created album if albums are logically separate.

---

# 9. Album Architecture

The UI designs require Albums to be a first-class feature.

## `core/database/dao/AlbumDao.kt`
**Action:** CREATE

Responsibility:
- persist/query user-created album definitions.

## `core/database/entity/AlbumEntity.kt`
**Action:** CREATE

Responsibility:
- persistence representation of an album.

## `core/albums/AlbumRepository.kt`
**Action:** CREATE

Responsibility:
- read/write album metadata
- expose album contents
- manage album ordering/visibility as required

## `core/albums/AlbumMembershipRepository.kt`
**Action:** CREATE

Responsibility:
- represent which media belong to an app-managed album when the album model is virtual.

Important architectural decision:

The implementation must not assume that "album" means "physical folder."

The UI uses both:
- Device Albums / Device Folders
- My Albums

Therefore the app needs a clear distinction between:

```text
Physical folder
```

and:

```text
App-managed album
```

Whether My Albums are virtual membership collections or actual folders must be finalized before implementation.

## `core/albums/AlbumService.kt`
**Action:** CREATE

Responsibility:
- create album
- rename album
- delete album definition
- add media to album
- remove media from album
- set/change cover
- pin/unpin where applicable

Do not physically move media when the user only chooses "Add to album."

---

# 10. Home Architecture

## `HomeScreen.kt`
**Action:** MODIFY from earlier plan

Responsibilities now include:

- greeting/header
- search entry
- refresh/rescan
- quick-access cards
- pinned folders
- recent media
- bottom navigation

The Home screen should be presentation-only.

## `HomeViewModel.kt`
**Action:** MODIFY

Coordinate:

- recent media
- pinned folders
- quick-access counts
- refresh state
- navigation events

## `HomeUiState.kt`
**Action:** CREATE

Model:

```text
Loading
Ready
Refreshing
PermissionRequired
Error
```

with independently represented content sections.

A missing section must not force the entire Home screen into an error state.

---

# 11. Albums Architecture

## `AlbumsScreen.kt`
**Action:** CREATE

Responsibilities:

- Device Albums section
- My Albums section
- album cards
- add-album action
- empty states
- album context menu entry

## `AlbumsViewModel.kt`
**Action:** CREATE

Responsibilities:

- load device albums
- load My Albums
- create album
- delete/rename album
- pin/unpin if applicable
- refresh

## `AlbumDetailScreen.kt`
**Action:** CREATE

Responsibilities:

- album/folder cover presentation
- title and metadata
- media grid
- top-bar actions
- overflow menu
- selection mode integration

## `AlbumDetailViewModel.kt`
**Action:** CREATE

Responsibilities:

- current album
- contents
- sorting/filtering
- selection
- album actions
- media actions

## `AddAlbumSheet.kt`
**Action:** CREATE

Responsibilities:

- create a new My Album
- choose initial cover/content if the UI supports it

---

# 12. Browse Architecture

## `BrowserScreen.kt`
**Action:** MODIFY

Responsibilities now include:

- Browse title
- scope selector:
  - All
  - My Albums
  - Device Folders
- search
- sort
- filter
- grid density
- folder/media content
- empty state
- selection state
- overflow/context actions

## `BrowserViewModel.kt`
**Action:** MODIFY

Own:

- selected Browse scope
- current folder/album
- sort
- filter
- grid density
- selection
- refresh
- operation commands

## `BrowseScope.kt`
**Action:** CREATE

Presentation/domain bridge for the three Browse scopes.

---

# 13. Search

## `feature/search/SearchScreen.kt`
**Action:** CREATE

Responsibility:

- search field
- recent/active query state
- search results
- filters
- selection
- result empty state

## `SearchViewModel.kt`
**Action:** CREATE

Responsibility:

- query
- scope
- filters
- results
- navigation into viewer/folder

## `SearchUiState.kt`
**Action:** CREATE

States:

- idle
- searching
- results
- no results
- error

Search must exclude Private media by default.

---

# 14. Viewer Architecture

## `MediaViewerScreen.kt`
**Action:** MODIFY

Support:

- image full-screen viewing
- video playback
- neighboring media navigation
- favorite
- edit where supported
- share
- delete/trash
- info
- more actions

Controls must be media-aware.

## `ViewerUiState.kt`
**Action:** CREATE

Represent:

- current media
- playback state
- controls visibility
- action availability
- loading/error state

## `MediaViewerViewModel.kt`
**Action:** MODIFY

Coordinate viewer state and actions.

Do not implement file operations directly.

---

# 15. Selection Architecture

## `SelectionManager.kt`
**Action:** REUSE / MODIFY

Selection is shared across:

- Browse
- Album Detail
- Favorites
- Search
- Trash
- Private Gallery where allowed

Selection must support:

- long press entry
- tap select/deselect
- select all
- clear
- count
- bulk actions

Range selection remains optional for V1 unless explicitly required.

---

# 16. File Actions and Bottom Sheets

## `ContextActionSheet.kt`
**Action:** MODIFY

The UI reference shows contextual menus/sheets.

It should be a reusable presentation component that receives a feature-defined action list.

It must not own business logic.

Typical actions:

```text
Open
Add to Album
Favorite / Remove Favorite
Move
Copy
Rename
Share
Info
Delete
Pin / Unpin
```

Only show actions valid for the current item/state.

## `ConfirmationDialog.kt`
**Action:** CREATE

Shared destructive confirmation surface for:

- delete
- empty trash
- permanent delete
- destructive replacement where applicable

---

# 17. Move Architecture

## `MoveDestinationScreen.kt`
**Action:** CREATE

Responsibilities:

- destination navigation
- folder hierarchy
- breadcrumbs
- create folder
- choose destination
- cancel

Do not use this screen for album membership.

## `MoveDestinationViewModel.kt`
**Action:** CREATE

Responsibilities:

- current destination
- validation
- create-folder action
- move confirmation
- conflict handoff

---

# 18. Add-to-Album Architecture

## `AddToAlbumSheet.kt`
**Action:** CREATE

Responsibilities:

- show available albums
- select album(s) if supported
- create album
- confirm membership

## `AddToAlbumViewModel.kt`
**Action:** CREATE

Responsibilities:

- selected media
- selected album
- add/remove membership
- success/error state

This flow must not invoke `FileOperationService` for a virtual album membership operation.

If the final album design decides that My Albums are physical folders, this boundary must be revisited before implementation.

---

# 19. Favorites

## `FavoritesScreen.kt`
**Action:** MODIFY

Add:

- designed empty state
- media grid
- selection mode
- viewer navigation
- remove from favorites

## `FavoritesViewModel.kt`
**Action:** MODIFY

Favorites remain metadata references.

Removing a favorite must not delete or move the media.

---

# 20. Trash

## `TrashScreen.kt`
**Action:** MODIFY

Support:

- trashed media grid
- selection
- restore
- permanent delete
- empty trash
- destructive confirmation

## `TrashViewModel.kt`
**Action:** MODIFY

Manage trash operations through the shared file-operation service.

---

# 21. Private Architecture

This is one of the biggest changes from the earlier plan.

## `PrivateEntryScreen.kt`
**Action:** CREATE

Responsibility:

- determine whether Private is configured
- route to setup or unlock

## `PrivateSetupScreen.kt`
**Action:** CREATE

Responsibilities:

- create PIN
- confirm PIN
- create/confirm pattern if the final design supports both
- explain biometric/device authentication availability

## `PrivateUnlockScreen.kt`
**Action:** CREATE

Responsibilities:

- biometric/device authentication
- PIN entry
- pattern entry
- retry/failure state
- forgot/recovery action

## `PrivateGalleryScreen.kt`
**Action:** CREATE

Responsibilities:

- protected media grid
- protected selection
- protected actions
- lock/exit

## `PrivateViewModel.kt`
**Action:** CREATE

Own:

- setup state
- authentication state
- session lock state
- protected media queries
- protected operations

## `PrivateUiState.kt`
**Action:** MODIFY / EXPAND

At minimum:

```text
NotConfigured
CreatingPin
ConfirmingPin
CreatingPattern
ConfirmingPattern
Locked
Authenticating
Unlocked
Error
```

Only include states that survive the final approved security flow.

---

# 22. Private Security Boundary

The UI reference makes it inappropriate to implement Private as:

```text
FileItem.isPrivate = true
```

alone.

The required architecture is:

```text
Private UI
    ↓
Private session/authentication
    ↓
Protected storage
    ↓
Protected media
```

Normal scanning must not index protected files as public media.

Private content must not leak through:

- MediaStore-derived normal lists
- recent media
- Home
- Browse
- Albums
- Favorites
- Search
- folder thumbnails
- normal viewer navigation

This boundary is a high-priority security test target.

---

# 23. Authentication Architecture

## `DeviceAuthenticationManager.kt`
**Action:** MODIFY

Responsible for:

- checking device authentication availability
- triggering Android biometric/device credential authentication
- returning a normalized result

## `PrivateCredentialManager.kt`
**Action:** CREATE

Responsible for the app's Private credential lifecycle.

It must not expose raw credentials to UI code.

The exact secure credential storage mechanism must be selected and verified before implementation.

## `AuthenticationResult.kt`
**Action:** CREATE

Normalize:

- success
- cancelled
- unavailable
- failed
- locked out
- error

---

# 24. Image Editor

## `ImageEditorScreen.kt`
**Action:** MODIFY

Match the designed workspace:

```text
Top
├── Back
├── Undo
├── Redo
└── Save

Center
└── Image preview

Bottom
└── Editing tools
```

Tool groups include the previously specified:

- crop
- rotate
- flip
- resize
- brightness
- contrast
- saturation
- exposure
- sharpness

The final tool arrangement should follow the supplied UI design.

## Crop workflow

Crop is editor state:

```text
Editing
  ↓
Crop mode
  ↓
Apply / Cancel
  ↓
Editing
```

Do not persist an intermediate crop as a separate gallery file.

## Save behavior

Support:

- Save as copy
- Replace original

Default should remain non-destructive where possible.

---

# 25. Composition Editor

The earlier architecture remains valid but should inherit the same visual system as the rest of the app.

Required model:

```text
CompositionProject
├── Canvas
├── ImageObjects
├── TextObjects
├── StickerObjects
├── DrawingObjects
└── FrameObjects
```

The editor must preserve:

- object positions
- object sizes
- order
- crop state
- canvas configuration
- editable project state

The renderer remains separate from the editor UI.

---

# 26. Settings

## `SettingsScreen.kt`
**Action:** MODIFY

The screen should follow the designed grouped-card/row structure.

Settings include:

- Theme
- Grid
- Default sort
- Confirm before deleting
- Trash behavior

If the final UI adds a Private security/settings entry, it must route into the Private credential/security flow rather than directly manipulating protected storage.

## `SettingsViewModel.kt`
**Action:** MODIFY

Read/write `AppPreferences`.

---

# 27. Shared UI / Design System

This is newly required by the UI reference.

## `shared/ui/theme/Color.kt`
**Action:** CREATE

Centralize:

- background colors
- surface colors
- accent colors
- text hierarchy
- destructive/success states

Do not hard-code colors in feature screens.

## `Theme.kt`
**Action:** CREATE

Centralize:

- app theme
- dark/light behavior if both are supported
- system bar treatment

## `Type.kt`
**Action:** CREATE

Centralize typography hierarchy.

## `Dimensions.kt`
**Action:** CREATE

Centralize repeated layout values.

## `GalleryBottomBar.kt`
**Action:** CREATE

Own the visual bottom navigation:

```text
Home | Albums | Browse
```

Navigation decisions should remain outside the component.

## `GalleryTopBar.kt`
**Action:** CREATE

Reusable top-bar structure for:

- title
- back
- search
- overflow
- contextual actions

## `GlassCard.kt`
**Action:** CREATE

Reusable visual surface for the designed elevated/translucent card treatment.

It must remain presentation-only.

## `MediaGrid.kt`
**Action:** CREATE

Unify file/media grid behavior.

Should support:

- dynamic columns
- zoom
- selection overlay
- media thumbnails
- video indicators

## `FolderGrid.kt`
**Action:** MODIFY / REUSE

Use the same grid-density behavior as MediaGrid.

## `AlbumCard.kt`
**Action:** CREATE

Album-specific card with:

- cover
- title
- count
- category/context

## `QuickAccessCard.kt`
**Action:** CREATE

Home quick-access card for:

- All Media
- Favorites
- Private
- Trash
- other final quick-access destinations

## `SectionHeader.kt`
**Action:** CREATE

Reusable Home/Albums section heading with optional "See all" behavior.

## `SearchBar.kt`
**Action:** CREATE

Reusable visual search entry.

## `FilterChipRow.kt`
**Action:** CREATE

Shared filter presentation.

## `PinEntryPad.kt`
**Action:** CREATE

Presentation component for PIN entry.

Business/security validation belongs in the ViewModel/credential layer.

## `PatternLockInput.kt`
**Action:** CREATE

Presentation component for pattern input.

Security validation must remain outside the composable.

---

# 28. Navigation Architecture

## `AppRoute.kt`
**Action:** MODIFY

Routes should reflect the actual UI hierarchy.

Conceptually:

```text
Home
Albums
AlbumDetail
Browse
Search
Favorites
Trash
PrivateEntry
PrivateSetup
PrivateUnlock
PrivateGallery
Viewer
FileInfo
MoveDestination
AddToAlbum
BulkRename
ImageEditor
CompositionEditor
Settings
```

Do not make every bottom sheet a top-level navigation destination.

Use modal/bottom-sheet state for lightweight contextual actions where appropriate.

## `AppNavHost.kt`
**Action:** MODIFY

Responsibilities:

- bottom-navigation destinations
- secondary screen routes
- navigation arguments
- editor/viewer entry
- Private setup/unlock routing

No storage/business logic.

---

# 29. Data and State Flow

## Home

```text
Repositories
   ↓
HomeViewModel
   ↓
HomeUiState
   ↓
HomeScreen
```

Home aggregates data but does not become a general-purpose application state container.

## Browse

```text
BrowseScope
     ↓
BrowserViewModel
     ↓
Search/filter/sort repository queries
     ↓
BrowserUiState
     ↓
BrowserScreen
```

## Albums

```text
AlbumRepository
     ↓
AlbumsViewModel
     ↓
AlbumsScreen
```

For album detail:

```text
AlbumRepository + media repository
            ↓
    AlbumDetailViewModel
            ↓
     AlbumDetailUiState
            ↓
      AlbumDetailScreen
```

## File operation

```text
UI
 ↓
ViewModel
 ↓
FileOperationService
 ↓
StorageRepository
 ↓
Android storage
 ↓
Index reconciliation
 ↓
Room/Flow
 ↓
UI
```

## Add to album

```text
Selection
 ↓
AddToAlbumViewModel
 ↓
AlbumService
 ↓
Album membership persistence
 ↓
UI
```

This must remain distinct from physical Move/Copy.

## Private

```text
Private UI
 ↓
PrivateViewModel
 ↓
Authentication / PrivateSessionManager
 ↓
ProtectedStorage
 ↓
Private media
```

Normal public repositories must not cross into this path.

---

# 30. Folder Thumbnail Architecture

The UI reference uses strong image-based album/folder cards.

Folder/album cover rules should be explicit:

### Device folders

Use an automatically selected representative media thumbnail.

### My Albums

Support:

- automatic cover
- manually selected cover

### Pinned folders

Reuse the same cover source rather than generating another physical image.

No duplicate media should be created merely to produce a thumbnail.

---

# 31. Recent Media

The Home design makes Recent Media a first-class section.

Add:

- `HomeViewModel` aggregation
- repository query for recent public media
- stable ordering
- exclusion of Private and Trash content

The definition of "recent" should be based on media date/metadata, not on the time the app happened to scan the file, unless the final product explicitly chooses otherwise.

---

# 32. Refresh / Rescan

The UI shows a refresh action, so refresh must have visible state.

Required states:

```text
Idle
Refreshing
Success
Error
```

During refresh:

- do not freeze the Home UI
- show progress
- reconcile additions/deletions/moves
- update Home, Albums, Browse, Favorites, and recent media through observable state

A successful refresh should not require manual app restart.

---

# 33. Empty / Loading / Error States

Every major collection needs separate states.

## Home

- loading
- refreshing
- normal
- partial-data/error
- permission required

## Browse

- loading
- empty
- no permission
- error

## Albums

- no albums
- no device albums
- no My Albums
- loading
- error

## Favorites

- empty favorites

## Trash

- empty trash

## Private

- not configured
- locked
- authenticating
- empty private gallery
- authentication failure

## Search

- idle
- searching
- no results
- results
- error

Do not use fake empty states when access is actually blocked by permission.

---

# 34. Selection and Context Menu Rules

Long press enters selection mode.

Once selection mode is active:

```text
Top bar
├── close
├── count
└── more

Bottom/action area
├── Move
├── Copy
├── Share
├── Delete
└── More
```

Available actions depend on the current scope.

Examples:

- Trash should emphasize Restore/Permanent Delete.
- Favorites should allow Remove Favorite.
- Private should not expose public-only actions.
- Albums should distinguish Remove from Album from Delete File.
- Search results use the same file-operation system as Browse.

---

# 35. Important Distinction: Album Membership vs Physical Storage

This must be resolved before coding.

The UI clearly distinguishes:

```text
Device Albums / Device Folders
```

from:

```text
My Albums
```

The app must decide whether My Albums are:

### Option A — Virtual albums

Media stay in their physical folders.

Pros:
- one media item can belong to multiple albums
- Add to album is cheap
- no unexpected physical file movement

Cons:
- album membership exists only in the app

### Option B — Physical folders

My Albums correspond to actual storage directories.

Pros:
- visible outside the app
- intuitive physical organization

Cons:
- "Add to album" becomes a file move/copy problem
- one file cannot naturally belong to multiple albums without duplication

**Proposed:** use virtual My Albums unless the final UI/product requirement explicitly expects albums to be physical folders.

This decision affects the database and file-operation boundaries and must be confirmed before implementation.

---

# 36. Architectural Decisions

## Decision 1 — UI design is the behavior authority

**Status:** Required for this planning revision.

When the UI reference specifies a workflow more precisely than the earlier feature list, implementation should follow the UI design.

The earlier Markdown provides architecture; the UI reference provides intended user interaction.

## Decision 2 — Three primary destinations

**Status:** Proposed from UI design.

```text
Home
Albums
Browse
```

Private and Settings remain secondary.

## Decision 3 — Albums are first-class

**Status:** Required by UI design.

Albums receive their own repository/service and feature package.

## Decision 4 — Add to Album is separate from Move/Copy

**Status:** Required.

Do not route all album actions through `FileOperationService`.

## Decision 5 — Centralized visual design system

**Status:** Proposed.

The distinctive visual language is shared enough to justify a dedicated theme/component boundary.

## Decision 6 — Private has a dedicated setup/authentication lifecycle

**Status:** Required.

The UI is not satisfied by a single authentication dialog.

## Decision 7 — Private storage is isolated

**Status:** Required.

Private must be protected at the storage/data boundary, not merely hidden in the UI.

## Decision 8 — Home aggregates; it does not own domain logic

**Status:** Proposed.

Home should compose information from repositories without becoming an application-wide state dump.

---

# 37. Implementation Order

The order is changed slightly to account for the new Album and UI-system boundaries.

## Phase 0 — Finalize product/security decisions

Before substantial implementation:

1. minimum Android version
2. target Android version
3. application ID/package
4. storage access model
5. virtual vs physical My Albums
6. protected Private storage mechanism
7. Private credential/recovery behavior
8. Trash retention model
9. exact supported image/video formats
10. final UI copy and action lists

## Phase 1 — Design system and app shell

Build the architecture for:

- theme
- typography
- dimensions
- shared cards/surfaces
- bottom navigation
- top bars
- grid primitives
- search bar
- dialogs/sheets
- selection overlay

Do not implement feature business logic here.

## Phase 2 — Storage/index foundation

Build:

- MediaStore access
- DocumentFile access where required
- scanner
- metadata
- Room index
- reconciliation
- refresh

## Phase 3 — Core navigation and Home

Build:

- AppNavHost
- Home
- bottom navigation
- quick access
- pinned folders
- recent media
- refresh

## Phase 4 — Albums

Build:

- Albums screen
- Device Albums
- My Albums
- Add Album
- Album Detail
- album cover behavior
- Add to Album

This phase depends on the album model decision.

## Phase 5 — Browse

Build:

- All
- My Albums
- Device Folders
- folder navigation
- breadcrumbs
- grid zoom
- sort/filter
- empty/loading/error states

## Phase 6 — Selection and file operations

Build:

- shared selection
- Move
- Copy
- Rename
- Bulk Rename
- Delete to Trash
- conflict handling
- create folder during Move
- undo

## Phase 7 — Favorites and Trash

Build:

- Favorites
- Trash
- restore
- permanent delete
- empty trash confirmation

## Phase 8 — Search

Build:

- Search UI
- query state
- filters
- public-media search
- Private exclusion

## Phase 9 — Viewer and File Info

Build:

- image viewer
- video viewer
- playback
- media-specific actions
- File Info
- containing-folder navigation

## Phase 10 — Private

Build and test independently:

- setup
- PIN
- pattern if retained
- biometric/device authentication
- protected storage
- private browser
- lock/session behavior
- isolation

## Phase 11 — Android Share import

Build:

- SEND/SEND_MULTIPLE
- destination picker
- album/folder destination
- create destination
- conflict handling

## Phase 12 — Image Editor

Build:

- editor shell
- crop
- transforms
- adjustments
- undo/redo
- save copy
- replace

## Phase 13 — Composition Editor

Build:

- canvas
- image objects
- transforms
- crop
- text
- stickers
- doodle
- frames
- project persistence
- reopen
- export

## Phase 14 — UI reconciliation pass

After functional implementation:

- compare every screen against the supplied designs
- verify navigation transitions
- verify overlay placement
- verify empty states
- verify selection behavior
- verify bottom navigation
- verify album/folder distinction
- verify Private setup/unlock flow
- verify editor controls

## Phase 15 — Final verification

High-risk regression testing:

1. Private isolation
2. Move/Copy/Delete
3. Trash restore
4. external rescan
5. album membership
6. selection
7. Android Share
8. image-editor save semantics
9. composition persistence
10. process recreation

---

# 38. Testing Plan

## Unit tests

Test:

- media classification
- sorting
- filtering
- search query parsing
- selection state
- bulk rename generation
- conflict resolution
- album membership rules
- favorite references
- folder preference persistence
- undo bookkeeping
- composition transformations
- Private session state transitions

## Repository tests

Test:

- media indexing
- folder indexing
- album persistence
- album membership
- favorites
- trash
- composition projects
- external reconciliation

## Storage integration tests

Test:

- file creation outside app
- file deletion outside app
- file move outside app
- app move
- app copy
- rename
- delete-to-trash
- restore
- permanent delete
- conflicts

## Private security tests

Highest priority.

Verify:

- Private media is absent from public index
- Private media is absent from search
- Private media is absent from Home recent media
- Private media is absent from normal album lists
- locking immediately prevents protected access
- authentication failure does not expose media
- process recreation does not leave protected content visible
- screenshots/thumbnail caches do not accidentally expose protected content where applicable

## UI tests

Test:

- bottom navigation
- Home quick access
- Albums navigation
- Browse scope switching
- folder detail
- selection mode
- context sheet
- Add to Album
- Move destination
- conflict dialog
- Favorites empty state
- Trash confirmation
- Private setup
- Private unlock
- biometric fallback
- PIN
- pattern if retained
- viewer
- image editor
- settings

---

# 39. Behavior and Edge Cases

## Albums

If an item is added to a virtual album:

- physical location does not change
- item remains available in its original folder
- deleting the album does not delete media
- removing from an album does not delete media

## Device folders

If a physical folder disappears:

- scanner marks/removes its index representation
- related UI updates automatically
- pinned references must degrade gracefully

## Album cover disappears

If the chosen manual cover is deleted/moved:

- automatically fall back to another album item
- if no items remain, show the album empty-state artwork

## Recent media

Private and Trash must never appear.

## Viewer after deletion

If the current item is deleted from the viewer:

- operation completes
- viewer moves to an adjacent valid item if available
- otherwise exits to the containing collection

## Selection after operation

After Move/Delete/etc.:

- remove successfully processed items from selection
- retain failed items if useful for retry/error explanation
- never claim success for failed items

## Permission loss

If permission is revoked:

- do not present an empty gallery as if there are no files
- show a permission/access state
- retain app metadata only where it is safe and useful
- recover after permission is restored and rescan is completed

## Private lock

When Private is locked:

- clear protected UI state that could reveal thumbnails
- do not retain sensitive previews in shared UI state
- public navigation remains usable

---

# 40. Files to Protect from Unnecessary Changes

Do not modify these for unrelated UI-only changes:

- `core/storage/*`
- `core/fileoperations/*`
- `core/private/*`
- `core/database/*`
- `feature/composition/*`
- `feature/editor/*`

Likewise:

- a visual Home change should not alter storage scanning
- an editor change should not alter album membership
- an album-card change should not alter file-operation rules
- a settings-row change should not alter Private storage
- a viewer layout change should not alter the scanner

Shared UI changes are appropriate only when the component genuinely owns the visual behavior being changed.

---

# 41. Files to Remove / Rename from the Earlier Plan

The earlier plan can be simplified/reorganized as follows.

### Replace

```text
feature/browser/...
```

with the revised Browser responsibility, while adding:

```text
feature/albums/...
```

### Add

```text
feature/search/...
feature/move/...
feature/albumactions/...
feature/private/PrivateSetupScreen.kt
feature/private/PrivateUnlockScreen.kt
feature/private/PrivateEntryScreen.kt
feature/private/PrivateGalleryScreen.kt
```

### Add shared design system

```text
shared/ui/theme/...
shared/ui/components/...
shared/ui/interaction/...
```

### Add album core boundary

```text
core/albums/...
```

### Add Private core boundary

```text
core/private/...
```

### Add media support boundary

```text
core/media/...
```

The purpose is not to maximize file count. Each added boundary corresponds to a real responsibility visible in the designed product.

---

# 42. Open Decisions

These still require confirmation/technical verification.

1. Minimum Android version.
2. Target Android version.
3. Final application ID/package.
4. Exact storage-access strategy.
5. Whether My Albums are virtual or physical folders.
6. Whether one media item can belong to multiple My Albums.
7. Whether deleting a My Album removes only membership/album definition or also performs physical file actions.
8. Exact Private protected-storage mechanism.
9. Whether Private supports both PIN and pattern or one is the primary credential with the other as an optional method.
10. Exact Private recovery/"Forgot pattern" behavior.
11. Whether biometric authentication is preferred before PIN/pattern.
12. Whether Private media can be shared/exported.
13. Whether Private media can be favorited.
14. Whether Private media can be added to My Albums.
15. Trash retention period.
16. Whether range selection is required for V1.
17. Exact definition of Recent Media.
18. Exact list of filters in Browse/Search.
19. Exact list of folder overflow actions.
20. Exact image/video format support after device compatibility testing.
21. Whether SVG is rendered natively or normalized through a media-processing layer.
22. Composition source strategy: reference source media or copy source media into project storage.
23. Whether composition project files are stored in Room, app-private files, or both.
24. Whether missing composition sources can be relinked in V1.

Security-sensitive decisions must not be invented by the Coder.

---

# 43. Acceptance Criteria — Revised

## Navigation

- Bottom navigation exposes Home, Albums, Browse.
- Private is reachable from the intended quick-access/security flow.
- Settings is reachable from the intended app-level control.
- Viewer/editor/composition workflows are secondary destinations.

## Home

- Greeting/header is displayed.
- Search is reachable.
- Refresh/rescan is available.
- Quick-access destinations work.
- Pinned folders are displayed.
- Recent media is displayed.
- Private and Trash do not leak into Recent Media.

## Albums

- Device Albums and My Albums are visually distinct.
- User can create My Albums.
- Album detail opens.
- Album cover behavior works.
- Add to Album does not unexpectedly perform Move/Copy when albums are virtual.
- Empty album state works.

## Browse

- All/My Albums/Device Folders scopes work.
- Folder navigation works.
- Breadcrumbs work.
- Sort/filter works.
- Grid zoom works.
- Empty/loading/error/permission states are distinct.

## Selection

- Long press enters selection.
- Multi-select works.
- Select all works.
- Count is visible.
- Actions are context-aware.

## File operations

- Move works.
- Copy works.
- Rename works.
- Bulk rename works.
- Delete moves to Trash.
- Conflicts never overwrite silently.
- Replace/Keep both/Skip/Apply to all work.
- Undo works for supported reversible operations.
- Partial failures are reported accurately.

## Favorites

- Favorites show correct media.
- Empty Favorites state matches the design.
- Removing favorite does not delete the media.

## Trash

- Trash displays deleted media.
- Restore works.
- Permanent delete works.
- Empty Trash confirmation is destructive and explicit.

## Viewer

- Images display full screen.
- Videos play correctly.
- Video controls work.
- Media-specific actions appear correctly.
- File Info is reachable.

## Private

- First launch can configure the Private Gallery.
- PIN setup and confirmation work if enabled.
- Pattern setup/confirmation works if retained.
- Biometric/device authentication works when available.
- Private content is protected.
- Private content is excluded from public browsing/search/Home/Albums.
- Locking removes protected content from active UI state.
- Recovery behavior is explicit and secure.

## Image editor

- Crop works.
- Rotate/flip/resize work.
- Adjustments work.
- Undo/redo/reset work.
- Save as copy works.
- Replace original works.
- Original preservation remains the default where applicable.

## Composition

- Multiple images can be independently manipulated.
- Canvas configuration works.
- Text/stickers/doodle/frame work.
- Projects remain editable.
- Projects reopen without losing state.
- Export works.

## Android Share

- SEND/SEND_MULTIPLE can enter the app.
- User chooses destination.
- Destination can be created where supported.
- Import conflicts follow the shared rules.

## Settings

- Theme setting works.
- Grid preference works.
- Sort preference works.
- Delete confirmation works.
- Trash behavior works.

---

# 44. Coder Handoff

## Build

Build the Gallery Manager according to the revised UI hierarchy and architecture in this document.

The UI design is the behavioral reference.

The implementation must not force the designed workflows into the older four-destination model.

## Start here

1. Finalize storage/security/album decisions.
2. Build the shared visual design system.
3. Build storage/indexing.
4. Build App shell + Home/Albums/Browse navigation.
5. Build Albums.
6. Build Browse.
7. Build selection and file operations.
8. Build Favorites/Trash/Search.
9. Build Viewer/File Info.
10. Build Private and test its isolation.
11. Build Share import.
12. Build Image Editor.
13. Build Composition Editor.
14. Run a screen-by-screen UI reconciliation pass.

## Communication rules

Use:

```text
UI
 ↓
ViewModel
 ↓
service/repository
 ↓
storage/database
```

Do not:

- access Android storage directly from Composables
- perform database queries directly in screens
- put Private credential logic in a screen
- put file-operation rules in a context menu
- put album membership rules in a grid
- put image-processing code in the editor Composable
- put composition persistence in the renderer
- put business logic in navigation

## Preserve

- gallery-only media scope
- no document/ebook viewer behavior
- non-destructive editing by default
- Favorites as references
- Trash semantics
- conflict safety
- Private isolation
- editable composition projects
- external storage reconciliation
- album membership semantics once finalized

## Do not unnecessarily touch

- storage when changing UI
- Private security when changing public gallery UI
- file operations when changing album-card presentation
- composition code when changing Home
- editor code when changing Browse
- navigation business logic when changing a screen's internal layout

## Completion standard

The implementation is complete only when:

- the functional acceptance criteria pass
- the UI follows the supplied screen hierarchy
- all major designed states are represented
- the three-item bottom navigation behaves correctly
- Albums and Browse remain conceptually distinct
- Add to Album is not confused with Move/Copy
- Private is actually protected and isolated
- file operations are centralized
- external changes reconcile
- image editing is non-destructive by default
- composition projects remain editable
- high-risk tests pass
- no out-of-scope document viewer has been introduced

---

# 45. Final Architecture Map

The revised product should be understood as:

```text
                         APP SHELL
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
            HOME          ALBUMS        BROWSE
              │             │             │
      ┌───────┼──────┐      │       ┌────┼─────┐
      ↓       ↓      ↓      ↓       ↓    ↓     ↓
   Recent  Pinned Quick   Device   All  My   Device
   Media   Folders Access Albums Albums Albums Folders
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                     Shared Media Grid
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
       Selection          Viewer            Info
          │                 │
          ├──────┬──────────┤
          ↓      ↓          ↓
        Move   Copy       Actions
          │      │          │
          └──────┼──────────┘
                 ↓
          FileOperationService
                 │
                 ↓
              Storage

Separate application-managed collections:

Favorites ─────→ media references
My Albums ─────→ album membership

Separate protected boundary:

Private
   ↓
Authentication
   ↓
Protected Session
   ↓
Protected Storage

Editing:

Viewer
  ↓
Image Editor
  ↓
Save Copy / Replace

Composition:

Viewer / Album / Browse
  ↓
Composition Editor
  ↓
Editable Project
  ↓
Export
```

---

# 46. Final Architectural Principle

The supplied UI design is not merely a visual skin.

It establishes the intended interaction model:

- Home is a dashboard.
- Albums is its own destination.
- Browse is a media/folder exploration surface with scopes.
- Private is a protected workflow.
- Add to Album is a distinct organization action.
- Viewer and editors are dedicated workflows.
- Sheets/dialogs handle contextual actions.
- The visual language is consistent enough to require shared UI primitives.

Therefore the implementation architecture should be **mapped to the designed user experience**, not the other way around.

The Coder should use this document as the implementation plan and use the supplied UI reference as the visual/interaction evidence when implementing each screen.
