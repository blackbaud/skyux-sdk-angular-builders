import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import {
  DevServerBuilderOptions,
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { Observable, of } from 'rxjs';

import { applySkyuxDevServerOptions } from './dev-server-utils';

function executeSkyuxDevServerBuilder(
  options: DevServerBuilderOptions,
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

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
