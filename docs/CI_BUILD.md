# GitHub Actions build

The CI workflow is `.github/workflows/build-apk.yml`.

It intentionally does not require a checked-in Gradle wrapper: the workflow provisions Gradle 8.10.2 with the official Gradle setup action. This keeps the empty GitHub repository easy to bootstrap while still giving us a reproducible CI Gradle version.

The first successful CI run is the first real compile/lint/test signal for this project because the current authoring environment does not contain an Android SDK or Gradle installation.
