import {
  addModuleImportToRootModule
} from '@angular/cdk/schematics';

import {
  OutputHashing
} from '@angular-devkit/build-angular';

import {
  normalize,
  strings,
  workspaces
} from '@angular-devkit/core';

import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
  SchematicContext,
  MergeStrategy,
  forEach
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';

import {
  SkyuxDevServerBuilderOptions
} from '../../builders/dev-server/dev-server-options';

import {
  installPackages
} from '../utils/npm-utils';

import {
  createHost
} from '../utils/schematics-utils';

import {
  SkyuxNgAddOptions
} from './schema';

const KARMA_CONFIG = `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
module.exports = function (config) {
  config.set({});
};
`;

const PROTRACTOR_CONFIG = `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
exports.config = {};
`;

async function modifyTsConfig(host: workspaces.WorkspaceHost): Promise<void> {
  const tsConfigContents = await host.readFile('tsconfig.json');
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

function setupBrowserBuilder(projectConfig: any): void {
  projectConfig.architect.build.builder = '@skyux-sdk/angular-builders:browser';
  // Configure Angular to only hash bundled JavaScript files.
  // Our builder will handle hashing the file names found in `src/assets`.
  projectConfig.architect.build.configurations.production!.outputHashing! = OutputHashing.Bundles;
}

function setupDevServerBuilder(projectConfig: any): void {
  projectConfig.architect.serve.builder = '@skyux-sdk/angular-builders:dev-server';
}

function setupProtractorBuilder(projectConfig: any, projectName: string): void {
  projectConfig.architect.e2e.builder = '@skyux-sdk/angular-builders:protractor';
  projectConfig.architect.e2e.options.devServerTarget = `${projectName}:serve:e2e`;
  projectConfig.architect.e2e.configurations.production.devServerTarget = `${projectName}:serve:e2eProduction`
  projectConfig.architect.serve.configurations.e2e = {
    browserTarget: `${projectName}:build`,
    open: false,
    skyuxOpen: false,
    skyuxLaunch: 'host'
  } as SkyuxDevServerBuilderOptions;
  projectConfig.architect.serve.configurations.e2eProduction = {
    browserTarget: `${projectName}:build:production`,
    open: false,
    skyuxOpen: false,
    skyuxLaunch: 'host'
  } as SkyuxDevServerBuilderOptions;
}

function setupKarmaBuilder(projectConfig: any): void {
  projectConfig.architect.test.builder = '@skyux-sdk/angular-builders:karma';
  projectConfig.architect.test.options.codeCoverage = true;
}

function createTemplateFiles(tree: Tree, project: workspaces.ProjectDefinition): Rule {
  addModuleImportToRootModule(
    tree,
    'SkyuxModule.forRoot()',
    './__skyux/skyux.module',
    project
  );

  const sourcePath = `${project!.sourceRoot}/app`;
  const templateSource = apply(url('./files'), [
    applyTemplates({ ...strings }),
    move(normalize(sourcePath)),
    overwriteIfExists(tree)
  ]);

  return mergeWith(templateSource, MergeStrategy.Overwrite);
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
        `This builder is only useful for application projects.`
      );
    }

    const angularJsonContents = await host.readFile('angular.json');
    const angularJson = JSON.parse(angularJsonContents);

    const projectConfig = angularJson.projects[options.project];
    setupBrowserBuilder(projectConfig);
    setupDevServerBuilder(projectConfig);
    setupProtractorBuilder(projectConfig, options.project);
    setupKarmaBuilder(projectConfig);

    await host.writeFile('angular.json', JSON.stringify(angularJson, undefined, 2));
    await host.writeFile('karma.conf.js', KARMA_CONFIG);
    await host.writeFile('e2e/protractor.conf.js', PROTRACTOR_CONFIG);
    await modifyTsConfig(host);

    // Install this builder as a development dependency.
    context.addTask(new NodePackageInstallTask());
    installPackages(['@skyux/assets@^4']);
    installPackages(['@skyux-sdk/e2e@^4', '@skyux-sdk/testing@^4'], {
      location: 'devDependencies'
    });

    return createTemplateFiles(tree, project);
  };
}
