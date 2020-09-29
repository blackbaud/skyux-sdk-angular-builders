import {
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';

import {
  getWorkspace,
  updateWorkspace
} from '@schematics/angular/utility/config';

import fs from 'fs-extra';

import path from 'path';

export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const projectName = options.project || workspace.defaultProject;
    const architect = workspace.projects[projectName].architect;

    // Assumes the builder name is in the package.json (found from the dist folder).
    const packageJson = fs.readJsonSync(path.join(__dirname, '../../../../package.json'));
    const packageName = packageJson.name;

    if (!architect) {
      throw new Error(
        `Expected node projects/${projectName}/architect in angular.json!`
      );
    }

    const test = architect.test;
    if (!test) {
      throw new Error(
        `Expected node projects/${projectName}/architect/test in angular.json!`
      );
    }
    test.builder = `${packageName}:karma` as any;

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
