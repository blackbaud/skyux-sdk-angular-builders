import glob from 'glob';

import karma from 'karma';

import path from 'path';

import {
  SkyuxCIPlatform
} from './ci-platform';

import {
  SkyuxCodeCoverageThreshold
} from './code-coverage-threshold';

import {
  SkyuxKarmaConfigAdapter
} from './karma-config-adapter';

function getCiPlatformKarmaConfig(platform: SkyuxCIPlatform): string | undefined {
  // Using glob so we can find skyux-sdk-builder-config regardless of npm install location
  const pattern = path.join(
    process.cwd(),
    `node_modules/**/@skyux-sdk/pipeline-settings/platforms/${platform}/karma/karma.angular-cli.conf.js`
  );

  const configFiles = glob.sync(pattern);
  const config = configFiles[0];

  if (config) {
    console.log(`[SKY UX] Using external Karma configuration:\n${config}\n`);
    return config;
  }

  console.warn(
    `[SKY UX] Platform configuration not found for key, '${platform}'! ` +
    'Using default Karma configuration.'
  );
  return;
}

function getCodeCoverageThresholdPercent(threshold?: SkyuxCodeCoverageThreshold): number {
  switch (threshold) {
    default:
    case 'none':
      return 0;

    case 'standard':
      return 80;

    case 'strict':
      return 100;
  }
}

module.exports = (config: karma.Config): void => {

  const codeCoverageThresholdPercent = getCodeCoverageThresholdPercent(
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCodeCoverageThreshold
  );

  console.log(`[SKY UX] Minimum required code coverage threshold set to ${codeCoverageThresholdPercent} percent.`);

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(process.cwd(), './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          branches: codeCoverageThresholdPercent,
          functions: codeCoverageThresholdPercent,
          lines: codeCoverageThresholdPercent,
          statements: codeCoverageThresholdPercent
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  } as karma.ConfigOptions);

  // Apply platform config overrides.
  if (SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform) {
    try {
      const platformConfigPath = getCiPlatformKarmaConfig(
        SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform
      );

      /* istanbul ignore else */
      if (platformConfigPath) {
        require(platformConfigPath)(config);
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  } else {
    console.log(
      '[SKY UX] A specific CI platform configuration was not requested. ' +
      'Using default Karma configuration.'
    );
  }
}
