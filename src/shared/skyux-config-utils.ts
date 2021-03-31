import fs from 'fs-extra';

import merge from 'lodash.merge';

import { SkyuxConfig } from './skyux-config';

const DEFAULTS: SkyuxConfig = {
  host: {
    url: 'https://host.nxt.blackbaud.com'
  }
};

export function getSkyuxConfig(): SkyuxConfig {
  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error(
      '[@skyux-sdk/angular-builders] A skyuxconfig.json file was not found at the project root. Did you run `ng add @skyux-sdk/angular-builders`?'
    );
  }

  const skyuxConfig = merge<SkyuxConfig, SkyuxConfig>(
    DEFAULTS,
    fs.readJsonSync('skyuxconfig.json')
  );

  const hostUrl = skyuxConfig.host.url;
  if (hostUrl.endsWith('/')) {
    throw new Error(
      `[@skyux-sdk/angular-builders] The host URL must not end with a forward slash. You provided: "${hostUrl}"`
    );
  }

  return skyuxConfig;
}
