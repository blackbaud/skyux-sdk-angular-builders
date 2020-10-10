import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import {
  homedir
} from 'os';

import {
  of
} from 'rxjs';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import mock from 'mock-require';

import webpack from 'webpack';

class MockWebpackPlugin {
  public apply() { }
}

describe('dev-server builder', () => {

  let createBuilderSpy: jasmine.Spy;
  let executDevServerBuilderSpy: jasmine.Spy;
  let defaultOptions: SkyuxDevServerBuilderOptions;
  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;

  beforeEach(() => {
    defaultOptions = {
      browserTarget: 'foo:build',
      host: 'localhost',
      port: 4200
    };

    defaultWebpackConfig = {};
    actualWebpackConfig = {};

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(defaultOptions, {
        target: {
          project: 'foo'
        }
      }));

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

    it('should not affect Angular options if `skyuxLaunch` is set to "local"', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'local'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual(defaultOptions);
    });

    it('should overwrite Angular options if `skyuxLaunch` is set to "host"', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual({
        allowedHosts: [ '.blackbaud.com' ],
        baseHref: 'https://localhost:4200/',
        browserTarget: 'foo:build',
        deployUrl: 'https://localhost:4200/',
        host: 'localhost',
        port: 4200,
        publicHost: 'https://localhost:4200/',
        servePathDefaultWarning: false,
        skyuxHostUrl: 'https://app.blackbaud.com/',
        skyuxLaunch: 'host',
        ssl: true,
        sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
        sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
      });
    });

    it('should allow setting a custom `skyuxHostUrl` and append a trailing slash', async () => {
      defaultOptions = overrideOptions({
        skyuxLaunch: 'host',
        skyuxHostUrl: 'https://my-host-url.com'
      });

      await (mock.reRequire('./dev-server'));

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual(jasmine.objectContaining({
        skyuxHostUrl: 'https://my-host-url.com/'
      }));
    });
  });

  describe('webpack config', () => {
    it('should add `SkyuxOpenHostURLPlugin` to webpack plugins', async () => {
      await (mock.reRequire('./dev-server'));

      let plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxOpenHostURLPlugin);

      expect(plugin).toBeUndefined(
        'Expected the plugin not to be included by default.'
      );

      defaultOptions = overrideOptions({
        skyuxLaunch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxOpenHostURLPlugin);

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

      expect(actualWebpackConfig.plugins?.length).toEqual(2);
    });
  });

});
