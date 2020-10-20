import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

const schema = require('./assets-in-html-schema.json');

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;

export default function AssetsLoaderHTML(
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
    if (processedFiles.includes(filePath)) {
      return;
    }

    const url = `${options.baseUrl}${filePath.replace(/\\/g, '/')}`;

    content = content.replace(
      new RegExp(filePath, 'gi'),
      url
    );

    processedFiles.push(filePath);
  });

  return content;
}
