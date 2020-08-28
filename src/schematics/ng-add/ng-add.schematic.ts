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

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
