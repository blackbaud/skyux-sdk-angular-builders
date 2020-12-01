import karma from 'karma';
import glob from 'glob';

import path from 'path';

import {
  SkyuxKarmaConfigAdapter
} from './karma-config-adapter';

function getKarmaConfig(platform: string): string {

  // Using glob so we can find skyux-sdk-builder-config regardless of npm install location
  const pattern = path.join(
    process.cwd(),
    `node_modules/**/@skyux-sdk/pipeline-settings/platforms/${platform}/karma/karma.angular-cli.conf.js`
  );

  const configFiles = glob.sync(pattern);
  const config = configFiles[0];

  return config;
}

module.exports = (config: karma.Config): void => {

  console.log('Adapter config?', SkyuxKarmaConfigAdapter.builderOptions);

  try {
    if (SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform) {
      require(getKarmaConfig(SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform));
    } else {
      // require(path.resolve(process.cwd(), 'karma.conf.js'))(config);
    }
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: path.resolve(process.cwd(), 'coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 100,
        lines: 100,
        branches: 100,
        functions: 100
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
}
