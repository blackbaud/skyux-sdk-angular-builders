import mock from 'mock-require';

describe('SKY app config loader', () => {
  beforeEach(() => {
    mock('../../../../shared/skyux-config-utils', {
      getSkyAppConfig() {
        return {
          skyux: {
            host: {
              url: 'https://foo.blackbaud.com'
            }
          }
        };
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should replace skyappconfig.json contents', () => {
    const loader = mock.reRequire('./sky-app-config.loader').default;

    const result = loader.apply({
      query: {
        command: 'serve',
        projectName: 'foo'
      }
    });

    expect(result).toEqual(
      '{"skyux":{"host":{"url":"https://foo.blackbaud.com"}}}'
    );
  });
});
