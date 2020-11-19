import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';

import {
  SkyuxDevServerBuilderOptions
} from '../../builders/dev-server/dev-server-options';

import {
  SkyuxNgAddOptions
} from './schema';

export function ngAdd(options: SkyuxNgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI workspace.');
    }

    const workspace = JSON.parse(workspaceConfigBuffer.toString());

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
    build.builder = '@skyux-sdk/angular-builders:browser';


    // Overwrite the default serve architect.
    const serve = architect.serve;
    if (!serve) {
      throw new Error(
        `Expected node projects/${options.project}/architect/serve in angular.json!`
      );
    }
    serve.builder = '@skyux-sdk/angular-builders:dev-server';
    (serve.options as SkyuxDevServerBuilderOptions).skyuxLaunch = 'host';

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    tree.overwrite('angular.json', JSON.stringify(workspace, undefined, 2));

    return tree;
  };
}
