import fs from 'fs-extra';

import webpack from 'webpack';

import {
  SkyuxAppAssets
} from '../../../shared/app-assets';

import {
  addWebpackAssetsEmitTap
} from '../../webpack-utils';

const PLUGIN_NAME = 'skyux-asset-urls-plugin';

interface SkyuxAppAssetsPluginConfig {
  assetsMap: SkyuxAppAssets;
}

/**
 * This plugin replaces any asset paths located in the bundle with absolute URLs.
 * Background: Angular's `@ngtools/webpack` plugin overrides all Webpack TypeScript loaders,
 * so we can only alter the contents of the JavaScript bundle after the compilation is done.
 * @see https://github.com/angular/angular-cli/issues/16544#issuecomment-571245469
 */
export class SkyuxAppAssetsPlugin {

  constructor(
    private config: SkyuxAppAssetsPluginConfig
  ) { }

  public apply(compiler: webpack.Compiler): void {
    this.createHashedAssets(compiler);
    this.replaceAssetPaths(compiler);
  }

  /**
   * Create duplicates of all files found in the `src/assets` folder,
   * using hashed file names.
   */
  private createHashedAssets(compiler: webpack.Compiler): void {
    compiler.hooks.emit.tap(
      PLUGIN_NAME,
      (compilation) => {
        for (const [_filePath, asset] of Object.entries(this.config.assetsMap)) {
          const contents = fs.readFileSync(asset.absolutePath);
          compilation.assets[asset.hashedRelativePath] = {
            source() {
              return contents;
            },
            size() {
              return contents.length;
            }
          };
        }
      }
    );
  }

  /**
   * Replaces unhashed asset file names found within compiled scripts
   * with the hashed file names.
   */
  private replaceAssetPaths(compiler: webpack.Compiler): void {
    addWebpackAssetsEmitTap(
      PLUGIN_NAME,
      compiler,
      (content) => {
        for (const [filePath, asset] of Object.entries(this.config.assetsMap)) {
          content = content.replace(
            new RegExp(`"${filePath}"`, 'gi'),
            `"${asset.hashedUrl}"`
          );
        }
        return content;
      }
    );
  }
}
