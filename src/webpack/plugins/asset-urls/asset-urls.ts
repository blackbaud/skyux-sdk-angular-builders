import {
  Compiler
} from 'webpack';

import {
  SkyuxAssetService
} from '../../../shared/asset-service';

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

  constructor(
    private assetService: SkyuxAssetService
  ) { }

  public apply(compiler: Compiler): void {
    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content: string) => this.assetService.replaceAssetPaths(content)
    );
  }

}
