import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  applySkyuxDevServerOptions
} from './dev-server-utils';

import {
  getDevServerTransforms
} from './dev-server-transforms';

async function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Promise<DevServerBuilderOutput> {
  await applySkyuxDevServerOptions(options);

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context)
  ).toPromise();
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
