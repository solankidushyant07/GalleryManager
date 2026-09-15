# Gallery Manager — Implementation Status

## Current state

The project has moved from foundation-only work into a broad functional implementation pass. Product decisions 1–31 are recorded and the main user-facing routes are wired.

## Implemented in the current pass

- MediaStore public image/video indexing with reconciliation.
- Android-version-aware media permission handling, including Android 14 selected-media permission.
- Virtual My Albums with create/rename/delete/pin and membership persistence.
- Album detail and device-folder detail routes.
- Browse scopes scaffold with sorting, grid-density control, selection, Select All, Add to Album, and Trash actions.
- Favorites persistence and Favorites screen.
- Trash persistence with backup copies, restore, permanent delete, and 30-day purge support.
- Central file-operation service for rename/copy/move with explicit conflict policy and undo tokens.
- Search over indexed file name/type data, with the UI positioned for the broader filename/folder/album/metadata search requirement.
- Image/video viewer foundation with native Media3 video playback and zoom gestures.
- Dedicated File Info screen.
- Private vault using app-internal storage and AES-GCM encrypted `.gmprivate` blobs, with PIN/pattern credentials and device-authentication path.
- Share/import entry point for image/video content.
- Non-destructive image editing export path with rotation and adjustment controls.
- Editable composition project persistence plus 2–9 image selection, layout preview, save-project, and flattened export.
- Persistent settings model for grid density, sorting, auto-scan, Trash retention, biometric unlock, and theme.
- Navigation to Home, Albums, Browse, Search, Favorites, Trash, Private, Settings, Viewer, File Info, Import, Editor, and Composition.

## Important security/design choices

Private content is not protected by changing a file extension. Private media is stored inside app-private storage, encrypted with an Android Keystore AES-GCM key, and represented by opaque `.gmprivate` files. The normal MediaStore scanner does not index those files, so they do not appear in the public/system gallery.

## Remaining work

The next pass is primarily hardening and reconciliation rather than adding another foundation:
- compile-time/API verification in Android Studio;
- runtime permission behavior on real Android 10–15 devices;
- exact UI reconciliation against all supplied screenshots;
- stronger operation history/undo UX;
- richer search indexes for folders/albums/date/size;
- full Move/Copy destination picker and conflict dialog UX;
- real gesture-pattern setup UI refinements;
- viewer next/previous/swipe-down navigation;
- editor crop/flip/drawing/text/sticker polish;
- composition project editing/reopening UI;
- notification integration for genuinely long operations;
- private-vault leakage/lock-state tests;
- final regression and device testing.

This status deliberately distinguishes implemented foundations from items that still need device/build verification.
