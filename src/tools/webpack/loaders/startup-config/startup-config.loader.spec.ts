import mock from 'mock-require';

import {
  SkyuxConfig
} from '../../../../shared/skyux-config';

describe('startup config loader', () => {
  function mockGetSkyuxConfig(testSkyuxConfig: SkyuxConfig): void {
    mock('../../../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return testSkyuxConfig;
      }
    });
  }

  afterEach(() => {
    mock.stopAll();
  });

  it('should replace startupconfig.json contents', () => {
    mockGetSkyuxConfig({
      app: {
        theming: {
          supportedThemes: ['default', 'modern'],
          theme: 'modern'
        }
      },
      auth: true,
      help: {},
      host: {
        url: 'https://example.com'
      },
      omnibar: {}
    });

    const loader = mock.reRequire('./startup-config.loader').default;

    const result = loader.apply({
      query: {
        projectName: 'bar'
      }
    });

    expect(JSON.parse(result)).toEqual({
      auth: true,
      baseHref: '/bar/',
      help: {},
      omnibar: {},
      theming: {
        supportedThemes: ['default', 'modern'],
        theme: 'modern'
      }
    });
  });

  it('should support optional properties in skyuxconfig.json', () => {
    mockGetSkyuxConfig({
      host: {
        url: 'https://example.com'
      }
    });

    const loader = mock.reRequire('./startup-config.loader').default;

    const result = loader.apply({
      query: {
        projectName: 'bar'
      }
    });

    expect(JSON.parse(result)).toEqual({
      baseHref: '/bar/'
    });
  });

});
