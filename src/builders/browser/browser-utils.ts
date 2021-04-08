import { BuilderContext } from '@angular-devkit/architect';

import { getBaseHref } from '../../shared/context-utils';
import { ensureBaseHref, ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';

export function applySkyuxBrowserOptions(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): void {
  const baseHref = getBaseHref(context);

  let deployUrl = options.deployUrl || '';
  deployUrl = ensureTrailingSlash(deployUrl);
  deployUrl = ensureBaseHref(deployUrl, baseHref);
  options.deployUrl = deployUrl;
}
