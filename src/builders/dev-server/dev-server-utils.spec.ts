import mock from 'mock-require';

describe('dev-server utils', () => {
  beforeEach(() => {
    mock('../../shared/cert-utils', {
      getCertPath(fileName: string) {
        return fileName;
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getUtils() {
    return mock.reRequire('./dev-server-utils');
  }

  it('should set SSL options', () => {
    const { applySkyuxDevServerOptions } = getUtils();
    const options = {};
    applySkyuxDevServerOptions(options);
    expect(options).toEqual({
      ssl: true,
      sslCert: 'skyux-server.crt',
      sslKey: 'skyux-server.key'
    });
  });
});
