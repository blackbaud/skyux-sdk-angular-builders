import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import { of } from 'rxjs';

describe('dev-server builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executDevServerBuilderSpy: jasmine.Spy;
  let defaultOptions: buildAngular.DevServerBuilderOptions;
  let mockContext: any;
  let loggerSpy: jasmine.Spy;
  let mockDevServerUtils: any;

  beforeEach(() => {
    defaultOptions = {
      browserTarget: 'foo:build'
    };

    loggerSpy = jasmine.createSpy('fatal');

    mockContext = {
      logger: {
        fatal: loggerSpy
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

    spyOn(process, 'exit');

    mockDevServerUtils = {
      applySkyuxDevServerOptions() {}
    };

    mock('./dev-server-utils', mockDevServerUtils);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function runBuilder() {
    return mock.reRequire('./dev-server').default.toPromise();
  }

  it("should run Angular's dev-server builder", async () => {
    await runBuilder();
    expect(executDevServerBuilderSpy).toHaveBeenCalled();
  });

  it('should handle errors from dev-server-utils', async () => {
    spyOn(mockDevServerUtils, 'applySkyuxDevServerOptions').and.throwError(
      'something bad happened'
    );
    await runBuilder();
    expect(loggerSpy).toHaveBeenCalledWith('something bad happened');
  });
});
