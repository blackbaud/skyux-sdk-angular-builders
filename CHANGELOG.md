# 4.0.0-alpha.5 (2020-11-06)

- Updated the `dev-server` builder to set `skyuxLaunch` to `"host"` in the project's `angular.json` file. [#33](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/33)

# 4.0.0-alpha.4 (2020-10-28)

- Fixed the release.

~~# 4.0.0-alpha.3 (2020-10-28)~~

- Updated the `dev-server` builder to launch an Angular CLI application with the SKY UX Host server. [#16](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/16)
- Updated the `dev-server` builder to send the `app-root` tag name to the SKY UX Host server to bootstrap the application. [#19](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/19)
- Updated the `browser` builder to write a `metadata.json` file to the `dist` folder (to be used by `skyux-deploy` library). [#17](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/17)
- Updated the `browser` and `dev-server` builders to prefix application asset paths with the `--deployUrl`. [#29](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/29)
- Updated the `browser` and `dev-server` builders to hash application asset file names that exist in a component's HTML and TypeScript files. [#29](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/29)
- Removed the `skyux-upgrade-dependencies` builder to investigate a more graceful solution. [#9](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/9)

# 4.0.0-alpha.2 (2020-08-28)

- Fixed the `skyux-upgrade-dependencies` builder to ignore dependencies that are already on the latest supported versions. [#7](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/7)

# 4.0.0-alpha.1 (2020-08-28)

- Added the missing dependencies `fs-extra`, `latest-version`, and `semver`. [#6](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/6)

# 4.0.0-alpha.0 (2020-08-28)

- Initial alpha release.
