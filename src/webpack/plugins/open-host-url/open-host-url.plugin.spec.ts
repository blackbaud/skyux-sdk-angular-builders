import mock from 'mock-require';

import {
  SkyuxOpenHostURLPluginConfig
} from './open-host-url-config';

describe('open host url webpack plugin', () => {

  let createSpy: jasmine.Spy;
  let openSpy: jasmine.Spy;
  let mockCompiler: any;
  let mockStats: any;
  let hostUrl: string;
  let localUrl: string;

  beforeEach(() => {
    createSpy = jasmine.createSpy('createHostUrl');
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

    hostUrl = 'https://app.blackbaud.com/';
    localUrl = 'https://localhost:4200/';

    spyOn(console, 'log');

    mock('../../../shared/host-utils', {
      createHostUrl: createSpy
    });

    mock('open', openSpy);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getPlugin(options: Partial<SkyuxOpenHostURLPluginConfig> = {}): typeof SkyuxOpenHostURLPlugin {
    const SkyuxOpenHostURLPlugin = mock.reRequire('./open-host-url.plugin').SkyuxOpenHostURLPlugin;

    const plugin = new SkyuxOpenHostURLPlugin({...{
      hostUrl,
      localUrl,
      pathName: 'my-project'
    }, ...options});

    return plugin;
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const plugin = getPlugin();

    plugin.apply(mockCompiler);

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
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

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [
        { name: 'main.ts' }
      ]
    });
  });

  it('should load the polyfills script first', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: [
        {
          initial: true,
          files: ['main.ts']
        },
        {
          initial: true,
          files: ['polyfills.ts']
        }
      ]
    };

    plugin.apply(mockCompiler);

    expect(createSpy.calls.mostRecent().args[2].scripts).toEqual([
      {
        name: 'polyfills.ts'
      },
      {
        name: 'main.ts'
      }
    ]);
  });

  it('should handle empty chunks', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: undefined
    };

    plugin.apply(mockCompiler);

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
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

    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('should allow opening the Host URL in the default browser', () => {
    let plugin = getPlugin();
    plugin.apply(mockCompiler);

    // The URL should not be opened by default.
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.calls.reset();

    plugin = getPlugin({
      open: true
    });
    plugin.apply(mockCompiler);

    expect(openSpy).toHaveBeenCalled();
  });

});
