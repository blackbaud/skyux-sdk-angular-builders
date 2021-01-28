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

function regexEscape(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
    this.writeHashedAssets(compiler);
    this.replaceAssetPaths(compiler);
  }

  /**
   * Create duplicates of all files found in the `src/assets` folder,
   * using hashed file names.
   */
  private writeHashedAssets(compiler: webpack.Compiler): void {
    compiler.hooks.emit.tap(
      PLUGIN_NAME,
      (compilation) => {
        for (const [_fileName, asset] of Object.entries(this.config.assetsMap)) {
          const contents = fs.readFileSync(asset.absolutePath);
          compilation.assets[asset.hashedFileName] = {
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
        for (const [_fileName, asset] of Object.entries(this.config.assetsMap)) {

          // Replace HTML attributes.
          content = content.replace(
            new RegExp(regexEscape(`"${asset.relativeUrl}"`), 'gi'),
            `"${asset.hashedAbsoluteUrl}"`
          );

          // Replace CSS background image URLs.
          // (Angular flattens all asset paths in CSS, so just search for the file name.)
          const replacement = `url(${asset.hashedAbsoluteUrl})`;
          content = content.replace(
            new RegExp(regexEscape(`url(/${asset.relativeUrl})`), 'g'),
            replacement
          )
            // Account for quoted URLs.
            .replace(
              new RegExp(regexEscape(`url(\\"/${asset.relativeUrl}\\")`), 'g'),
              replacement
            );
        }

        return content;
      }
    );
  }
}
