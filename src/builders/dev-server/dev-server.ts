import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { getAvailablePort } from '../../shared/port-finder';
import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';
import { getDevServerTransforms } from './dev-server-transforms';
import { applySkyuxDevServerOptions } from './dev-server-utils';

async function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Promise<DevServerBuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  const preferredPort = options.port;
  const port = await getAvailablePort(preferredPort);
  if (port !== preferredPort) {
    options.port = port;
    context.logger.info(
      `The requested port ${preferredPort} is not available; using ${port}.`
    );
  }

  applySkyuxDevServerOptions(options, context);

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context, skyuxConfig)
  ).toPromise();
}

export default createBuilder<
  SkyuxDevServerBuilderOptions,
  DevServerBuilderOutput
>(executeSkyuxDevServerBuilder);
