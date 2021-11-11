import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { of } from 'rxjs';

import { SkyuxNgPackagrBuilderOptions } from './schema';

describe('ng-packagr builder', () => {
  let contextLoggerSpy: jasmine.SpyObj<any>;
  let createBuilderSpy: jasmine.Spy;
  let executeNgPackagrBuilderResult: angularArchitect.BuilderOutput;
  let executeNgPackagrBuilderSpy: jasmine.Spy;
  let inlineExternalResourcesSpyObj: jasmine.SpyObj<any>;
  let defaultOptions: SkyuxNgPackagrBuilderOptions;
  let mockContext: any;

  beforeEach(() => {
    inlineExternalResourcesSpyObj = jasmine.createSpyObj('inline-resources', [
      'inlineExternalResourcesPaths',
    ]);

    defaultOptions = {
      project: 'foo',
    };

    contextLoggerSpy = jasmine.createSpyObj('logger', ['fatal']);

    mockContext = {
      target: {
        project: 'foo',
      },
      logger: contextLoggerSpy,
    };

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) => cb(defaultOptions, mockContext));

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

    expect(executeNgPackagrBuilderSpy).toHaveBeenCalledWith(
      defaultOptions,
      mockContext
    );
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
    ).toHaveBeenCalledWith(mockContext);
  });

  it('should handle errors from inlining resources', async () => {
    inlineExternalResourcesSpyObj.inlineExternalResourcesPaths.and.throwError(
      'Something bad happened.'
    );

    const result = await runBuilder();

    expect(result.success).toBe(false);
    expect(contextLoggerSpy.fatal).toHaveBeenCalledWith(
      '[SKY UX] Something bad happened.'
    );
  });
});
