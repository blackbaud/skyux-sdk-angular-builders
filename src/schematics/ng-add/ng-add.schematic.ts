import { chain, Rule, SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import {
  getProject,
  getWorkspace,
  updateWorkspace,
} from '../utility/workspace';

import { Schema } from './schema';

function addBuilder(projectName: string): Rule {
  return () => {
    return updateWorkspace((workspace) => {
      const project = workspace.projects.get(projectName)!;
      project.targets.get('build')!.builder =
        '@skyux-sdk/angular-builders:ng-packagr';
    });
  };
}

export default function ngAdd(options: Schema): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    const { project, projectName } = await getProject(
      workspace,
      options.project || (workspace.extensions.defaultProject as string)
    );

    if (project.extensions.projectType !== 'library') {
      throw new SchematicsException(
        'This schematic may only be added to library projects.'
      );
    }

    addPackageJsonDependency(tree, {
      name: 'ng-packagr',
      type: NodeDependencyType.Dev,
      version: '^12.2.5',
      overwrite: true,
    });

    return chain([
      addBuilder(projectName),
      (_tree, context) => {
        context.addTask(new NodePackageInstallTask());
      },
    ]);
  };
}
