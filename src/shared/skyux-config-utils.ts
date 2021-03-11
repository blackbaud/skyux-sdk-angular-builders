import fs from 'fs-extra';

import {
  SkyuxConfig
} from './skyux-config';

const DEFAULTS: SkyuxConfig = {
};

export function getSkyuxConfig(): SkyuxConfig {

  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error('A skyuxconfig.json file was not found at the project root.');
  }

  const skyuxJson: SkyuxConfig = fs.readJsonSync('skyuxconfig.json');

  return {
    ...DEFAULTS,
    ...skyuxJson
  };
}
