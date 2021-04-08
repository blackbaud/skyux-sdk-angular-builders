import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';

/**
 * Create a base app used for testing.
 */
export async function createTestApp(
  runner: SchematicTestRunner,
  appOptions: {
    defaultProjectName: string;
  }
): Promise<{
  appTree: UnitTestTree;
  workspaceTree: UnitTestTree;
}> {
  const workspaceTree = await runner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '11.0.0',
      newProjectRoot: 'projects'
    })
    .toPromise();

  const appTree = await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name: appOptions.defaultProjectName,
        projectRoot: ''
      },
      workspaceTree
    )
    .toPromise();

  return {
    appTree,
    workspaceTree
  };
}

/**
 * Create a base library used for testing.
 */
export async function generateTestLibrary(
  runner: SchematicTestRunner,
  workspaceTree: Tree,
  libOptions: {
    name: string;
  }
): Promise<UnitTestTree> {
  return runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'library',
      {
        ...libOptions
      },
      workspaceTree
    )
    .toPromise();
}
