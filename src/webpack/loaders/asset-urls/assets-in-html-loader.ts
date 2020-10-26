import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

const schema = require('./asset-urls-loader-schema.json');

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

      const baseUrl = ensureTrailingSlash(options.assetBaseUrl as string);
      const url = `${baseUrl}${filePath.replace(/\\/g, '/')}`;

      content = content.replace(
        new RegExp(filePath, 'gi'),
        url
      );

      return content;
    }
  });

  return content;
}

