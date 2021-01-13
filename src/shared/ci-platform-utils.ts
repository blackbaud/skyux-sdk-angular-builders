import glob from 'glob';

import path from 'path';

import {
  SkyuxCIPlatform
} from './ci-platform';

/**
 * Returns the configuration file path for a specific service on a specific continuous integration (CI) platform.
 * @param service The service running the tests.
 * @param platform The CI platform hosting the test server.
 */
export function getCiPlatformConfig(
  service: 'karma' | 'protractor',
  platform: SkyuxCIPlatform
) {
  // Using glob so we can find skyux-sdk-builder-config regardless of npm install location
  const pattern = path.join(
    process.cwd(),
    `node_modules/**/@skyux-sdk/pipeline-settings/platforms/${platform}/${service}/${service}.angular-cli.conf.js`
  );

  const configFiles = glob.sync(pattern);
  const config = configFiles[0];

  if (config) {
    console.log(`[SKY UX] Using external ${service} configuration:\n${config}\n`);
    return config;
  }

  console.warn(
    `[SKY UX] Platform configuration not found for key, '${platform}'! ` +
    `Using default ${service} configuration.`
  );

  return;
}
