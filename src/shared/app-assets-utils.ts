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
    const baseUrl = ensureTrailingSlash(assetBaseUrl);

    const relativePath = filePath.replace(path.join(process.cwd(), 'src/'), '');

    const parsed = path.parse(relativePath);
    const fileName = `${parsed.name}${parsed.ext}`;
    const hash = hasha.fromFileSync(filePath);
    const hashedFileName = `${parsed.name}.${hash}${parsed.ext}`;

    assetsMap[fileName] = {
      lookup: `~/${relativePath.replace(/\\/g, '/')}`,
      absolutePath: filePath,
      relativeUrl: `${relativePath.replace(/\\/g, '/')}`,
      hashedFileName,
      hashedAbsoluteUrl: `${baseUrl}${hashedFileName}`,
      absoluteUrl: `${baseUrl}${fileName}`,
      hashedRelativeUrl: `${parsed.dir}${hashedFileName}`
    };
  });

  return assetsMap;
}
