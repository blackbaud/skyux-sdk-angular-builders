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

import * as applyAppAssetsConfigUtil from '../../webpack/app-assets-utils';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url.plugin';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

class MockWebpackPlugin {
  public apply() { }
}

describe('dev-server builder', () => {

  let applyAppAssetsConfigSpy: jasmine.Spy;
  let createBuilderSpy: jasmine.Spy;
  let executDevServerBuilderSpy: jasmine.Spy;

  let defaultSkyuxOptions: SkyuxDevServerBuilderOptions;

  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;

  beforeEach(() => {
    defaultWebpackConfig = {};

    actualWebpackConfig = {};

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(defaultSkyuxOptions, {
        target: {
          project: 'foo'
        }
      }));

    executDevServerBuilderSpy = jasmine.createSpy('executeDevServerBuilder').and
      .callFake((_options: buildAngular.DevServerBuilderOptions, _context: any, transforms: any) => {
        actualWebpackConfig = transforms.webpackConfiguration(defaultWebpackConfig);
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and
      .returnValue(createBuilderSpy);

    spyOnProperty(buildAngular, 'executeDevServerBuilder', 'get').and
      .returnValue(executDevServerBuilderSpy);

    applyAppAssetsConfigSpy = spyOn(applyAppAssetsConfigUtil, 'applyAppAssetsConfig');
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getAngularBuilderOptions(): buildAngular.DevServerBuilderOptions {
    return executDevServerBuilderSpy.calls.mostRecent().args[0];
  }

  function overrideSkyuxOptions(config: SkyuxDevServerBuilderOptions): SkyuxDevServerBuilderOptions {
    return {...defaultSkyuxOptions, ...config} as SkyuxDevServerBuilderOptions;
  }

  describe('configuration', () => {

    it('should overwrite Angular options if `launch` is set to "host"', async () => {
      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      const builderOptions = getAngularBuilderOptions();

      expect(builderOptions).toEqual({
        allowedHosts: [ '.blackbaud.com' ],
        browserTarget: 'foo:build',
        deployUrl: 'https://localhost:4200/',
        host: 'localhost',
        port: 4200,
        publicHost: 'https://localhost:4200/',
        servePath: '/',
        ssl: true,
        sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
        sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
      });
    });

    it('should open the default browser if `launch` is set to "local"', async () => {
      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'local'
      });

      await (mock.reRequire('./dev-server'));

      const builderOptions = getAngularBuilderOptions();

      expect(builderOptions.open).toEqual(true);
    });


    it('should allow setting a custom `hostUrl` and append a trailing slash', async () => {
      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'host',
        hostUrl: 'https://my-host-url.com'
      });

      await (mock.reRequire('./dev-server'));

      expect(defaultSkyuxOptions).toEqual(jasmine.objectContaining({
        hostUrl: 'https://my-host-url.com/'
      }));
    });
  });

  describe('webpack config', () => {
    it('should add `SkyuxOpenHostURLPlugin` to webpack plugins', async () => {
      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'local'
      });

      await (mock.reRequire('./dev-server'));

      let plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxOpenHostURLPlugin);

      expect(plugin).toBeUndefined(
        'Expected the plugin not to be included by default.'
      );

      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxOpenHostURLPlugin);

      expect(plugin).toBeDefined();
    });

    it('should add app assets loaders and plugins', async () => {
      await (mock.reRequire('./dev-server'));

      expect(applyAppAssetsConfigSpy).toHaveBeenCalled();
    });

    it('should not affect other plugins', async () => {
      defaultWebpackConfig = {
        plugins: [
          new MockWebpackPlugin()
        ]
      };

      defaultSkyuxOptions = overrideSkyuxOptions({
        launch: 'host'
      });

      await (mock.reRequire('./dev-server'));

      expect(actualWebpackConfig.plugins?.length).toEqual(2);
    });

  });

});
