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
  SkyuxKarmaBuilderOptions
} from '../../builders/karma/karma-options';

import {
  SkyuxNgAddOptions
} from './schema';

function setupBrowserBuilder(
  architect: {
    builder: string;
  },
  ngAddOptions: SkyuxNgAddOptions
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${ngAddOptions.project}/architect/build in angular.json!`
    );
  }

  // Overwrite the default build architect.
  architect.builder = '@skyux-sdk/angular-builders:browser';
}

function setupDevServerBuilder(
  architect: {
    builder: string;
    options: SkyuxDevServerBuilderOptions;
  },
  ngAddOptions: SkyuxNgAddOptions
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${ngAddOptions.project}/architect/serve in angular.json!`
    );
  }

  // Overwrite the default serve architect.
  architect.builder = '@skyux-sdk/angular-builders:dev-server';
  architect.options.skyuxLaunch = 'host';
}

function setupKarmaBuilder(
  tree: Tree,
  architect: {
    builder: string;
    options: SkyuxKarmaBuilderOptions;
  },
  ngAddOptions: SkyuxNgAddOptions
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${ngAddOptions.project}/architect/test in angular.json!`
    );
  }

  // Overwrite the default test architect.
  architect.builder = `@skyux-sdk/angular-builders:karma`;
  architect.options.codeCoverage = true;

  tree.overwrite('karma.conf.js', `// DO NOT MODIFY
// This file is handled by the \`@skyux-sdk/angular-builders:karma\` builder.
module.exports = function (config) {
  config.set({});
};
`);
}

export function ngAdd(options: SkyuxNgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {

    // Get the workspace config.
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an Angular CLI workspace.');
    }
    const workspace = JSON.parse(workspaceConfigBuffer.toString());

    const projectConfig = workspace.projects[options.project];
    if (!projectConfig) {
      throw new SchematicsException(
        `The "${options.project}" project is not defined in angular.json. Provide a valid project name.`
      );
    }

    const architect = workspace.projects[options.project].architect;
    if (!architect) {
      throw new SchematicsException(
        `Expected node projects/${options.project}/architect in angular.json!`
      );
    }

    setupBrowserBuilder(architect.build, options);
    setupDevServerBuilder(architect.serve, options);
    setupKarmaBuilder(tree, architect.test, options);

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    tree.overwrite('angular.json', JSON.stringify(workspace, undefined, 2));

    return tree;
  };
}
