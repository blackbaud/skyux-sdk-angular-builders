import mock from 'mock-require';
import path from 'path';

import { SkyuxConfig } from './skyux-config';

describe('skyux config utils', () => {
  let mockSkyuxConfig: Partial<SkyuxConfig> | undefined;
  let mockSkyuxTestConfig: Partial<SkyuxConfig> | undefined;

  beforeEach(() => {
    mockSkyuxConfig = undefined;
    mockSkyuxTestConfig = undefined;

    spyOn(console, 'log');

    mock('fs-extra', {
      existsSync(filePath: string) {
        switch (path.basename(filePath)) {
          case 'skyuxconfig.json':
            return !!mockSkyuxConfig;
          case 'skyuxconfig.test.json':
            return !!mockSkyuxTestConfig;
        }

        return false;
      },
      readJsonSync(filePath: string) {
        switch (path.basename(filePath)) {
          case 'skyuxconfig.json':
            return mockSkyuxConfig;
          case 'skyuxconfig.test.json':
            return mockSkyuxTestConfig;
        }

        return undefined;
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should return defaults', () => {
    mockSkyuxConfig = {};

    const util = mock.reRequire('./skyux-config-utils');
    expect(util.getSkyuxConfig()).toEqual({});
  });

  it('should throw an error if skyuxconfig.json does not exist', () => {
    const util = mock.reRequire('./skyux-config-utils');
    expect(util.getSkyuxConfig).toThrowError(
      '[@skyux-sdk/angular-builders] A skyuxconfig.json file was not found at the project root. Did you run `ng add @skyux-sdk/angular-builders`?'
    );
  });

  it('should merge command-specific config files with the base config file', () => {
    mockSkyuxConfig = {
      codeCoverageThreshold: 'none'
    };

    mockSkyuxTestConfig = {
      codeCoverageThreshold: 'standard'
    };

    const util = mock.reRequire('./skyux-config-utils');

    expect(util.getSkyuxConfig('test')).toEqual({
      codeCoverageThreshold: 'standard'
    });
  });

  it('should not attempt to merge command-specific config files if none exist', () => {
    mockSkyuxConfig = {};

    const util = mock.reRequire('./skyux-config-utils');

    expect(util.getSkyuxConfig('test')).toEqual({});
  });
});
