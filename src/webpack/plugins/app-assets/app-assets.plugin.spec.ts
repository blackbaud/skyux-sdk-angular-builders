import mock from 'mock-require';

describe('Asset URLs plugin', () => {

  let actualContent: string;
  let mockWebpackAssets: {
    [_: string]: {
      source: () => string;
    }
  };
  let mockCompiler: any;

  beforeEach(() => {
    mockWebpackAssets = {};

    actualContent = '';

    mockCompiler = {
      hooks: {
        emit: {
          tap(_pluginName: string, callback: (compilation: any) => void) {
            const mockCompilation = {
              assets: mockWebpackAssets
            };

            callback(mockCompilation);

            // Simulate Webpack emitting all assets.
            for (const [_file, asset] of Object.entries(mockCompilation.assets)) {
              actualContent += asset.source();
            }
          }
        }
      }
    };

    mock('fs-extra', {
      readFileSync: () => ''
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should replace asset paths with hard URLs', () => {
    mockWebpackAssets = {
      'foo.js': {
        source: () => '["assets/foo.gif"], background-image: url(\\"/assets/foo.gif\\"), background-image: url(/assets/foo.gif)'
      }
    };

    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin({
      assetsMap: {
        'assets/foo.gif': {
          absolutePath: '',
          hashedAbsoluteUrl: 'https://foobar.com/foo.HASH.gif',
          hashedFileName: 'foo.HASH.gif'
        }
      }
    });

    plugin.apply(mockCompiler);

    expect(actualContent).toBe(
      '["https://foobar.com/foo.HASH.gif"], background-image: url(https://foobar.com/foo.HASH.gif), background-image: url(https://foobar.com/foo.HASH.gif)'
    );
  });

  it('should create hashed file names for all assets', () => {
    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin({
      assetsMap: {
        'assets/foo.gif': {
          absolutePath: '',
          hashedAbsoluteUrl: 'https://foobar.com/foo.HASH.gif',
          hashedFileName: 'foo.HASH.gif'
        }
      }
    });

    plugin.apply(mockCompiler);

    expect(typeof mockWebpackAssets['foo.HASH.gif'].source).toEqual('function');
  });

});
