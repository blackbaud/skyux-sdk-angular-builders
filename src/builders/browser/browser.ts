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
  getWepbackConfigTransformer
} from '../../webpack/config-transformer';

function skyuxBrowser(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return executeBrowserBuilder(options, context, {
    webpackConfiguration: getWepbackConfigTransformer(options, context)
  });
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(skyuxBrowser);
