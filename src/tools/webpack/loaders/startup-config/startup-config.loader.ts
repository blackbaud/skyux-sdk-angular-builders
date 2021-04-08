import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { loader } from 'webpack';

import { getSkyuxConfig } from '../../../../shared/skyux-config-utils';

const schema = require('./schema.json');

export default function startupConfigLoader(this: loader.LoaderContext) {
  const skyuxConfig = getSkyuxConfig();

  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX Startup Config Loader'
  });

  return JSON.stringify({
    auth: skyuxConfig.auth,
    baseHref: options.baseHref,
    help: skyuxConfig.help,
    omnibar: skyuxConfig.omnibar,
    theming: skyuxConfig.app?.theming
  });
}
