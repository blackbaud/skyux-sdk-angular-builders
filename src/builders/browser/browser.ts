import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import { executeBrowserBuilder } from '@angular-devkit/build-angular';

import { JsonObject } from '@angular-devkit/core';

import { ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';

import { serveBuildResults } from './browser-utils';

import { getBrowserTransforms } from './browser-transforms';
import { getSkyuxConfig } from '../../shared/skyux-config-utils';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  options.deployUrl = ensureTrailingSlash(
    options.deployUrl || options.skyuxServe ? `https://localhost:4200` : ''
  );

  const result = await executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  ).toPromise();

  if (options.skyuxServe) {
    await serveBuildResults(options, context, skyuxConfig);
  }

  return result;
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
