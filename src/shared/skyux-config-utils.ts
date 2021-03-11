import fs from 'fs-extra';
import { SkyuxConfig } from './skyux-config';

const DEFAULTS: SkyuxConfig = {
};

export async function getSkyuxConfig(): Promise<SkyuxConfig> {

  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error('A skyuxconfig.json file was not found at the project root.');
  }

  const skyuxJson: SkyuxConfig = await fs.readJson('skyuxconfig.json');
  const skyuxConfig: SkyuxConfig = {};

  if (skyuxJson?.app?.externals) {
    skyuxConfig.app = skyuxConfig.app || {};
    skyuxConfig.app.externals = skyuxJson.app.externals;
  }

  return {...DEFAULTS, ...skyuxConfig};
}
