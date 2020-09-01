import {
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';

import {
  NodePackageInstallTask
} from '@angular-devkit/schematics/tasks';

import {
  getWorkspace,
  updateWorkspace
} from '@schematics/angular/utility/config';

import fs from 'fs-extra';

import path from 'path';

// import {
//   addModuleImportToModule
// } from 'schematics-utilities';

export function ngAdd(options: any): Rule {

  // Assumes the builder name is in the package.json (found from the dist folder).
  const packageJson = fs.readJsonSync(path.join(__dirname, '../../../../package.json'));
  const builder = packageJson.name;

  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = options.project || workspace.defaultProject;
    const architect = workspace.projects[project].architect;

    if (!architect) {
      throw new Error(
        `Expected node projects/${project}/architect in angular.json!`
      );
    }

    // Overwrite the default build architect.
    const build = architect.build;
    if (!build) {
      throw new Error(`Expected node projects/${project}/architect/build in angular.json!`);
    }
    build.builder = `${builder}:browser` as any;

    // Overwrite the default serve architect.
    const serve = architect.serve;
    if (!serve) {
      throw new Error(`Expected node projects/${project}/architect/serve in angular.json!`);
    }
    serve.builder = `${builder}:dev-server` as any;

    // addImportToModule(
    //   tree.get('src/app/app.module.ts'),
    //   'src/app/app.module.ts',
    //   'SkyuxBoostrapModule',
    //   '@skyux/boostrap'
    // );

    // TODO: REMOVE THESE AS THEY ARE TEMPORARY
    // const serveOptions = serve.options as SkyuxDevServerBuilderOptions;
    // serveOptions.skyuxHostUrl = 'https://localhost:5234';

    // TODO: REMOVE ONCE HOST IS UPDATED
    // const appComponentPath = 'src/app/app.component.ts';
    // const appComponentContent = tree.read(appComponentPath)?.toString();
    // if (appComponentContent && appComponentContent.indexOf('app-root') > -1) {
    //   context.logger.info(`Setting selector in ${appComponentPath} to sky-app-pages`);
    //   tree.overwrite(appComponentPath, appComponentContent.replace('app-root', 'sky-pages-app'));
    // }

    // Install as a development dependency.
    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
