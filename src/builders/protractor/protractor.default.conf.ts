// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {
  SpecReporter,
  StacktraceOption
} = require('jasmine-spec-reporter');

import {
  Config as ProtractorConfig
} from 'protractor';

import {
  getCiPlatformProtractorConfig
} from '../../shared/ci-platform-utils';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

function getConfig(): ProtractorConfig {
  const browserArgs: string[] = [];

  const builderOptions: SkyuxProtractorBuilderOptions = JSON.parse(
    process.env.SKYUX_PROTRACTOR_BUILDER_OPTIONS!
  );

  if (builderOptions.skyuxHeadless) {
    browserArgs.push('--headless');
  }

  // The default Protractor configuration provided by Angular CLI.
  const config: ProtractorConfig = {
    allScriptsTimeout: 11000,
    specs: [
      require('path').join(process.cwd(), './e2e/src/**/*.e2e-spec.ts')
    ],
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: browserArgs
      }
    },
    directConnect: true,
    SELENIUM_PROMISE_MANAGER: false,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 30000,
      /* istanbul ignore next */
      print() {}
    },
    /* istanbul ignore next */
    onPrepare() {
      require('ts-node').register({
        project: require('path').join(process.cwd(), './e2e/tsconfig.json')
      });
      jasmine.getEnv().addReporter(new SpecReporter({
        spec: {
          displayStacktrace: StacktraceOption.PRETTY
        }
      }));
    }
  };

  // Apply platform config overrides.
  if (builderOptions.skyuxCiPlatform) {
    const overrides = getCiPlatformProtractorConfig(builderOptions.skyuxCiPlatform);
    Object.assign(config, overrides);
  } else {
    console.log(
      '[SKY UX] A specific CI platform configuration was not requested. ' +
      'Using default Protractor configuration.'
    );
  }

  return config;
}

exports.config = getConfig();