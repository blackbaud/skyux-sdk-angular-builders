// import fs from 'fs-extra';

import {
  getOptions
} from 'loader-utils';

// import path from 'path';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

const schema = require('./schema.json');

export default function skyuxconfigTsLoader(
  this: loader.LoaderContext,
  content: string
) {

  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX Config Loader'
  });

  console.log('Eh?', options.skyuxconfigStringified);

  content = `FOO!`;

  // TODO: Check that the value located in skyuxconfig.json is equal to the value derived from angular.json (and the command line). If they are different, throw an error.
  // OR: Just overwrite with whatever is in skyuxconfig.json.
  // const skyuxconfig = fs.readJsonSync(path.join(process.cwd(), 'skyuxconfig.json'));
  // const angularJson = fs.readJsonSync(path.join(process.cwd(), 'angular.json'));
  // if (angularJson.host !== options.skyuxconfig.host) {
  //   throw new Error('Configuration mismatch!');
  // }

  return content;
}
