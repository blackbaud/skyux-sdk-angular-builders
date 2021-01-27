import fs from 'fs-extra';

import webpack from 'webpack';

import {
  SkyuxAppAssets
} from '../../../shared/app-assets';

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
export class SkyuxAppAssetsPlugin {

  constructor(
    private config: {
      assetsMap: SkyuxAppAssets
    }
  ) { }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {

      Object.keys(this.config.assetsMap).forEach(filePath => {
        const asset = this.config.assetsMap[filePath];
        const contents = fs.readFileSync(asset.absolutePath);

        compilation.assets[asset.hashedRelativePath] = {
          source() {
            return contents;
          },
          size() {
            return contents.length;
          }
        };
      });

    });

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
