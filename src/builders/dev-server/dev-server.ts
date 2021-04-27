import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { Observable, of } from 'rxjs';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';
import { applySkyuxDevServerOptions } from './dev-server-utils';

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  try {
    applySkyuxDevServerOptions(options);
  } catch (err) {
    context.logger.fatal(err.message);
    return of({
      success: false
    });
  }

  return executeDevServerBuilder(options, context);
}

export default createBuilder<
  SkyuxDevServerBuilderOptions,
  DevServerBuilderOutput
>(executeSkyuxDevServerBuilder);
