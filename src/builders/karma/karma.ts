import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeKarmaBuilder
} from '@angular-devkit/build-angular';

import path from 'path';

import {
  Observable
} from 'rxjs';

import {
  SkyuxKarmaConfigAdapter
} from './karma-config-adapter';

import {
  SkyuxKarmaBuilderOptions
} from './karma-options';

import {
  getKarmaTransforms
} from './karma-transforms';

function executeSkyuxKarmaBuilder(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {

  options.skyuxCodeCoverageThreshold = options.skyuxCodeCoverageThreshold || 'none';
  options.karmaConfig = path.join(__dirname, 'karma.default.conf.js');

  // Enforce code coverage for CI platforms.
  if (options.skyuxCiPlatform) {
    options.codeCoverage = true;
  }

  SkyuxKarmaConfigAdapter.builderOptions = options;

  return executeKarmaBuilder(
    options,
    context,
    getKarmaTransforms(options, context)
  );
}

export default createBuilder<SkyuxKarmaBuilderOptions>(
  executeSkyuxKarmaBuilder
);
