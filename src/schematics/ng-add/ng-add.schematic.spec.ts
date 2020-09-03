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
    mockWorkspace = {
      defaultProject: 'default-project',
      projects: {
        'default-project': {
          architect: {}
        },
        'my-project': {
          architect: {}
        },
        'invalid-project': {}
      }
    };

    mockContext = {
      addTask: jasmine.createSpy('addTask')
    };

    resetMock('@schematics/angular/utility/config', {
      getWorkspace: () => mockWorkspace,
      updateWorkspace() {}
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
    }).toThrow();
  });

  describe('skyux-upgrade-dependencies', () => {
    it('should add the builder to a specific project', () => {
      const rule = ngAdd({
        project: 'my-project'
      });

      rule({} as any, mockContext);

      expect(
        mockWorkspace.projects['default-project'].architect['skyux-upgrade-dependencies']
      ).toBeUndefined();
      expect(
        mockWorkspace.projects['my-project'].architect['skyux-upgrade-dependencies']
      ).toBeDefined();
    });

    it('should use default project if project not provided', () => {
      const rule = ngAdd({}); // Don't supply a project.

      rule({} as any, mockContext);

      expect(
        mockWorkspace.projects['default-project'].architect['skyux-upgrade-dependencies']
      ).toBeDefined();
      expect(
        mockWorkspace.projects['my-project'].architect['skyux-upgrade-dependencies']
      ).toBeUndefined();
    });
  });

});
