import glob from 'glob';

import karma from 'karma';

import path from 'path';

import {
  Config as ProtractorConfig
} from 'protractor';

import {
  SkyuxCIPlatform
} from './ci-platform';

/**
 * Returns the testing framework configuration intended for a specific continuous integration (CI) platform.
 * @param framework The framework running the tests.
 * @param platform The CI platform hosting the test server.
 */
function getCiPlatformConfig(
  framework: 'karma' | 'protractor',
  platform: SkyuxCIPlatform
): unknown {

  // Using glob so we can find skyux-sdk-builder-config regardless of npm install location
  const pattern = path.join(
    process.cwd(),
    `node_modules/**/@skyux-sdk/pipeline-settings/platforms/${platform}/${framework}/${framework}.angular-cli.conf.js`
  );

  const configFiles = glob.sync(pattern);
  const configPath = configFiles[0];

  if (configPath) {
    console.log(`[SKY UX] Using external ${framework} configuration:\n${configPath}\n`);
    return require(configPath);
  }

  console.warn(
    `[SKY UX] Platform configuration not found for key, '${platform}'! ` +
    `Using default ${framework} configuration.`
  );

  return;
}

export function getCiPlatformKarmaConfig(platform: SkyuxCIPlatform): (conf: karma.Config) => void {
  return getCiPlatformConfig('karma', platform) as (conf: karma.Config) => void;
}

export function getCiPlatformProtractorConfig(platform: SkyuxCIPlatform): ProtractorConfig {
  return getCiPlatformConfig('protractor', platform) as ProtractorConfig;
}
