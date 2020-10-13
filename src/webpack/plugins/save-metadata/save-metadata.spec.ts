import mock from 'mock-require';

describe('save metadata webpack plugin', () => {

  let writeJsonSpy: jasmine.Spy;
  let mockCompiler: any;
  let mockStats: any;

  beforeEach(() => {
    writeJsonSpy = jasmine.createSpy('writeJsonSync');

    mockStats = {
      toJson: () => ({})
    };

    mockCompiler = {
      hooks: {
        done: {
          tap(_pluginName: string, callback: (stats: any) => void) {
            callback(mockStats);
          }
        },
        emit: {
          tap(_pluginName: string, callback: (stats: any) => void) {
            callback(mockStats);
          }
        }
      }
    };

    mock('fs-extra', {
      writeJsonSync: writeJsonSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getPlugin(): typeof SkyuxSaveMetadataPlugin {
    const SkyuxSaveMetadataPlugin = mock.reRequire('./save-metadata').SkyuxSaveMetadataPlugin;

    const plugin = new SkyuxSaveMetadataPlugin('my-project', {
      hostUrl: 'https://app.blackbaud.com/',
      localUrl: 'https://localhost:4200/'
    });

    return plugin;
  }

  it('should write metadata.json file', () => {
    mockStats = {
      assets: {
        'main.js': {
          source: () => '[main content here]'
        },
        'styles.css': {}
      },
      toJson: () => {
        return {
          chunks: [
            {
              initial: true,
              files: ['main.js']
            },
            {
              initial: false,
              files: ['default~app-module~app-module~mo~0d131e23.js']
            }
          ],
          outputPath: './dist'
        };
      }
    };

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    expect(writeJsonSpy).toHaveBeenCalledWith(
      'dist/metadata.json',
      [
        {
          name: 'main.js',
          initial: true,
          fallback: 'SKY_PAGES_READY_MAIN_JS'
        },
        {
          name: 'default~app-module~app-module~mo~0d131e23.js',
          initial: false,
          fallback: 'SKY_PAGES_READY_DEFAULT~APP-MODULE~APP-MODULE~MO~0D131E23_JS'
        }
      ],
      {
        spaces: 2
      }
    );
  });

  it('should add a fallback variable to the end of a JavaScript file\'s source', () => {
    const mockAssets = {
      'main.js': {
        source: () => '[main content here]'
      }
    };

    mockStats = {
      assets: mockAssets,
      toJson: () => {
        return {
          chunks: [
            {
              initial: true,
              files: ['main.js']
            }
          ],
          outputPath: './dist'
        };
      }
    };

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    // Simulate Webpack calling the source callback.
    const content = mockAssets['main.js'].source();

    expect(content).toEqual('[main content here]\nvar SKY_PAGES_READY_MAIN_JS = true;');
  });

});
