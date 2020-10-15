import mock from 'mock-require';

describe('open host url webpack plugin', () => {

  let openSpy: jasmine.Spy;
  let mockCompiler: any;
  let mockStats: any;

  beforeEach(() => {
    openSpy = jasmine.createSpy('open');

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

    mock('open', openSpy);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getPlugin(): typeof SkyuxOpenHostURLPlugin {
    const SkyuxOpenHostURLPlugin = mock.reRequire('./open-host-url').SkyuxOpenHostURLPlugin;

    const plugin = new SkyuxOpenHostURLPlugin('my-project', {
      hostUrl: 'https://app.blackbaud.com/',
      localUrl: 'https://localhost:4200/'
    });

    return plugin;
  }

  function decode(url: string): object {
    return JSON.parse(Buffer.from(decodeURIComponent(url.split('_cfg=')[1]), 'base64').toString());
  }

  function getActualUrl(): string {
    return openSpy.calls.mostRecent().args[0];
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const plugin = getPlugin();

    plugin.apply(mockCompiler);

    const actualUrl = getActualUrl();
    expect(actualUrl.startsWith('https://app.blackbaud.com/my-project/?local=true&_cfg=')).toEqual(true);

    expect(decode(actualUrl)).toEqual({
      host: {
        rootElementTagName: 'app-root'
      },
      localUrl: 'https://localhost:4200/',
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

    const actualUrl = getActualUrl();
    expect(decode(actualUrl)).toEqual({
      host: {
        rootElementTagName: 'app-root'
      },
      localUrl: 'https://localhost:4200/',
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

    const actualUrl = getActualUrl();
    expect(decode(actualUrl)).toEqual({
      host: {
        rootElementTagName: 'app-root'
      },
      localUrl: 'https://localhost:4200/',
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
