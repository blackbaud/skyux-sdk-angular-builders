import { SkyuxAppAssets } from './app-assets';
import { ensureTrailingSlash } from './url-utils';
import glob from 'glob';
import hasha from 'hasha';
import path from 'path';

/**
 * Creates an object which maps relative asset paths to absolute URLs with hashed file names.
 * @param assetBaseUrl The base URL where the assets are served.
 */
export function createAppAssetsMap(
  assetsBaseUrl: string,
  _baseHref: string
): SkyuxAppAssets {
  const assetsMap: SkyuxAppAssets = {};

  // Find all asset file paths.
  const filePaths = glob.sync(path.join(process.cwd(), 'src/assets/**/*'), {
    nodir: true
  });

  console.log('Asset files:', filePaths);

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

    const parsed = path.parse(relativeUrl);
    const hashedRelativeUrl = `${parsed.dir}/${parsed.name}.${hash}${parsed.ext}`;
    const hashedUrl = `${baseUrl}${hashedRelativeUrl}`;

    assetsMap[relativeUrl] = {
      absolutePath: filePath,
      hashedUrl,
      hashedRelativeUrl
    };
  });

  console.log(assetsMap);

  return assetsMap;
}
