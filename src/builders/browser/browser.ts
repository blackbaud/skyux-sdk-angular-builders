import { SkyuxBrowserBuilderOptions } from './browser-options';
import { getBrowserTransforms } from './browser-transforms';
import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';

function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  );
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
