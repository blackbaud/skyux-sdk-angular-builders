import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { loader } from 'webpack';

import { getSkyAppConfig } from '../../../../shared/skyux-config-utils';

const schema = require('./schema.json');

export default function skyAppConfigLoader(this: loader.LoaderContext) {
  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY App Config Loader'
  });

  const appConfig = getSkyAppConfig(
    options.command as string,
    options.projectName as string
  );

  return JSON.stringify(appConfig);
}
