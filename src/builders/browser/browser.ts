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
  getBrowserTransforms
} from './browser-transforms';

function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {

  // TODO: Run a check of angular.json to make sure the settings are correct?

  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options)
  );
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
