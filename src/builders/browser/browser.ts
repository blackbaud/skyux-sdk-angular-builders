import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeBrowserBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

import {
  getBrowserTransforms
} from './browser-transforms';

import {
  serveBuildResults
} from './browser-utils';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  await executeBrowserBuilder(options, context, getBrowserTransforms()).toPromise();

  if (options.skyuxServe) {
    await serveBuildResults(options, context);
  }

  return Promise.resolve({
    success: true
  });
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
