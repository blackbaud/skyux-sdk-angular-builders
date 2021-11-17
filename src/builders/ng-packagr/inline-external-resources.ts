import { BuilderContext } from '@angular-devkit/architect';

import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

/**
 *
 * @param bundlePath The contents of the UMD distribution bundle.
 * @param externalResourceRegex The regular expression used to find the external resource string (e.g., 'templateUrl:')
 * @param inlineResourceRegex The regular expression used to find the inlined resource contents (e.g., 'template:')
 */
function inlineExternalResource(
  contents: string,
  externalResourceRegex: RegExp,
  inlineResourceRegex: RegExp
) {
  // Get every character between 'ngDeclareComponent' and '@class'.
  const componentDefinitionRegex =
    /ngDeclareComponent\(\{(.|\s)+?(?=@class)/g;

  const componentDefinitionMatches = contents.match(componentDefinitionRegex);

  componentDefinitionMatches?.forEach((componentDefinitionMatch) => {
    const externaResourceMatch = componentDefinitionMatch.match(
      externalResourceRegex
    );
    /*istanbul ignore else*/
    if (externaResourceMatch) {
      const externalResourcePath = externaResourceMatch[0];
      const inlineResourceMatch =
        componentDefinitionMatch.match(inlineResourceRegex);
      /*istanbul ignore else*/
      if (inlineResourceMatch) {
        const inlineContents = inlineResourceMatch[0];
        contents = contents.replace(externalResourcePath, inlineContents);
      }
    }
  });

  // Make one final check of the content to make sure the relative paths have been removed.
  // If paths are found, throw an error so that any structural changes to the bundle files can
  // be addressed before releasing the consuming library.
  if (contents.match(externalResourceRegex)) {
    throw new Error(
      'Relative file paths pointing to external resources were found in a component definition (e.g. `templateUrl` or `styleUrls`). ' +
        'The `@skyux-sdk/angular-builders:ng-packagr` builder should have replaced these paths with the file contents inlined (e.g. `template`, `styles`), ' +
        'but the file structure of the bundle has likely changed. Please report this problem to the author of `@skyux-sdk/angular-builders:ng-packagr`.'
    );
  }

  return contents;
}

function inlineTemplateUrls(contents: string): string {
  const templateRegex = /template:\s(["'])(?:(?=(\\?))\2.)*?\1/;
  const templateUrlRegex = /templateUrl:\s(["'])(?:(?=(\\?))\2.)*?\1/;
  return inlineExternalResource(contents, templateUrlRegex, templateRegex);
}

function inlineStyleUrls(contents: string): string {
  const stylesRegex = /styles:\s+\[(.|\s)*?(?=])\]/;
  const styleUrlsRegex = /styleUrls:\s+\[(.|\s)*?(?=])\]/;
  return inlineExternalResource(contents, styleUrlsRegex, stylesRegex);
}

/**
 * Replaces any references to `templateUrl` and `styleUrls` with `template` and `styles`, respectively.
 * Note: this currently only affects the UMD module since that's what StackBlitz imports.
 */
export function inlineExternalResourcesPaths(context: BuilderContext): void {
  const projectName = context.target!.project;
  const bundlePattern = path.join(
    context.workspaceRoot,
    `dist/${projectName}/bundles/*.umd.js`
  );
  const bundlePaths = glob.sync(bundlePattern);

  if (bundlePaths.length > 0) {
    bundlePaths.forEach((bundlePath) => {
      context.logger.info(
        `Inlining external resource paths for file '${bundlePath}'...`
      );
      let contents = fs.readFileSync(bundlePath).toString();

      contents = inlineTemplateUrls(contents);
      contents = inlineStyleUrls(contents);

      fs.writeFileSync(bundlePath, contents, { encoding: 'utf-8' });
    });
    context.logger.info('Done inlining external resources.');
  } else {
    throw new Error(
      `The UMD bundle was not found. (wanted '${bundlePattern}')`
    );
  }
}
