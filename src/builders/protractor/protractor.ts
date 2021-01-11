import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeProtractorBuilder
} from '@angular-devkit/build-angular';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

function executeSkyuxProtractorBuilder(
  options: SkyuxProtractorBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  return executeProtractorBuilder(
    options,
    context
  );
}

export default createBuilder<SkyuxProtractorBuilderOptions>(
  executeSkyuxProtractorBuilder
);
