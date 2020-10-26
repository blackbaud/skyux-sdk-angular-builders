import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  SkyuxAssetHelper
} from '../../../shared/asset-helper';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

const schema = require('./assets-in-ts-schema.json');

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;
const TEMPLATE_REGEX = /template\s*:(\s*['"`]([\s\S]*?)['"`]\s*([,}]))/gm;

export default function AssetsLoaderTS(
  this: loader.LoaderContext,
  content: string
) {

  if (content.indexOf('@Component(') === -1) {
    return content;
  }

  const match = TEMPLATE_REGEX.exec(content);
  if (match) {

    const options = getOptions(this);
    validateOptions(schema, options, {
      name: 'SKY UX HTML Assets Loader'
    });

    // Prevent the same file from being processed more than once.
    const processedFiles: string[] = [];

    content.match(ASSETS_REGEX)?.forEach(filePath => {
      if (processedFiles.includes(filePath)) {
        return;
      }

      processedFiles.push(filePath);

      const baseUrl = ensureTrailingSlash(options.assetBaseUrl as string);
      const url = `${baseUrl}${filePath.replace(/\\/g, '/')}`;

      SkyuxAssetHelper.queue({ filePath, url });

      return content;
    });
  }

  return content;
}
