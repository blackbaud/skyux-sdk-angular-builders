import glob from 'glob';

import hasha from 'hasha';

import path from 'path';

import {
  SkyuxAppAssets
} from './app-assets';

import {
  ensureTrailingSlash
} from './url-utils';

/**
 * Creates an object which maps relative asset paths to absolute URLs with hashed file names.
 * @param assetBaseUrl The base URL where the assets are served.
 */
export function createAppAssetsMap(assetBaseUrl: string = ''): SkyuxAppAssets {

  const assetsMap: SkyuxAppAssets = {};

  // Find all asset file paths.
  const filePaths = glob.sync(
    path.join(process.cwd(), 'src/assets/**/*'),
    {
      nodir: true
    }
  );

  // Create a hashed version of each path.
  filePaths.forEach(filePath => {
    const baseUrl = ensureTrailingSlash(assetBaseUrl);
    const relativePath = filePath.replace(path.join(process.cwd(), 'src/'), '');
    const parsed = path.parse(relativePath);

    /**
     * Create a hash from the file path.
     * The md5 algorithm is sufficient for "cache busting".
     * @see https://blog.risingstack.com/automatic-cache-busting-for-your-css/#cssandcachebusting
     */
    const hash = hasha.fromFileSync(filePath, {
      algorithm: 'md5'
    });

    const hashedFileName = `${parsed.name}.${hash}${parsed.ext}`;
    const relativeUrl = `${relativePath.replace(/\\/g, '/')}`;

    assetsMap[relativeUrl] = {
      absolutePath: filePath,
      hashedUrl: `${baseUrl}${hashedFileName}`,
      hashedFileName
    };
  });

  return assetsMap;
}
