# Gallery Manager — Web Migration

This is the first web-first implementation pass for GalleryManager.

## Run

Open `web/index.html` in Acode/browser. The browser build uses the deterministic sample runtime by default and requires no network assets.

There are 30 local PNG sample media assets under `assets/sample-media/`.

## Architecture

`feature → application service → contract/runtime adapter`

The default runtime is the sample adapter. An Android package can select the Android adapter with:

```text
?runtime=android
```

or by setting `window.GALLERY_RUNTIME = "android"` before bootstrap.

The Android adapter intentionally contains only the JS/native boundary; the actual bridge names are the contract to be implemented by the Android host.

## Product boundaries preserved

- Home, Albums, and Browse remain distinct.
- My Albums are virtual membership collections.
- Favorites are virtual.
- Trash is a separate lifecycle with restore/permanent delete.
- Private is a separate protected boundary.
- Search is a feature.
- Editor and Composition are separate workspaces.
- `index.html` remains the document shell.

## Development-only note

The browser Private runtime is a functional simulation for UI/application development. It is **not** a security boundary and must never be treated as production private storage. Production Private security remains Android-owned, as required by the migration architecture.

## No-build workflow

The web tree deliberately uses classic script files instead of ES-module imports so a directly opened local `index.html` can run in environments that restrict `file://` module imports.


## Home screen reference update

The Home feature is implemented in:
- `js/features/home/home-screen.js`
- `css/features/home.css`
- `assets/home-wallpaper.svg`

The Home surface follows the supplied mobile reference: greeting/settings header, translucent search, 2x2 quick-access cards, horizontally swipeable pinned folders with folder names below their sample covers, horizontally swipeable recent media, and persistent bottom navigation.
