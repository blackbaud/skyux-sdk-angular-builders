import mock from 'mock-require';

import {
  SkyuxSaveHostMetadataPlugin
} from './save-host-metadata.plugin';

describe('save metadata webpack plugin', () => {

  let writeJsonSpy: jasmine.Spy;
  let mockCompiler: any;

  beforeEach(() => {
    writeJsonSpy = jasmine.createSpy('writeJsonSync');

    mock('fs-extra', {
      writeJsonSync: writeJsonSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });
  
  function setupTest(mockChunks: any[]): void {
    const mockStats = {
      toJson: () => {
        return {
          chunks: mockChunks,
          outputPath: './dist'
        };
      }
    };
    
    mockCompiler = {
      hooks: {
        done: {
          tap(_pluginName: string, callback: (stats: any) => void) {
            callback(mockStats);
          }
        }
      }
    };
  }

  function getPlugin(): SkyuxSaveHostMetadataPlugin {
    const SkyuxSaveHostMetadataPlugin = mock.reRequire('./save-host-metadata.plugin').SkyuxSaveHostMetadataPlugin;

    const plugin = new SkyuxSaveHostMetadataPlugin('my-project', {
      hostUrl: 'https://host.nxt.blackbaud.com/',
      localUrl: 'https://localhost:4200/'
    });

    return plugin;
  }

  it('should write metadata.json file', () => {
    setupTest([
      {
        initial: true,
        files: ['main.js']
      },
      {
        initial: false,
        files: ['default~app-module~app-module~mo~0d131e23.js']
      },
      {
        files: ['styles.css']
      }
    ]);

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    expect(writeJsonSpy).toHaveBeenCalledWith(
      'dist/metadata.json',
      [
        {
          name: 'main.js',
          initial: true,
          fallback: 'SKY_PAGES_READY_MAIN_JS',
          type: 'script'
        },
        {
          name: 'default~app-module~app-module~mo~0d131e23.js',
          initial: false,
          fallback: 'SKY_PAGES_READY_DEFAULT_APP_MODULE_APP_MODULE_MO_0D131E23_JS',
          type: 'script'
        },
        {
          name: 'styles.css',
          type: 'stylesheet',
          fallbackStylesheet: {
            class: 'sky-pages-ready-styles-css',
            property: 'visibility',
            value: 'hidden'
          }
        }
      ],
      {
        spaces: 2
      }
    );
  });

});
