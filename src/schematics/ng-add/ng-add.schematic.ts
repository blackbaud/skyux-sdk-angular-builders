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
  SkyuxProtractorBuilderOptions
} from '../../builders/protractor/protractor-options';

import {
  SkyuxNgAddOptions
} from './schema';

function setupBrowserBuilder(
  architect: {
    builder: string;
  },
  projectName: string
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/build in angular.json!`
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
  projectName: string
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/serve in angular.json!`
    );
  }

  // Overwrite the default serve architect.
  architect.builder = '@skyux-sdk/angular-builders:dev-server';
  architect.options.skyuxLaunch = 'host';
}

function setupProtractorBuilder(
  architect: {
    builder: string;
    options: SkyuxProtractorBuilderOptions;
  },
  projectName: string
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/e2e in angular.json!`
    );
  }

  // Overwrite the default e2e architect.
  architect.builder = '@skyux-sdk/angular-builders:protractor';
}

function setupKarmaBuilder(
  tree: Tree,
  architect: {
    builder: string;
    options: SkyuxKarmaBuilderOptions;
  },
  projectName: string
): void {
  if (!architect) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/test in angular.json!`
    );
  }

  // Overwrite the default test architect.
  architect.builder = `@skyux-sdk/angular-builders:karma`;
  architect.options.codeCoverage = true;

  const contents = `// DO NOT MODIFY
// This file is handled by the \`@skyux-sdk/angular-builders:karma\` builder.
module.exports = function (config) {
  config.set({});
};
`;

  const libraryKarmaConfig = `projects/${projectName}/karma.conf.js`;
  if (tree.exists(libraryKarmaConfig)) {
    tree.overwrite(libraryKarmaConfig, contents);
  } else {
    tree.overwrite('karma.conf.js', contents);
  }
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

    setupBrowserBuilder(architect.build, options.project);
    setupDevServerBuilder(architect.serve, options.project);
    setupProtractorBuilder(architect.e2e, options.project);

    // Setup karma for all projects.
    Object.keys(workspace.projects).forEach(project => {
      setupKarmaBuilder(tree, workspace.projects[project].architect.test, project);
    });

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    tree.overwrite('angular.json', JSON.stringify(workspace, undefined, 2));

    return tree;
  };
}
