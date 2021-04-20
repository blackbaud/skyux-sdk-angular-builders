import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { getAvailablePort } from '../../shared/port-finder';
import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';
import { getDevServerTransforms } from './dev-server-transforms';
import { applySkyuxDevServerOptions } from './dev-server-utils';

async function setup(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Promise<void> {
  applySkyuxDevServerOptions(options, context);

  const preferredPort = options.port;
  const port = await getAvailablePort(preferredPort);
  if (port !== preferredPort) {
    options.port = port;
    context.logger.info(
      `The requested port ${preferredPort} is not available; using ${port}.`
    );
  }
}

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  return from(setup(options, context)).pipe(
    switchMap(() => {
      return executeDevServerBuilder(
        options,
        context,
        getDevServerTransforms(options, context, skyuxConfig)
      );
    })
  );
}

export default createBuilder<
  SkyuxDevServerBuilderOptions,
  DevServerBuilderOutput
>(executeSkyuxDevServerBuilder);
