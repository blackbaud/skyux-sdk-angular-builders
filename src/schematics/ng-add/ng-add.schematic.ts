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
  addModuleImportToRootModule
} from '@angular/cdk/schematics';

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

async function modifyAngularJson(
  host: workspaces.WorkspaceHost,
  options: SkyuxNgAddOptions
): Promise<void> {
  const angularJsonContents = await host.readFile('angular.json');
  const angularJson = JSON.parse(angularJsonContents);
  const architectConfig = angularJson.projects[options.project].architect;
  setupBrowserBuilder(architectConfig.build);
  setupDevServerBuilder(architectConfig.serve);
  setupProtractorBuilder(architectConfig.e2e, architectConfig.serve, options.project);
  setupKarmaBuilder(architectConfig.test);
  await host.writeFile('angular.json', JSON.stringify(angularJson, undefined, 2));
}

function setupBrowserBuilder(buildTarget: workspaces.TargetDefinition): void {
  buildTarget.builder = '@skyux-sdk/angular-builders:browser';
  // Configure Angular to only hash bundled JavaScript files.
  // Our builder will handle hashing the file names found in `src/assets`.
  buildTarget.configurations!.production!.outputHashing! = OutputHashing.Bundles;
}

function setupDevServerBuilder(serveTarget: workspaces.TargetDefinition): void {
  serveTarget.builder = '@skyux-sdk/angular-builders:dev-server';
}

function setupProtractorBuilder(
  e2eTarget: workspaces.TargetDefinition,
  serveTarget: workspaces.TargetDefinition,
  projectName: string
): void {
  e2eTarget.builder = '@skyux-sdk/angular-builders:protractor';
  e2eTarget.options!.devServerTarget = `${projectName}:serve:e2e`;
  e2eTarget.configurations!.production!.devServerTarget = `${projectName}:serve:e2eProduction`
  serveTarget.configurations!.e2e = {
    browserTarget: `${projectName}:build`,
    open: false,
    skyuxOpen: false,
    skyuxLaunch: 'host'
  } as SkyuxDevServerBuilderOptions;
  serveTarget.configurations!.e2eProduction = {
    browserTarget: `${projectName}:build:production`,
    open: false,
    skyuxOpen: false,
    skyuxLaunch: 'host'
  } as SkyuxDevServerBuilderOptions;
}

function setupKarmaBuilder(testTarget: workspaces.TargetDefinition): void {
  testTarget.builder = '@skyux-sdk/angular-builders:karma';
  testTarget.options!.codeCoverage = true;
}

async function modifyTestFrameworkConfigs(host: workspaces.WorkspaceHost): Promise<void> {
  await host.writeFile('karma.conf.js', `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
module.exports = function (config) {
  config.set({});
};
`);
  await host.writeFile('e2e/protractor.conf.js', `// DO NOT MODIFY
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

function installDependencies(context: SchematicContext): void {
  // Install this builder as a development dependency.
  context.addTask(new NodePackageInstallTask());
  installPackages(['@skyux/assets@^4']);
  installPackages(['@skyux-sdk/e2e@^4', '@skyux-sdk/testing@^4'], {
    location: 'devDependencies'
  });
}

function createAppFiles(tree: Tree, project: workspaces.ProjectDefinition): Rule {
  addModuleImportToRootModule(
    tree,
    'SkyuxModule.forRoot()',
    './__skyux/skyux.module',
    project
  );

  const sourcePath = `${project!.sourceRoot}/app`;
  const templateSource = apply(url('./files'), [
    applyTemplates({}),
    move(normalize(sourcePath))
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

    // TODO: Need to add support for libraries?
    if (project.extensions.projectType !== 'application') {
      throw new SchematicsException(
        `This builder is only useful for application projects.`
      );
    }

    await modifyAngularJson(host, options);
    await modifyTsConfig(host);
    await modifyTestFrameworkConfigs(host);
    installDependencies(context);
    return createAppFiles(tree, project);
  };
}
