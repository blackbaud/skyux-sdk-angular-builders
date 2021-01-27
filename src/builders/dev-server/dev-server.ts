import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  Observable
} from 'rxjs';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  applySkyuxDevServerOptions
} from './dev-server-utils';

import {
  getDevServerTransforms
} from './dev-server-transforms';

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {
  applySkyuxDevServerOptions(options);

  // Override options when called via `ng e2e`.
  // During `ng e2e`, Angular calls the dev-server builder via `context.scheduleTarget`,
  // which sets the configuration property to `undefined`.
  // TODO: Better way to handle this?
  if (context.target!.configuration === undefined) {
    options.open = false;
    options.skyuxOpen = false;
    options.skyuxLaunch = 'host';
  }

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context)
  );
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
