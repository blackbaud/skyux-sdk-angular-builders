const mock = require('mock-require');

describe('cert utils', () => {
  let certExists: boolean;

  beforeEach(() => {
    certExists = true;

    mock('fs-extra', {
      existsSync() {
        return certExists;
      }
    });

    mock('os', {
      homedir() {
        return 'HOME_DIR';
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getUtil() {
    return mock.reRequire('./cert-utils');
  }

  it('should get a certificate path', () => {
    const { getCertPath } = getUtil();
    const certPath = getCertPath('my.crt');
    expect(certPath).toEqual('HOME_DIR/.skyux/certs/my.crt');
  });

  it("should throw an error if cert path doesn't exist", () => {
    certExists = false;
    try {
      const { getCertPath } = getUtil();
      getCertPath('invalid.key');
      fail('Expected test to fail.');
    } catch (err) {
      expect(err).toEqual(
        new Error(
          'Unable to locate certificate named "HOME_DIR/.skyux/certs/invalid.key".\n' +
            'Please install the latest version of `@skyux-sdk/cli` and run `skyux certs install`.'
        )
      );
    }
  });
});
