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

import {
  readJsonSync
} from 'fs-extra';

import path from 'path';

export function ngAdd(options: any): Rule {

  // Assumes the builder name is this same library.
  const packageJson = readJsonSync(path.join(__dirname, '../../../package.json'));
  const builder = packageJson.name;

  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = options.project || workspace.defaultProject;
    const architect = workspace.projects[project].architect;

    if (!architect) {
      throw new Error(
        `Expected node projects/${project}/architect in angular.json!`
      );
    }

    // Create a new architect for upgrading dependencies.
    architect['skyux-upgrade-dependencies'] = {
      builder: '@skyux-sdk/angular-builders:upgrade-dependencies',
      options: {}
    };

    // Overwrite the default build architect.
    const build = architect.build;
    if (!build) {
      throw new Error(`Expected node projects/${project}/architect/build in angular.json!`);
    }
    build.builder = `${builder}:browser` as any;

    // Overwrite the default serve architect.
    const serve = architect.serve;
    if (!serve) {
      throw new Error(`Expected node projects/${project}/architect/serve in angular.json!`);
    }
    serve.builder = `${builder}:dev-server` as any;

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
