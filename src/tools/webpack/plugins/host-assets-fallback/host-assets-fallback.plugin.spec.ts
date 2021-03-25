import mock from 'mock-require';

import {
  SkyuxHostAssetsFallbackPlugin
} from './host-assets-fallback.plugin';

describe('host assets fallback webpack plugin', () => {

  let mockCompiler: any;

  afterEach(() => {
    mock.stopAll();
  });
  
  function setupTest(mockAssets: any): void {
    const mockStats = {
      assets: mockAssets
    };
    
    mockCompiler = {
      hooks: {
        emit: {
          tap(_pluginName: string, callback: (stats: any) => void) {
            callback(mockStats);
          }
        }
      }
    };
  }

  function getPlugin(): SkyuxHostAssetsFallbackPlugin {
    const SkyuxHostAssetsFallbackPlugin = mock.reRequire('./host-assets-fallback.plugin').SkyuxHostAssetsFallbackPlugin;
    return new SkyuxHostAssetsFallbackPlugin('my-project');
  }

  it('should add a fallback variable to the end of a JavaScript file\'s source', () => {
    const mockAssets = {
      'main.js': {
        source: () => '[main content here]'
      }
    };
    
    setupTest(mockAssets);

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    // Simulate Webpack calling the source callback.
    const content = mockAssets['main.js'].source();

    expect(content).toEqual('[main content here]\nvar SKY_PAGES_READY_MAIN_JS = true;');
  });
  
  it('should add a fallback CSS rule to the end of a CSS file\'s source', () => {
    const mockAssets = {
      'styles.css': {
        source: () => '[main content here]'
      }
    };
    
    setupTest(mockAssets);

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    // Simulate Webpack calling the source callback.
    const content = mockAssets['styles.css'].source();

    expect(content).toEqual('[main content here]\n.sky-pages-ready-styles-css {visibility:hidden;}');
  });

});
