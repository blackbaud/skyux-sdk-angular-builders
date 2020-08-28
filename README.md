# @skyux-sdk/angular-builders
[![npm](https://img.shields.io/npm/v/@skyux-sdk/angular-builders.svg)](https://www.npmjs.com/package/@skyux-sdk/angular-builders)
[![status](https://travis-ci.org/blackbaud/skyux-sdk-angular-builders.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-sdk-angular-builders)
[![coverage](https://codecov.io/gh/blackbaud/skyux-sdk-angular-builders/branch/master/graphs/badge.svg?branch=master)](https://codecov.io/gh/blackbaud/skyux-sdk-angular-builders/branch/master)

## Installation

Within the directory of an Angular CLI application, run:

```
ng add @skyux-sdk/angular-builders
```

## Usage

### Upgrading SKY UX package dependencies

This builder automatically upgrades all Angular and SKY UX packages to their latest supported versions.

- `ng run my-project:skyux-upgrade-dependencies`
- Add `--dry-run` to see the updates but leave your `package.json` file unaffected.

## Local setup

- Run `npm start` for local development; changes are transpiled automatically after each file is saved.
- If you clone this project in the same directory as your Angular CLI project, you can add it via `ng add ../skyux-sdk-angular-builders`.
- Run `npm run build` to create the distribution package.