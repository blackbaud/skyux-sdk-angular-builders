import mock from 'mock-require';

import {
  take
} from 'rxjs/operators';

import {
  SkyuxHostAssetType
} from '../../host-asset-type';

import {
  SkyuxOpenHostUrlPluginConfig
} from './open-host-url-config';

import {
  SkyuxOpenHostUrlPlugin
} from './open-host-url.plugin';

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

    hostUrl = 'https://host.nxt.blackbaud.com/';
    localUrl = 'https://localhost:4200/';

    spyOn(console, 'log');

    mock('./create-host-url', {
      createHostUrl: createSpy
    });

    mock('open', openSpy);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getPlugin(options: Partial<SkyuxOpenHostUrlPluginConfig> = {}): SkyuxOpenHostUrlPlugin {
    const SkyuxOpenHostUrlPlugin = mock.reRequire('./open-host-url.plugin').SkyuxOpenHostUrlPlugin;

    const plugin = new SkyuxOpenHostUrlPlugin({...{
      host: {
        url: hostUrl
      },
      localUrl,
      baseHref: 'my-project'
    }, ...options});

    return plugin;
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const plugin = getPlugin();

    plugin.apply(mockCompiler);

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      },
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [],
      stylesheets: []
    });
  });

  it('should open host URL with `externals`', () => {
    const externals = {
      js: {
        before: [{
          url: 'foo.js'
        }]
      }
    };

    const plugin = getPlugin({
      externals
    });

    plugin.apply(mockCompiler);

    expect(createSpy.calls.mostRecent().args[2].externals).toEqual(externals);
  });

  it('should send scripts to SKY UX Host', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: [
        {
          initial: true,
          files: ['main.js']
        },
        {
          initial: false,
          files: ['default~app-module~app-module~mo~0d131e23.js']
        }
      ]
    };

    plugin.apply(mockCompiler);

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      },
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [
        {
          name: 'main.js',
          type: SkyuxHostAssetType.Script
        }
      ],
      stylesheets: []
    });
  });

  it('should only send javascript and css files', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: [
        {
          initial: true,
          files: ['main.js']
        },
        {
          files: ['styles.css']
        },
        {
          initial: true,
          files: ['foo.txt']
        }
      ]
    };

    plugin.apply(mockCompiler);

    expect(createSpy).toHaveBeenCalledWith(hostUrl, 'my-project', {
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      },
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [
        {
          name: 'main.js',
          type: SkyuxHostAssetType.Script
        }
      ],
      stylesheets: [
        {
          name: 'styles.css',
          type: SkyuxHostAssetType.Stylesheet
        }
      ]
    });
  });

  it('should load the polyfills script first', () => {
    const plugin = getPlugin();

    mockStats = {
      chunks: [
        {
          initial: true,
          files: ['main.js']
        },
        {
          initial: true,
          files: ['polyfills.js']
        }
      ]
    };

    plugin.apply(mockCompiler);

    expect(createSpy.calls.mostRecent().args[2].scripts).toEqual([
      {
        name: 'polyfills.js',
        type: SkyuxHostAssetType.Script
      },
      {
        name: 'main.js',
        type: SkyuxHostAssetType.Script
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
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      },
      localUrl: 'https://localhost:4200/',
      rootElementTagName: 'app-root',
      scripts: [],
      stylesheets: []
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

  it('should provide a public observable for the generated Host URL', async () => {
    createSpy.and.returnValue('foobar.com?cfg=baz');

    const plugin = getPlugin();
    plugin.apply(mockCompiler);

    const url = await plugin.$hostUrl.pipe(take(1)).toPromise();
    expect(url).toEqual('foobar.com?cfg=baz');
  });

});
