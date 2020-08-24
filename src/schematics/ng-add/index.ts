import {
  Rule,
  SchematicContext,
  Tree
} from "@angular-devkit/schematics";

import {
  NodePackageInstallTask
} from "@angular-devkit/schematics/tasks";

import {
  getWorkspace,
  updateWorkspace
} from '@schematics/angular/utility/config';

// Just return the tree
export function ngAdd(options: any): Rule {
  const builder = '@skyux-sdk/angular-builders';

  return (tree: Tree, context: SchematicContext) => {

    const workspace = getWorkspace(tree);
    const project = options.project || workspace.defaultProject;

    const architect = workspace.projects[project].architect;
    if (!architect) {
      throw new Error(`expected node projects/${project}/architect in angular.json`);
    }

    const build = architect.build;
    if (!build) {
      throw new Error(`expected node projects/${project}/architect/build in angular.json`);
    }

    // Custom Builders are not part of the CLI's enum
    build.builder = <any>`${builder}:browser`;

    const serve = architect.serve;
    if (!serve) {
      throw new Error(`expected node projects/${project}/architect/serve in angular.json`);
    }

    serve.builder = <any>`${builder}:dev-server`;

    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
