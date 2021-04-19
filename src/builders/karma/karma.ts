import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeKarmaBuilder } from '@angular-devkit/build-angular';

import path from 'path';
import { Observable } from 'rxjs';

import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxKarmaConfigAdapter } from './karma-config-adapter';
import { SkyuxKarmaBuilderOptions } from './karma-options';
import { getKarmaTransforms } from './karma-transforms';

function executeSkyuxKarmaBuilder(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  options.karmaConfig = path.join(__dirname, 'karma.default.conf.js');

  // Enforce code coverage for CI platforms.
  if (options.skyuxCiPlatform) {
    options.codeCoverage = true;
    options.watch = false;
  }

  SkyuxKarmaConfigAdapter.builderOptions = options;
  SkyuxKarmaConfigAdapter.skyuxConfig = getSkyuxConfig('test');

  return executeKarmaBuilder(options, context, getKarmaTransforms());
}

export default createBuilder<SkyuxKarmaBuilderOptions>(
  executeSkyuxKarmaBuilder
);
