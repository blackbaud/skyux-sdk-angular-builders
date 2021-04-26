import { workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType
} from '@schematics/angular/utility/dependencies';

import { SkyuxDevServerBuilderOptions } from '../../builders/dev-server/dev-server-options';
import { createHost } from '../utils/schematics-utils';

import { SkyuxNgAddOptions } from './schema';

async function readJson(host: workspaces.WorkspaceHost, filePath: string) {
  const contents = await host.readFile(filePath);
  return JSON.parse(contents);
}

async function getThemeStylesheets(): Promise<string[]> {
  const themeStylesheets = ['@skyux/theme/css/sky.css'];

  return themeStylesheets;
}

async function modifyAngularJson(
  host: workspaces.WorkspaceHost,
  options: SkyuxNgAddOptions
): Promise<void> {
  const projectName = options.project;
  const angularJson = await readJson(host, 'angular.json');

  const architectConfig = angularJson.projects[projectName].architect;
  if (!architectConfig) {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect in angular.json!`
    );
  }

  if (architectConfig.serve) {
    architectConfig.serve.builder = '@skyux-sdk/angular-builders:dev-server';
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/serve in angular.json!`
    );
  }

  if (architectConfig.e2e) {
    architectConfig.e2e.builder = '@skyux-sdk/angular-builders:protractor';
    architectConfig.e2e.options!.devServerTarget = `${projectName}:serve:e2e`;
    architectConfig.e2e.configurations!.production!.devServerTarget = `${projectName}:serve:e2eProduction`;
    architectConfig.serve.configurations!.e2e = {
      browserTarget: `${projectName}:build`,
      open: false
    } as SkyuxDevServerBuilderOptions;
    architectConfig.serve.configurations!.e2eProduction = {
      browserTarget: `${projectName}:build:production`,
      open: false
    } as SkyuxDevServerBuilderOptions;
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/e2e in angular.json!`
    );
  }

  // Setup karma builder for all projects.
  for (const project in angularJson.projects) {
    const testTarget = angularJson.projects[project].architect.test;
    if (testTarget) {
      testTarget.builder = '@skyux-sdk/angular-builders:karma';
      testTarget.options!.codeCoverage = true;
    } else {
      throw new SchematicsException(
        `Expected node projects/${project}/architect/test in angular.json!`
      );
    }
  }

  // Add theme stylesheets.
  const angularStylesheets = architectConfig.build.options.styles.filter(
    (stylesheet: string) => !stylesheet.startsWith('@skyux/theme')
  );
  const themeStylesheets = await getThemeStylesheets();
  architectConfig.build.options.styles = themeStylesheets.concat(
    angularStylesheets
  );

  await host.writeFile(
    'angular.json',
    JSON.stringify(angularJson, undefined, 2) + '\n'
  );
}

async function modifyKarmaConfig(
  host: workspaces.WorkspaceHost,
  projectRoot: string
): Promise<void> {
  await host.writeFile(
    `${projectRoot}/karma.conf.js`,
    `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
module.exports = function (config) {
  config.set({});
};
`
  );
}

async function modifyProtractorConfig(
  host: workspaces.WorkspaceHost,
  projectRoot: string
): Promise<void> {
  await host.writeFile(
    `${projectRoot}/e2e/protractor.conf.js`,
    `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
exports.config = {};
`
  );
}

async function modifyTsConfig(host: workspaces.WorkspaceHost): Promise<void> {
  const tsConfigContents = await host.readFile('tsconfig.json');
  // JavaScript has difficulty parsing JSON with comments.
  const banner =
    '/* To learn more about this file see: https://angular.io/config/tsconfig. */\n';
  const tsConfig = JSON.parse(tsConfigContents.replace(banner, ''));

  // Enforce the ES5 target until we can drop support for IE 11.
  tsConfig.compilerOptions.target = 'es5';

  await host.writeFile(
    'tsconfig.json',
    banner + JSON.stringify(tsConfig, undefined, 2)
  );
}

function createSkyuxConfigIfNotExists(tree: Tree) {
  if (!tree.exists('skyuxconfig.json')) {
    tree.create(
      'skyuxconfig.json',
      JSON.stringify(
        {
          $schema:
            './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
        },
        undefined,
        2
      )
    );
  }
}

async function setupLibraries(
  host: workspaces.WorkspaceHost,
  workspace: workspaces.WorkspaceDefinition
): Promise<void> {
  // Modify the karma configs for all libraries.
  workspace.projects.forEach(async (project) => {
    await modifyKarmaConfig(host, project.root);
  });
}

export function ngAdd(options: SkyuxNgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    if (!options.project) {
      options.project = workspace.extensions.defaultProject as string;
    }

    const project = workspace.projects.get(options.project);
    if (!project) {
      throw new SchematicsException(
        `The "${options.project}" project is not defined in angular.json. Provide a valid project name.`
      );
    }

    if (project.extensions.projectType !== 'application') {
      throw new SchematicsException(
        `You are attempting to add this builder to a library project, but it is designed to be added only to the primary application.`
      );
    }

    createSkyuxConfigIfNotExists(tree);
    await modifyAngularJson(host, options);
    await modifyTsConfig(host);
    await modifyKarmaConfig(host, project.root);
    await modifyProtractorConfig(host, project.root);
    await setupLibraries(host, workspace);

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/core',
      version: '^4.4.0',
      overwrite: true
    });

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/i18n',
      version: '^4.0.3',
      overwrite: true
    });

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/theme',
      version: '^4.15.3',
      overwrite: true
    });

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Dev,
      name: '@skyux-sdk/e2e',
      version: '^4.0.0',
      overwrite: true
    });

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Dev,
      name: '@skyux-sdk/testing',
      version: '^4.0.0',
      overwrite: true
    });

    context.addTask(new NodePackageInstallTask());
  };
}
