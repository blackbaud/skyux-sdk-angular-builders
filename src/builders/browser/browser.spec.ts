import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import {
  of
} from 'rxjs';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata-plugin';

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

});
