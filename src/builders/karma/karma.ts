import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeKarmaBuilder } from '@angular-devkit/build-angular';

import glob from 'glob';
import path from 'path';
import { Observable, of } from 'rxjs';

import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxKarmaConfigAdapter } from './karma-config-adapter';
import { SkyuxKarmaBuilderOptions } from './karma-options';

function executeSkyuxKarmaBuilder(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const specs = glob.sync(path.join(process.cwd(), 'src/**/*.spec.ts'), {
    nodir: true
  });

  if (specs.length === 0) {
    context.logger.info('No spec files located. Skipping test command.');
    return of({
      success: true
    });
  }

  options.karmaConfig = path.join(__dirname, 'karma.default.conf.js');

  // Enforce code coverage for CI platforms.
  if (options.skyuxCiPlatform) {
    options.codeCoverage = true;
    options.watch = false;
  }

  SkyuxKarmaConfigAdapter.builderOptions = options;
  SkyuxKarmaConfigAdapter.skyuxConfig = getSkyuxConfig('test');

  return executeKarmaBuilder(options, context);
}

export default createBuilder<SkyuxKarmaBuilderOptions>(
  executeSkyuxKarmaBuilder
);
