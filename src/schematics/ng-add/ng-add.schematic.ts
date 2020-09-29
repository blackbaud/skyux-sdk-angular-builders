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

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
