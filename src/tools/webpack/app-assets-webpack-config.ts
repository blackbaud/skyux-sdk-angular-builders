import glob from 'glob';

import hasha from 'hasha';

import path from 'path';

import webpack from 'webpack';

import { ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxAppAssetsPlugin } from './plugins/app-assets/app-assets.plugin';

import { SkyuxAppAssets } from './app-assets';

/**
 * Creates an object which maps relative asset paths to absolute URLs with hashed file names.
 * @param assetBaseUrl The base URL where the assets are served.
 */
function createAppAssetsMap(assetsBaseUrl: string): SkyuxAppAssets {
  const assetsMap: SkyuxAppAssets = {};

  // Find all asset file paths.
  const filePaths = glob.sync(path.join(process.cwd(), 'src/assets/**/*'), {
    nodir: true
  });

  // Create a hashed version of each path.
  filePaths.forEach((filePath) => {
    const baseUrl = ensureTrailingSlash(assetsBaseUrl);

    const relativeUrl = filePath.replace(
      path
        .join(process.cwd(), 'src/')
        // Glob always returns file paths with a forward-slash separator.
        // Replace Windows' backward slashes before running the replacement.
        .replace(/\\/g, '/'),
      ''
    );

    const parsed = path.parse(relativeUrl);

    /**
     * Create a hash from the file path.
     * The md5 algorithm is sufficient for "cache busting".
     * @see https://blog.risingstack.com/automatic-cache-busting-for-your-css/#cssandcachebusting
     */
    const hash = hasha.fromFileSync(filePath, {
      algorithm: 'md5'
    });

    const hashedFileName = `${parsed.name}.${hash}${parsed.ext}`;

    assetsMap[relativeUrl] = {
      absolutePath: filePath,
      hashedUrl: `${baseUrl}${hashedFileName}`,
      hashedFileName
    };
  });

  return assetsMap;
}

export function applyAppAssetsWebpackConfig(
  webpackConfig: webpack.Configuration,
  assetsBaseUrl: string = ''
): void {
  const assetsMap = createAppAssetsMap(assetsBaseUrl);
  const processedAssetsMap: { [_: string]: string } = {};
  for (const [relativeUrl, asset] of Object.entries(assetsMap)) {
    processedAssetsMap[relativeUrl.replace('assets/', '')] = asset.hashedUrl;
  }

  webpackConfig.module = webpackConfig.module || {
    rules: []
  };

  webpackConfig.module.rules.push({
    enforce: 'pre',
    test: /(\/|\\)__skyux(\/|\\)app-assets-map\.json$/,
    use: {
      loader: path.resolve(__dirname, './loaders/app-assets/app-assets.loader'),
      options: {
        assetsMapStringified: JSON.stringify(processedAssetsMap)
      }
    }
  });

  webpackConfig.plugins!.push(
    new SkyuxAppAssetsPlugin({
      assetsMap
    })
  );
}
