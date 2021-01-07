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

  console.log('OPTIONS:', options);

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context)
  );
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
