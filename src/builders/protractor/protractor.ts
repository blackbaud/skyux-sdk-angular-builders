import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeProtractorBuilder
} from '@angular-devkit/build-angular';

import path from 'path';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

function executeSkyuxProtractorBuilder(
  options: SkyuxProtractorBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  options.skyuxHeadless = !!options.skyuxHeadless;
  options.protractorConfig = path.join(__dirname, 'protractor.default.conf.js');

  // Our `protractor.default.conf.js` file needs to read the builder options to set certain behaviors.
  // However, because Angular CLI runs Protractor in a separate process, we must save the builder options
  // as an environment variable (`argv` and other states do not get passed to the separate process).
  // See: https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/build_angular/src/protractor/index.ts#L41
  process.env.SKYUX_PROTRACTOR_BUILDER_OPTIONS = JSON.stringify(options);

  return executeProtractorBuilder(
    options,
    context
  );
}

export default createBuilder<SkyuxProtractorBuilderOptions>(
  executeSkyuxProtractorBuilder
);
