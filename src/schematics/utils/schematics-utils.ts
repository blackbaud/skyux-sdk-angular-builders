import {
  virtualFs,
  workspaces
} from '@angular-devkit/core';

import {
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import {
  addImportToModule
} from '@schematics/angular/utility/ast-utils';

import {
  InsertChange
} from '@schematics/angular/utility/change';

/**
 * Imports a class into the main app module.
 * @see https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/module/index.ts#L59
 * @param tree
 * @param classifiedName The name of the class to import.
 * @param importPath The import path of the class.
 */
export function addModuleImportToRootModule(
  tree: Tree,
  classifiedName: string,
  importPath: string
): void {
  const modulePath = 'src/app/app.module.ts';
  const sourceText = tree.read(modulePath)!.toString();
  const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
  const changes = addImportToModule(
    source,
    modulePath,
    classifiedName,
    importPath
  );

  const recorder = tree.beginUpdate(modulePath);
  for (const change of changes) {
    /* istanbul ignore else */
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }

  tree.commitUpdate(recorder);
}

/**
 * Creates a workspace host.
 * Taken from: https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
 */
export function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {

    /* istanbul ignore next */
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },

    /* istanbul ignore next */
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },

    /* istanbul ignore next */
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },

    /* istanbul ignore next */
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    }

  };
}
