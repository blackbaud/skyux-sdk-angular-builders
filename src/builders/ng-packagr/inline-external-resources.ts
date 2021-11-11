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
  // Get every character between 'ngDeclareClassMetadata' and '@class'.
  const classDefinitionRegex = /ngDeclareClassMetadata\(\{(.|\n)+?(?=@class)/g;

  // Get every character between 'ngDeclareComponent' and '@class'.
  const componentDefinitionRegex = /ngDeclareComponent\(\{(.|\n)+?(?=@class)/g;

  const selectorRegex = /selector: '([\w|-]+)'/;

  const componentDefinitionMatches = contents.match(componentDefinitionRegex);

  contents.match(classDefinitionRegex)?.forEach((classDefinition) => {
    const externaResourceMatch = classDefinition.match(externalResourceRegex);

    if (externaResourceMatch) {
      const externalResourcePath = externaResourceMatch[0];

      const selectorMatch = classDefinition.match(selectorRegex);

      /*istanbul ignore else*/
      if (selectorMatch) {
        const selector = selectorMatch[1];
        const componentMatch = componentDefinitionMatches!.find((x) =>
          x.includes(selector)
        );
        /*istanbul ignore else*/
        if (componentMatch) {
          const inlineResourceMatch = componentMatch.match(inlineResourceRegex);
          /*istanbul ignore else*/
          if (inlineResourceMatch) {
            const inlineContents = inlineResourceMatch[0];
            contents = contents.replace(externalResourcePath, inlineContents);
          }
        }
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
  const stylesRegex = /styles:\s+\[(.|\n)*?(?=])\]/;
  const styleUrlsRegex = /styleUrls:\s+\[(.|\n)*?(?=])\]/;
  return inlineExternalResource(contents, styleUrlsRegex, stylesRegex);
}

/**
 * Replaces any references to `templateUrl` and `styleUrls` with `template` and `styles`, respectively.
 * Note: this currently only affects the UMD module since that's what StackBlitz imports.
 */
export function inlineExternalResourcesPaths(context: BuilderContext): void {
  const projectName = context.target!.project;
  const bundlePaths = glob.sync(
    path.join(context.workspaceRoot, `dist/${projectName}/bundles/*.umd.js`)
  );

  const bundlePath = bundlePaths[0];

  if (bundlePath && fs.existsSync(bundlePath)) {
    let contents = fs.readFileSync(bundlePath).toString();

    contents = inlineTemplateUrls(contents);
    contents = inlineStyleUrls(contents);

    fs.writeFileSync(bundlePath, contents, { encoding: 'utf-8' });
  } else {
    throw new Error(`The UMD bundle was not found. (wanted '${bundlePath}')`);
  }
}
