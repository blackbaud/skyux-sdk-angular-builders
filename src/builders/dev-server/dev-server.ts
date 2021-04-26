import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { Observable } from 'rxjs';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';
import { applySkyuxDevServerOptions } from './dev-server-utils';

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {
  try {
    applySkyuxDevServerOptions(options);
  } catch (err) {
    context.logger.fatal(err.message);
    process.exit(1);
  }

  return executeDevServerBuilder(options, context);
}

export default createBuilder<
  SkyuxDevServerBuilderOptions,
  DevServerBuilderOutput
>(executeSkyuxDevServerBuilder);
