import fs from 'fs-extra';

import webpack from 'webpack';

import {
  SkyuxAppAssets
} from '../../../shared/app-assets';

import {
  modifyBundleContents
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
    compiler.hooks.emit.tap(
      PLUGIN_NAME,
      (compilation) => {
        this.replaceAssetPaths(compilation);
        this.writeHashedAssets(compilation);
        this.writeAppAssetsService(compilation);
      }
    );
  }

  /**
   * Replaces unhashed asset file names found within compiled scripts
   * with the hashed file names.
   */
  private replaceAssetPaths(compilation: webpack.compilation.Compilation): void {
    modifyBundleContents(compilation, (content) => {
      for (const [relativeUrl, asset] of Object.entries(this.config.assetsMap)) {

        // Replace HTML attributes.
        content = content.replace(
          new RegExp(regexEscape(`"${relativeUrl}"`), 'gi'),
          `"${asset.hashedUrl}"`
        );

        // Replace CSS background image URLs.
        // (Angular flattens all asset paths in CSS, so just search for the file name.)
        const replacement = `url(${asset.hashedUrl})`;
        content = content.replace(
          new RegExp(regexEscape(`url(/${relativeUrl})`), 'g'),
          replacement
        )
          // Account for quoted URLs.
          .replace(
            new RegExp(regexEscape(`url(\\"/${relativeUrl}\\")`), 'g'),
            replacement
          );
      }

      return content;
    });
  }

  /**
   * Create duplicates of all files found in the `src/assets` folder,
   * using hashed file names.
   */
  private writeHashedAssets(compilation: webpack.compilation.Compilation): void {
    for (const [_relativeUrl, asset] of Object.entries(this.config.assetsMap)) {
      const contents = fs.readFileSync(asset.absolutePath);
      compilation.assets[asset.hashedFileName] = {
        source() {
          return contents;
        }
      };
    }
  }

  private writeAppAssetsService(compilation: webpack.compilation.Compilation): void {
    const values: {[_:string]: string} = {};
    for (const [relativeUrl, asset] of Object.entries(this.config.assetsMap)) {
      values[relativeUrl.replace('assets/', '')] = asset.hashedUrl;
    }
    const stringified = JSON.stringify(values);
    const replacement = `this.__SKYUX_APP_ASSETS_VALUES=${stringified}`;

    modifyBundleContents(compilation, (content) => {
      content = content
        .replace('this.__SKYUX_APP_ASSETS_VALUES = {}', replacement)
        .replace('this.__SKYUX_APP_ASSETS_VALUES={}', replacement);
      return content;
    });
  }

}
