import glob from 'glob';

import karma from 'karma';

import mock from 'mock-require';

import {
  SkyuxKarmaConfigAdapter
} from './karma-config-adapter';

describe('karma.default.conf.ts', () => {

  let calledKarmaConfig: any;
  let mockKarmaConfigUtil: karma.Config;
  let globSyncSpy: jasmine.Spy;

  //#region helpers

  function verifyCoverageThresholdPercent(threshold: number): void {
    expect(calledKarmaConfig.coverageReporter.check.global).toEqual({
      branches: threshold,
      functions: threshold,
      lines: threshold,
      statements: threshold
    });
  }

  //#endregion

  beforeEach(() => {

    calledKarmaConfig = {};

    mockKarmaConfigUtil = {
      set: (conf: any) => {
        calledKarmaConfig = conf;
      },
      LOG_DEBUG: '',
      LOG_DISABLE: '',
      LOG_ERROR: '',
      LOG_INFO: '',
      LOG_WARN: ''
    };

    SkyuxKarmaConfigAdapter.builderOptions = {
      karmaConfig: 'karma.conf.js',
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    };

    globSyncSpy = spyOn(glob, 'sync');

    mock('@angular-devkit/build-angular/plugins/karma', {});
    mock('karma-chrome-launcher', {});
    mock('karma-coverage', {});
    mock('karma-jasmine', {});
    mock('karma-jasmine-html-reporter', {});
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should set default code coverage thresholds', () => {
    const config: (conf: karma.Config) => void = mock.reRequire('./karma.default.conf');
    config(mockKarmaConfigUtil);

    verifyCoverageThresholdPercent(0);
  });

  it('should set "standard" code coverage thresholds', () => {
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCodeCoverageThreshold = 'standard';

    const config: (conf: karma.Config) => void = mock.reRequire('./karma.default.conf');
    config(mockKarmaConfigUtil);

    verifyCoverageThresholdPercent(80);
  });

  it('should set "strict" code coverage thresholds', () => {
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCodeCoverageThreshold = 'strict';

    const config: (conf: karma.Config) => void = mock.reRequire('./karma.default.conf');
    config(mockKarmaConfigUtil);

    verifyCoverageThresholdPercent(100);
  });

  it('should run tests with Chrome browser by default', () => {
    const config = mock.reRequire('./karma.default.conf');
    config(mockKarmaConfigUtil);
    expect(calledKarmaConfig.browsers).toEqual(['Chrome']);
  });

  it('should apply platform config overrides', () => {
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform = 'ado';

    globSyncSpy.and.returnValue([
      'mock-karma.conf.js'
    ]);

    mock('mock-karma.conf.js', (conf: karma.Config) => {
      conf.set({
        singleRun: true
      });
    });

    const config: (conf: karma.Config) => void = mock.reRequire('./karma.default.conf');
    config(mockKarmaConfigUtil);

    expect(globSyncSpy.calls.mostRecent().args[0]).toContain('/@skyux-sdk/pipeline-settings/platforms/ado/karma/karma.angular-cli.conf.js');
    expect(calledKarmaConfig.singleRun).toEqual(true);
  });

  it('should handle nonexistent platform config files', () => {
    SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform = 'ado';

    globSyncSpy.and.returnValue([
      'mock-karma.conf.js'
    ]);

    const config: (conf: karma.Config) => void = mock.reRequire('./karma.default.conf');

    try {
      config(mockKarmaConfigUtil);
      fail('Expected test to throw an error.');
    } catch (err) {
      expect(err.message).toContain('Error: Cannot find module \'mock-karma.conf.js\'');
    }
  });

  it('should handle invalid platform config keys', () => {
    (SkyuxKarmaConfigAdapter.builderOptions.skyuxCiPlatform as string) = 'invalid';

    globSyncSpy.and.returnValue([]);

    const warnSpy = spyOn(console, 'warn');
    const config = mock.reRequire('./karma.default.conf');

    config(mockKarmaConfigUtil);
    expect(warnSpy.calls.mostRecent().args[0]).toContain('Platform configuration not found for key');
  });

});
