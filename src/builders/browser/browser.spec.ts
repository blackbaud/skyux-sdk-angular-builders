import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { of } from 'rxjs';
import webpack from 'webpack';

import { SkyuxAppAssetsPlugin } from '../../tools/webpack/plugins/app-assets/app-assets.plugin';
import { SkyuxSaveHostMetadataPlugin } from '../../tools/webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import { SkyuxBrowserBuilderOptions } from './browser-options';

class MockWebpackPlugin {
  public apply() {}
}

describe('browser builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeBrowserBuilderSpy: jasmine.Spy;
  let serveBuildResultsSpy: jasmine.Spy;
  let defaultOptions: SkyuxBrowserBuilderOptions;
  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;

  beforeEach(() => {
    defaultOptions = {
      index: '',
      main: '',
      outputPath: '',
      tsConfig: ''
    };

    defaultWebpackConfig = {};

    actualWebpackConfig = {};

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(defaultOptions, {
          target: {
            project: 'foo'
          }
        })
      );

    executeBrowserBuilderSpy = jasmine
      .createSpy('executeBrowserBuilder')
      .and.callFake((_options: any, _context: any, transforms: any) => {
        actualWebpackConfig = transforms.webpackConfiguration(
          defaultWebpackConfig
        );
        return of({
          success: true
        });
      });

    serveBuildResultsSpy = jasmine.createSpy('serveBuildResults');

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(buildAngular, 'executeBrowserBuilder', 'get').and.returnValue(
      executeBrowserBuilderSpy
    );

    mock('glob', {
      sync: () => ['foo.jpg']
    });

    mock('hasha', {
      fromFileSync: () => 'MOCK_HASH'
    });

    mock('../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return {
          host: {
            url: 'https://foo.com/'
          }
        };
      }
    });

    mock('./browser-server', {
      serveBuildResults: serveBuildResultsSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should add `SkyuxSaveMetadataPlugin` to webpack plugins', async () => {
    await mock.reRequire('./browser');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof SkyuxSaveHostMetadataPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should add `SkyuxAppAssetsPlugin` to webpack plugins', async () => {
    await mock.reRequire('./browser');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof SkyuxAppAssetsPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should not affect other plugins', async () => {
    defaultWebpackConfig = {
      plugins: [new MockWebpackPlugin()]
    };

    await mock.reRequire('./browser');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof MockWebpackPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should ensure the deployUrl ends with the baseHref and a forward slash', async () => {
    defaultOptions.deployUrl = 'https://foo.com';
    await mock.reRequire('./browser');
    expect(
      executeBrowserBuilderSpy.calls.mostRecent().args[0].deployUrl
    ).toEqual('https://foo.com/foo/');
  });

  it("should only add the baseHref if it's not already included", async () => {
    defaultOptions.deployUrl = 'https://foo.com/foo/';
    await mock.reRequire('./browser');
    expect(
      executeBrowserBuilderSpy.calls.mostRecent().args[0].deployUrl
    ).toEqual('https://foo.com/foo/');
  });

  it('should serve build results', async () => {
    defaultOptions.skyuxServe = true;
    await mock.reRequire('./browser');
    expect(serveBuildResultsSpy).toHaveBeenCalled();
  });
});
