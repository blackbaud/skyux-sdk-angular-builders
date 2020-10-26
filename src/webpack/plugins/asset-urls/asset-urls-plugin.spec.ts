import mock from 'mock-require';

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
              console.log('Actual content:', actualContent);
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

    const { SkyuxAssetUrlsPlugin } = mock.reRequire('./asset-urls-plugin');
    const plugin = new SkyuxAssetUrlsPlugin({
      assetBaseUrl: 'https://foobar.com/'
    });

    plugin.apply(mockCompiler);

    expect(actualContent).toBe('["https://foobar.com/assets/foo.gif"]');
  });

  it('should handle duplicate assets for the same file', () => {
    mockAssets = {
      'foo.js': {
        source: () => '["assets/duplicate.gif"],["assets/duplicate.gif"]'
      }
    };

    const { SkyuxAssetUrlsPlugin } = mock.reRequire('./asset-urls-plugin');
    const plugin = new SkyuxAssetUrlsPlugin({
      assetBaseUrl: 'https://foobar.com/'
    });

    plugin.apply(mockCompiler);

    expect(actualContent).toBe(
      '["https://foobar.com/assets/duplicate.gif"],["https://foobar.com/assets/duplicate.gif"]'
    );
  });

  it('should ignore files without assets', () => {
    mockAssets = {
      'foo.js': {
        source: () => 'Default content here.'
      }
    };

    const { SkyuxAssetUrlsPlugin } = mock.reRequire('./asset-urls-plugin');
    const plugin = new SkyuxAssetUrlsPlugin({
      assetBaseUrl: 'https://foobar.com/'
    });

    plugin.apply(mockCompiler);

    expect(actualContent).toBe(
      'Default content here.'
    );
  });

});

