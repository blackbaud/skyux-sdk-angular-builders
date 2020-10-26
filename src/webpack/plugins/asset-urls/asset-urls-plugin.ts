import {
  Compiler
} from 'webpack';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

import {
  addAssetSourceTap
} from '../../webpack-stats-utils';

const PLUGIN_NAME = 'skyux-asset-urls-plugin';

/**
 * This plugin replaces any asset paths located in the bundle with absolute URLs.
 * Background: Angular's `@ngtools/webpack` plugin overrides all Webpack TypeScript loaders,
 * so we can only alter the contents of the JavaScript bundle after the compilation is done.
 * @see https://github.com/angular/angular-cli/issues/16544#issuecomment-571245469
 */
export class SkyuxAssetUrlsPlugin {

  constructor(
    private options: {
      assetBaseUrl: string;
    }
  ) { }

  public apply(compiler: Compiler): void {
    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content: string) => {

        const ASSETS_REGEX = /("|')assets\/.*?\.[\.\w]+("|')/gi;
        const processedFiles: string[] = [];

        content.match(ASSETS_REGEX)?.forEach(filePath => {
          if (!processedFiles.includes(filePath)) {
            processedFiles.push(filePath);

            const baseUrl = ensureTrailingSlash(this.options.assetBaseUrl);
            const url = `${baseUrl}${filePath.replace(/\\/g, '/').replace(/("|')/g, '')}`;

            content = content.replace(
              new RegExp(filePath, 'gi'),
              `"${url}"`
            );
          }
        });

        return content;
      }
    );
  }

}
