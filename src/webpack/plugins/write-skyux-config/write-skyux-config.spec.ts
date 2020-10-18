import mock from 'mock-require';

describe('write skyuxconfig.json webpack plugin', () => {

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

  function getPlugin(): typeof SkyuxWriteSkyuxConfigPlugin {
    const SkyuxWriteSkyuxConfigPlugin = mock.reRequire('./write-skyux-config').SkyuxWriteSkyuxConfigPlugin;
    return new SkyuxWriteSkyuxConfigPlugin();
  }

  it('should write skyuxconfig.json file', () => {
    mockStats = {
      toJson: () => {
        return {
          outputPath: './dist'
        };
      }
    };

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    expect(writeJsonSpy).toHaveBeenCalledWith(
      'dist/skyuxconfig.json',
      {
        rootElementTagName: 'app-root'
      },
      {
        spaces: 2
      }
    );
  });

});
