import fs from 'fs-extra';

import mergeWith from 'lodash.mergewith';

import {
  SkyuxConfig
} from './skyux-config';

const DEFAULTS: SkyuxConfig = {
  host: {
    url: 'https://host.nxt.blackbaud.com'
  }
};

export function getSkyuxConfig(): SkyuxConfig {
  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error('A skyuxconfig.json file was not found at the project root.');
  }

  const skyuxConfig: SkyuxConfig = mergeWith(
    DEFAULTS,
    fs.readJsonSync('skyuxconfig.json')
  );

  const hostUrl = skyuxConfig.host.url;
  if (hostUrl.charAt(hostUrl.length - 1) === '/') {
    throw new Error('The host URL must not end with a forward slash.');
  }

  return skyuxConfig;
}
