import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { homedir } from 'os';
import { of } from 'rxjs';

import { SkyuxConfig } from '../../shared/skyux-config';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';

describe('dev-server builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executDevServerBuilderSpy: jasmine.Spy;
  let defaultOptions: SkyuxDevServerBuilderOptions;
  let mockContext: any;
  let mockSkyuxConfig: SkyuxConfig;

  beforeEach(() => {
    defaultOptions = {
      browserTarget: 'foo:build'
    };

    mockContext = {
      logger: {
        info() {}
      },
      target: {
        project: 'foo',
        configuration: ''
      }
    };

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) => cb(defaultOptions, mockContext));

    executDevServerBuilderSpy = jasmine
      .createSpy('executeDevServerBuilder')
      .and.callFake(() => {
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(
      buildAngular,
      'executeDevServerBuilder',
      'get'
    ).and.returnValue(executDevServerBuilderSpy);

    mock('glob', {
      sync: () => ['foo.jpg']
    });

    mockSkyuxConfig = {};
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

  function runBuilder() {
    return mock.reRequire('./dev-server').default.toPromise();
  }

  describe('configuration', () => {
    it('should set defaults', async () => {
      await runBuilder();

      const actualOptions = getActualOptions();

      expect(actualOptions).toEqual({
        browserTarget: 'foo:build',
        open: true,
        ssl: true,
        sslCert: `${homedir()}/.skyux/certs/skyux-server.crt`,
        sslKey: `${homedir()}/.skyux/certs/skyux-server.key`
      });
    });
  });
});
