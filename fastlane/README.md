fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build app

### android upload

```sh
[bundle exec] fastlane android upload
```

Upload to Play Store

### android internal

```sh
[bundle exec] fastlane android internal
```

Release Internal

### android release

```sh
[bundle exec] fastlane android release
```

Release

### android increment_version

```sh
[bundle exec] fastlane android increment_version
```



----


## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

build app

### ios upload

```sh
[bundle exec] fastlane ios upload
```

upload to testflight

### ios sandbox

```sh
[bundle exec] fastlane ios sandbox
```

Sandbox Release

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
