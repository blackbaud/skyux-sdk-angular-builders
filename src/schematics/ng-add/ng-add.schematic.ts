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

export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);

    const projectConfig = workspace.projects[options.project];
    if (!projectConfig) {
      throw new Error(
        `The "${options.project}" project is not defined in angular.json. Provide a valid project name.`
      );
    }

    const architect = workspace.projects[options.project].architect;
    if (!architect) {
      throw new Error(
        `Expected node projects/${options.project}/architect in angular.json!`
      );
    }

    // Overwrite the default build architect.
    const build = architect.build;
    if (!build) {
      throw new Error(`Expected node projects/${options.project}/architect/build in angular.json!`);
    }
    build.builder = '@skyux-sdk/angular-builders:browser' as any;

    // Overwrite the default serve architect.
    const serve = architect.serve;
    if (!serve) {
      throw new Error(
        `Expected node projects/${options.project}/architect/serve in angular.json!`
      );
    }
    serve.builder = '@skyux-sdk/angular-builders:dev-server' as any;

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
