import glob from 'glob';
import hasha from 'hasha';
import path from 'path';
import webpack from 'webpack';

import { ensureTrailingSlash } from '../../shared/url-utils';
import { SkyuxAppAssets } from './app-assets';
import { SkyuxAppAssetsPlugin } from './plugins/app-assets/app-assets.plugin';

/**
 * Creates an object which maps relative asset paths to absolute URLs with hashed file names.
 * @param assetBaseUrl The base URL where the assets are served.
 */
function createAppAssetsMap(
  assetsBaseUrl: string,
  baseHref: string
): SkyuxAppAssets {
  const assetsMap: SkyuxAppAssets = {};

  // Find all asset file paths.
  const filePaths = glob.sync(path.join(process.cwd(), 'src/assets/**/*'), {
    nodir: true
  });

  // Create a hashed version of each path.
  filePaths.forEach((filePath) => {
    const baseUrl = ensureTrailingSlash(assetsBaseUrl);

    // Get the asset's URL, relative to the src directory.
    const relativeUrl = filePath.replace(
      path
        .join(process.cwd(), 'src/')
        // Glob always returns file paths with a forward-slash separator.
        // Replace Windows' backward slashes before running the replacement.
        .replace(/\\/g, '/'),
      ''
    );

    /**
     * Create a hash from the file path.
     * The md5 algorithm is sufficient for "cache busting".
     * @see https://blog.risingstack.com/automatic-cache-busting-for-your-css/#cssandcachebusting
     */
    const hash = hasha.fromFileSync(filePath, {
      algorithm: 'md5'
    });

    if (baseHref) {
      baseHref = ensureTrailingSlash(baseHref);
    }

    const parsed = path.parse(relativeUrl);
    const hashedRelativeUrl = `${parsed.dir}/${parsed.name}.${hash}${parsed.ext}`;
    const hashedUrl = `${baseUrl}${baseHref}${hashedRelativeUrl}`;

    assetsMap[relativeUrl] = {
      absolutePath: filePath,
      hashedUrl,
      hashedRelativeUrl
    };
  });

  return assetsMap;
}

export function applyAppAssetsWebpackConfig(
  webpackConfig: webpack.Configuration,
  assetsBaseUrl: string,
  baseHref: string
): void {
  const assetsMap = createAppAssetsMap(assetsBaseUrl, baseHref);
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
