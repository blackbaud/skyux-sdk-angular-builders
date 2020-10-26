import {
  Compiler
} from 'webpack';

import {
  SkyuxApplicationAssetHelper
} from '../../app-asset-helper';

import {
  addAssetSourceTap
} from '../../webpack-stats-utils';

const PLUGIN_NAME = 'skyux-asset-urls-plugin';

/**
 * Angular's `@ngtools/webpack` plugin overrides all Webpack TypeScript loaders.
 * This plugin replaces any asset paths located in the compiled JavaScript bundle with
 * absolute URLs pointing to SKY UX Host.
 */
export class SkyuxAssetUrlsPlugin {
  public apply(compiler: Compiler): void {
    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content: string) => SkyuxApplicationAssetHelper.replaceAssetPaths(content)
    );
  }

}
