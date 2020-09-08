import {
  MockNodePackageInstallTask,
  resetMock,
  setupTest,
  teardownTest
} from './testing/setup-test';

// Setup mocks before importing the file that will be tested.
setupTest();

import {
  ngAdd
} from './ng-add.schematic';

describe('ngAdd schematic', () => {
  let mockContext: any;
  let mockWorkspace: any;

  beforeEach(() => {
    mockContext = {
      addTask: jasmine.createSpy('addTask')
    };

    mockWorkspace = {
      defaultProject: 'default-project',
      projects: {
        'default-project': {},
        'my-project': {
          architect: {
            build: {},
            serve: {}
          }
        },
        'invalid-project': {}
      }
    };

    resetMock('@schematics/angular/utility/config', {
      getWorkspace: () => mockWorkspace,
      updateWorkspace() {}
    });

    resetMock('fs-extra', {
      readJsonSync() {
        return {
          name: 'my-builder'
        };
      }
    });
  });

  afterEach(() => {
    teardownTest();
  });

  it('should add a node package install task', () => {
    const rule = ngAdd({
      project: 'my-project'
    });

    rule({} as any, mockContext);

    expect(mockContext.addTask).toHaveBeenCalledWith(jasmine.any(MockNodePackageInstallTask));
  });

  it('should throw an error if specified project doesn\'t include an `architect` property', () => {
    const rule = ngAdd({
      project: 'invalid-project'
    });

    expect(() => {
      rule({} as any, mockContext);
    }).toThrowError('Expected node projects/invalid-project/architect in angular.json!');
  });

  it('should use the default project if none provided', () => {
    const rule = ngAdd({}); // Don't provide a project.

    expect(() => {
      rule({} as any, mockContext);
    }).toThrowError('Expected node projects/default-project/architect in angular.json!');
  });
});
