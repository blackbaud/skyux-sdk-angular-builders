import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { executeKarmaBuilder } from '@angular-devkit/build-angular';

import {
  Observable
} from 'rxjs';

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
  console.log('Running karma with options...', options);

  // Based on platform, set:
  // options.karmaConfig = '/path/to/config';
  // options.codeCoverage = true;

  /**
   * Create a karma config within builders.
   * This file will import from the local karma file, and defaults will be added after (such as thresholds).
   * If a `platform` is provided, that file will be merged with the default.
   */

  return executeKarmaBuilder(options, context, getKarmaTransforms(options, context));
}

export default createBuilder<SkyuxKarmaBuilderOptions>(executeSkyuxKarmaBuilder);
