import mock from 'mock-require';

import { ConcatSource } from 'webpack-sources';

describe('Asset URLs plugin', () => {
  let mockWebpackAssets: {
    [_: string]: {
      source: () => string;
    };
  };

  let mockCompiler: any;

  let assetsToUpdate: {
    [filePath: string]: (asset: { source: () => string }) => ConcatSource;
  };

  beforeEach(() => {
    mockWebpackAssets = {};

    mock('fs-extra', {
      readFileSync: () => ''
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function setupTest(assets: any): void {
    assetsToUpdate = {};
    mockWebpackAssets = assets;

    const mockCompilation = {
      assets,
      updateAsset: (filePath: string, cb: () => ConcatSource) => {
        assetsToUpdate[filePath] = cb;
      }
    };

    mockCompiler = {
      hooks: {
        emit: {
          tap(_pluginName: string, callback: (compilation: any) => void) {
            callback(mockCompilation);

            // Simulate Webpack emitting all assets.
            for (const fileName of Object.keys(mockCompilation.assets)) {
              mockCompilation.assets[fileName].source();
            }
          }
        }
      }
    };
  }

  // Simulate Webpack calling the source callback.
  function getAssetContent(fileName: string): string {
    return assetsToUpdate[fileName](mockWebpackAssets[fileName]).source();
  }

  it('should replace asset paths with hard URLs', () => {
    setupTest({
      'foo.js': {
        source: () =>
          '["assets/foo.gif"], background-image: url(\\"/assets/foo.gif\\"), background-image: url(/assets/foo.gif)'
      }
    });

    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin({
      assetsMap: {
        'assets/foo.gif': {
          absolutePath: '',
          hashedUrl: 'https://foobar.com/foo.HASH.gif',
          hashedFileName: 'foo.HASH.gif'
        }
      }
    });

    plugin.apply(mockCompiler);

    const actualContent = getAssetContent('foo.js');
    expect(actualContent).toBe(
      '["https://foobar.com/foo.HASH.gif"], background-image: url(https://foobar.com/foo.HASH.gif), background-image: url(https://foobar.com/foo.HASH.gif)'
    );
  });

  it('should create hashed file names for all assets', () => {
    setupTest({});

    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin({
      assetsMap: {
        'assets/foo.gif': {
          absolutePath: '',
          hashedUrl: 'https://foobar.com/foo.HASH.gif',
          hashedFileName: 'foo.HASH.gif'
        }
      }
    });

    plugin.apply(mockCompiler);

    expect(typeof mockWebpackAssets['foo.HASH.gif'].source).toEqual('function');
  });
});
