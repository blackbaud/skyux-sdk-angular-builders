import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { of } from 'rxjs';

import { SkyuxNgPackagrBuilderOptions } from './schema';

describe('ng-packagr builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeNgPackagrBuilderResult: angularArchitect.BuilderOutput;
  let executeNgPackagrBuilderSpy: jasmine.Spy;
  let inlineExternalResourcesSpyObj: jasmine.SpyObj<any>;
  let defaultOptions: SkyuxNgPackagrBuilderOptions;

  beforeEach(() => {
    inlineExternalResourcesSpyObj = jasmine.createSpyObj('inline-resources', [
      'inlineExternalResourcesPaths',
    ]);

    defaultOptions = {
      project: 'foo',
    };

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(defaultOptions, {
          target: {
            project: 'foo',
          },
        })
      );

    executeNgPackagrBuilderResult = {
      success: true,
    };

    executeNgPackagrBuilderSpy = jasmine
      .createSpy('executeNgPackagrBuilder')
      .and.callFake((_options: any, _context: any) => {
        return of(executeNgPackagrBuilderResult);
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(
      buildAngular,
      'executeNgPackagrBuilder',
      'get'
    ).and.returnValue(executeNgPackagrBuilderSpy);

    mock('./inline-external-resources', inlineExternalResourcesSpyObj);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function runBuilder() {
    return mock.reRequire('./ng-packagr.builder').default;
  }

  it("should call Angular's ng-packagr builder", async () => {
    await runBuilder();

    expect(executeNgPackagrBuilderSpy).toHaveBeenCalledWith(defaultOptions, {
      target: { project: 'foo' },
    });
  });

  it("should catch errors from Angular's ng-packagr builder", async () => {
    executeNgPackagrBuilderResult = {
      error: 'Something bad happened.',
      success: false,
    };

    await runBuilder();

    expect(
      inlineExternalResourcesSpyObj.inlineExternalResourcesPaths
    ).not.toHaveBeenCalled();
  });

  it('should inline resources', async () => {
    await runBuilder();

    expect(
      inlineExternalResourcesSpyObj.inlineExternalResourcesPaths
    ).toHaveBeenCalledWith({ target: { project: 'foo' } });
  });
});
