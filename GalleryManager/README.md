# Gallery Manager

Gallery Manager is an Android image/video gallery manager built from the supplied UI designs and the reconciled implementation plan.

## Build on GitHub

The repository includes a GitHub Actions workflow at `.github/workflows/build-apk.yml`.

It runs on:
- pushes to `main`
- pull requests
- manual **Run workflow**

The workflow:
1. checks out the repository;
2. installs JDK 17;
3. provisions Gradle 8.10.2;
4. provisions Android SDK/API 35;
5. runs `testDebugUnitTest` and `lintDebug`;
6. builds the debug APK;
7. uploads the APK as the `GalleryManager-debug-apk` workflow artifact.

## Downloading the APK

After a successful workflow run, open the run in GitHub and download the **GalleryManager-debug-apk** artifact.

## Product decisions

The project records the locked product decisions in `docs/PHASE_0_DECISIONS.md` and `docs/PRODUCT_DECISIONS.md`.

Key decisions include:
- Android 10+
- `com.coconutshell.gallerymanager`
- MediaStore for public media
- virtual My Albums
- centralized file operations with explicit conflict handling and Undo
- 30-day Trash
- Favorites as a virtual collection
- broad image/video support
- non-destructive editing
- editable compositions
- Private as protected app-private encrypted storage, isolated from normal/system gallery

## Scope

Images and videos only. Document/ebook viewing is intentionally out of scope.

## Local build

A local Android Studio environment with JDK 17, Android SDK API 35, and Gradle 8.10.2 is recommended. The GitHub workflow is the authoritative CI build until local/device verification is available.

## Current implementation status

See `docs/IMPLEMENTATION_STATUS.md` for the current feature and verification status.
