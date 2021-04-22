import mock from 'mock-require';
import path from 'path';

import { SkyuxConfig } from './skyux-config';

describe('skyux config utils', () => {
  let mockSkyuxConfig: Partial<SkyuxConfig> | undefined;
  let mockSkyuxServeConfig: Partial<SkyuxConfig> | undefined;

  beforeEach(() => {
    mockSkyuxConfig = undefined;
    mockSkyuxServeConfig = undefined;

    spyOn(console, 'log');

    mock('fs-extra', {
      existsSync(filePath: string) {
        switch (path.basename(filePath)) {
          case 'skyuxconfig.json':
            return !!mockSkyuxConfig;
          case 'skyuxconfig.serve.json':
            return !!mockSkyuxServeConfig;
        }

        return false;
      },
      readJsonSync(filePath: string) {
        switch (path.basename(filePath)) {
          case 'skyuxconfig.json':
            return mockSkyuxConfig;
          case 'skyuxconfig.serve.json':
            return mockSkyuxServeConfig;
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
    expect(util.getSkyuxConfig()).toEqual({
      host: {
        url: 'https://host.nxt.blackbaud.com'
      }
    });
  });

  it('should throw error if host URL contains trailing slash', () => {
    const invalidUrl = 'https://foo.blackbaud.com/';

    mockSkyuxConfig = {
      host: {
        url: invalidUrl
      }
    };
    const util = mock.reRequire('./skyux-config-utils');
    expect(() => {
      util.getSkyuxConfig();
    }).toThrowError(
      `[@skyux-sdk/angular-builders] The host URL must not end with a forward slash. You provided: "${invalidUrl}"`
    );
  });

  it('should throw an error if skyuxconfig.json does not exist', () => {
    const util = mock.reRequire('./skyux-config-utils');
    expect(util.getSkyuxConfig).toThrowError(
      '[@skyux-sdk/angular-builders] A skyuxconfig.json file was not found at the project root. Did you run `ng add @skyux-sdk/angular-builders`?'
    );
  });

  it('should merge command-specific config files with the base config file', () => {
    mockSkyuxConfig = {
      auth: true,
      appSettings: {
        foo: ['bar']
      }
    };

    mockSkyuxServeConfig = {
      auth: false,
      appSettings: {
        foo: ['baz']
      }
    };

    const util = mock.reRequire('./skyux-config-utils');

    expect(util.getSkyuxConfig('serve')).toEqual({
      auth: false,
      appSettings: {
        foo: ['baz']
      },
      host: {
        url: 'https://host.nxt.blackbaud.com'
      }
    });
  });

  it('should not attempt to merge command-specific config files if none exist', () => {
    mockSkyuxConfig = {
      auth: true,
      appSettings: {
        foo: ['bar']
      }
    };

    const util = mock.reRequire('./skyux-config-utils');

    expect(util.getSkyuxConfig('serve')).toEqual({
      auth: true,
      appSettings: {
        foo: ['bar']
      },
      host: {
        url: 'https://host.nxt.blackbaud.com'
      }
    });
  });

  it('should build the expected SKY app config object', () => {
    mockSkyuxConfig = {
      appSettings: {
        foo: 'bar'
      },
      auth: true
    };

    mockSkyuxServeConfig = {
      appSettings: {
        foo: ['baz']
      },
      auth: false
    };

    const util = mock.reRequire('./skyux-config-utils');

    const skyAppConfig = util.getSkyAppConfig('serve', 'project-name');

    expect(skyAppConfig).toEqual({
      runtime: {
        app: {
          base: '/project-name',
          inject: false,
          name: 'project-name',
          template: ''
        },
        command: 'serve'
      },
      skyux: {
        appSettings: {
          foo: ['baz']
        },
        auth: false,
        host: {
          url: 'https://host.nxt.blackbaud.com'
        }
      }
    });
  });
});
