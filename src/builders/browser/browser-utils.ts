import { BuilderContext } from '@angular-devkit/architect';

import { ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';

export function applySkyuxBrowserOptions(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): void {
  const projectName = context.target!.project!;
  const baseHref = `/${projectName}/`;

  let deployUrl = ensureTrailingSlash(options.deployUrl || '');
  if (!deployUrl.endsWith(baseHref)) {
    deployUrl = deployUrl.substr(0, deployUrl.length - 1) + baseHref;
  }

  options.deployUrl = deployUrl;
}
