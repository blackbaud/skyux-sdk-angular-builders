import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import path from 'path';
import { of } from 'rxjs';
import webpack, { DefinePlugin } from 'webpack';

import { SkyuxKarmaBuilderOptions } from './karma-options';

describe('karma builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeKarmaBuilderSpy: jasmine.Spy;
  let options: SkyuxKarmaBuilderOptions;
  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;

  beforeEach(() => {
    options = {
      karmaConfig: 'karma.conf.js',
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    };

    defaultWebpackConfig = {};

    actualWebpackConfig = {};

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(options, {
          target: {
            project: 'foo'
          }
        })
      );

    executeKarmaBuilderSpy = jasmine
      .createSpy('executeKarmaBuilder')
      .and.callFake((_options: any, _context: any, transforms: any) => {
        actualWebpackConfig = transforms.webpackConfiguration(
          defaultWebpackConfig
        );
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(buildAngular, 'executeKarmaBuilder', 'get').and.returnValue(
      executeKarmaBuilderSpy
    );

    mock('../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return {
          host: {
            url: 'https://foo.blackbaud.com/'
          }
        };
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should overwrite Angular karma config with defaults', async () => {
    await mock.reRequire('./karma');

    expect(options).toEqual({
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    });
  });

  it('should add specific options for CI platforms', async () => {
    options.skyuxCiPlatform = 'ado';

    await mock.reRequire('./karma');

    expect(options).toEqual({
      codeCoverage: true,
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      skyuxCiPlatform: 'ado',
      tsConfig: 'tsconfig.json',
      watch: false
    });
  });

  describe('webpack config', () => {
    it('should add a loader to fix `require.context` in skyux-i18n-testing.js', async () => {
      await mock.reRequire('./karma');
      expect(actualWebpackConfig.module!.rules).toEqual([
        {
          enforce: 'pre',
          test: /skyux-i18n-testing\.js$/,
          use: {
            loader: path.join(
              process.cwd(),
              'src/tools/webpack/loaders/fix-require-context/fix-require-context.loader'
            )
          }
        }
      ]);
    });

    it('should add the DefinePlugin', async () => {
      await mock.reRequire('./karma');
      const plugin = actualWebpackConfig.plugins?.find(
        (p) => p instanceof DefinePlugin
      ) as DefinePlugin;
      expect(plugin).toBeDefined();
    });
  });
});
