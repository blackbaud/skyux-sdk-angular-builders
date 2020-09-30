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
  Observable
} from 'rxjs';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

import {
  getBrowserWepbackConfigTransformer
} from './webpack-config-transformer';

function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return executeBrowserBuilder(options, context, {
    webpackConfiguration: getBrowserWepbackConfigTransformer()
  });
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
