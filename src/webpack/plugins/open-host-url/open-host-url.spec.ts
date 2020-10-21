import mock from 'mock-require';

describe('open host url webpack plugin', () => {

  let openSpy: jasmine.Spy;
  let mockCompiler: any;
  let mockStats: any;
  let hostUrl: string;
  let localUrl: string;

  beforeEach(() => {
    openSpy = jasmine.createSpy('openHostUrl');

    mockStats = undefined;

    mockCompiler = {
      hooks: {
        done: {
          tap(_pluginName: string, callback: (stats: any) => void) {
            callback({
              toJson: () => mockStats
            });
          }
        }
      }
    };

    hostUrl = 'https://app.blackbaud.com/';
    localUrl = 'https://localhost:4200/';

    mock('../../../shared/host-utils', {
      openHostUrl: openSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getPlugin(): typeof SkyuxOpenHostURLPlugin {
    const SkyuxOpenHostURLPlugin = mock.reRequire('./open-host-url').SkyuxOpenHostURLPlugin;

    const plugin = new SkyuxOpenHostURLPlugin({
      hostUrl,
      localUrl,
      pathName: 'my-project'
    });

    return plugin;
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const plugin = getPlugin();

    plugin.apply(mockCompiler);

    expect(openSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: []
    });
  });

  it('should send scripts to SKY UX Host', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: [
        {
          initial: true,
          files: ['main.ts']
        },
        {
          initial: false,
          files: ['default~app-module~app-module~mo~0d131e23.js']
        }
      ]
    };

    plugin.apply(mockCompiler);

    expect(openSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [
        { name: 'main.ts' }
      ]
    });
  });

  it('should handle empty chunks', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: undefined
    };

    plugin.apply(mockCompiler);

    expect(openSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: []
    });
  });

  it('should only open the URL once', () => {
    const plugin = getPlugin();

    mockCompiler.hooks.done.tap = (_pluginName: string, callback: (stats: any) => void) => {
      callback({
        toJson() {
          return mockStats;
        }
      });

      // Run the callback again to simulate a compilation after a file is changed during watch mode.
      callback({});
    };

    plugin.apply(mockCompiler);

    expect(openSpy).toHaveBeenCalledTimes(1);
  });

});
