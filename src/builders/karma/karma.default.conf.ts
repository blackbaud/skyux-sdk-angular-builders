import karma from 'karma';

import { getCiPlatformKarmaConfig } from '../../shared/ci-platform-utils';
import { SkyuxCodeCoverageThreshold } from './code-coverage-threshold';
import { SkyuxKarmaConfigAdapter } from './karma-config-adapter';

function getCodeCoverageThresholdPercent(
  threshold?: SkyuxCodeCoverageThreshold
): number {
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
    SkyuxKarmaConfigAdapter.builderOptions
      .skyuxCodeCoverageThreshold ||
      SkyuxKarmaConfigAdapter.skyuxConfig
        .codeCoverageThreshold
  );

  console.log(
    `[SKY UX] Minimum required code coverage threshold set to ${codeCoverageThresholdPercent} percent.`
  );

  // The default Karma configuration provided by Angular CLI.
  config.set({
    basePath: '',
    frameworks: [
      'jasmine',
      '@angular-devkit/build-angular'
    ],
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
      dir: require('path').join(
        process.cwd(),
        './coverage'
      ),
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
  if (
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform
  ) {
    const platformConfig = getCiPlatformKarmaConfig(
      SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform
    );
    /* istanbul ignore else */
    if (platformConfig) {
      platformConfig(config);
    }
  } else {
    console.log(
      '[SKY UX] A specific CI platform configuration was not requested. ' +
        'Using default Karma configuration.'
    );
  }
};
