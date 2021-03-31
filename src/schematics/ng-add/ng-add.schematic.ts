import {
  OutputHashing
} from '@angular-devkit/build-angular';

import {
  normalize,
  workspaces
} from '@angular-devkit/core';

import {
  apply,
  applyTemplates,
  forEach,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';

import {
  addPackageJsonDependency,
  NodeDependencyType
} from '@schematics/angular/utility/dependencies';

import {
  SkyuxDevServerBuilderOptions
} from '../../builders/dev-server/dev-server-options';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  addModuleImportToRootModule,
  createHost
} from '../utils/schematics-utils';

import {
  SkyuxNgAddOptions
} from './schema';

async function readJson<T = any>(host: workspaces.WorkspaceHost, filePath: string): Promise<T> {
  const contents = await host.readFile(filePath);
  const value: T = JSON.parse(contents);
  return value;
}

async function getThemeStylesheets(
  host: workspaces.WorkspaceHost
): Promise<string[]> {
  const themeStylesheets = [
    '@skyux/theme/css/sky.css'
  ];

  const skyuxConfig = await readJson<SkyuxConfig>(host, 'skyuxconfig.json');
  if (skyuxConfig.app?.theming?.supportedThemes) {
    for (const theme of skyuxConfig.app.theming.supportedThemes) {
      if (theme !== 'default') {
        themeStylesheets.push(`@skyux/theme/css/themes/${theme}/styles.css`);
      }
    }
  }

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

  if (architectConfig.build) {
    architectConfig.build.builder = '@skyux-sdk/angular-builders:browser';
    // Configure Angular to only hash bundled JavaScript files.
    // Our builder will handle hashing the file names found in `src/assets`.
    architectConfig.build.configurations!.production!.outputHashing! = OutputHashing.Bundles;
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/build in angular.json!`
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
    architectConfig.e2e.configurations!.production!.devServerTarget = `${projectName}:serve:e2eProduction`
    architectConfig.serve.configurations!.e2e = {
      browserTarget: `${projectName}:build`,
      open: false,
      skyuxOpen: false
    } as SkyuxDevServerBuilderOptions;
    architectConfig.serve.configurations!.e2eProduction = {
      browserTarget: `${projectName}:build:production`,
      open: false,
      skyuxOpen: false
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

      // Exclude our generated files from the consumers' code coverage.
      testTarget.options!.codeCoverageExclude = [
        'src/app/__skyux/**/*'
      ];
    } else {
      throw new SchematicsException(
        `Expected node projects/${project}/architect/test in angular.json!`
      );
    }
  }

  // Add theme stylesheets.
  const angularStylesheets = (architectConfig.build.options.styles || [])
    .filter((stylesheet: string) => !stylesheet.startsWith('@skyux/theme'));
  const themeStylesheets = await getThemeStylesheets(host);
  architectConfig.build.options.styles = themeStylesheets.concat(angularStylesheets);

  await host.writeFile('angular.json', JSON.stringify(angularJson, undefined, 2));
}

async function modifyKarmaConfig(
  host: workspaces.WorkspaceHost,
  projectRoot: string
): Promise<void> {
  await host.writeFile(`${projectRoot}/karma.conf.js`, `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
module.exports = function (config) {
  config.set({});
};
`);
}

async function modifyProtractorConfig(
  host: workspaces.WorkspaceHost,
  projectRoot: string
): Promise<void> {
  await host.writeFile(`${projectRoot}/e2e/protractor.conf.js`, `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
exports.config = {};
`);
}

async function modifyTsConfig(host: workspaces.WorkspaceHost): Promise<void> {
  const tsConfigContents = await host.readFile('tsconfig.json');
  // JavaScript has difficulty parsing JSON with comments.
  const banner = '/* To learn more about this file see: https://angular.io/config/tsconfig. */\n';
  const tsConfig = JSON.parse(tsConfigContents.replace(banner, ''));
  tsConfig.compilerOptions.resolveJsonModule = true;
  tsConfig.compilerOptions.esModuleInterop = true;
  await host.writeFile('tsconfig.json', banner + JSON.stringify(tsConfig, undefined, 2));
}

/**
 * Fixes an Angular CLI issue with merge strategies.
 * @see https://github.com/angular/angular-cli/issues/11337#issuecomment-516543220
 */
function overwriteIfExists(tree: Tree): Rule {
  return forEach(fileEntry => {
    if (tree.exists(fileEntry.path)) {
      tree.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}

function createAppFiles(tree: Tree, project: workspaces.ProjectDefinition): Rule {
  // Create an empty skyuxconfig.json file.
  if (!tree.exists('skyuxconfig.json')) {
    tree.create('skyuxconfig.json', JSON.stringify({
      $schema: './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
    }, undefined, 2));
  }

  addModuleImportToRootModule(
    tree,
    'SkyuxModule.forRoot()',
    './__skyux/skyux.module'
  );

  const sourcePath = `${project!.sourceRoot}/app`;
  const templateSource = apply(url('./files'), [
    applyTemplates({}),
    move(normalize(sourcePath)),
    overwriteIfExists(tree)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
}

function setupLibraries(
  host: workspaces.WorkspaceHost,
  workspace: workspaces.WorkspaceDefinition
): void {
  // Modify the karma configs for all libraries.
  workspace.projects.forEach(async project => {
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

    await modifyAngularJson(host, options);
    await modifyTsConfig(host);
    await modifyKarmaConfig(host, project.root);
    await modifyProtractorConfig(host, project.root);
    await setupLibraries(host, workspace);

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/assets',
      version: '^4.0.0',
      overwrite: true
    });

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/config',
      version: '^4.4.0',
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

    return createAppFiles(tree, project);
  };
}
