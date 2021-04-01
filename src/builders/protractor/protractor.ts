import { applyProtractorEnvironmentConfig } from '../../shared/protractor-environment-utils';
import { SkyuxProtractorBuilderOptions } from './protractor-options';
import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { executeProtractorBuilder } from '@angular-devkit/build-angular';
import path from 'path';

function executeSkyuxProtractorBuilder(
  options: SkyuxProtractorBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  options.skyuxHeadless = !!options.skyuxHeadless;
  options.protractorConfig = path.join(__dirname, 'protractor.default.conf.js');

  applyProtractorEnvironmentConfig({
    builderOptions: options
  });

  return executeProtractorBuilder(options, context);
}

export default createBuilder<SkyuxProtractorBuilderOptions>(
  executeSkyuxProtractorBuilder
);
