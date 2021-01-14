import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';

import path from 'path';

import {
  of
} from 'rxjs';

import {
  SkyuxKarmaBuilderOptions
} from './karma-options';

describe('karma builder', () => {

  let createBuilderSpy: jasmine.Spy;
  let executeKarmaBuilderSpy: jasmine.Spy;
  let options: SkyuxKarmaBuilderOptions;

  beforeEach(() => {
    options = {
      karmaConfig: 'karma.conf.js',
      main: 'main.ts',
      tsConfig: 'tsconfig.json'
    };

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(options, {
        target: {
          project: 'foo'
        }
      }));

    executeKarmaBuilderSpy = jasmine.createSpy('executeKarmaBuilder').and
      .callFake((_options: any, _context: any, _transforms: any) => {
        return of({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and
      .returnValue(createBuilderSpy);

    spyOnProperty(buildAngular, 'executeKarmaBuilder', 'get').and
      .returnValue(executeKarmaBuilderSpy);
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should overwrite Angular karma config with defaults', async () => {
    await (mock.reRequire('./karma'));

    expect(options).toEqual({
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      skyuxCodeCoverageThreshold: 'none',
      tsConfig: 'tsconfig.json'
    });
  });

  it('should add specific options for CI platforms', async () => {
    options.skyuxCiPlatform = 'ado';

    await (mock.reRequire('./karma'));

    expect(options).toEqual({
      codeCoverage: true,
      karmaConfig: path.resolve(__dirname, 'karma.default.conf.js'),
      main: 'main.ts',
      skyuxCiPlatform: 'ado',
      skyuxCodeCoverageThreshold: 'none',
      tsConfig: 'tsconfig.json',
      watch: false
    });
  });

});
