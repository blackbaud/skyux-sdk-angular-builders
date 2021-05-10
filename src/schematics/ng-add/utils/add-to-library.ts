import {
  WorkspaceDefinition,
  WorkspaceHost
} from '@angular-devkit/core/src/workspace';
import {
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType
} from '@schematics/angular/utility/dependencies';

import { SkyuxNgAddOptions } from '../schema';

import { createSkyuxConfigIfNotExists } from './create-skyuxconfig';
import { modifyKarmaConfig } from './modify-karma-config';
import { readJson } from './read-json';

async function modifyAngularJson(
  host: WorkspaceHost,
  options: SkyuxNgAddOptions
): Promise<void> {
  const projectName = options.project;
  const angularJson = await readJson(host, 'angular.json');
  const testConfig = angularJson.projects[projectName].architect.test;

  if (testConfig) {
    testConfig.builder = '@skyux-sdk/angular-builders:karma';
    testConfig.options!.codeCoverage = true;
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/test in angular.json!`
    );
  }

  await host.writeFile(
    'angular.json',
    JSON.stringify(angularJson, undefined, 2) + '\n'
  );
}

export async function addToLibrary(
  tree: Tree,
  host: WorkspaceHost,
  workspace: WorkspaceDefinition,
  context: SchematicContext,
  options: SkyuxNgAddOptions
): Promise<void> {
  createSkyuxConfigIfNotExists(tree);

  await modifyAngularJson(host, options);

  const projectRoot = workspace.projects.get(options.project)!.root;

  await modifyKarmaConfig(host, projectRoot);

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Default,
    name: '@skyux/assets',
    version: '^4.0.0',
    overwrite: true
  });

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Default,
    name: '@skyux/config',
    version: '^4.4.0',
    overwrite: true
  });

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Default,
    name: '@skyux/core',
    version: '^4.4.0',
    overwrite: true
  });

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Default,
    name: '@skyux/i18n',
    version: '^4.0.3',
    overwrite: true
  });

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Default,
    name: '@skyux/theme',
    version: '^4.15.3',
    overwrite: true
  });

  addPackageJsonDependency(tree, {
    type: NodeDependencyType.Dev,
    name: '@skyux-sdk/testing',
    version: '^4.0.0',
    overwrite: true
  });

  context.addTask(new NodePackageInstallTask());
}
