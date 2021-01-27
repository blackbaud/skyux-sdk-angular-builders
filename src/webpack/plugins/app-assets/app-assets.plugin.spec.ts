import mock from 'mock-require';

import {
  SkyuxAppAssets
} from '../../../shared/app-assets';

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
              actualContent = asset.source();
            }
          }
        }
      }
    };
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should replace asset paths with hard URLs', () => {
    mockWebpackAssets = {
      'foo.js': {
        source: () => '["assets/foo.gif"]'
      }
    };

    // SkyuxAppAssetsState.queue({
    //   filePath: 'assets/foo.gif',
    //   url: 'https://foobar.com/'
    // });

    const assetsMap: SkyuxAppAssets = {};

    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin({
      assetsMap
    });

    plugin.apply(mockCompiler);

    expect(actualContent).toBe('["https://foobar.com/"]');
  });

});
