import glob from 'glob';

import hasha from 'hasha';

import path from 'path';

import {
  SkyuxAppAssets
} from './app-assets';

import {
  ensureTrailingSlash
} from './url-utils';

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
    const hash = hasha.fromFileSync(filePath);
    const hashedFileName = `${parsed.name}.${hash}${parsed.ext}`;
    const relativeUrl = `${relativePath.replace(/\\/g, '/')}`;

    assetsMap[relativeUrl] = {
      absolutePath: filePath,
      hashedAbsoluteUrl: `${baseUrl}${hashedFileName}`,
      hashedFileName
    };
  });

  return assetsMap;
}
