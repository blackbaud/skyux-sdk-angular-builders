import mock from 'mock-require';

import {
  SkyuxAssetHelper
} from '../../../shared/asset-helper';

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
  });

  it('should replace asset paths with hard URLs', () => {
    mockAssets = {
      'foo.js': {
        source: () => '["assets/foo.gif"]'
      }
    };

    SkyuxAssetHelper.queue({
      filePath: 'assets/foo.gif',
      url: 'https://foobar.com/'
    });

    const { SkyuxAssetUrlsPlugin } = mock.reRequire('./asset-urls-plugin');
    const plugin = new SkyuxAssetUrlsPlugin();

    plugin.apply(mockCompiler);

    expect(actualContent).toBe('["https://foobar.com/"]');
  });

});

