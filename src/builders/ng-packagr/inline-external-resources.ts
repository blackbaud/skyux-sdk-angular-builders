import { BuilderContext } from '@angular-devkit/architect';

import fs from 'fs-extra';
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

  const componentDefinitionRegex = /ngDeclareComponent\(\{(.|\n)+?(?=@class)/g;

  const selectorRegex = /selector: '([\w|-]+)'/;

  const componentDefinitionMatches = contents.match(componentDefinitionRegex);

  contents.match(classDefinitionRegex)?.forEach((classDefinition) => {
    const templateUrlMatch = classDefinition.match(externalResourceRegex);

    if (templateUrlMatch) {
      const templateUrl = templateUrlMatch[0];

      const selectorMatch = classDefinition.match(selectorRegex);
      if (selectorMatch) {
        const selector = selectorMatch[1];
        const componentMatch = componentDefinitionMatches?.find((x) =>
          x.includes(selector)
        );
        if (componentMatch) {
          const templateMatch = componentMatch.match(inlineResourceRegex);
          if (templateMatch) {
            const template = templateMatch[0];
            contents = contents.replace(templateUrl, template);
          }
        }
      }
    }
  });

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
export async function inlineExternalResourcesPaths(
  context: BuilderContext
): Promise<void> {
  const projectName = context.target!.project;
  const bundlePath = path.join(
    context.workspaceRoot,
    `dist/${projectName}/bundles/${projectName}.umd.js`
  );

  if (fs.existsSync(bundlePath)) {
    let contents = fs.readFileSync(bundlePath).toString();

    contents = inlineTemplateUrls(contents);
    contents = inlineStyleUrls(contents);

    fs.writeFileSync(bundlePath, contents, { encoding: 'utf-8' });
  }
}
