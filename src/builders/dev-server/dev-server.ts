import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  getSkyuxConfig
} from '../../shared/skyux-config-utils';

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

  const skyuxConfig = await getSkyuxConfig();

  applySkyuxDevServerOptions(options);

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context, skyuxConfig)
  ).toPromise();
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
