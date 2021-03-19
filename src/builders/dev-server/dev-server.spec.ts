import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';

import {
  homedir
} from 'os';

import {
  of
} from 'rxjs';

import webpack from 'webpack';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  SkyuxAppAssetsPlugin
} from '../../tools/webpack/plugins/app-assets/app-assets.plugin';

import {
  SkyuxProtractorPlugin
} from '../../tools/webpack/plugins/protractor/protractor.plugin';

import {
  SkyuxOpenHostUrlPlugin
} from '../../tools/webpack/plugins/open-host-url/open-host-url.plugin';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

class MockWebpackPlugin {
  public apply() { }
}

describe('dev-server builder', () => {

  let createBuilderSpy: jasmine.Spy;
  let executDevServerBuilderSpy: jasmine.Spy;
  let defaultOptions: SkyuxDevServerBuilderOptions;
  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;
  let mockContext: any;
  let mockSkyuxConfig: SkyuxConfig;

  beforeEach(() => {
    defaultOptions = {
      browserTarget: 'foo:build'
    };

    defaultWebpackConfig = {};

    actualWebpackConfig = {};

    mockContext = {
      target: {
        project: 'foo',
        configuration: ''
      }
    };

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(defaultOptions, mockContext));

    executDevServerBuilderSpy = jasmine.createSpy('executeDevServerBuilder').and
      .callFake((_options: any, _context: any, transforms: any) => {
        actualWebpackConfig = transforms.webpackConfiguration(defaultWebpackConfig);
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and
      .returnValue(createBuilderSpy);

    spyOnProperty(buildAngular, 'executeDevServerBuilder', 'get').and
      .returnValue(executDevServerBuilderSpy);

    mock('glob', {
      sync: () => ['foo.jpg']
    });

    mock('hasha', {
      fromFileSync: () => 'MOCK_HASH'
    });

    mockSkyuxConfig = {
      host: {
        url: 'https://foo.blackbaud.com/'
      }
    };
    mock('../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return mockSkyuxConfig;
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getActualOptions(): SkyuxDevServerBuilderOptions {
    return executDevServerBuilderSpy.calls.mostRecent().args[0];
  }

  function overrideOptions(config: any): SkyuxDevServerBuilderOptions {
    return {...defaultOptions, ...config} as SkyuxDevServerBuilderOptions;
  }

  describe('configuration', () => {

    it('should set defaults', async () => {
      defaultOptions = overrideOptions({});

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual({
        browserTarget: 'foo:build',
        host: 'localhost',
        port: 4200,
        ssl: true,
        sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
        sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
      });
    });

    it('should overwrite Angular options if `skyuxLaunch` is set to "host"', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual({
        allowedHosts: [ '.blackbaud.com' ],
        browserTarget: 'foo:build',
        deployUrl: 'https://localhost:4200/',
        host: 'localhost',
        open: false,
        port: 4200,
        publicHost: 'https://localhost:4200/',
        servePath: '/',
        skyuxLaunch: 'host',
        skyuxOpen: true,
        ssl: true,
        sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
        sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
      });
    });

    it('should enforce HTTPS if `skyuxLaunch` is defined', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'local'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual({
        ...defaultOptions,
        ...{
          ssl: true,
          sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
          sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
        }
      } as SkyuxDevServerBuilderOptions);
    });

    it('should open the default browser if `skyuxLaunch` is set to "local"', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'local'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions.open).toEqual(true);
    });

  });

  describe('webpack config', () => {

    function getOpenHostUrlPlugin(): SkyuxOpenHostUrlPlugin {
      return actualWebpackConfig.plugins?.find(p =>
        p instanceof SkyuxOpenHostUrlPlugin) as SkyuxOpenHostUrlPlugin;
    }

    function getProtractorPlugin(): SkyuxProtractorPlugin {
      return actualWebpackConfig.plugins?.find(p =>
        p instanceof SkyuxProtractorPlugin) as SkyuxProtractorPlugin;
    }

    it('should add `SkyuxOpenHostUrlPlugin` to webpack plugins', async () => {
      await (mock.reRequire('./dev-server'));

      let plugin = getOpenHostUrlPlugin();

      expect(plugin).toBeUndefined(
        'Expected the plugin not to be included by default.'
      );

      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      plugin = getOpenHostUrlPlugin();

      expect(plugin).toBeDefined();
    });

    it('should pass `externals` to `SkyuxOpenHostUrlPlugin` if defined', async () => {
      const externals = {
        js: {
          before: [{
            url: 'foo.js'
          }]
        }
      };

      mockSkyuxConfig.app = {
        externals
      };

      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      const plugin = getOpenHostUrlPlugin();

      expect(plugin['config'].skyuxConfig.app?.externals).toEqual(externals);
    });

    it('should add `SkyuxAppAssetsPlugin` to webpack plugins', async () => {
      await (mock.reRequire('./dev-server'));

      const plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxAppAssetsPlugin);

      expect(plugin).toBeDefined();
    });

    it('should not affect other plugins', async () => {
      defaultWebpackConfig = {
        plugins: [
          new MockWebpackPlugin()
        ]
      };

      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      expect(actualWebpackConfig.plugins?.length).toEqual(3);
    });

    it('should add `SkyuxProtractorPlugin` when running e2e', async () => {
      await (mock.reRequire('./dev-server'));

      let plugin = getProtractorPlugin();

      expect(plugin).toBeUndefined(
        'Expected the plugin not to be included by default.'
      );

      mockContext.target.configuration = 'e2e';
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      plugin = getProtractorPlugin();

      expect(plugin).toBeDefined(
        'Expected the plugin to be added for `ng e2e`.'
      );

      mockContext.target.configuration = 'e2eProduction';
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      plugin = getProtractorPlugin();

      expect(plugin).toBeDefined(
        'Expected the plugin to be added for `ng e2e --prod`.'
      );
    });

    it('should pass Host URL to `SkyuxProtractorPlugin`', async () => {
      mockContext.target.configuration = 'e2e';
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      const protractorPlugin = getProtractorPlugin();
      const hostUrlPlugin = getOpenHostUrlPlugin();
      hostUrlPlugin['_$hostUrl'].next('https://foo.bar.com');

      const url = await protractorPlugin['config'].hostUrlFactory();
      expect(url).toEqual('https://foo.bar.com');
    });

  });

});
