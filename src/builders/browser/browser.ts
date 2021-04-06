import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import { executeBrowserBuilder } from '@angular-devkit/build-angular';

import { JsonObject } from '@angular-devkit/core';

import { getSkyuxConfig } from '../../shared/skyux-config-utils';
import { getAvailablePort } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { getBrowserTransforms } from './browser-transforms';
import { applySkyuxBrowserOptions, serveBuildResults } from './browser-utils';

function runBuild(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  ).toPromise();
}

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  if (options.skyuxServe) {
    const port = await getAvailablePort();
    applySkyuxBrowserOptions(options, context, port);
    const result = await runBuild(options, context);
    await serveBuildResults(options, context, skyuxConfig, port);
    return result;
  }

  applySkyuxBrowserOptions(options, context);
  return runBuild(options, context);
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
