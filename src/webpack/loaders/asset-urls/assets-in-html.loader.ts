import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  saveAndEmitAssets
} from '../../app-asset-utils';

const schema = require('./schema.json');

export default function assetsInHtmlLoader(
  this: loader.LoaderContext,
  content: string
) {

  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX Assets in HTML Loader'
  });

  saveAndEmitAssets(content, {
    assetBaseUrl: options.assetBaseUrl as string
  });

  return content;
}
