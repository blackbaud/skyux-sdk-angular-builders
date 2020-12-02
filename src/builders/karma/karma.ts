import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeKarmaBuilder
} from '@angular-devkit/build-angular';

// import glob from 'glob';

import path from 'path';

import {
  Observable
} from 'rxjs';

import {
  SkyuxKarmaBuilderOptions
} from './karma-options';

import {
  SkyuxKarmaConfigAdapter
} from './karma-config-adapter';

import {
  getKarmaTransforms
} from './karma-transforms';

// function getKarmaConfig(platform: string): string {

//   // Using glob so we can find skyux-sdk-builder-config regardless of npm install location
//   const pattern = path.join(
//     process.cwd(),
//     `node_modules/**/@skyux-sdk/pipeline-settings/platforms/${platform}/karma/karma.angular-cli.conf.js`
//   );

//   const configFiles = glob.sync(pattern);
//   const config = configFiles[0];

//   return config;
// }

function executeSkyuxKarmaBuilder(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  console.log('Running karma with options...\n', options, '\n');

  options.skyuxCodeCoverageThreshold = options.skyuxCodeCoverageThreshold || 'none';
  SkyuxKarmaConfigAdapter.builderOptions = options;
  options.karmaConfig = path.join(__dirname, 'karma.default.conf.js');

  // Based on platform, set:
  // if (options.skyuxCiPlatform) {
  //   const karmaConfigFile = getKarmaConfig(options.skyuxCiPlatform);
  //   if (karmaConfigFile) {
  //     options.karmaConfig = karmaConfigFile;
  //   }
  // } else {
  //   // options.karmaConfig = path.join(__dirname, 'karma.default.conf.js');
  // }

  /**
   * Create a karma config within builders.
   * This file will import from the local karma file, and defaults will be added after (such as thresholds).
   * If a `platform` is provided, that file will be merged with the default.
   */

  return executeKarmaBuilder(options, context, getKarmaTransforms(options, context));
}

export default createBuilder<SkyuxKarmaBuilderOptions>(executeSkyuxKarmaBuilder);
