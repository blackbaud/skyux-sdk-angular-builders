import { workspaces } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../testing/scaffold';
import { getWorkspace } from '../utility/workspace';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  const defaultProjectName = 'my-lib';

  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function runSchematic(
    tree: UnitTestTree,
    options?: { project?: string }
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  async function getProjectDefinition(
    tree: UnitTestTree,
    projectName: string
  ): Promise<workspaces.ProjectDefinition | undefined> {
    const { workspace } = await getWorkspace(tree);

    return workspace.projects.get(projectName);
  }

  it('should run the NodePackageInstallTask', async () => {
    await runSchematic(tree, {
      project: defaultProjectName,
    });

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true,
      'Expected the schematic to setup a package install step.'
    );
  });

  it('should add packages to package.json', async () => {
    await runSchematic(tree, { project: defaultProjectName });

    const packageJson = JSON.parse(tree.readContent('/package.json'));
    expect(packageJson.devDependencies['ng-packagr']).toEqual('12.2.5');
  });

  it('should add the builder', async () => {
    await runSchematic(tree, { project: defaultProjectName });

    const project = await getProjectDefinition(tree, defaultProjectName);
    const target = project?.targets.get('build');

    expect(target?.builder).toBe('@skyux-sdk/angular-builders:ng-packagr');
  });

  it('should abort for application projects', async () => {
    tree = await createTestApp(runner, { defaultProjectName: 'my-app' });

    await expectAsync(
      runSchematic(tree, { project: 'my-app' })
    ).toBeRejectedWith(
      new SchematicsException(
        'This schematic may only be added to library projects.'
      )
    );
  });
});
