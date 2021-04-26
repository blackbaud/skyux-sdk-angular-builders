import fs from 'fs-extra';
import mergeWith from 'lodash.mergewith';

import { SkyuxConfig } from './skyux-config';

const DEFAULTS: SkyuxConfig = {};

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
 * Creates an object containing values from skyuxconfig.json.
 * @param command The name of the CLI command invoking this function.
 */
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

  return skyuxConfig;
}
