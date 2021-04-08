import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { homedir } from 'os';
import path from 'path';
import { of } from 'rxjs';
import webpack from 'webpack';

import { SkyuxAppAssetsPlugin } from '../../tools/webpack/plugins/app-assets/app-assets.plugin';
import { SkyuxSaveHostMetadataPlugin } from '../../tools/webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import { SkyuxBrowserBuilderOptions } from './browser-options';

class MockWebpackPlugin {
  public apply() {}
}

fdescribe('browser builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeBrowserBuilderSpy: jasmine.Spy;
  let mockServerUtils: any;

  let actualBrowserOptions: Partial<SkyuxBrowserBuilderOptions>;
  let defaultBrowserOptions: SkyuxBrowserBuilderOptions;
  let defaultWebpackConfig: webpack.Configuration;
  let actualWebpackConfig: webpack.Configuration;

  beforeEach(() => {
    defaultBrowserOptions = {
      index: '',
      main: '',
      outputPath: '',
      tsConfig: ''
    };
    actualBrowserOptions = {};

    defaultWebpackConfig = {};
    actualWebpackConfig = {};

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(defaultBrowserOptions, {
          target: {
            project: 'foo'
          }
        })
      );

    executeBrowserBuilderSpy = jasmine
      .createSpy('executeBrowserBuilder')
      .and.callFake(
        (
          options: SkyuxBrowserBuilderOptions,
          _context: any,
          transforms: any
        ) => {
          actualBrowserOptions = options;
          actualWebpackConfig = transforms.webpackConfiguration(
            defaultWebpackConfig
          );
          return of({
            success: true
          });
        }
      );

    mockServerUtils = {
      createServer: {
        start() {
          console.log('START!!!!!');
          return Promise.resolve();
        },
        stop() {}
      },
      getAvailablePort() {
        console.log('GET PORT!');
        return 4200;
      }
    };

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(buildAngular, 'executeBrowserBuilder', 'get').and.returnValue(
      executeBrowserBuilderSpy
    );

    mock('fs-extra', {
      existsSync(filePath: string): boolean {
        if (filePath.endsWith('skyuxconfig.json')) {
          return true;
        }
        return false;
      },
      readFileSync() {
        return 'contents';
      },
      readJsonSync(filePath: string) {
        if (filePath.endsWith('metadata.json')) {
          return [
            {
              name: 'main.js',
              type: 'script'
            },
            {
              name: 'styles.css',
              type: 'stylesheet'
            }
          ];
        }
        return {};
      }
    });

    mock('glob', {
      sync: () => ['foo.jpg']
    });

    mock('hasha', {
      fromFileSync: () => 'MOCK_HASH'
    });

    mock('portfinder', {
      getPortPromise() {
        return Promise.resolve(4200);
      }
    });

    mock('../../shared/host-utils', {
      createHostUrl() {},
      openHostUrl() {}
    });

    mock('../../shared/server-utils', mockServerUtils);
  });

  afterEach(() => {
    mock.stopAll();
  });

  async function runBuilder(): Promise<void> {
    await mock.reRequire('./browser');
  }

  it('should add `SkyuxSaveMetadataPlugin` to webpack plugins', async () => {
    await runBuilder();
    console.log('EXPECT');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof SkyuxSaveHostMetadataPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should add `SkyuxAppAssetsPlugin` to webpack plugins', async () => {
    await runBuilder();
    console.log('EXPECT');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof SkyuxAppAssetsPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should not affect other plugins', async () => {
    defaultWebpackConfig = {
      plugins: [new MockWebpackPlugin()]
    };

    await runBuilder();
    console.log('EXPECT');

    const plugin = actualWebpackConfig.plugins?.find(
      (p) => p instanceof MockWebpackPlugin
    );

    expect(plugin).toBeDefined();
  });

  it('should ensure the deployUrl ends with the baseHref and a forward slash', async () => {
    defaultBrowserOptions.deployUrl = 'https://foo.com';
    await runBuilder();
    console.log('EXPECT');
    expect(
      executeBrowserBuilderSpy.calls.mostRecent().args[0].deployUrl
    ).toEqual('https://foo.com/foo/');
  });

  fit("should only add the baseHref if it's not already included", async () => {
    defaultBrowserOptions.deployUrl = 'https://foo.com/foo/';
    await runBuilder();
    console.log('EXPECT');
    expect(
      executeBrowserBuilderSpy.calls.mostRecent().args[0].deployUrl
    ).toEqual('https://foo.com/foo/');
  });

  fit('should serve build results', async () => {
    defaultBrowserOptions.skyuxServe = true;
    defaultBrowserOptions.outputPath = 'dist/foobar';
    const createServerSpy = spyOn(mockServerUtils, 'createServer');
    await runBuilder();
    console.log('EXPECT', createServerSpy.calls.all());
    expect(createServerSpy).toHaveBeenCalledWith({
      distPath: path.join(process.cwd(), 'dist/foobar'),
      port: 4200,
      rootPath: '/foo/',
      sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
      sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
    });
    expect(actualBrowserOptions.deployUrl).toEqual(
      'https://localhost:4200/foo/'
    );
  });
});
