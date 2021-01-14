import mock from 'mock-require';

import {
  Config as ProtractorConfig
} from 'protractor';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

describe('protractor.default.conf', () => {

  let mockPlatformConfig: ProtractorConfig;

  beforeEach(() => {

    process.env.SKYUX_PROTRACTOR_BUILDER_OPTIONS = JSON.stringify({});

    mockPlatformConfig = {};

    spyOn(console, 'log');

    mock('../../shared/ci-platform-utils', {
      getCiPlatformProtractorConfig: () => mockPlatformConfig
    });

  });

  afterEach(() => {
    mock.stopAll();
  });

  function setBuilderOptions(value: Partial<SkyuxProtractorBuilderOptions>): void {
    process.env.SKYUX_PROTRACTOR_BUILDER_OPTIONS = JSON.stringify(value);
  }

  it('should allow setting the test browser to "headless" mode', () => {
    let config = mock.reRequire('./protractor.default.conf').config;

    expect(config.capabilities.chromeOptions.args.indexOf('--headless') === -1).toBeTrue();

    setBuilderOptions({
      skyuxHeadless: true
    });

    config = mock.reRequire('./protractor.default.conf').config;

    expect(config.capabilities.chromeOptions.args.indexOf('--headless') === -1).toBeFalse();
  });

  it('should apply CI platform overrides', () => {
    mockPlatformConfig = {
      capabilities: {
        browserName: 'firefox'
      }
    };

    setBuilderOptions({
      skyuxCiPlatform: 'ado'
    });

    const config = mock.reRequire('./protractor.default.conf').config;

    expect(config.capabilities.browserName).toBe('firefox');
  });

});
