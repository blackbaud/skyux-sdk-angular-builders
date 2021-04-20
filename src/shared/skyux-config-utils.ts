import fs from 'fs-extra';
import mergeWith from 'lodash.mergewith';

import { SkyAppConfig, SkyuxConfig } from './skyux-config';

function merge(
  original: Partial<SkyuxConfig>,
  override: SkyuxConfig
): SkyuxConfig {
  return mergeWith(original, override, (originalValue, overrideValue) => {
    if (Array.isArray(originalValue)) {
      return overrideValue;
    }
  });
}

/**
 * @name getSkyAppConfig
 * @param {argv} Optional arguments from command line
 * @returns [SkyAppConfig] skyAppConfig
 */
export function getSkyAppConfig(
  command: string,
  projectName: string
): SkyAppConfig {
  const config: SkyAppConfig = {
    runtime: {
      app: {
        base: `/${projectName}`,
        inject: false,
        name: projectName,
        template: ''
      },
      command
    },
    skyux: getSkyuxConfig(command)
  };

  return config;
}

const DEFAULTS: SkyuxConfig = {
  host: {
    url: 'https://host.nxt.blackbaud.com'
  }
};

export function getSkyuxConfig(command?: string): SkyuxConfig {
  if (!fs.existsSync('skyuxconfig.json')) {
    throw new Error(
      '[@skyux-sdk/angular-builders] A skyuxconfig.json file was not found at the project root. Did you run `ng add @skyux-sdk/angular-builders`?'
    );
  }

  let skyuxConfig = merge({}, DEFAULTS);

  const hierarchy = [
    {
      fileName: `SPA skyuxconfig.json`,
      filePath: `skyuxconfig.json`
    }
  ];

  if (command) {
    hierarchy.push({
      fileName: `SPA skyuxconfig.${command}.json`,
      filePath: `skyuxconfig.${command}.json`
    });
  }

  hierarchy.forEach((file) => {
    if (fs.existsSync(file.filePath)) {
      console.log(`Merging ${file.fileName}`);
      skyuxConfig = merge(skyuxConfig, fs.readJsonSync(file.filePath));
    }
  });

  const hostUrl = skyuxConfig.host.url;

  if (hostUrl.endsWith('/')) {
    throw new Error(
      `[@skyux-sdk/angular-builders] The host URL must not end with a forward slash. You provided: "${hostUrl}"`
    );
  }

  return skyuxConfig;
}
