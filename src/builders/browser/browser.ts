import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { JsonObject } from '@angular-devkit/core';

import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { serveBuildResults } from './browser-server';
import { getBrowserTransforms } from './browser-transforms';
import { applySkyuxBrowserOptions } from './browser-utils';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const skyuxConfig = getSkyuxConfig('build');

  if (options.skyuxServe) {
    return serveBuildResults(options, context, skyuxConfig);
  }

  applySkyuxBrowserOptions(options, context);

  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  ).toPromise();
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
