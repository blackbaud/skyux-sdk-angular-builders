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
  const filePaths = glob.sync(path.join(process.cwd(), 'src/assets/**/*'));

  // Create a hashed version of each path.
  filePaths.forEach(filePath => {
    const relativePath = filePath.replace(path.join(process.cwd(), 'src/'), '');
    const parsed = path.parse(relativePath);
    const hash = hasha.fromFileSync(filePath);
    const filePathHashed = `${parsed.dir}/${parsed.name}.${hash}${parsed.ext}`;
    const baseUrl = ensureTrailingSlash(assetBaseUrl);
    const url = `${baseUrl}${filePathHashed.replace(/\\/g, '/')}`;

    assetsMap[relativePath] = {
      absolutePath: filePath,
      hashedRelativePath: filePathHashed,
      hashedUrl: url
    };
  });

  return assetsMap;
}
