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
  getDevServerTransforms
} from './dev-server-transforms';

import {
  applySkyuxDevServerOptions,
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {
  const settings = applySkyuxDevServerOptions(options);
  return executeDevServerBuilder(settings, context, getDevServerTransforms(settings, context));
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
