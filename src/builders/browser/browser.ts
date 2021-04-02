import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import { executeBrowserBuilder } from '@angular-devkit/build-angular';

import { JsonObject } from '@angular-devkit/core';

import { Observable } from 'rxjs';

import { ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';

import { getBrowserTransforms } from './browser-transforms';

function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  options.deployUrl = ensureTrailingSlash(
    options.deployUrl || ''
  );

  return executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  );
}

export default createBuilder<
  JsonObject & SkyuxBrowserBuilderOptions
>(executeSkyuxBrowserBuilder);
