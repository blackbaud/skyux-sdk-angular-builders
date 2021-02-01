import mock from 'mock-require';

describe('app assets utils', () => {

  let mockGlobResult: string[];

  beforeEach(() => {

    mockGlobResult = [];

    mock('glob', {
      sync() {
        return mockGlobResult;
      }
    });

    mock('hasha', {
      fromFileSync() {
        return 'MOCK_HASH';
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should create an asset map', () => {
    mockGlobResult = [
      '/assets/foo.jpg',
      '/assets/img/bar.png',
      '/assets/img/icon/baz.ico'
    ];

    const { createAppAssetsMap } = mock.reRequire('./app-assets-utils');

    const result = createAppAssetsMap();
    expect(result).toEqual({
      '/assets/foo.jpg': Object({ absolutePath: '/assets/foo.jpg', hashedUrl: '/foo.MOCK_HASH.jpg', hashedFileName: 'foo.MOCK_HASH.jpg' }),
      '/assets/img/bar.png': Object({ absolutePath: '/assets/img/bar.png', hashedUrl: '/bar.MOCK_HASH.png', hashedFileName: 'bar.MOCK_HASH.png' }),
      '/assets/img/icon/baz.ico': Object({ absolutePath: '/assets/img/icon/baz.ico', hashedUrl: '/baz.MOCK_HASH.ico', hashedFileName: 'baz.MOCK_HASH.ico' })
    });
  });

});
