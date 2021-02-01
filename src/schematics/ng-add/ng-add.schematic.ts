import {
  OutputHashing
} from '@angular-devkit/build-angular';

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
  SkyuxBrowserBuilderOptions
} from '../../builders/browser/browser-options';

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
    options: SkyuxBrowserBuilderOptions;
    configurations: {
      production: SkyuxBrowserBuilderOptions;
    };
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

  // Configure Angular to only hash bundled JavaScript files.
  // Our builder will handle hashing the file names found in `src/assets`.
  architect.configurations.production!.outputHashing! = OutputHashing.Bundles;
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
  tree: Tree,
  architect: {
    serve: {
      configurations: {
        e2e: SkyuxDevServerBuilderOptions;
        'e2e-production': SkyuxDevServerBuilderOptions;
      };
    },
    e2e: {
      builder: string;
      options: SkyuxProtractorBuilderOptions;
      configurations: {
        production: SkyuxProtractorBuilderOptions;
      };
    }
  },
  projectName: string
): void {
  if (!architect.e2e) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/e2e in angular.json!`
    );
  }

  // Overwrite the default e2e architect.
  architect.e2e.builder = '@skyux-sdk/angular-builders:protractor';

  architect.e2e.options.devServerTarget = `${projectName}:serve:e2e`;
  architect.e2e.configurations.production.devServerTarget = `${projectName}:serve:e2e-production`

  architect.serve.configurations.e2e = architect.serve.configurations['e2e-production'] = {
    open: false,
    skyuxOpen: false,
    skyuxLaunch: 'host'
  } as SkyuxDevServerBuilderOptions;

  const contents = `// DO NOT MODIFY
// This file is handled by the \`@skyux-sdk/angular-builders:protractor\` builder.

exports.config = {};
`;

  tree.overwrite('e2e/protractor.conf.js', contents);
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
    setupProtractorBuilder(tree, architect, options.project);

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
