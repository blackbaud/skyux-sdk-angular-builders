import mock from 'mock-require';
import { ConcatSource } from 'webpack-sources';

import { SkyuxHostAssetsFallbackPlugin } from './host-assets-fallback.plugin';

describe('host assets fallback webpack plugin', () => {
  let mockAssets: {
    [filePath: string]: {
      source: () => string;
    };
  };

  let mockCompiler: any;

  let assetsToUpdate: {
    [filePath: string]: (asset: { source: () => string }) => ConcatSource;
  };

  afterEach(() => {
    mock.stopAll();
  });

  function setupTest(assets: any): void {
    assetsToUpdate = {};
    mockAssets = assets;

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
          }
        }
      }
    };
  }

  function getPlugin(): SkyuxHostAssetsFallbackPlugin {
    const SkyuxHostAssetsFallbackPlugin = mock.reRequire(
      './host-assets-fallback.plugin'
    ).SkyuxHostAssetsFallbackPlugin;
    return new SkyuxHostAssetsFallbackPlugin('my-project');
  }

  // Simulate Webpack calling the source callback.
  function getAssetContent(fileName: string): string {
    return assetsToUpdate[fileName](mockAssets[fileName]).source();
  }

  it("should add a fallback variable to the end of a JavaScript file's source", () => {
    setupTest({
      'main.js': {
        source: () => '[main content here]'
      }
    });

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    const content = getAssetContent('main.js');
    expect(content).toEqual(
      '[main content here]\nwindow.SKY_PAGES_READY_MAIN_JS = true;'
    );
  });

  it("should add a fallback CSS rule to the end of a CSS file's source", () => {
    setupTest({
      'styles.css': {
        source: () => '[main content here]'
      }
    });

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    const content = getAssetContent('styles.css');
    expect(content).toEqual(
      '[main content here]\n.sky-pages-ready-styles-css {visibility:hidden;}'
    );
  });
});
