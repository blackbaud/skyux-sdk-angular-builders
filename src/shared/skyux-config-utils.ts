import fs from 'fs-extra';

import merge from 'lodash.merge';

import {
  SkyuxConfig
} from './skyux-config';

import {
  ensureTrailingSlash
} from './url-utils';

const DEFAULTS: SkyuxConfig = {
  host: {
    url: 'https://host.nxt.blackbaud.com/'
  }
};

export function getSkyuxConfig(): SkyuxConfig {
  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error('A skyuxconfig.json file was not found at the project root.');
  }

  const skyuxConfig = merge<SkyuxConfig, SkyuxConfig>(
    DEFAULTS,
    fs.readJsonSync('skyuxconfig.json')
  );

  skyuxConfig.host.url = ensureTrailingSlash(skyuxConfig.host.url);

  return skyuxConfig;
}
