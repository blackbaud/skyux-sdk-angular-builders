import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import path from 'path';
import { of } from 'rxjs';

import { SkyuxKarmaBuilderOptions } from './karma-options';

describe('karma builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeKarmaBuilderSpy: jasmine.Spy;
  let options: SkyuxKarmaBuilderOptions;
  let mockSpecFiles: string[];

  beforeEach(() => {
    options = {
      karmaConfig: 'karma.conf.js',
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    };

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(options, {
          target: {
            project: 'foo'
          },
          logger: {
            info() {}
          }
        })
      );

    executeKarmaBuilderSpy = jasmine
      .createSpy('executeKarmaBuilder')
      .and.callFake(() => {
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

    mockSpecFiles = ['foo.spec.ts'];
    mock('glob', {
      sync() {
        return mockSpecFiles;
      }
    });

    mock('../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return {};
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  async function runBuilder() {
    return await mock.reRequire('./karma').default;
  }

  it('should overwrite Angular karma config with defaults', async () => {
    await runBuilder();

    expect(options).toEqual({
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    });
  });

  it('should add specific options for CI platforms', async () => {
    options.skyuxCiPlatform = 'ado';

    await runBuilder();

    expect(options).toEqual({
      codeCoverage: true,
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      skyuxCiPlatform: 'ado',
      tsConfig: 'tsconfig.json',
      watch: false
    });
  });

  it('should abort if no specs', async () => {
    mockSpecFiles = [];
    await runBuilder();
    expect(executeKarmaBuilderSpy).not.toHaveBeenCalled();
  });
});
