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

import { createHost } from '../utils/schematics-utils';

import { SkyuxNgAddOptions } from './schema';
import { addToLibrary } from './utils/add-to-library';
import { createSkyuxConfigIfNotExists } from './utils/create-skyuxconfig';
import { modifyKarmaConfig } from './utils/modify-karma-config';
import { modifyPolyfills } from './utils/modify-polyfills';
import { readJson } from './utils/read-json';

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
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/e2e in angular.json!`
    );
  }

  if (architectConfig.test) {
    architectConfig.test.builder = '@skyux-sdk/angular-builders:karma';
    architectConfig.test.options!.codeCoverage = true;
  } else {
    throw new SchematicsException(
      `Expected node projects/${projectName}/architect/test in angular.json!`
    );
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

    // Libraries require a different setup.
    if (project.extensions.projectType === 'library') {
      return addToLibrary(tree, host, workspace, context, options);
    }

    createSkyuxConfigIfNotExists(tree);
    await modifyAngularJson(host, options);
    await modifyTsConfig(host);
    await modifyKarmaConfig(host, project.root);
    await modifyProtractorConfig(host, project.root);
    await modifyPolyfills(host);

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/config',
      version: '^4.4.0',
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
