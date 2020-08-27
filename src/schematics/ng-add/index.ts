import {
  readFileSync
} from 'fs';

import {
  join
} from 'path';

import {
  Rule,
  SchematicContext,
  Tree
} from "@angular-devkit/schematics";

import {
  NodePackageInstallTask,

} from "@angular-devkit/schematics/tasks";

import {
  getWorkspace,
  updateWorkspace
} from '@schematics/angular/utility/config';

import {
  addModuleImportToModule
} from 'schematics-utilities';

// import {
//   SkyuxDevServerBuilderOptions
// } from '../../shared/skyux-builder-options';

export function ngAdd(options: any): Rule {
  
  // Assumes the builder name is this same library
  const pkg = readFileSync(join(__dirname, '../../../package.json'));
  const builder = JSON.parse(pkg.toString()).name;

  return (tree: Tree, context: SchematicContext) => {

    const workspace = getWorkspace(tree);
    const project = options.project || workspace.defaultProject;

    const architect = workspace.projects[project].architect;
    if (!architect) {
      throw new Error(`expected node projects/${project}/architect in angular.json`);
    }

    const build = architect.build;
    if (!build) {
      throw new Error(`expected node projects/${project}/architect/build in angular.json`);
    }

    // Custom Builders are not part of the CLI's enum
    build.builder = <any>`${builder}:browser`;

    const serve = architect.serve;
    if (!serve) {
      throw new Error(`expected node projects/${project}/architect/serve in angular.json`);
    }

    serve.builder = <any>`${builder}:dev-server`;
    addModuleImportToModule(tree, 'src/app/app.module.ts', 'SkyuxBootstrapperModule', './skyux-bootstrapper');
    // addImportToModule(tree.get('src/app/app.module.ts'), 'src/app/app.module.ts', 'SkyuxBoostrapModule', '@skyux/boostrap');

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

    context.addTask(new NodePackageInstallTask());

    return updateWorkspace(workspace);
  };
}
