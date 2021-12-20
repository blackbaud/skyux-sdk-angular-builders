# 5.0.0-beta.3 (2021-12-20)

- Fixed a bug with inline dependencies in the UMD bundle to properly handle CSS that contains square brackets. [#118](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/118)

# 5.0.0-beta.2 (2021-11-18)

- Fixed a build issue for Windows. [#116](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/116)

# 5.0.0-beta.1 (2021-11-12)

- Fixed the peer dependency version for `ng-packagr`. [#115](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/115)
- Fixed the `ng-packagr` builder to inline external resources for the UMD bundle generated for testing modules. [#115](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/115)

# 5.0.0-beta.0 (2021-11-11)

- Removed the `dev-server`, `karma`, and `protractor` builders. [#114](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/114)
- Added the `ng-packagr` builder. [#114](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/114)

# 5.0.0-alpha.0 (2021-04-27)

- Removed all features specific to the SKY UX Host platform. [#110](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/110) [#111](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/111)

# 4.0.0-alpha.35 (2021-04-22)

- Added support for `chromedriver-version-matcher` for the `protractor` builder. [#107](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/107)
- Added functionality to abort the `protractor` and `karma` builders if no spec files are found. [#107](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/107)
- Added functionality to allow serving multiple applications at once. [#104](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/104)
- Updated all builders to provide values for the `SkyAppConfig` provider. [#106](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/106)
- Added a polyfill to address a bug with the `dragula` package. [#109](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/109)

# 4.0.0-alpha.34 (2021-04-13)

- Updated the `browser` builder to accept the `--skyux-serve` argument which serves the build results on SKY UX Host (for local testing purposes). [#96](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/96)
- Updated the `ng add` schematic to automatically setup the viewkeeper service. [#98](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/98)
- Updated the `browser` builder to enforce a build target of `'es5'` to maintain support for IE 11. [#94](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/94)
- Updated the `SkyuxOpenHostUrlPlugin` to better handle the order of assets sent to SKY UX Host. [#95](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/95)
- Added support for `SkyAppAssetsTestService`. [#97](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/97)

# 4.0.0-alpha.33 (2021-04-07)

- Fixed lazy-loaded script URLs to include the base HREF. [#91](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/91)

# 4.0.0-alpha.32 (2021-04-02)

- Fixed the app assets service to supply the correct base HREF for asset URLs. [#86](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/86)
- Fixed the fallback test variable for ES5 script chunks. [#88](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/88)

# 4.0.0-alpha.31 (2021-04-02)

- Added `SkyThemeService` to the `SkyuxModule` providers. [#87](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/87)

# 4.0.0-alpha.30 (2021-04-01)

- Fixed the `browser` builder to run skyux and startup configurations. [#84](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/84)

# 4.0.0-alpha.29 (2021-04-01)

- Fixed the application assets service to format file paths correctly for OSX machines. [#83](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/83)

# 4.0.0-alpha.28 (2021-04-01)

- Fixed the application assets service to format file paths correctly for Windows machines. [#80](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/80)

# 4.0.0-alpha.27 (2021-03-31)

- Added the `SkyAppOmnibarTitleService`. [#77](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/77)

# 4.0.0-alpha.26 (2021-03-31)

- Added the `skyux-app-shell` component which sets up omnibar, help, and other shell components configured in `skyuxconfig.json`. [#72](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/72)
- Updated the `ng add` schematic to add SKY UX Theme stylesheets to `angular.json`. [#72](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/72)

# 4.0.0-alpha.25 (2021-03-30)

- Added `params` to `skyuxconfig-schema.json`. [#66](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/66)
- Updated `SkyuxOpenHostUrlPlugin` to send stylesheets to SKY UX Host. [#67](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/67)
- Removed the `--skyux-launch` option from `ng serve`. [#68](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/68)
- Updated `SkyuxHostMetadataPlugin` to append Webpack stylesheet assets to the `metadata.json` file, including fallback tests. [#69](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/69)
- Fixed the `host.url` property of `skyuxconfig.json` to throw an error if the URL includes a trailing slash. [#70](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/70)

# 4.0.0-alpha.24 (2021-03-16)

- Added support for `@skyux/config@4.4.0`. [#64](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/64)

# 4.0.0-alpha.23 (2021-03-15)

- Updated the `SkyuxOpenHostUrlPlugin` to send `externals` and `bbCheckout` values to SKY UX Host. [#61](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/61)

# 4.0.0-alpha.22 (2021-03-11)

- Implemented basic support for the `skyuxconfig.json` file. [#60](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/60)
- Changed the default SKY UX Host URL from `https://app.blackbaud.com/` to `https://host.nxt.blackbaud.com/`. [#60](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/60)
- Added ability to send external JavaScript and CSS files to SKY UX Host. [#60](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/60)

# 4.0.0-alpha.21 (2021-02-25)

- Fixed the `SkyuxSaveHostMetadataPlugin` to only include JavaScript files in `metadata.json`. [#58](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/58)

# 4.0.0-alpha.20 (2021-02-25)

- Upgraded development and peer dependencies. [#57](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/57)

# 4.0.0-alpha.19 (2021-02-10)

- Removed the `@angular/cdk` dependency. [#56](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/56)

# 4.0.0-alpha.18 (2021-02-09)

- Added module and provider for `SkyAppAssetsService` in `@skyux/asssets`. [#54](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/54)

# 4.0.0-alpha.17 (2021-01-26)

- Updated the package dependencies. [#52](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/52)

# 4.0.0-alpha.16 (2021-01-21)

- Updated the Protractor builder to work well with `@skyux-sdk/e2e@4.0.1`. [#50](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/50)

# 4.0.0-alpha.15 (2021-01-15)

- Fixed the Protractor builder to merge configs properly. [#49](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/49)

# 4.0.0-alpha.14 (2021-01-14)

- Fixed the Protractor builder to run e2e tests on localhost, instead of SKY UX Host. [#48](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/48)

# 4.0.0-alpha.13 (2021-01-14)

- Added a builder to run Protractor e2e tests. [#47](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/47)
- Removed the `ng test --skyux-headless` argument; the Angular CLI `--browsers=ChromeHeadless` argument should be used instead. [#46](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/46)
- Fixed the regular expression used for asset hashing to handle similarly named file paths. [#46](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/46)

# 4.0.0-alpha.12 (2021-01-06)

- Added support for running unit tests in "headless" mode. [#45](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/45)

# 4.0.0-alpha.11 (2020-12-10)

- Updated the test application and default `karma.conf.js` file to what `@angular/cli@11.0.4` provides when generating a new application. [#43](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/43)

# 4.0.0-alpha.10 (2020-12-09)

- Fixed the location of the code coverage directory. [#42](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/42)

# 4.0.0-alpha.9 (2020-12-09)

- Updated the `ng-add` schematic to modify a library's `karma.conf.js` file. [#41](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/41)

# 4.0.0-alpha.8 (2020-12-08)

- Updated the `ng-add` schematic to modify an application's `karma.conf.js` file. [#40](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/40)

# 4.0.0-alpha.7 (2020-12-08)

- Added a builder to run Karma unit tests. [#32](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/32)
- Fixed ahead-of-time builds to load the `polyfills.js` script first. [#37](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/37)
- Removed the deprecated `servePathDefaultWarning` option from the `dev-server` builder. [#35](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/35)

# 4.0.0-alpha.6 (2020-11-19)

- Added support for `@angular-devkit/build-angular@0.1100.0`. [#34](https://github.com/blackbaud/skyux-sdk-angular-builders/pull/34)

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
