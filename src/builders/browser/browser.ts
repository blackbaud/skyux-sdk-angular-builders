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
  getHostUrlFromOptions
} from '../../shared/host-utils';

import {
  createServer
} from '../../shared/server';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

import {
  getBrowserTransforms
} from './browser-transforms';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  await executeBrowserBuilder(options, context, getBrowserTransforms()).toPromise();

  if (options.skyuxServe) {
    await createServer({
      hostUrl: getHostUrlFromOptions(options),
      pathName: context.target?.project!,
      port: 4200
    });
  }

  return Promise.resolve({
    success: true
  });
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
