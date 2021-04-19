import { BuilderContext } from '@angular-devkit/architect';
import { SkyuxConfig } from '@skyux/config';

import { homedir } from 'os';
import { of } from 'rxjs';
import { take, delay } from 'rxjs/operators';

import { SkyuxCreateHostUrlConfig } from '../../shared/create-host-url-config';
import { SkyuxHostAssetType } from '../../shared/host-asset-type';

import { SkyuxBrowserBuilderOptions } from './browser-options';

const mock = require('mock-require');

interface MockProcess {
  on: (event: string, callback: () => void) => void;
}

describe('browser server', () => {
  let certsExist: boolean;

  let executeBrowserBuilderSpy: jasmine.Spy;
  let openSpy: jasmine.Spy;

  let mockOptions: Partial<SkyuxBrowserBuilderOptions>;
  let mockContext: Partial<BuilderContext>;
  let mockSkyuxConfig: SkyuxConfig;

  beforeEach(() => {
    certsExist = true;

    mockOptions = {
      outputPath: 'dist/foo'
    };

    mockContext = {
      target: {
        project: 'foo',
        target: ''
      }
    };

    mockSkyuxConfig = {
      host: {
        url: 'https://foo.com/'
      }
    };

    executeBrowserBuilderSpy = jasmine
      .createSpy('executeBrowserBuilder')
      .and.returnValue(of({}));

    mock('@angular-devkit/build-angular', {
      executeBrowserBuilder: executeBrowserBuilderSpy
    });

    spyOn(process as MockProcess, 'on').and.callFake(
      (hook: string, callback: () => void) => {
        if (hook === 'exit') {
          // Wait for one lifecycle before executing the exit callback.
          of('')
            .pipe(delay(10), take(1))
            .subscribe(() => {
              callback();
            });
        }
      }
    );

    spyOn(console, 'log');

    mock('cors', () => {});

    function mockExpress() {
      return {
        use() {}
      };
    }
    mockExpress.static = () => {};
    mock('express', mockExpress);

    mock('fs-extra', {
      existsSync(filePath: string) {
        if (filePath.includes('skyux-server.crt')) {
          return certsExist;
        }
        return true;
      },
      readFileSync() {
        return '';
      },
      readJsonSync(filePath: string) {
        if (filePath.includes('metadata.json')) {
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

    mock('https', {
      createServer() {
        return {
          close: () => {},
          listen: () => Promise.resolve(),
          on: () => {}
        };
      }
    });

    openSpy = jasmine.createSpy('open');
    mock('open', openSpy);

    mock('portfinder', {
      getPortPromise: () => Promise.resolve(1111)
    });

    mock('./browser-transforms', {
      getBrowserTransforms() {}
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  function decode(url: string): Partial<SkyuxCreateHostUrlConfig> {
    return JSON.parse(
      Buffer.from(
        decodeURIComponent(url.split('_cfg=')[1]),
        'base64'
      ).toString()
    );
  }

  it('should serve build results on SKY UX Host', async () => {
    const { serveBuildResults } = mock.reRequire('./browser-server');
    await serveBuildResults(mockOptions, mockContext, mockSkyuxConfig);
    const expectedUrl =
      'https://foo.com/foo/?local=true&_cfg=eyJob3N0Ijp7InVybCI6Imh0dHBzOi8vZm9vLmNvbS8ifSwibG9jYWxVcmwiOiJodHRwczovL2xvY2FsaG9zdDoxMTExL2Zvby8iLCJzY3JpcHRzIjpbeyJuYW1lIjoibWFpbi5qcyIsInR5cGUiOiJzY3JpcHQifV0sInN0eWxlc2hlZXRzIjpbeyJuYW1lIjoic3R5bGVzLmNzcyIsInR5cGUiOiJzdHlsZXNoZWV0In1dLCJyb290RWxlbWVudFRhZ05hbWUiOiJhcHAtcm9vdCJ9';
    expect(openSpy).toHaveBeenCalledWith(expectedUrl);
    expect(decode(expectedUrl)).toEqual({
      host: { url: 'https://foo.com/' },
      localUrl: 'https://localhost:1111/foo/',
      scripts: [{ name: 'main.js', type: SkyuxHostAssetType.Script }],
      stylesheets: [
        { name: 'styles.css', type: SkyuxHostAssetType.Stylesheet }
      ],
      rootElementTagName: 'app-root'
    });
  });

  it('should respect options.deployUrl', async () => {
    mockOptions.deployUrl = 'https://deploy.foo.com/';
    const { serveBuildResults } = mock.reRequire('./browser-server');
    await serveBuildResults(mockOptions, mockContext, mockSkyuxConfig);
    const url = openSpy.calls.mostRecent().args[0];
    expect(decode(url).localUrl).toEqual('https://deploy.foo.com/foo/');
  });

  it('should respect skyuxConfig.app.externals', async () => {
    mockSkyuxConfig.app = {
      externals: {
        js: {
          before: [{ url: 'foo.js' }]
        }
      }
    };
    const { serveBuildResults } = mock.reRequire('./browser-server');
    await serveBuildResults(mockOptions, mockContext, mockSkyuxConfig);
    const url = openSpy.calls.mostRecent().args[0];
    expect(decode(url).externals).toEqual({
      js: {
        before: [{ url: 'foo.js' }]
      }
    });
  });

  it('should throw error if certs not found', async () => {
    certsExist = false;
    const { serveBuildResults } = mock.reRequire('./browser-server');
    try {
      await serveBuildResults(mockOptions, mockContext, mockSkyuxConfig);
      fail('Expected to throw error.');
    } catch (err) {
      const certsPath = `${homedir()}/.skyux/certs/skyux-server.crt`;
      expect(err).toEqual(
        new Error(
          `Unable to locate certificate named "${certsPath}".\nPlease install the latest SKY UX CLI and run \`skyux certs install\`.`
        )
      );
    }
  });
});
