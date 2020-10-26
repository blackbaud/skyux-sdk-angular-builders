import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import {
  of
} from 'rxjs';

import {
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls-plugin';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

import mock from 'mock-require';

import webpack from 'webpack';

class MockWebpackPlugin {
  public apply() { }
}

describe('browser builder', () => {

  let createBuilderSpy: jasmine.Spy;
  let executeBrowserBuilderSpy: jasmine.Spy;
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

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(defaultOptions, {
        target: {
          project: 'foo'
        }
      }));

    executeBrowserBuilderSpy = jasmine.createSpy('executeBrowserBuilder').and
      .callFake((_options: any, _context: any, transforms: any) => {
        actualWebpackConfig = transforms.webpackConfiguration(defaultWebpackConfig);
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and
      .returnValue(createBuilderSpy);

    spyOnProperty(buildAngular, 'executeBrowserBuilder', 'get').and
      .returnValue(executeBrowserBuilderSpy);
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should add `SkyuxSaveMetadataPlugin` to webpack plugins', async () => {
    await (mock.reRequire('./browser'));

    const plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxSaveHostMetadataPlugin);

    expect(plugin).toBeDefined();
  });

  it('should not affect other plugins', async () => {
    defaultWebpackConfig = {
      plugins: [
        new MockWebpackPlugin()
      ]
    };

    await (mock.reRequire('./browser'));

    expect(actualWebpackConfig.plugins?.length).toEqual(2);
  });

  it('should add asset URLs loader and plugin when `deployUrl` set', async () => {
    defaultOptions.deployUrl = 'https://foobar.com/';

    await (mock.reRequire('./browser'));

    const loader = actualWebpackConfig.module?.rules?.find((rule: any) => {
      return rule.use.loader.indexOf('asset-urls-loader') > -1;
    });

    const plugin = actualWebpackConfig.plugins?.find(p => p instanceof SkyuxAssetUrlsPlugin);

    expect(loader).toBeDefined('Expected config to include loader.');
    expect(plugin).toBeDefined('Expected config to include plugin.');
  });

});
