import mock from 'mock-require';

import {
  SkyuxAppAssetsState
} from '../../app-assets-state';

describe('Asset URLs plugin', () => {

  let actualContent: string;
  let mockAssets: {
    [_: string]: {
      source: () => string;
    }
  };
  let mockCompiler: any;

  beforeEach(() => {
    mockAssets = {};

    actualContent = '';

    mockCompiler = {
      hooks: {
        emit: {
          tap(_pluginName: string, callback: (compilation: any) => void) {
            const mockCompilation = {
              assets: mockAssets
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
    SkyuxAppAssetsState.flush();
  });

  it('should replace asset paths with hard URLs', () => {
    mockAssets = {
      'foo.js': {
        source: () => '["assets/foo.gif"]'
      }
    };

    SkyuxAppAssetsState.queue({
      filePath: 'assets/foo.gif',
      url: 'https://foobar.com/'
    });

    const { SkyuxAppAssetsPlugin } = mock.reRequire('./app-assets.plugin');
    const plugin = new SkyuxAppAssetsPlugin();

    plugin.apply(mockCompiler);

    expect(actualContent).toBe('["https://foobar.com/"]');
  });

});
