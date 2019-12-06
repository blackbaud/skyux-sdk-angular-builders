import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  BrowserBuilderOptions,
  BrowserBuilderOutput,
  executeBrowserBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import {
  Observable
} from 'rxjs';

import {
  SkyBuilderOptions
} from '../builder-options';

import {
  getTransforms
} from '../utils/common';

export type SkyBrowserBuilderOptions = BrowserBuilderOptions & SkyBuilderOptions;

export function browserBuilder(
  options: SkyBrowserBuilderOptions,
  context: BuilderContext
): Observable<BrowserBuilderOutput> {
  return executeBrowserBuilder(options, context, getTransforms(options, context));
}

export default createBuilder<JsonObject & SkyBrowserBuilderOptions>(browserBuilder);
