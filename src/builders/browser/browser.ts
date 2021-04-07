import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { JsonObject } from '@angular-devkit/core';

import { getAvailablePort } from '../../shared/server-utils';
import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { getBrowserTransforms } from './browser-transforms';
import { applySkyuxBrowserOptions, serveBuildResults } from './browser-utils';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  let port = 4200;
  if (options.skyuxServe) {
    port = await getAvailablePort({ preferredPort: 4200 });
    options.deployUrl = `https://localhost:${port}/`;
  }

  applySkyuxBrowserOptions(options, context);

  const result = await executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  ).toPromise();

  if (options.skyuxServe && result.success) {
    await serveBuildResults(options, context, skyuxConfig, port);
  }

  return result;
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
