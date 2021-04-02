import { getOptions } from 'loader-utils';

import validateOptions from 'schema-utils';

import { loader } from 'webpack';

const schema = require('./schema.json');

export default function appAssetsLoader(
  this: loader.LoaderContext
) {
  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX Assets Loader'
  });

  return options.assetsMapStringified as string;
}
