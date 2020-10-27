import {
  Compiler
} from 'webpack';

import {
  SkyuxApplicationAssetState
} from '../../app-asset-state';

import {
  addWebpackAssetsEmitTap
} from '../../webpack-utils';

const PLUGIN_NAME = 'skyux-asset-urls-plugin';

/**
 * This plugin replaces any asset paths located in the bundle with absolute URLs.
 * Background: Angular's `@ngtools/webpack` plugin overrides all Webpack TypeScript loaders,
 * so we can only alter the contents of the JavaScript bundle after the compilation is done.
 * @see https://github.com/angular/angular-cli/issues/16544#issuecomment-571245469
 */
export class SkyuxAssetUrlsPlugin {
  public apply(compiler: Compiler): void {
    addWebpackAssetsEmitTap(
      PLUGIN_NAME,
      compiler,
      (content) => SkyuxApplicationAssetState.replaceFilePaths(content)
    );
  }
}
