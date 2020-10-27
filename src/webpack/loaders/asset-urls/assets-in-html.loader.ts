import hasha from 'hasha';

import {
  getOptions
} from 'loader-utils';

import path from 'path';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

// import {
//   SkyuxApplicationAssetState
// } from '../../app-asset-state';

const schema = require('./schema.json');

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;

export default function assetsInHtmlLoader(
  this: loader.LoaderContext,
  content: string
) {

  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX HTML Assets Loader'
  });

  // Prevent the same file from being processed more than once.
  const processedFiles: string[] = [];

  content.match(ASSETS_REGEX)?.forEach(filePath => {
    if (!processedFiles.includes(filePath)) {
      processedFiles.push(filePath);

      const parsed = path.parse(filePath);
      const filePathResolved = path.resolve(process.cwd(), 'src', filePath);
      const hash = hasha.fromFileSync(filePathResolved);
      const filePathHashed = `${parsed.dir}.${hash}${parsed.ext}`;

      const baseUrl = ensureTrailingSlash(options.assetBaseUrl as string);
      const url = `${baseUrl}${filePathHashed.replace(/\\/g, '/')}`;

      // Emit the new file path to Webpack.
      this.emitFile(filePathHashed, this.fs.readFileSync(filePathResolved), undefined);

      // Save the new file URL to replace the original file path in the compiled bundle.
      // SkyuxApplicationAssetState.queue({
      //   filePath: filePath,
      //   url
      // });

      content = content.replace(
        new RegExp(filePath, 'gi'),
        url
      );

      return content;
    }
  });

  return content;
}
