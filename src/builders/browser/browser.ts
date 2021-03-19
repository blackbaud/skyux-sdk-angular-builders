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
  getSkyuxConfig
} from '../../shared/skyux-config-utils';

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
  const skyuxConfig = getSkyuxConfig();

  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, skyuxConfig)
  );
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
