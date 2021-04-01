import { SkyuxConfig } from '../shared/skyux-config';
import mock from 'mock-require';

describe('skyux config utils', () => {
  let fileExists: boolean;
  let mockSkyuxConfig: Partial<SkyuxConfig>;

  beforeEach(() => {
    fileExists = true;
    mockSkyuxConfig = {};

    mock('fs-extra', {
      existsSync() {
        return fileExists;
      },
      readJsonSync() {
        return mockSkyuxConfig;
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should return defaults', () => {
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
    fileExists = false;
    const util = mock.reRequire('./skyux-config-utils');
    expect(util.getSkyuxConfig).toThrowError(
      '[@skyux-sdk/angular-builders] A skyuxconfig.json file was not found at the project root. Did you run `ng add @skyux-sdk/angular-builders`?'
    );
  });
});
