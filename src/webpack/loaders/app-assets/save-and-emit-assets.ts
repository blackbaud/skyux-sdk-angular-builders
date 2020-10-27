import hasha from 'hasha';

import path from 'path';

import {
  loader
} from 'webpack';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

import {
  SkyuxAppAssetsState
} from '../../app-assets-state';

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;

// Prevent the same asset from being processed more than once.
const processedAssets: string[] = [];

export function saveAndEmitAssets(
  this: loader.LoaderContext,
  content: string,
  config: {
    assetBaseUrl: string;
  }
): void {
  content.match(ASSETS_REGEX)?.forEach(filePath => {
    if (!processedAssets.includes(filePath)) {
      processedAssets.push(filePath);

      const parsed = path.parse(filePath);
      const filePathResolved = path.resolve(process.cwd(), 'src', filePath);
      const hash = hasha.fromFileSync(filePathResolved);
      const filePathHashed = `${parsed.dir}/${parsed.name}.${hash}${parsed.ext}`;

      const baseUrl = ensureTrailingSlash(config.assetBaseUrl);
      const url = `${baseUrl}${filePathHashed.replace(/\\/g, '/')}`;

      // Emit the new file to Webpack.
      this.emitFile(
        filePathHashed,
        this.fs.readFileSync(filePathResolved),
        undefined
      );

      // Save the new file URL to replace the original file path in the compiled bundle.
      SkyuxAppAssetsState.queue({
        filePath,
        url
      });
    }
  });
}
